export class ProjectInformation {
  private static _isSPFxProject: boolean | undefined = undefined;

  public static get isSPFxProject(): boolean | undefined {
    return this._isSPFxProject;
  }

  public static set isSPFxProject(value: boolean | undefined) {
    this._isSPFxProject = value;
  }

  public static reset() {
    this._isSPFxProject = undefined;
  }
}