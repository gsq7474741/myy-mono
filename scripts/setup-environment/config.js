/**
 * Configuration file for GitHub environment setup script
 */
const path = require('path');
const fs = require('fs');
const pino = require('pino');

// Create pino logger instance
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

// 全局配置文件路径
const GITHUB_CONFIG_FILE = path.resolve(__dirname, '.github-config');

// 加载全局 GitHub 配置
function loadGithubConfig() {
  if (!fs.existsSync(GITHUB_CONFIG_FILE)) {
    logger.error({ file: GITHUB_CONFIG_FILE }, `Error: Global configuration file ${GITHUB_CONFIG_FILE} does not exist`);
    return null;
  }
  
  try {
    const content = fs.readFileSync(GITHUB_CONFIG_FILE, 'utf8');
    const config = {};
    
    content.split('\n').forEach(line => {
      // 忽略注释和空行
      if (line.trim() && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('='); // 处理值中可能包含 = 的情况
        if (key && value) {
          config[key.trim()] = value.trim();
        }
      }
    });
    
    // 设置默认值
    if (config.CONFIG_DIR) {
      config.CONFIG_DIR = path.resolve(__dirname, config.CONFIG_DIR);
    } else {
      config.CONFIG_DIR = path.resolve(__dirname, './config');
    }
    
    return config;
  } catch (error) {
    logger.error({ file: GITHUB_CONFIG_FILE, error: error.message }, `Failed to read global configuration file ${GITHUB_CONFIG_FILE}`);
    return null;
  }
}

// 加载全局配置
const githubConfig = loadGithubConfig() || {};

// 配置目录
const CONFIG_DIR = githubConfig.CONFIG_DIR || path.resolve(__dirname, './config');

// 加载环境配置文件
function loadConfigFile(envDir) {
  const configFilePath = path.join(envDir, '.github-config');
  
  if (!fs.existsSync(configFilePath)) {
    logger.warn({ file: configFilePath }, `Warning: Configuration file ${configFilePath} does not exist`);
    return null;
  }
  
  try {
    const content = fs.readFileSync(configFilePath, 'utf8');
    const config = {};
    
    content.split('\n').forEach(line => {
      // 忽略注释和空行
      if (line.trim() && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('='); // 处理值中可能包含 = 的情况
        if (key && value) {
          config[key.trim()] = value.trim();
        }
      }
    });
    
    return config;
  } catch (error) {
    logger.error({ file: configFilePath, error: error.message }, `Failed to read configuration file ${configFilePath}`);
    return null;
  }
}

// 获取环境目录列表
function getEnvironmentDirs() {
  if (!fs.existsSync(CONFIG_DIR)) {
    logger.error({ dir: CONFIG_DIR }, `Error: Configuration directory ${CONFIG_DIR} does not exist`);
    return [];
  }
  
  return fs.readdirSync(CONFIG_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(CONFIG_DIR, dirent.name));
}

// 读取环境文件
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    logger.warn({ file: filePath }, `Warning: Environment file ${filePath} does not exist`); 
    return null;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    
    content.split('\n').forEach(line => {
      // 忽略注释和空行
      if (line.trim() && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('='); // 处理值中可能包含 = 的情况
        if (key && value) {
          env[key.trim()] = value.trim();
        }
      }
    });
    
    return env;
  } catch (error) {
    logger.error({ file: filePath, error: error.message }, `Failed to read environment file ${filePath}`);
    return null;
  }
}

// 读取 secrets 文件
function readSecretsFile(filePath) {
  if (!fs.existsSync(filePath)) {
    logger.warn({ file: filePath }, `Warning: Secrets file ${filePath} does not exist`);
    return null;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const secrets = {};
    
    content.split('\n').forEach(line => {
      if (line.trim() && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('='); // 处理值中可能包含 = 的情况
        if (key && value) {
          secrets[key.trim()] = value.trim();
        }
      }
    });
    
    return secrets;
  } catch (error) {
    logger.error({ file: filePath, error: error.message }, `Failed to read Secrets file ${filePath}`);
    return null;
  }
}

// 读取分支规则配置文件
function readBranchRules(envDir) {
  const branchRulesPath = path.join(envDir, '.branch-rules.json');
  
  if (!fs.existsSync(branchRulesPath)) {
    // 如果没有分支规则配置文件，返回 null，使用默认配置
    return null;
  }
  
  try {
    const content = fs.readFileSync(branchRulesPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    logger.error({ file: branchRulesPath, error: error.message }, `Failed to read branch rules configuration file ${branchRulesPath}`);
    return null;
  }
}

module.exports = {
  CONFIG_DIR,
  githubConfig,
  loadConfigFile,
  getEnvironmentDirs,
  loadEnvFile,
  readSecretsFile,
  readBranchRules,
  logger
};
