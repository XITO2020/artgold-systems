# --- for proper UTF-8 output on Windows PowerShell 5 ---
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding  = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.UTF8Encoding]::new()


Param(
  [string]$Api = "http://localhost:4000"
)

$ErrorActionPreference = 'Stop'

function Log([string]$m){ Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Ok ([string]$m){ Write-Host "[ OK ] $m" -ForegroundColor Green }
function Fail([string]$m){ Write-Host "[ERR ] $m" -ForegroundColor Red; exit 1 }

try {
  Log "Ping /"
  Invoke-RestMethod -Uri "$Api/" | Out-Null
  Ok "Dashboard accessible"

  # Signup
  $email = "demo+$([DateTime]::UtcNow.Ticks)@example.com"
  $passwordPlain = "S3cret!"
  Log "Signup $email"
  $signupBody = @{ email=$email; password=$passwordPlain; name="Demo" } | ConvertTo-Json
  $signup = Invoke-RestMethod -Method Post -Uri "$Api/api/user/signup" -ContentType "application/json" -Body $signupBody
  if (-not $signup.user.id) { Fail "Signup a échoué: $($signup | ConvertTo-Json -Depth 6)" }
  Ok "User créé: $($signup.user.id)"

  # Login
  Log "Login"
  $loginBody = @{ email=$email; password=$passwordPlain } | ConvertTo-Json
  $login = Invoke-RestMethod -Method Post -Uri "$Api/api/user/login" -ContentType "application/json" -Body $loginBody
  $token = $login.accessToken
  if (-not $token) { Fail "Pas d'accessToken: $($login | ConvertTo-Json -Depth 6)" }
  Ok "Token reçu (len=$($token.Length))"

  $headers = @{ Authorization = "Bearer $token" }

  # /api/user/me
  Log "GET /api/user/me"
  $me = Invoke-RestMethod -Method Get -Uri "$Api/api/user/me" -Headers $headers
  Ok ("ME: " + ($me | ConvertTo-Json -Depth 4))

  # POST /api/nft/upload
  Log "POST /api/nft/upload"
  $uploadBody = @{
    title       = "Test NFT"
    description = "demo"
    chain       = "EVM"
    network     = "sepolia"
    url         = "https://example.com/media.png"
  } | ConvertTo-Json
  $nft = Invoke-RestMethod -Method Post -Uri "$Api/api/nft/upload" -Headers $headers -ContentType "application/json" -Body $uploadBody
  Ok ("NFT créé: " + ($nft | ConvertTo-Json -Depth 4))

  # GET /api/nft/mine
  Log "GET /api/nft/mine"
  $mine = Invoke-RestMethod -Method Get -Uri "$Api/api/nft/mine" -Headers $headers
  Ok ("NFTs: " + ($mine | ConvertTo-Json -Depth 4))

  Ok "Sanity check terminé ✅"
}
catch {
  if ($_.Exception.Response -and $_.Exception.Response.GetResponseStream) {
    try {
      $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      $body = $reader.ReadToEnd()
      Fail ("HTTP error: " + $body)
    } catch {
      Fail $_.Exception.Message
    }
  } else {
    Fail $_.Exception.Message
  }
}
