// Script to automatically create GitHub environments and import secrets
// Supports batch creation/update of environments from multiple environment configurations in the scripts/config directory
const https = require('https');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Import configuration module
const { 
  CONFIG_DIR, 
  githubConfig,
  getEnvironmentDirs, 
  loadEnvFile, 
  readSecretsFile,
  readBranchRules,
  logger // Import logger from config.js
} = require('./config');

// 发送 GitHub API 请求
function sendRequest(method, endpoint, data = null, token, silentErrors = []) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: endpoint,
      method: method,
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'GitHub-Environment-Setup-Script',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    };

    if (data) {
      options.headers['Content-Type'] = 'application/json';
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            // 如果状态码在静默错误列表中，不输出错误日志
            if (!silentErrors.includes(res.statusCode)) {
              logger.error({ statusCode: res.statusCode, response: parsedData }, `API Error`);
            }
            reject(new Error(`API request failed: ${res.statusCode} ${JSON.stringify(parsedData)}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// 创建或更新 GitHub 环境
async function createOrUpdateEnvironment(owner, repo, environmentName, token, branchRules = null) {
  try {
    const endpoint = `/repos/${owner}/${repo}/environments/${environmentName}`;
    
    // 准备环境数据
    const data = {
      wait_timer: 0, // 等待时间（分钟）
      reviewers: [] // 审核者列表
    };
    
    // 如果有分支规则配置，添加到环境数据中
    if (branchRules) {
      // 构建部署分支策略
      const deploymentBranchPolicy = {
        // GitHub API 要求 protected_branches 字段必须存在
        protected_branches: false
      };
      
      // 设置是否使用自定义分支策略
      if (branchRules.custom_branch_policies !== undefined) {
        deploymentBranchPolicy.custom_branch_policies = !!branchRules.custom_branch_policies;
      }
      
      // 只有当分支策略对象不为空时才添加到数据中
      if (Object.keys(deploymentBranchPolicy).length > 0) {
        data.deployment_branch_policy = deploymentBranchPolicy;
        logger.info({ env: environmentName, policy: deploymentBranchPolicy }, `Configuring branch policy for environment ${environmentName}`);
      }
    }
    
    await sendRequest('PUT', endpoint, data, token);
    logger.info({ env: environmentName }, `Environment "${environmentName}" created successfully`);
    
    // 如果有分支规则并且启用了自定义分支策略，创建分支规则
    if (branchRules && branchRules.custom_branch_policies && 
        branchRules.protected_branches && Array.isArray(branchRules.protected_branches)) {
      // 为每个分支模式创建一个分支策略
      for (const branchPattern of branchRules.protected_branches) {
        await createBranchPolicy(owner, repo, environmentName, branchPattern, token);
      }
    }
    
    return true;
  } catch (error) {
    logger.error({ env: environmentName, error: error.message }, `Failed to create environment "${environmentName}"`);
    return false;
  }
}

// 创建分支策略
async function createBranchPolicy(owner, repo, environmentName, branchPattern, token) {
  try {
    const endpoint = `/repos/${owner}/${repo}/environments/${environmentName}/deployment-branch-policies`;
    const data = {
      name: branchPattern,
      type: 'branch'
    };
    
    try {
      await sendRequest('POST', endpoint, data, token, [303]);
      logger.info({ env: environmentName, branch: branchPattern }, `Creating branch policy for environment ${environmentName}: ${branchPattern}`);
      return true;
    } catch (error) {
      // 303 状态码表示相同的分支名称模式已经存在
      if (error.message.includes('303')) {
        logger.info({ env: environmentName, branch: branchPattern }, `Branch policy ${branchPattern} already exists in environment ${environmentName}`);
        return true;
      } else {
        throw error;
      }
    }
  } catch (error) {
    logger.error({ env: environmentName, branch: branchPattern, error: error.message }, `Failed to create branch policy ${branchPattern} for environment ${environmentName}`);
    return false;
  }
}

// 获取环境的公钥（用于加密 secrets）
async function getEnvironmentPublicKey(owner, repo, environmentName, token) {
  try {
    const endpoint = `/repos/${owner}/${repo}/environments/${environmentName}/secrets/public-key`;
    const response = await sendRequest('GET', endpoint, null, token);
    return response;
  } catch (error) {
    logger.error({ env: environmentName, error: error.message }, `Failed to get public key for environment "${environmentName}"`);
    throw error;
  }
}

// 使用 libsodium 加密 secret 值
function encryptSecret(publicKey, secretValue) {
  try {
    // 由于 Node.js 原生不支持 libsodium，我们使用命令行工具 (如果安装了 libsodium-wrappers)
    // 为每个并行任务创建一个唯一的临时文件名，确保并行安全
    const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
    const tempFile = path.join(__dirname, `temp_encrypt_${uniqueId}.js`);
    
    fs.writeFileSync(tempFile, `
      const sodium = require('libsodium-wrappers');
      
      async function encryptValue() {
        await sodium.ready;
        
        const publicKey = '${publicKey}';
        const secretValue = '${secretValue}';
        
        const binkey = sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL);
        const binsec = sodium.from_string(secretValue);
        
        const encBytes = sodium.crypto_box_seal(binsec, binkey);
        const output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
        
        console.log(output); // 保留这个，因为它是加密脚本的输出
      }
      
      encryptValue();
    `);
    
    try {
      const encryptedValue = execSync(`node "${tempFile}"`, { encoding: 'utf8' }).trim();
      return encryptedValue;
    } finally {
      // 确保在出错时也能删除临时文件
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to encrypt secret');
    logger.error('Please make sure libsodium-wrappers package is installed: npm install libsodium-wrappers');
    throw error;
  }
}

// 创建或更新环境 secret
async function createOrUpdateSecret(owner, repo, environmentName, key, value, publicKeyInfo, token) {
  try {
    const encryptedValue = encryptSecret(publicKeyInfo.key, value);
    
    const endpoint = `/repos/${owner}/${repo}/environments/${environmentName}/secrets/${key}`;
    const data = {
      encrypted_value: encryptedValue,
      key_id: publicKeyInfo.key_id
    };
    
    await sendRequest('PUT', endpoint, data, token);
    logger.info({ key }, `Secret "${key}" created/updated successfully`);
    return true;
  } catch (error) {
    logger.error({ key, error: error.message }, `Failed to create/update secret "${key}"`);
    return false;
  }
}

// 创建或更新环境变量
async function createOrUpdateVariable(owner, repo, environmentName, key, value, token) {
  try {
    // 检查变量名是否以 GITHUB_ 开头
    if (key.startsWith('GITHUB_')) {
      logger.warn({ key }, `Skipping variable "${key}": variable names cannot start with GITHUB_`);
      return true; // 跳过这个变量
    }
    
    // 先尝试创建变量
    const createEndpoint = `/repos/${owner}/${repo}/environments/${environmentName}/variables`;
    const data = { name: key, value };
    
    try {
      // 对于创建请求，静默 409 错误（变量已存在）
      const response = await sendRequest('POST', createEndpoint, data, token, [409]);
      logger.info({ key }, `Variable "${key}" created successfully`);
      return true;
    } catch (createError) {
      // 处理 409 错误（变量已存在）
      if (createError.message.includes('409')) {
        // 更新环境变量的 API 端点
        const updateEndpoint = `/repos/${owner}/${repo}/environments/${environmentName}/variables/${key}`;
        try {
          await sendRequest('PATCH', updateEndpoint, data, token);
          logger.info({ key }, `Variable "${key}" updated successfully`);
          return true;
        } catch (updateError) {
          logger.error({ key, error: updateError.message }, `Failed to update variable "${key}"`);
          return false;
        }
      } else {
        // 如果是其他错误，输出错误信息（已经在 sendRequest 中输出了）
        return false;
      }
    }
  } catch (error) {
    logger.error({ key, error: error.message }, `Unexpected error while processing variable "${key}"`);
    return false;
  }
}

// 处理单个环境配置
async function processEnvironment(envDir) {
  logger.info({ dir: envDir }, `Processing environment configuration directory: ${envDir}`);
  
  // 检查全局 GitHub 配置
  if (!githubConfig.GITHUB_OWNER || !githubConfig.GITHUB_REPO || !githubConfig.GITHUB_TOKEN) {
    logger.error(`Error: Global GitHub configuration file is missing required configuration items (GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN)`);
    return false;
  }
  
  // 使用子目录名作为环境名
  const dirName = path.basename(envDir);
  const GITHUB_ENV_NAME = dirName;
  
  const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } = githubConfig;
  
  // 查找环境配置文件
  const envFilePath = path.join(envDir, '.env');
  if (!fs.existsSync(envFilePath)) {
    logger.warn({ dir: envDir }, `Warning: No .env file found in ${envDir}`);
  }
  
  // 查找 secrets 文件
  const secretsFilePath = path.join(envDir, '.secrets');
  const secretsExists = fs.existsSync(secretsFilePath);
  if (!secretsExists) {
    logger.warn({ dir: envDir }, `Warning: No .secrets file found in ${envDir}`);
  }
  
  // 如果既没有 .env 也没有 .secrets，则跳过此环境
  if (!fs.existsSync(envFilePath) && !secretsExists) {
    logger.error({ dir: envDir }, `Error: Neither .env nor .secrets file found in ${envDir}, skipping this environment`);
    return false;
  }
  
  // 读取分支规则配置
  const branchRules = readBranchRules(envDir);
  
  logger.info({ env: GITHUB_ENV_NAME }, `Creating environment: ${GITHUB_ENV_NAME}`);
  const environmentCreated = await createOrUpdateEnvironment(GITHUB_OWNER, GITHUB_REPO, GITHUB_ENV_NAME, GITHUB_TOKEN, branchRules);
  if (!environmentCreated) {
    return false;
  }
  
  // 获取环境公钥
  let publicKeyInfo;
  try {
    publicKeyInfo = await getEnvironmentPublicKey(GITHUB_OWNER, GITHUB_REPO, GITHUB_ENV_NAME, GITHUB_TOKEN);
  } catch (error) {
    logger.error({ env: GITHUB_ENV_NAME }, `Error: Unable to get public key for environment ${GITHUB_ENV_NAME}`);
    return false;
  }
  
  // 处理 secrets 文件
  if (secretsExists) {
    const secrets = readSecretsFile(secretsFilePath);
    if (secrets) {
      logger.info({ env: GITHUB_ENV_NAME }, `Creating/updating secrets for environment ${GITHUB_ENV_NAME}...`);
      for (const [key, value] of Object.entries(secrets)) {
        await createOrUpdateSecret(GITHUB_OWNER, GITHUB_REPO, GITHUB_ENV_NAME, key, value, publicKeyInfo, GITHUB_TOKEN);
      }
    }
  }
  
  // 处理环境变量
  if (fs.existsSync(envFilePath)) {
    const envVars = loadEnvFile(envFilePath);
    if (envVars) {
      logger.info({ env: GITHUB_ENV_NAME }, `Creating/updating environment variables for environment ${GITHUB_ENV_NAME}...`);
      for (const [key, value] of Object.entries(envVars)) {
        await createOrUpdateVariable(GITHUB_OWNER, GITHUB_REPO, GITHUB_ENV_NAME, key, value, GITHUB_TOKEN);
      }
    }
  }
  
  logger.info({ env: GITHUB_ENV_NAME }, `Environment ${GITHUB_ENV_NAME} setup completed!`);
  return true;
}

// 主函数
async function main() {
  logger.info('Starting GitHub environment setup...');
  
  // 获取所有环境目录
  const envDirs = getEnvironmentDirs();
  
  if (envDirs.length === 0) {
    logger.error({ dir: CONFIG_DIR }, `Error: No environment directories found in ${CONFIG_DIR}`);
    process.exit(1);
  }
  
  logger.info({ count: envDirs.length }, `Found ${envDirs.length} environment configuration directories`);
  
  // 并行处理每个环境目录
  logger.info('\nStarting parallel processing of environment configurations...');
  
  // 使用 Promise.all 并行处理所有环境
  const results = await Promise.all(
    envDirs.map(envDir => processEnvironment(envDir))
  );
  
  // 检查结果
  const successCount = results.filter(result => result === true).length;
  const failCount = results.length - successCount;
  
  logger.info({ success: successCount, fail: failCount }, `\nAll GitHub environments setup completed! Success: ${successCount}, Failed: ${failCount}`);
}

// 运行主函数
main().catch(error => {
  logger.error({ error: error.message }, 'Script execution failed');
  process.exit(1);
});
