import { Commands } from './../constants/Commands';
import { Notifications } from './Notifications';
import { execSync } from 'child_process';
import { commands, ProgressLocation, ThemeIcon, window } from 'vscode';
import { Logger } from './Logger';
import { NpmLs, Subscription } from '../models';
import { Terminal } from './Terminal';
import { Extension } from './Extension';

const SUPPORTED_VERSIONS = ["12", "14", "16"];
const DEPENDENCIES = ["gulp-cli", "yo", "@microsoft/generator-sharepoint"];

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
   * Validate if all the required dependencies are installed
   */
  public static async validate() {
    await window.withProgress({
      location: ProgressLocation.Notification,
      cancellable: false,
      title: 'Checking dependencies',
    }, async (progress) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          progress.report({ message: 'Checking node version...' });

          // Validate node
          const isNodeValid = Dependencies.isValidNodeJs();
          if (!isNodeValid) {
            Notifications.warning(`Your Node.js version is not supported. Make sure you are using one of the following Node.js versions: ${SUPPORTED_VERSIONS.join(', ')}.`);
            resolve(null);
            return;
          }

          progress.report({ message: 'Checking npm dependencies...' });

          const command = `npm ls -g ${DEPENDENCIES.join(' ')} --json`;
          const result = execSync(command, { shell: Terminal.shell });

          if (!result) {
            Notifications.error(`Failed checking dependencies`);
          }

          // Check for missing dependencies
          const npmLs: NpmLs = JSON.parse(result.toString());
          const missingDependencies = [];
          for (const dependency of DEPENDENCIES) {
            const dependencyResult = npmLs.dependencies[dependency];
            if (!dependencyResult) {
              missingDependencies.push(dependency);
            }
          }

          if (missingDependencies.length > 0) {
            const installItem = 'Install dependencies';
            Notifications.warning(`Missing dependencies: ${missingDependencies.join(', ')}`, installItem).then((item) => {
              if (item === installItem) {
                commands.executeCommand(Commands.installDependencies);
              }
            })
          } else {
            Notifications.info('You have all dependencies installed and ready to go!');
          }
          resolve(null);
        }, 0);
      });
    });
  }

  /**
   * Install all the dependencies
   */
  public static install() {
    const terminal = window.createTerminal({
      name: `Installing dependencies`,
      iconPath: new ThemeIcon('cloud-download')
    });

    if (terminal) {
      terminal.sendText(`npm i -g ${DEPENDENCIES.join(' ')}`);
      terminal.show(true);
    }
  }

  /**
   * Check node version
   */
  private static isValidNodeJs() {
    try {
      const output = execSync(`node --version`, { shell: Terminal.shell });
      const match = /v(?<major_version>\d+)\.(?<minor_version>\d+)\.(?<patch_version>\d+)/gm.exec(output.toString());

      Logger.info(`Node.js version: ${output}`);

      if (!match) return false;
      
      let groups;
      const majorVersion = null === (groups = match.groups) || void 0 === groups ? void 0 : groups.major_version;
      return !!majorVersion && SUPPORTED_VERSIONS.includes(majorVersion);
    } catch(e) {
      Logger.error(`Failed checking node version: ${(e as Error).message}`);
      return false;
    }
  }
}