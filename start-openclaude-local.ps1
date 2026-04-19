# start-openclaude-local.ps1 → OpenClaude 100% local com Ollama

# Limpeza de configurações antigas da internet
Remove-Item Env:ANTHROPIC_* -ErrorAction SilentlyContinue
Remove-Item Env:CLAUDE_CODE_USE_OPENAI -ErrorAction SilentlyContinue

# Configuração para Ollama (OpenAI-compatible)
$env:CLAUDE_CODE_USE_OPENAI = "1"
$env:OPENAI_BASE_URL = "http://localhost:11434/v1"
$env:OPENAI_API_KEY = "ollama"                    # qualquer coisa funciona

Write-Host "🚀 Iniciando OpenClaude LOCAL com Ollama" -ForegroundColor Green
Write-Host "Base URL: http://localhost:11434/v1" -ForegroundColor Cyan
Write-Host "Model: qwen3-coder-next (ou o que você baixou)" -ForegroundColor Cyan

# Inicia o OpenClaude apontando para o modelo
openclaude --model qwen3-coder-next