import { SpfxCompatibilityMatrix } from '../../constants';
import { Dependencies } from '../actions/Dependencies';
import { MarkdownString } from 'vscode';


export interface SpfxStatusBarTooltip {
  tooltip: MarkdownString;
  hasCompatibilityIssues: boolean;
}

export const buildSPFxStatusBarTooltip = async (spfxVersion: string | undefined): Promise<SpfxStatusBarTooltip> => {
  if (!spfxVersion) {
    return {
      tooltip: createTooltip('SharePoint Framework project\n\nVersion could not be resolved from .yo-rc.json or package.json.'),
      hasCompatibilityIssues: true
    };
  }

  const compatibility = SpfxCompatibilityMatrix.find(item => item.Version === spfxVersion);
  if (!compatibility) {
    return {
      tooltip: createTooltip(`SharePoint Framework project v${spfxVersion}\n\nCompatibility matrix entry not found for this version.`),
      hasCompatibilityIssues: true
    };
  }

  const nodeVersion = Dependencies.getCurrentNodeVersion();
  const isNodeSupported = Dependencies.isValidNodeJs(compatibility.SupportedNodeVersions, nodeVersion);

  const hasCompatibilityIssues = !isNodeSupported;

  const nodeExpected = compatibility.SupportedNodeVersions.join(' | ');
  const nodeLine = `${isNodeSupported ? '$(check)' : '$(close)'} Node.js: ${nodeVersion ?? 'not found'} (expected: ${nodeExpected})`;

  const lines: string[] = [
    `SPFx v${spfxVersion} compatibility:`,
    nodeLine
  ];

  return {
    tooltip: createTooltip(lines.join('\n\n')),
    hasCompatibilityIssues
  };
};

const createTooltip = (text: string): MarkdownString => {
  const tooltip = new MarkdownString(text, true);
  tooltip.isTrusted = false;
  return tooltip;
};