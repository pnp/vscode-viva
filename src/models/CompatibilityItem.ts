export interface CompatibilityItem {
    Version: string,
    SupportedNodeVersions: string[],
    ReleaseNotes: string,
    Dependencies: {
        Name: string,
        SupportedVersions: string[],
        InstallVersion: string
    }[]
}