param ([string[]]$workspacePath)

$sampleRepos = @("sp-dev-fx-aces", "sp-dev-fx-extensions", "sp-dev-fx-library-components", "sp-dev-fx-webparts")

function Test-JsonContent {
    param (
        [string]$FilePath,
        [string]$JsonContent
    )
    
    try {
        $null = ConvertFrom-Json -InputObject $JsonContent -ErrorAction Stop
        return $true
    }
    catch {
        Write-Warning "Invalid JSON in: $FilePath"
        Write-Warning "Error: $($_.Exception.Message)"
        return $false
    }
}

function Parse-SampleJsonFiles {
    param (
        [string]$sampleRepo,
        [string]$folder
    )

    $allSamples = Get-ChildItem -Path "$workspacePath\$sampleRepo\$folder\**\sample.json" -Recurse -Force
    $samples = @()
    foreach ($sample in $allSamples) {

        try {
            $sampleContent = Get-Content -Path $sample.FullName -Raw
            
            if (-not (Test-JsonContent -FilePath $sample.FullName -JsonContent $sampleContent)) {
                continue 
            }

            $sampleJsons = ConvertFrom-Json -InputObject $sampleContent
            
            foreach ($sampleJson in $sampleJsons) {
                $version = $null
                $componentType = $null
                $extensionType = $null
                $isSPFxProject = $false

                $sampleFolder = Split-Path -Path $sample.FullName -Parent
                $sampleFolder = Split-Path -Path $sampleFolder -Parent

                $packageJsonPath = Join-Path -Path $sampleFolder -ChildPath "package.json"

                if (-not (Test-Path -Path $packageJsonPath)) {
                    Continue
                }

                try {
                    $packageJsonContent = Get-Content -Path $packageJsonPath -Raw
                    $packageJson = ConvertFrom-Json -InputObject $packageJsonContent
                    
                    if ($null -ne $packageJson.dependencies.'@microsoft/sp-core-library') {
                        $isSPFxProject = $true
                        
                        $coreLibVersion = $packageJson.dependencies.'@microsoft/sp-core-library'
                        $version = $coreLibVersion -replace '[\^~>=<]', ''
                        
                        switch ($sampleRepo) {
                            'sp-dev-fx-webparts' { $componentType = 'webPart' }
                            'sp-dev-fx-extensions' { $componentType = 'extension' }
                            'sp-dev-fx-aces' { $componentType = 'adaptiveCardExtension' }
                            'sp-dev-fx-library-components' { $componentType = 'library' }
                        }

                        $assetsPath = Join-Path -Path $sampleFolder -ChildPath "assets"
                        $samplePath = Join-Path -Path $assetsPath -ChildPath "sample.json"
                        if (Test-Path -Path $samplePath) {
                            try {
                                $sampleContent = Get-Content -Path $samplePath -Raw
                                $sampleItems = ConvertFrom-Json -InputObject $sampleContent
                                $sampleMetadataSource = $sampleItems | Select-Object -First 1

                                if ($null -ne $sampleMetadataSource) {
                                    if ($null -ne $sampleMetadataSource.categories -and $sampleMetadataSource.categories.Count -gt 0) {
                                        $extensionType = $sampleMetadataSource.categories[0]
                                    }
                                }
                            }
                            catch {
                                Write-Warning "Failed to parse sample.json for $($sample.FullName): $($_.Exception.Message)"
                            } 
                        }
                    }
                }
                catch {
                    Write-Warning "Failed to read package.json for $($sample.FullName): $($_.Exception.Message)"
                }

                if (-not $isSPFxProject) {
                    Continue
                }

                $sampleAuthors = @()
                foreach ($author in $sampleJson.authors) {
                    $sampleAuthors += [pscustomobject]@{ 
                        name       = $author.name;
                        pictureUrl = $author.pictureUrl;
                    }
                }

                $tags = @()
                if ($null -ne $sampleJson.products) {
                    $tags = $sampleJson.products
                }

                if ("SPFX-APPLICATION-EXTENSION" -eq $extensionType){
                    $extensionType = "ApplicationCustomizer"
                }
                elseif ("SPFX-FIELD-EXTENSION" -eq $extensionType){
                    $extensionType = "FieldCustomizer"
                }
                elseif ("SPFX-COMMAND-EXTENSION" -eq $extensionType){
                    $extensionType = "ListViewCommandSet"
                }
                elseif ("SPFX-FORM-EXTENSION" -eq $extensionType){
                    $extensionType = "FormCustomizer"
                }

                $samples += [pscustomobject]@{
                    name          = $sampleJson.name; 
                    title         = $sampleJson.title; 
                    url           = $sampleJson.url;
                    description   = $sampleJson.shortDescription; 
                    image         = $sampleJson.thumbnails[0].url; 
                    authors       = $sampleAuthors;
                    tags          = $tags;
                    createDate    = $sampleJson.creationDateTime;
                    updateDate    = $sampleJson.updateDateTime;
                    version       = $version;  
                    componentType = $componentType;
                    extensionType = $extensionType;       
                    sampleGallery = $sampleRepo;
                    sampleType    = $folder
                }
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

    Write-Output $sampleRepo

    if (Test-Path -Path "$workspacePath\$sampleRepo\samples" -PathType Container) {
        $samples += Parse-SampleJsonFiles -sampleRepo $sampleRepo -folder 'samples'
    }
    if (Test-Path -Path "$workspacePath\$sampleRepo\scenarios" -PathType Container) {
        $samples += Parse-SampleJsonFiles -sampleRepo $sampleRepo -folder 'scenarios'
    }
}

[hashtable]$sampleModel = @{}
$sampleModel.Add('samples', $samples)
$orderedSampleModel = [ordered]@{}
foreach ($Item in ($sampleModel.GetEnumerator() | Sort-Object -Property Key)) {
    $orderedSampleModel[$Item.Key] = $Item.Value
}

$jsonOutput = New-Object -TypeName psobject -Property $orderedSampleModel | ConvertTo-Json -Depth 10

try {
    $null = ConvertFrom-Json -InputObject $jsonOutput -ErrorAction Stop
    Write-Output "`nJSON validation passed"
}
catch {
    Write-Error "`nGenerated JSON is invalid: $($_.Exception.Message)"
    exit 1
}

$jsonOutput | Out-File "$workspacePath\data\sp-dev-fx-samples.json"

$totalSamples = $samples.Count
$statsByRepo = $samples | Group-Object -Property sampleGallery | Sort-Object Name

$statsLines = @()
$statsLines += '## Sample Data Summary'
$statsLines += ''
$statsLines += '✅ **JSON Validation:** Passed'
$statsLines += ''
$statsLines += "**Total Samples:** $totalSamples"
$statsLines += ''
$statsLines += '### Breakdown by Repository'

foreach ($stat in $statsByRepo) {
    $statsLines += "- **$($stat.Name):** $($stat.Count)"
}

$statsContent = $statsLines -join "`n"

# temp output for PR body; will be deleted after PR is raised
$statsContent | Out-File "$workspacePath\sample-stats.txt" -Encoding utf8

if ($env:GITHUB_STEP_SUMMARY) {
    $statsContent | Out-File $env:GITHUB_STEP_SUMMARY -Encoding utf8
    Write-Output "Statistics written to GitHub Actions summary"
}

Write-Output "`nSample data update complete: $totalSamples total samples`n"
foreach ($stat in $statsByRepo) {
    Write-Output "  $($stat.Name): $($stat.Count)"
}

exit 0

