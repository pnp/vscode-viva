import * as React from 'react';
import { Sample } from '../../../../models';
import { VSCodeButton, VSCodeTag } from '@vscode/webview-ui-toolkit/react';
import { DesktopDownloadIcon, GitHubIcon, PreviewIcon } from '../icons';
import { useNavigate } from 'react-router-dom';
import { Messenger } from '@estruyf/vscode/dist/client';
import { WebviewCommand } from '../../../../constants';


export interface IRowProps {
  item: Sample;
}

export const Row: React.FunctionComponent<IRowProps> = ({ item }: React.PropsWithChildren<IRowProps>) => {
  const navigate = useNavigate();

  const onSampleClick = () => {
    Messenger.send(WebviewCommand.toVSCode.useSample, item);
  };

  const onRepoClick = () => {
    Messenger.send(WebviewCommand.toVSCode.redirectTo, item.url);
  };

  const onViewClick = () => {
    navigate('/sp-dev-fx-sample-details-view', { state: { item: item } });
  };

  const getComponentType = (componentType: string): string => {
    switch (componentType) {
      case 'extension':
        return 'Extension';
      case 'webpart':
        return 'Web part';
      case 'adaptiveCardExtension':
        return 'ACE';
      default:
        return '';
    }
  };

  const getExtensionType = (extensionType: string): string => {
    switch (extensionType) {
      case 'ApplicationCustomizer':
        return 'Application customizer';
      case 'ListViewCommandSet':
        return 'List view commandSet';
      case 'FieldCustomizer':
        return 'Field customizer';
      case 'FormCustomizer':
        return 'Form customizer';
      case 'SearchQueryModifier':
        return 'Search query modifier';
      default:
        return '';
    }
  };

  const componentType = getComponentType(item.componentType);
  const extensionType = getExtensionType(item.extensionType);

  return (
    <li className={'sample_row mb-3 px-2 py-1'}>
      <div className={'grid grid-cols-4 gap-1'}>
        <div className={'col-span-2'}>
          <p className={'max-w-full text-base bold overflow-hidden whitespace-nowrap text-ellipsis'}>
            {item.title}
          </p>
          <p className={'text-xs mb-1'}>SPFx version: {item.version}</p>
        </div>
        <div className={'pt-2'}>
          {
            componentType &&
            <div>
              <VSCodeTag className={'sample_row__component_type'} key={`${item.title}_${componentType}`}>{componentType}</VSCodeTag>
              {
                extensionType &&
                <VSCodeTag className={'sample_row__extension_type ml-1'} key={`${item.title}_${extensionType}`}>{extensionType}</VSCodeTag>
              }
            </div>
          }
        </div>
        <div className={'sample_card__actions text-right space-x-2 pt-1'}>
          <VSCodeButton className={'mb-2'} onClick={onRepoClick} title={'View in GitHub'}>
            <span slot={'start'}><GitHubIcon /></span>
            Repo
          </VSCodeButton>

          <VSCodeButton className={'mb-2'} onClick={onViewClick} title={'View details'}>
            <span slot={'start'}><PreviewIcon /></span>
            View
          </VSCodeButton>

          <VSCodeButton className={'mb-2'} onClick={onSampleClick} title={'Use sample'}>
            <span slot={'start'}><DesktopDownloadIcon /></span>
            Use
          </VSCodeButton>
        </div>
      </div>
      <div className={'border-t'}>
        <p className={'text-xs overflow-hidden text-ellipsis justify max-w-full text-ellipsis'}>{item.description}</p>
      </div>
    </li>
  );
};