export class M365AgentsToolkitIntegration {
  private static _isM365AgentsToolkitProject: boolean | undefined = undefined;

  public static get isM365AgentsToolkitProject(): boolean | undefined {
    return this._isM365AgentsToolkitProject;
  }

  public static set isM365AgentsToolkitProject(value: boolean | undefined) {
    this._isM365AgentsToolkitProject = value;
  }

  public static reset() {
    this._isM365AgentsToolkitProject = undefined;
  }
}