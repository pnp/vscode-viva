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

                $yoRcPath = $sample.FullName.ToLower().Replace("assets\sample.json", ".yo-rc.json")

                if (Test-Path -Path $yoRcPath) {
                    try {
                        $yoRcContent = Get-Content -Path $yoRcPath -Raw
                        $yoRcJson = ConvertFrom-Json -InputObject $yoRcContent
                        $yoRcJson = $yoRcJson.PSObject.Properties.Value

                        if ($null -ne $yoRcJson) {
                            $isSPFxProject = $true

                            if ($null -ne $yoRcJson.version -and $yoRcJson.version.GetType().BaseType -eq [System.Array]) {
                                if ($null -ne $yoRcJson.version[$yoRcJson.version.Length - 1]) {
                                    $version = $yoRcJson.version[$yoRcJson.version.Length - 1]
                                }
                                else {
                                    $version = $yoRcJson.version[0]
                                }
                            }
                            else {
                                $version = $yoRcJson.version
                            }

                            if ($null -ne $yoRcJson.componentType -and $yoRcJson.componentType.GetType().BaseType -eq [System.Array]) {
                                if ($null -ne $yoRcJson.componentType[$yoRcJson.componentType.Length - 1]) {
                                    $componentType = $yoRcJson.componentType[$yoRcJson.componentType.Length - 1]
                                }
                                else {
                                    $componentType = $yoRcJson.componentType[0]
                                }
                            }
                            else {
                                $componentType = $yoRcJson.componentType
                            }

                            if ($null -ne $yoRcJson.extensionType -and $yoRcJson.extensionType.GetType().BaseType -eq [System.Array]) {
                                $extensionType = $yoRcJson.extensionType[$yoRcJson.extensionType.Length - 1]
                            }
                            else {
                                $extensionType = $yoRcJson.extensionType
                            }
                        }
                    }
                    catch {
                        Write-Warning "Failed to parse package.json for $($sample.FullName): $($_.Exception.Message)"
                    }
                }

                if (-not $isSPFxProject) {
                    $packageJsonPath = $sample.FullName.ToLower().Replace("assets\sample.json", "package.json")

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
                        }
                    }
                    catch {
                    }
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
New-Object -TypeName psobject -Property $orderedSampleModel | ConvertTo-Json -Depth 10 | Out-File "$workspacePath\data\sp-dev-fx-samples.json"

