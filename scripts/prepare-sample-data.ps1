param ([string[]]$workspacePath)

$sampleRepos = @("sp-dev-fx-aces", "sp-dev-fx-extensions", "sp-dev-fx-library-components", "sp-dev-fx-webparts")

function Parse-SampleJsonFiles {
    param (
        [string[]]$sampleRepo,
        [string[]]$folder
    )

    $allSamples = Get-ChildItem -Path "$workspacePath\$sampleRepo\$folder\**\sample.json" -Recurse -Force
    $samples = @()
    foreach ($sample in $allSamples) {

        Write-output $sample.FullName

        try {
            $sampleContent = Get-Content -Path $sample.FullName -Raw
            $sampleJson = ConvertFrom-Json -InputObject $sampleContent

            $sampleAuthors = @()
            foreach ($author in $sampleJson.authors) {
                $sampleAuthors += [pscustomobject]@{ 
                    name       = $author.name;
                    pictureUrl = $author.pictureUrl;
                }
            }

            $samples += [pscustomobject]@{
                title       = $sampleJson.title; 
                url         = $sampleJson.url;
                description = $sampleJson.shortDescription; 
                image       = $sampleJson.thumbnails[0].url; 
                authors     = $sampleAuthors;
                tags        = $sampleJson.tags;
                createDate  = $sampleJson.creationDateTime;
            }
        }
        catch {
            Write-Output "Error: $($_.Exception.Message)"
        }
    }

    [hashtable]$sampleModel = @{}
    $sampleModel.Add('samples', $samples)
    $orderedSampleModel = [ordered]@{}
    foreach ($Item in ($sampleModel.GetEnumerator() | Sort-Object -Property Key)) {
        $orderedSampleModel[$Item.Key] = $Item.Value
    }
    New-Object -TypeName psobject -Property $orderedSampleModel | ConvertTo-Json -Depth 10 | Out-File "..\data\$sampleRepo-$folder.json"
}

foreach ($sampleRepo in $sampleRepos) {

    Write-output $sampleRepo

    if (Test-Path -Path "$workspacePath\$sampleRepo\samples" -PathType Container) {
        Parse-SampleJsonFiles -sampleRepo $sampleRepo -folder 'samples'
    }
    if (Test-Path -Path "$workspacePath\$sampleRepo\scenarios" -PathType Container) {
        Parse-SampleJsonFiles -sampleRepo $sampleRepo -folder 'scenarios'
    }
}

