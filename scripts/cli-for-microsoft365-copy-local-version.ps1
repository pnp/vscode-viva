param ([string[]]$workspacePath)

$cliPackagePath = "$workspacePath\vscode-viva\node_modules\@pnp\cli-microsoft365"
$cliLocalProjectPath = "$workspacePath\cli-microsoft365"

if (Test-Path -Path $cliPackagePath -PathType Container && Test-Path -Path $cliLocalProjectPath -PathType Container) {
    Write-Host "Coping local version of cli-microsoft365..."

    Copy-Item -Path "$cliLocalProjectPath\dist\*" -Destination "$cliPackagePath\dist\" -Recurse -Force

    # Remove the eslint plugin folder if it exists
    $eslintPluginPath = "$cliPackagePath\node_modules\eslint-plugin-cli-microsoft365"
    if (Test-Path -Path $eslintPluginPath -PathType Container) {
        Write-Host "Removing eslint-plugin-cli-microsoft365 folder..."
        Remove-Item -Path $eslintPluginPath -Recurse -Force
    }
}

