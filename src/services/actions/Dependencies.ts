import { Commands } from '../../constants/Commands';
import { Notifications } from '../dataType/Notifications';
import { execSync } from 'child_process';
import { commands, ProgressLocation, window, Uri } from 'vscode';
import * as os from 'os';
import { Logger } from '../dataType/Logger';
import { NpmLs, Subscription } from '../../models';
import { TerminalCommandExecuter } from '../executeWrappers/TerminalCommandExecuter';
import { Extension } from '../dataType/Extension';


const SUPPORTED_VERSIONS = ['22.14.0'];
const DEPENDENCIES = ['gulp-cli@3.0.0', 'yo@5.1.0', '@microsoft/generator-sharepoint@1.21.1'];

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
   * Validates the dependencies required for SPFx development.
   * Checks the Node.js version and npm dependencies.
   * Displays notifications for missing or incompatible dependencies.
   */
  public static async validate() {
    await window.withProgress({
      location: ProgressLocation.Notification,
      cancellable: false,
      title: 'Validating local setup',
    }, async (progress) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            progress.report({ message: 'Validating node version...' });

            // Validate node
            const isNodeValid = Dependencies.isValidNodeJs();
            if (!isNodeValid) {
              const installNodeJSOption = 'Install Node.js';
              const useNvmOption = os.platform() === 'win32' ? 'Use NVM for Windows' : 'Use NVM';
              const useNvsOption = 'Use NVS';

              Notifications.warning(
                'Your Node.js version is not supported with SPFx development. Make sure you are using version: >=22.14.0 and <23.0.0',
                installNodeJSOption,
                useNvmOption,
                useNvsOption
              ).then((selectedOption) => {
                if (selectedOption === installNodeJSOption) {
                  commands.executeCommand('vscode.open', Uri.parse('https://nodejs.org/en/download/'));
                } else if (selectedOption === useNvmOption) {
                  const nvmInstallUrl = os.platform() === 'win32'
                    ? 'https://github.com/coreybutler/nvm-windows?tab=readme-ov-file#overview'
                    : 'https://github.com/nvm-sh/nvm?tab=readme-ov-file#intro';
                  commands.executeCommand('vscode.open', Uri.parse(nvmInstallUrl));
                } else if (selectedOption === useNvsOption) {
                  const nvsInstallUrl = 'https://github.com/jasongin/nvs?tab=readme-ov-file#nvs-node-version-switcher';
                  commands.executeCommand('vscode.open', Uri.parse(nvsInstallUrl));
                }
              });
              resolve(null);
              return;
            }

            progress.report({ message: 'Validating npm dependencies...' });

            const command = 'npm list -g --json --silent';
            const result = execSync(command, { shell: TerminalCommandExecuter.shell, timeout: 15000 });

            if (!result) {
              Notifications.error('Failed validating local setup');
            }

            // Check for missing dependencies
            const npmLs: NpmLs = JSON.parse(result.toString());
            const missingDependencies = [];
            for (const dependency of DEPENDENCIES) {
              const dependencyDetails = Dependencies.splitDependency(dependency);
              const dependencyVersion = dependencyDetails.length > 1 ? dependencyDetails[1] : null;
              const dependencyName = dependencyDetails[0];
              const installedDependency = npmLs.dependencies[dependencyName];
              if (!installedDependency || (dependencyVersion && installedDependency.version !== dependencyVersion)) {
                missingDependencies.push(dependency);
              }
            }

            if (missingDependencies.length > 0) {
              const installItem = 'Install dependencies';
              Notifications.warning(`Missing dependencies: ${missingDependencies.join(', ')}`, installItem).then((item) => {
                if (item === installItem) {
                  commands.executeCommand(Commands.installDependencies);
                }
              });
            } else {
              Notifications.info('You have all dependencies installed and ready to go!');
            }
            resolve(null);
          } catch (e) {
            Notifications.error('Failed validating local setup');
            Logger.error(`${(e as Error).message}`);
            resolve(null);
          }
        }, 0);
      });
    });
  }

  /**
   * Installs the dependencies by running the npm install command in a terminal.
   */
  public static async install() {
    await TerminalCommandExecuter.runCommand(`npm i -g ${DEPENDENCIES.join(' ')}`, 'Installing dependencies', 'cloud-download');
  }

  /**
   * Checks if the installed version of Node.js is valid.
   * @returns Returns true if the installed version of Node.js is valid, otherwise false.
   */
  private static isValidNodeJs() {
    try {
      const output = execSync('node --version', { shell: TerminalCommandExecuter.shell });
      const match = /v(?<major_version>\d+)\.(?<minor_version>\d+)\.(?<patch_version>\d+)/gm.exec(output.toString());

      Logger.info(`Node.js version: ${output}`);

      const npmOutput = execSync('npm --version', { shell: TerminalCommandExecuter.shell });
      Logger.info(`npm version: ${npmOutput}`);

      if (!match) {
        return false;
      }

      let groups;
      const majorVersion = null === (groups = match.groups) || void 0 === groups ? void 0 : groups.major_version;
      const minorVersion = null === (groups = match.groups) || void 0 === groups ? void 0 : groups.minor_version;

      const supported = SUPPORTED_VERSIONS.find((version) => {
        const versionParts = version.split('.');
        const major = versionParts[0];
        const minor = versionParts[1];

        if (minor && minorVersion) {
          return majorVersion === major && minorVersion >= minor;
        }

        return majorVersion === major;
      });

      return !!supported;
    } catch (e) {
      Logger.error(`Failed checking node version: ${(e as Error).message}`);
      return false;
    }
  }

  /**
   * Splits a dependency string into an array of strings.
   * If the dependency starts with '@', it splits the string into two parts: the scope and the package name.
   * If the dependency does not start with '@', it splits the string into two parts: the package name and the version.
   * @param dependency - The dependency string to split.
   * @returns An array of strings containing the split parts of the dependency.
   */
  private static splitDependency(dependency: string): string[] {
    if (dependency.startsWith('@')) {
      return ['@' + dependency.substring(1).split('@')[0], dependency.substring(1).split('@')[1]];
    }

    return dependency.split('@');
  }
}