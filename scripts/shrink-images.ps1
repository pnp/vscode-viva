# .\shrink-images.ps1 -InputFolder "C:\images" -ApiKey "your-api-key"

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateScript({
        if (-not (Test-Path $_)) {
            throw "The specified folder '$_' does not exist."
        }
        return $true
    })]
    [string]$InputFolder,
    
    [Parameter(Mandatory = $false)]
    [string]$ApiKey = $env:TINYPNG_API_KEY,
    
    [Parameter(Mandatory = $false)]
    [string[]]$SupportedExtensions = @(".jpg", ".jpeg", ".png", ".webp")
)

if ([string]::IsNullOrWhiteSpace($ApiKey)) {
    Write-Error "API key is required. Provide it via -ApiKey parameter or set TINYPNG_API_KEY environment variable."
    Write-Host "Create an API key at https://tinify.com/developers" -ForegroundColor Yellow
    exit 1
} 

$imageFiles = Get-ChildItem -Path $InputFolder -File | Where-Object { 
    $SupportedExtensions -contains $_.Extension.ToLower() 
}

if ($imageFiles.Count -eq 0) {
    Write-Host "No supported image files found in $InputFolder"
    exit 0
}

$processedCount = 0
$successCount = 0
$errorCount = 0

Write-Host "Starting compression of $($imageFiles.Count) image(s)..." -ForegroundColor Green

foreach ($file in $imageFiles) {
    $processedCount++
    $inputPath = $file.FullName
    $fileName = $file.Name
    $outputPath = $inputPath
    
    Write-Host "[$processedCount/$($imageFiles.Count)] Processing: $fileName" -ForegroundColor Yellow
    
    try {
        $headers = @{ 
            Authorization = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("api:$ApiKey")))" 
        }
        
        $originalSize = (Get-Item $inputPath).Length
        
        $response = Invoke-RestMethod `
            -Uri "https://api.tinify.com/shrink" `
            -Method POST `
            -InFile $inputPath `
            -Headers $headers `
            -ContentType "application/octet-stream"
        
        Invoke-WebRequest `
            -Uri $response.output.url `
            -OutFile $outputPath

        $successCount++
    }
    catch {
        Write-Host "`tError compressing ${fileName}: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host "`n`tCompression completed!" -ForegroundColor Green
Write-Host "`tSuccessfully processed: $successCount/$($imageFiles.Count)" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "`tErrors encountered: $errorCount" -ForegroundColor Red
}
