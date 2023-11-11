param ([string[]]$workspacePath)

$cliPackagePath = "$workspacePath\vscode-viva\node_modules\@pnp\cli-microsoft365"

if (Test-Path -Path $cliPackagePath -PathType Container) {
    Write-Host "Cleaning up cli-microsoft365 package..."

    Remove-Item -Path "$cliPackagePath\docs" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\chili" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\aad" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\adaptivecard" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\app" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\booking" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\context" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\file" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\flow" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\graph" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\onedrive" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\onenote" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\outlook" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\pa" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\planner" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\pp" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\purview" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\applicationcustomizer" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\apppage" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\cdn" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\commandset" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\contenttype" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\contenttypehub" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\customaction" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\eventreceiver" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\externaluser" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\feature" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\field" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\folder" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\file" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\group" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\hidedefaultthemes" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\homesite" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\hubsite" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\knowledgehub" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\list" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\listitem" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\mail" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\navigation" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\orgassetslibrary" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\orgnewssite" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\page" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\propertybag" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\report" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\search" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\sitedesign" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\sitescript" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\storageentity" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\term" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\theme" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\user" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\userprofile" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\spo\commands\web" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\search" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\skype" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\teams" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\tenant" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\todo" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\viva" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\dist\m365\yammer" -Recurse -Force -ErrorAction SilentlyContinue

    Remove-Item -Path "$cliPackagePath\node_modules\@microsoft\microsoft-graph-types" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@types\adm-zip" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@types\inquirer" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@types\jmespath" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@types\json-to-ast" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@types\minimist" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@types\mocha" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@types\node" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@types\node-forge" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@types\semver" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@types\sinon" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@types\update-notifier" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@types\uuid" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@typescript-eslint\eslint-plugin" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\@typescript-eslint\parser" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\c8" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\eslint" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\eslint-plugin-cli-microsoft365" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\eslint-plugin-mocha" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\mocha" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\rimraf" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\sinon" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$cliPackagePath\node_modules\source-map-support" -Recurse -Force -ErrorAction SilentlyContinue
}

