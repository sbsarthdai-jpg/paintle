# 간단한 정적 파일 서버 (Node/Python 없이 로컬 미리보기용)
param(
  [int]$Port = 5500
)

$root = Split-Path -Parent $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $root at $prefix"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".ico"  = "image/x-icon"
  ".json" = "application/json; charset=utf-8"
  ".txt"  = "text/plain; charset=utf-8"
  ".xml"  = "application/xml; charset=utf-8"
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $request = $context.Request
  $response = $context.Response

  $localPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath)
  if ($localPath -eq "/") { $localPath = "/index.html" }
  $filePath = Join-Path $root ($localPath.TrimStart("/"))

  if (Test-Path $filePath -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
    $contentType = $mime[$ext]
    if (-not $contentType) { $contentType = "application/octet-stream" }
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $response.ContentType = $contentType
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $response.StatusCode = 404
    $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $localPath")
    $response.OutputStream.Write($notFound, 0, $notFound.Length)
  }
  $response.OutputStream.Close()
}
