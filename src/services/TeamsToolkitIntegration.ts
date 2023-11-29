export class TeamsToolkitIntegration {
  private static _isTeamsToolkitProject: boolean | undefined = undefined;

  public static get isTeamsToolkitProject(): boolean | undefined {
    return this._isTeamsToolkitProject;
  }

  public static set isTeamsToolkitProject(value: boolean | undefined) {
    this._isTeamsToolkitProject = value;
  }

  public static reset() {
    this._isTeamsToolkitProject = undefined;
  }
}