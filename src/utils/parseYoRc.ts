import { workspace } from 'vscode';
import { YoRc } from '../models';
import { Logger } from '../services/dataType/Logger';


export const parseYoRc = async (): Promise<YoRc | undefined> => {
  let yoRcFiles = await workspace.findFiles('.yo-rc.json', '**/node_modules/**');

  if (!yoRcFiles || yoRcFiles.length <= 0) {
    yoRcFiles = await workspace.findFiles('src/.yo-rc.json', '**/node_modules/**');
  }

  if (!yoRcFiles || yoRcFiles.length <= 0) {
    return;
  }

  let content: YoRc | string = '';
  for (const file of yoRcFiles) {
    content = await workspace.openTextDocument(file.fsPath).then(doc => doc.getText());

    if (content) {
      break;
    }
  }

  try {
    content = typeof content === 'string' ? JSON.parse(content) as YoRc : content;
    return content;
  } catch (error) {
    Logger.error(`Failed to parse .yo-rc.json: ${error}`);
    return undefined;
  }
};