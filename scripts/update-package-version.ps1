param (
    [Parameter(Mandatory = $true)]
    [string]$PathToWorkspace
)

$packageJson = Get-Content "$PathToWorkspace\package.json" | ConvertFrom-Json
$oldVersion = $packageJson.version
$oldVersionParts = $oldVersion.Split(".")
$newVersion = "$($oldVersionParts[0]).$($oldVersionParts[1]).$([int]$oldVersionParts[2] + 1)"
$packageJson.version = $newVersion
$packageJson | ConvertTo-Json -Depth 10 | Out-File "$PathToWorkspace\package.json" -Encoding utf8 -Force

$shrinkwrapPath = "$PathToWorkspace\npm-shrinkwrap.json"
$shrinkwrap = Get-Content $shrinkwrapPath -Raw | ConvertFrom-Json -AsHashtable
$shrinkwrap['version'] = $newVersion
$shrinkwrap['packages']['']['version'] = $newVersion
$shrinkwrap | ConvertTo-Json -Depth 100 | Out-File $shrinkwrapPath -Encoding utf8 -Force
