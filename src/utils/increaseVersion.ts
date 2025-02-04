import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { workspace } from 'vscode';


export async function increaseVersion(versionType: 'major' | 'minor' | 'patch') {
  const wsFolder = workspace.workspaceFolders?.[0];
  if (!wsFolder) {
    throw new Error('Workspace folder not found');
  }

  const packageJsonPath = join(wsFolder.uri.fsPath, 'package.json');
  let packageSolutionFiles = await workspace.findFiles('config/package-solution.json', '**/node_modules/**');

  if (packageSolutionFiles.length === 0) {
    packageSolutionFiles = await workspace.findFiles('src/config/package-solution.json', '**/node_modules/**');
  }

  const packageSolutionPath = packageSolutionFiles[0].fsPath;

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const packageSolution = JSON.parse(readFileSync(packageSolutionPath, 'utf8'));

  const newVersion = incrementVersion(packageJson.version, versionType);
  packageJson.version = newVersion;
  packageSolution.solution.version = `${newVersion}.0`;

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  writeFileSync(packageSolutionPath, JSON.stringify(packageSolution, null, 2));
}

function incrementVersion(version: string, versionType: 'major' | 'minor' | 'patch'): string {
  const [major, minor, patch] = version.split('.').map(Number);

  switch (versionType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error('Invalid version type');
  }
}
