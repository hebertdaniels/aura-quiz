# ------------------------------------------------------------
# Servidor local do Aura Quiz
# Usa so o PowerShell que ja vem no Windows: nao precisa instalar nada.
# Para parar: feche esta janela (ou aperte Ctrl+C).
# ------------------------------------------------------------

param([switch]$SemNavegador)

$raiz = [System.IO.Path]::GetFullPath($PSScriptRoot)

$tipos = @{
  '.html'        = 'text/html; charset=utf-8'
  '.js'          = 'text/javascript; charset=utf-8'
  '.css'         = 'text/css; charset=utf-8'
  '.json'        = 'application/json; charset=utf-8'
  '.webmanifest' = 'application/manifest+json; charset=utf-8'
  '.svg'         = 'image/svg+xml'
  '.png'         = 'image/png'
  '.ico'         = 'image/x-icon'
  '.md'          = 'text/plain; charset=utf-8'
}

# Procura uma porta livre entre 8080 e 8090
$servidor = $null
foreach ($porta in 8080..8090) {
  $tentativa = New-Object System.Net.HttpListener
  $tentativa.Prefixes.Add("http://localhost:$porta/")
  try {
    $tentativa.Start()
    $servidor = $tentativa
    break
  } catch {
    $tentativa.Close()
  }
}

if (-not $servidor) {
  Write-Host 'Nao encontrei nenhuma porta livre entre 8080 e 8090.' -ForegroundColor Red
  exit 1
}

$endereco = "http://localhost:$porta/"
Write-Host ''
Write-Host '  Aura Quiz rodando!' -ForegroundColor Magenta
Write-Host "  Abra no navegador: $endereco" -ForegroundColor Cyan
Write-Host '  Para parar, feche esta janela.' -ForegroundColor DarkGray
Write-Host ''
if (-not $SemNavegador) { Start-Process $endereco }

try {
  while ($servidor.IsListening) {
    $tarefa = $servidor.GetContextAsync()
    while (-not $tarefa.AsyncWaitHandle.WaitOne(300)) { }  # deixa o Ctrl+C funcionar
    $contexto = $tarefa.GetAwaiter().GetResult()
    $resposta = $contexto.Response

    try {
      $caminho = [System.Uri]::UnescapeDataString($contexto.Request.Url.AbsolutePath)
      if ($caminho.EndsWith('/')) { $caminho += 'index.html' }
      $arquivo = [System.IO.Path]::GetFullPath((Join-Path $raiz $caminho.TrimStart('/')))

      # Seguranca: so entrega arquivos de dentro da pasta do projeto
      $dentroDaPasta = $arquivo.StartsWith($raiz + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)

      if ($dentroDaPasta -and (Test-Path -LiteralPath $arquivo -PathType Leaf)) {
        $extensao = [System.IO.Path]::GetExtension($arquivo).ToLower()
        $tipo = $tipos[$extensao]
        if (-not $tipo) { $tipo = 'application/octet-stream' }
        $bytes = [System.IO.File]::ReadAllBytes($arquivo)
        $resposta.ContentType = $tipo
        $resposta.Headers.Add('Cache-Control', 'no-store')
        $resposta.ContentLength64 = $bytes.Length
        $resposta.OutputStream.Write($bytes, 0, $bytes.Length)
        Write-Host "  200  $caminho" -ForegroundColor DarkGray
      } else {
        $resposta.StatusCode = 404
        Write-Host "  404  $caminho" -ForegroundColor Yellow
      }
    } catch {
      $resposta.StatusCode = 500
    } finally {
      $resposta.Close()
    }
  }
} finally {
  $servidor.Stop()
  $servidor.Close()
}
