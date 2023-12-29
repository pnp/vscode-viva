param ([string[]]$workspacePath)

$sampleRepos = @("sp-dev-fx-aces", "sp-dev-fx-extensions", "sp-dev-fx-library-components", "sp-dev-fx-webparts")

function Parse-SampleJsonFiles {
    param (
        [string]$sampleRepo,
        [string]$folder
    )

    $allSamples = Get-ChildItem -Path "$workspacePath\$sampleRepo\$folder\**\sample.json" -Recurse -Force
    $samples = @()
    foreach ($sample in $allSamples) {

        Write-Output $sample.FullName

        try {
            $sampleContent = Get-Content -Path $sample.FullName -Raw
            $sampleJson = ConvertFrom-Json -InputObject $sampleContent
            
            $yoRcPath = $sample.FullName.Replace("assets\sample.json", ".yo-rc.json")

            if (-not (Test-Path -Path $yoRcPath)) {
                Continue
            }

            $yoRcContent = Get-Content -Path $yoRcPath -Raw
            $yoRcJson = ConvertFrom-Json -InputObject $yoRcContent
            $yoRcJson = $yoRcJson.PSObject.Properties.Value

            $version = $null
            if ($null -ne $yoRcJson.version -and $yoRcJson.version.GetType().BaseType -eq [System.Array]) {
                $version = $yoRcJson.version[$yoRcJson.version.Length - 1]
            } else {
                $version = $yoRcJson.version
            }

            $componentType = $null
            if ($null -ne $yoRcJson.componentType -and $yoRcJson.componentType.GetType().BaseType -eq [System.Array]) {
                $componentType = $yoRcJson.componentType[$yoRcJson.componentType.Length - 1]
            } else {
                $componentType = $yoRcJson.componentType
            }

            $extensionType = $null
            if ($null -ne $yoRcJson.extensionType -and $yoRcJson.extensionType.GetType().BaseType -eq [System.Array]) {
                $extensionType = $yoRcJson.extensionType[$yoRcJson.extensionType.Length - 1]
            } else {
                $extensionType = $yoRcJson.extensionType
            }

            $sampleAuthors = @()
            foreach ($author in $sampleJson.authors) {
                $sampleAuthors += [pscustomobject]@{ 
                    name       = $author.name;
                    pictureUrl = $author.pictureUrl;
                }
            }

            $samples += [pscustomobject]@{
                name            = $sampleJson.name; 
                title           = $sampleJson.title; 
                url             = $sampleJson.url;
                description     = $sampleJson.shortDescription; 
                image           = $sampleJson.thumbnails[0].url; 
                authors         = $sampleAuthors;
                tags            = $sampleJson.products;
                createDate      = $sampleJson.creationDateTime;
                updateDate      = $sampleJson.updateDateTime;
                version         = $version;  
                componentType   = $componentType;
                extensionType   = $extensionType;       
                sampleGalerry   = $sampleRepo
                sampleType      = $folder
            }
        }
        catch {
            Write-Output "Error: $($_.Exception.Message)"
        }
    }

    return $samples
}

$samples = @()
foreach ($sampleRepo in $sampleRepos) {

    Write-output $sampleRepo

    if (Test-Path -Path "$workspacePath\$sampleRepo\samples" -PathType Container) {
        $output = Parse-SampleJsonFiles -sampleRepo $sampleRepo -folder 'samples'
    }
    if (Test-Path -Path "$workspacePath\$sampleRepo\scenarios" -PathType Container) {
        $output = Parse-SampleJsonFiles -sampleRepo $sampleRepo -folder 'scenarios'
    }

    $samples += $output
}

[hashtable]$sampleModel = @{}
$sampleModel.Add('samples', $samples)
$orderedSampleModel = [ordered]@{}
foreach ($Item in ($sampleModel.GetEnumerator() | Sort-Object -Property Key)) {
    $orderedSampleModel[$Item.Key] = $Item.Value
}
New-Object -TypeName psobject -Property $orderedSampleModel | ConvertTo-Json -Depth 10 | Out-File "$workspacePath\vscode-viva\data\sp-dev-fx-samples.json"

