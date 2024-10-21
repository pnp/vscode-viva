param ([string[]]$workspacePath)

$cliLocalProjectPath = "$workspacePath\cli-microsoft365"

if (-not (Test-Path -Path $cliLocalProjectPath -PathType Container)) {
    return
}

[hashtable]$commandsData = @{}

$allSpoCommands = Get-ChildItem -Path "$workspacePath\cli-microsoft365\docs\docs\cmd\spo\*.mdx" -Recurse -Force -Exclude "_global*"

foreach ($command in $allSpoCommands) {
    $commandDocs = ConvertFrom-Markdown -Path $command
    $html = New-Object -Com 'HTMLFile'
    $html.write([ref]$commandDocs.Html)

    $title = $html.all.tags('h1')[0]
    $commandTitle = $title.innerText

    if (-not ($commandTitle -match "\b(list|get)$")) {
        continue
    }

    #Write-Host $commandTitle

    $titleIndex = @($html.all).IndexOf($title)

    $usage = $html.all.tags('h2') | Where-Object { $_.tagName -eq 'H2' } | Select-Object -First 1
    $usageIndex = @($html.all).IndexOf($usage)

    $commandDescription = @($html.all)[($titleIndex + 1)..($usageIndex - 1)]
    $commandDescription = $commandDescription | ForEach-Object { $_.innerText }

    $subTitles = $html.all.tags('h2') | Where-Object { $_.tagName -eq 'H2' } | Select-Object -First 5
    $optionsStartIndex = @($html.all).IndexOf($subTitles[1])
    $optionsEndIndex = @($html.all).IndexOf($subTitles[2])
    $commandOptions = @($html.all)[($optionsStartIndex + 1)..($optionsEndIndex - 1)]
    $commandOptions = $commandOptions | Where-Object { $_.nodeName -eq 'CODE' } | ForEach-Object { $_.innerText }
    $commandOptions = $commandOptions  -split '\r?\n'
    $commandOptions = $commandOptions | ForEach-Object { $_.Replace(':', '') }
    #$commandOptions | ForEach-Object { Write-Host $_ }

    $examples = $subTitles[2].innerText
    $examplesStartIndex = @($html.all).IndexOf($subTitles[2])
    $examplesEndIndex = @($html.all).IndexOf($subTitles[3])
    if (-not ($examples -match "Example")) {
        $examples = $subTitles[3].innerText
        $examplesStartIndex = @($html.all).IndexOf($subTitles[3])
        $examplesEndIndex = @($html.all).IndexOf($subTitles[4])
    }
    $commandExamples = @($html.all)[($examplesStartIndex + 1)..($examplesEndIndex - 1)]
    $commandExamples = $commandExamples | Where-Object { $_.nodeName -match  'CODE|P' } | ForEach-Object { $_.innerText }
    $commandExamples = $commandExamples | Select-Object -Unique
    $commandExamples = $commandExamples  -split '\r?\n'
    #$commandExamples | ForEach-Object { Write-Host $_ }

    [hashtable]$commandProperties = [ordered]@{}
    # $commandProperties.Add('prefix', @("m365 $commandTitle"))
    # $commandProperties.Add('body', @("m365 $commandTitle $commandOptions"))
    # $commandProperties.Add('description', "$commandDescription")
    # $commandClass = New-Object -TypeName psobject -Property $commandProperties

    # $commandsData.Add($commandTitle, $commandClass)
}

# $orderedCommandsData = [ordered]@{}
# foreach ($Item in ($commandsData.GetEnumerator() | Sort-Object -Property Key)) {
#     $orderedCommandsData[$Item.Key] = $Item.Value
# }
# New-Object -TypeName psobject -Property $orderedCommandsData | ConvertTo-Json | Out-File "$workspacePath\vscode-viva\data\cli-for-microsoft365-spo-commands.json"