/**
 * 递归检查 monorepo 中所有项目的许可证
 * 并输出整合的信息
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 主要项目目录
const projectDirs = [
  path.resolve(__dirname, '..'),
  path.resolve(__dirname, '../apps/myy-app'),
  path.resolve(__dirname, '../apps/myy-backend'),
  path.resolve(__dirname, '../apps/myy-dashboard'),
];

// 存储所有许可证信息
const allLicenses = {};
// 存储许可证计数
const licenseCounts = {};
// 存储每个许可证下的包
const licensePackages = {};

// 检查每个目录的许可证
projectDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`目录不存在: ${dir}`);
    return;
  }

  const projectName = path.basename(dir);
  console.log(`\n检查 ${projectName} 的许可证...`);

  try {
    // 运行 license-checker 获取 JSON 格式的结果
    const result = execSync('npx license-checker --json', { 
      cwd: dir, 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // 解析 JSON 结果
    const licenses = JSON.parse(result);
    
    // 合并到总结果中
    Object.assign(allLicenses, licenses);
    
    // 统计许可证类型
    Object.entries(licenses).forEach(([pkgPath, pkg]) => {
      const license = pkg.licenses || 'UNKNOWN';
      
      // 从路径中提取包名和版本
      const pathParts = pkgPath.split('@');
      let name = pathParts[0] || '';
      let version = '';
      
      // 处理作用域包 (如 @babel/core)
      if (name === '' && pathParts.length > 2) {
        name = '@' + pathParts[1];
        version = pathParts[2] || '';
      } else if (pathParts.length > 1) {
        version = pathParts[pathParts.length - 1];
      }
      
      // 清理名称中的特殊字符
      if (name.startsWith('/')) {
        name = name.substring(1);
      }
      
      // 计数
      if (!licenseCounts[license]) {
        licenseCounts[license] = 0;
        licensePackages[license] = [];
      }
      licenseCounts[license]++;
      
      // 添加到对应许可证的包列表
      licensePackages[license].push({
        name: name,
        version: version,
        repository: pkg.repository || '',
        publisher: pkg.publisher || '',
        email: pkg.email || ''
      });
    });
    
    // 输出当前项目的许可证摘要
    console.log(`${projectName} 许可证摘要:`);
    Object.entries(licenseCounts).forEach(([license, count]) => {
      console.log(`  ${license}: ${count}`);
    });
    
  } catch (error) {
    console.error(`检查 ${projectName} 许可证时出错:`, error.message);
  }
});

// 生成总结报告
console.log('\n\n=== 许可证总结报告 ===');
console.log('许可证类型统计:');
Object.entries(licenseCounts).sort((a, b) => b[1] - a[1]).forEach(([license, count]) => {
  console.log(`${license}: ${count} 个包`);
});

// 生成 Markdown 格式的报告
const generateMarkdownReport = () => {
  let markdown = `# 第三方开源软件许可证\n\n`;
  markdown += `本项目使用了多个开源软件包。以下是使用的第三方组件及其许可证信息：\n\n`;
  
  // 添加许可证摘要
  markdown += `## 许可证摘要\n\n`;
  markdown += `| 许可证 | 包数量 |\n`;
  markdown += `|--------|--------|\n`;
  
  Object.entries(licenseCounts).sort((a, b) => b[1] - a[1]).forEach(([license, count]) => {
    markdown += `| ${license} | ${count} |\n`;
  });
  
  // 添加每种许可证的包详情
  markdown += `\n## 详细包信息\n\n`;
  
  Object.entries(licensePackages).sort((a, b) => b[1].length - a[1].length).forEach(([license, packages]) => {
    markdown += `### ${license} 许可证 (${packages.length} 个包)\n\n`;
    markdown += `| 包名 | 版本 | 仓库 |\n`;
    markdown += `|------|------|------|\n`;
    
    packages.forEach(pkg => {
      const name = pkg.name || '未知';
      const version = pkg.version || '未知';
      const repoUrl = pkg.repository || '';
      markdown += `| ${name} | ${version} | ${repoUrl} |\n`;
    });
    
    markdown += `\n`;
  });
  
  // 添加主要许可证的说明
  if (licenseCounts['MIT'] > 0) {
    markdown += `## MIT 许可证说明\n\n`;
    markdown += `MIT 许可证是一种宽松的许可证，允许在私有软件中使用，并且允许修改和分发。该许可证只要求在软件和相关文档中包含该许可证的版权和许可声明。这种许可证对商业软件非常友好，不会有"传染性"问题。\n\n`;
  }
  
  if (licenseCounts['Apache-2.0'] > 0) {
    markdown += `## Apache 2.0 许可证说明\n\n`;
    markdown += `Apache 2.0 许可证是一种允许在商业软件中使用的许可证，但要求保留版权声明和许可证。该许可证还包含专利授权条款，为用户提供法律保护。\n\n`;
  }
  
  if (licenseCounts['BSD-2-Clause'] > 0 || licenseCounts['BSD-3-Clause'] > 0) {
    markdown += `## BSD 许可证说明\n\n`;
    markdown += `BSD 许可证是一种宽松的许可证，只要保留版权声明，允许商业使用和闭源。BSD-2-Clause（两条款）和 BSD-3-Clause（三条款）的主要区别在于后者多了一条不得使用原作者或贡献者名义进行推广的条款。\n\n`;
  }
  
  markdown += `---\n\n`;
  markdown += `注意：本文档由自动脚本生成，最后更新时间：${new Date().toISOString().split('T')[0]}。\n`;
  markdown += `如需更新，请运行 \`node scripts/check-licenses.js\`。\n`;
  
  return markdown;
};

// 将 Markdown 报告写入文件
const markdownReport = generateMarkdownReport();
const reportPath = path.resolve(__dirname, '../THIRD_PARTY_LICENSES.md');

fs.writeFileSync(reportPath, markdownReport, 'utf8');
console.log(`\n许可证报告已写入: ${reportPath}`);

// 将完整许可证信息写入 JSON 文件
const jsonReportPath = path.resolve(__dirname, '../licenses-full.json');
fs.writeFileSync(jsonReportPath, JSON.stringify(allLicenses, null, 2), 'utf8');
console.log(`完整许可证信息已写入: ${jsonReportPath}`);
