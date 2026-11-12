# ------------------------------------------------------------
# Empacotador do Aura Quiz
# Junta SÓ os arquivos que o site precisa num .zip pronto para a hospedagem.
# Arquivos de desenvolvimento (testes, servidor local, README, .git) ficam de fora.
# ------------------------------------------------------------

$ErrorActionPreference = 'Stop'
$raiz = $PSScriptRoot
$destino = Join-Path $raiz 'publicar'
$zip = Join-Path $raiz 'aura-quiz-site.zip'

# O que vai para a internet
$itens = @(
  'index.html',
  'manifest.webmanifest',
  'sw.js',
  '.htaccess',
  'assets\icons',
  'assets\brand\simbolo.png',
  'src'
)

# 1. Monta a pasta "publicar" do zero
if (Test-Path $destino) { Remove-Item $destino -Recurse -Force }
New-Item -ItemType Directory $destino | Out-Null
foreach ($item in $itens) {
  $origem = Join-Path $raiz $item
  if (-not (Test-Path $origem)) { throw "Arquivo não encontrado: $item" }
  $alvo = Join-Path $destino $item
  New-Item -ItemType Directory -Force (Split-Path $alvo) | Out-Null
  Copy-Item $origem $alvo -Recurse
}

# 2. Versão nova do modo offline (data e hora), para os celulares baixarem a atualização
$versao = 'aura-quiz-' + (Get-Date -Format 'yyyyMMdd-HHmm')
$sw = Join-Path $destino 'sw.js'
$texto = [System.IO.File]::ReadAllText($sw)
$texto = [regex]::Replace($texto, "const VERSAO = '[^']*';", "const VERSAO = '$versao';")
[System.IO.File]::WriteAllText($sw, $texto, (New-Object System.Text.UTF8Encoding $false))

# 3. Confere: todo arquivo que o modo offline espera precisa estar no pacote
$faltando = [regex]::Matches($texto, "'\./([^']+)'") |
  ForEach-Object { $_.Groups[1].Value } |
  Where-Object { -not (Test-Path (Join-Path $destino $_)) }
if ($faltando) { throw "Faltam no pacote (listados no sw.js): $($faltando -join ', ')" }

# 4. Cria o .zip (com barras "/" para o servidor Linux da hospedagem entender as pastas)
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
if (Test-Path $zip) { Remove-Item $zip -Force }
$arquivoZip = [System.IO.Compression.ZipFile]::Open($zip, 'Create')
try {
  Get-ChildItem $destino -Recurse -File -Force | ForEach-Object {
    $nome = $_.FullName.Substring($destino.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($arquivoZip, $_.FullName, $nome, 'Optimal') | Out-Null
  }
} finally {
  $arquivoZip.Dispose()
}

$tamanho = [Math]::Round((Get-Item $zip).Length / 1KB)
$total = (Get-ChildItem $destino -Recurse -File -Force).Count
Write-Host ''
Write-Host "  Pacote pronto! ($total arquivos, $tamanho KB)"
Write-Host "  Versao do modo offline: $versao"
Write-Host "  Arquivo: $zip"
Write-Host ''
Write-Host '  Envie o .zip para a pasta public_html da hospedagem e clique em Extrair.'
Write-Host ''
