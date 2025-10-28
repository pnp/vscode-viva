import { Commands } from '../../constants/Commands';
import { Notifications } from '../dataType/Notifications';
import { commands, ProgressLocation, window, Uri } from 'vscode';
import * as os from 'os';
import { Logger } from '../dataType/Logger';
import { Subscription } from '../../models';
import { Extension } from '../dataType/Extension';
import { NodeVersionManagers, SpfxCompatibilityMatrix } from '../../constants';
import { execSync } from 'child_process';
import { TerminalCommandExecuter } from '../executeWrappers/TerminalCommandExecuter';
import { getExtensionSettings } from '../../utils';
import { CliActions } from './CliActions';

export class Dependencies {

  public static registerCommands() {
    const subscriptions: Subscription[] = Extension.getInstance().subscriptions;

    subscriptions.push(
      commands.registerCommand(Commands.checkDependencies, Dependencies.validate)
    );
    subscriptions.push(
      commands.registerCommand(Commands.installDependencies, Dependencies.install)
    );
  }

  /**
   * Validates the development environment by running the SPFx doctor command.
   * @returns A Promise that resolves when the validation is complete
   */
  public static async validate() {
    CliActions.spfxDoctor();
  }

  /**
   * Installs SharePoint Framework dependencies based on the user's selected version.
   * @returns A Promise that resolves when the installation completes or is cancelled
   * @throws May throw errors during dependency installation which are caught and displayed as notifications
   */
  public static async install(requestedVersion: string | null = null, shouldValidateNode: boolean = true): Promise<void> {
    let spfxVersion;
    if (!requestedVersion) {
      const selectedSPFxVersion = await window.showQuickPick(SpfxCompatibilityMatrix.map(spfx => spfx.Version), {
        placeHolder: 'Select the SharePoint Framework version you want to install',
        ignoreFocusOut: true,
        canPickMany: false,
        title: 'Select the SharePoint Framework version'
      });

      if (!selectedSPFxVersion) {
        return;
      }

      spfxVersion = SpfxCompatibilityMatrix.find(spfx => spfx.Version === selectedSPFxVersion);
    } else {
      spfxVersion = SpfxCompatibilityMatrix.find(spfx => spfx.Version === requestedVersion);
    }


    if (!spfxVersion) {
      return;
    }

    await window.withProgress({
      location: ProgressLocation.Notification,
      cancellable: false,
      title: `Setting up your environment for SPFx v${spfxVersion.Version}...`,
    }, async (progress) => {
      return new Promise((resolve) => {
        setTimeout(async () => {
          try {
            progress.report({ message: 'Validating node version...' });
            const isValidNode = shouldValidateNode ? Dependencies.isValidNodeJs(spfxVersion.SupportedNodeVersions) : true;

            let canProceedWithDependencyCheck = false;
            if (!isValidNode) {
                progress.report({ message: 'Node.js version not supported. Checking options...' });
              canProceedWithDependencyCheck = await Dependencies.HandleNotValidNodeVersion(spfxVersion.SupportedNodeVersions[spfxVersion.SupportedNodeVersions.length - 1], spfxVersion.SupportedNodeVersions);
            }

            if (isValidNode || canProceedWithDependencyCheck) {
              progress.report({ message: 'installing npm global dependencies...' });
              const dependencies = spfxVersion.Dependencies.map(dep => `${dep.Name}@${dep.InstallVersion}`).join(' ');
              Logger.info(`Installing dependencies: ${dependencies}`);

              await TerminalCommandExecuter.runCommandAndWait(`npm install -g ${dependencies} @microsoft/generator-sharepoint@${spfxVersion.Version}`, 'Installing dependencies', 'cloud-download');
            } else {
              resolve(null);
              return;
            }

            const releaseNotes = 'Check out the release notes';
            const learningPath = 'Go to Learning path';
            Notifications.info(
              `You are all set for SPFx v${spfxVersion.Version}!`,
              releaseNotes,
              learningPath
            ).then((selectedOption) => {
              if (selectedOption === releaseNotes) {
                commands.executeCommand('vscode.open', Uri.parse(spfxVersion.ReleaseNotes));
              } else if (selectedOption === learningPath) {
                commands.executeCommand('vscode.open', Uri.parse('https://learn.microsoft.com/en-us/training/paths/m365-sharepoint-associate/'));
              }
            });
            resolve(null);
          } catch (e) {
            Notifications.error('Failed installing dependencies');
            Logger.error(`${(e as Error).message}`);
            resolve(null);
          }
        }, 0);
      });
    });
  }

  /**
   * Checks if the installed version of Node.js is valid.
   * @returns Returns true if the installed version of Node.js is valid, otherwise false.
   */
  public static isValidNodeJs(SupportedNodeVersions: string[], NodeVersion: string | null = null): boolean {
    try {
      const output = NodeVersion ? `v${NodeVersion}` : execSync('node --version', { shell: TerminalCommandExecuter.shell });
      const match = /v(?<major_version>\d+)\.(?<minor_version>\d+)\.(?<patch_version>\d+)/gm.exec(output.toString());

      Logger.info(`Node.js version: ${output}`);

      if (!match) {
        return false;
      }

      let groups;
      const majorVersion = null === (groups = match.groups) || void 0 === groups ? void 0 : groups.major_version;
      const minorVersion = null === (groups = match.groups) || void 0 === groups ? void 0 : groups.minor_version;

      const supported = SupportedNodeVersions.find((version) => {
        const versionParts = version.split('.');
        const major = versionParts[0];
        const minor = versionParts[1];

        if (minor && minorVersion && minor.toLowerCase() !== 'x') {
          return (majorVersion === major && minorVersion >= minor);
        }

        return (majorVersion === major);
      });

      return !!supported;
    } catch (e) {
      Logger.error(`Failed checking node version: ${(e as Error).message}`);
      return false;
    }
  }

  /**
   * Handles the case when the Node.js version is not valid for SPFx development.
   * @param requiredNodeVersions - A string representing the required Node.js version(s) for SPFx development
   * @param supportedNodeVersions - An array of strings representing the supported Node.js versions for SPFx development
   * @returns A boolean indicating whether the invalid Node.js version was successfully handled
   */
  private static HandleNotValidNodeVersion(requiredNodeVersions: string, supportedNodeVersions: string[]): boolean {
    const nodeVersionManager = getExtensionSettings<string>('nodeVersionManager', 'none');
    const isWindows = os.platform() === 'win32';

    if (nodeVersionManager === NodeVersionManagers.none) {
      const installNodeJSOption = 'Install Node.js';
      const useNvmOption = isWindows ? 'Use NVM for Windows' : 'Use NVM';
      const useNvsOption = 'Use NVS';

      Notifications.warning(
        `Your Node.js version is not supported for SPFx v${requiredNodeVersions}. 
        It is recommended to use a Node Version Manager to handle multiple Node.js versions
        and set SPFx Toolkit setting with your preferred Node Version Manager.
        Please select one of the options below to get help on installing or updating your Node.js version.`,
        installNodeJSOption,
        useNvmOption,
        useNvsOption
      ).then((selectedOption) => {
        if (selectedOption === installNodeJSOption) {
          commands.executeCommand('vscode.open', Uri.parse('https://nodejs.org/en/download/'));
        } else if (selectedOption === useNvmOption) {
          const nvmInstallUrl = isWindows
            ? 'https://github.com/coreybutler/nvm-windows?tab=readme-ov-file#overview'
            : 'https://github.com/nvm-sh/nvm?tab=readme-ov-file#intro';
          commands.executeCommand('vscode.open', Uri.parse(nvmInstallUrl));
        } else if (selectedOption === useNvsOption) {
          const nvsInstallUrl = 'https://github.com/jasongin/nvs?tab=readme-ov-file#nvs-node-version-switcher';
          commands.executeCommand('vscode.open', Uri.parse(nvsInstallUrl));
        }
      });
      return false;
    } else if (nodeVersionManager === NodeVersionManagers.nvm || nodeVersionManager === NodeVersionManagers.nvs) {
      let useNodeVersionOption: string = '';
      const requiredNodeVersionToInstall = requiredNodeVersions.replace(/x/g, '0');
      if (nodeVersionManager === NodeVersionManagers.nvm) {
        const nvmListCommand = isWindows ? 'list' : 'ls --no-alias';
        const nodeVersions = execSync(`nvm ${nvmListCommand}`, { shell: TerminalCommandExecuter.shell });
        const versions = isWindows ?
          nodeVersions.toString().split('\n').map(v => v.trim().replace(/^\*?\s*/, '').replace(/\s*\(.*\)$/, '').trim()).filter(v => v && /^\d+\.\d+\.\d+$/.test(v))
          : nodeVersions.toString().split('\n').map(v => v.trim().replace(/^(\*|->)?\s*/, '').replace(/\s*\(.*\)$/, '').replace(/^v/, '').trim()).filter(v => v && /^\d+\.\d+\.\d+$/.test(v));
        const firstNodeValidVersion = versions.find(v => Dependencies.isValidNodeJs(supportedNodeVersions, v))?.replace(/x/g, '0');

        const nvmUseCommand = `nvm use ${firstNodeValidVersion}`;
        const nvmInstallAndUseCommand = `nvm install ${requiredNodeVersionToInstall} && nvm use ${requiredNodeVersionToInstall}`;
        useNodeVersionOption = firstNodeValidVersion ? nvmUseCommand : nvmInstallAndUseCommand;
      } else {
        const nodeVersions = execSync('nvs list', { shell: TerminalCommandExecuter.shell });
        const versions = nodeVersions.toString().split('\n').map(v => {
          const match = /node\/(\d+\.\d+\.\d+)/.exec(v.trim());
          return match ? match[1] : '';
        }).filter(v => v);
        const firstNodeValidVersion = versions.find(v => Dependencies.isValidNodeJs(supportedNodeVersions, v))?.replace(/x/g, '0');

        const nvsUseCommand = `nvs use ${firstNodeValidVersion}`;
        const nvsInstallAndUseCommand = `nvs add ${requiredNodeVersionToInstall} && nvs use ${requiredNodeVersionToInstall}`;
        useNodeVersionOption = firstNodeValidVersion ? nvsUseCommand : nvsInstallAndUseCommand;
      }

      const abortOption = 'I will handle it myself';
      const output = Notifications.warning(
        `Your Node.js version is not supported with SPFx development. Make sure you are using version: v${requiredNodeVersions}. 
        It looks like you are using ${nodeVersionManager === NodeVersionManagers.nvm ? 'NVM' : 'NVS'}. You can use the command '${useNodeVersionOption}' to set the correct Node.js version for SPFx development.
        Please select one of the options below to get help on installing or updating your Node.js version.`,
        useNodeVersionOption,
        abortOption
      ).then(async (selectedOption): Promise<boolean> => {
        if (selectedOption === useNodeVersionOption) {
          await TerminalCommandExecuter.runCommandAndWait(useNodeVersionOption, 'Installing Node.js version', 'cloud-download');
          return true;
        } else if (selectedOption === abortOption) {
          return false;
        }
        return false;
      });
      return output as unknown as boolean;
    }

    return false;
  }
}