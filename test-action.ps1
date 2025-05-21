param (
    [Parameter(Mandatory = $false)]
    [string]$WorkflowFile,
    
    [Parameter(Mandatory = $false)]
    [string]$Job,
    
    [Parameter(Mandatory = $false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory = $false)]
    [switch]$VerboseOutput
)

# 设置工作目录
$WorkingDir = $PSScriptRoot

# 如果没有指定工作流文件，列出所有可用的工作流供用户选择
if (-not $WorkflowFile) {
    Write-Host "可用的工作流文件:" -ForegroundColor Cyan
    $workflows = Get-ChildItem -Path "$WorkingDir\.github\workflows" -Filter "*.yml"
    
    for ($i = 0; $i -lt $workflows.Count; $i++) {
        Write-Host "[$i] $($workflows[$i].Name)" -ForegroundColor Yellow
    }
    
    $choice = Read-Host "请选择要测试的工作流文件编号"
    $WorkflowFile = $workflows[$choice].Name
}

# 构建 act 命令
$actCommand = "act"

# 添加工作流文件参数
if ($WorkflowFile) {
    $actCommand += " -W .github/workflows/$WorkflowFile"
}

# 添加 Job 参数
if ($Job) {
    $actCommand += " -j $Job"
}

# 添加 DryRun 参数
if ($DryRun) {
    $actCommand += " -n"
}

# 添加 Verbose 参数
if ($VerboseOutput) {
    $actCommand += " -v"
}

# 显示将要执行的命令
Write-Host "执行命令: $actCommand" -ForegroundColor Green

# 执行命令
Invoke-Expression $actCommand
