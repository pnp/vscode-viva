param ([string[]]$workspacePath)

$cliLocalProjectPath = "$workspacePath\cli-microsoft365"

if (-not (Test-Path -Path $cliLocalProjectPath -PathType Container)) {
    return
}

[hashtable]$commandsData = @{}

$allSpoCommands = Get-ChildItem -Path "$workspacePath\cli-microsoft365\docs\docs\cmd\spo\*.mdx" -Recurse -Force -Exclude "_global*"
$allTeamsCommands = Get-ChildItem -Path "$workspacePath\cli-microsoft365\docs\docs\cmd\teams\*.mdx" -Recurse -Force -Exclude "_global*"
$allCommands = $allSpoCommands + $allTeamsCommands

foreach ($command in $allCommands) {
    $commandDocs = ConvertFrom-Markdown -Path $command
    $html = New-Object -Com 'HTMLFile'
    $html.write([ref]$commandDocs.Html)

    $title = $html.all.tags('h1')[0]
    $commandTitle = $title.innerText

    if (-not ($commandTitle -match "\b(list|get)$")) {
        continue
    }

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
    $commandOptions = $commandOptions | ForEach-Object { $_.Replace("`r`n", '') }

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
    $commandExamplesObjects = @()
    for ($i = 0; $i -lt $commandExamples.Length; $i += 2) {
        $example = $commandExamples[$i]
        $description = $commandExamples[$i + 1]
        $commandExamplesObject = @{
            Example = $example
            Description = $description
        }
        $commandExamplesObjects += $commandExamplesObject
    }

    $commandsData["m365 $commandTitle"] = @{
        Description = $commandDescription
        Options = $commandOptions
        Examples = $commandExamplesObjects
    }
}

$dataArray = @()
foreach ($key in $commandsData.Keys) {
    $orderedHashtable = [ordered]@{
        Command = $key
        Description = $commandsData[$key].Description
        Options = $commandsData[$key].Options
        Examples = $commandsData[$key].Examples
    }
    $dataArray += $orderedHashtable
}

$dataArray | ConvertTo-Json -Depth 3 | Out-File "$workspacePath\vscode-viva\src\chat\CliForMicrosoft365SpoCommands.ts"