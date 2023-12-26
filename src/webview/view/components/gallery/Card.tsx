import { VSCodeButton, VSCodeTag } from '@vscode/webview-ui-toolkit/react';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { useMemo } from 'react';
import { Sample } from '../../../../models';
import { format } from 'date-fns';
import { Messenger } from '@estruyf/vscode/dist/client';
import { WebviewCommand } from '../../../../constants';
import { GitHubIcon, DesktopDownloadIcon, PreviewIcon } from '../icons';


export interface ICardProps {
  item: Sample;
}

export const Card: React.FunctionComponent<ICardProps> = ({ item }: React.PropsWithChildren<ICardProps>) => {
  const navigate = useNavigate();

  const onSampleClick = () => {
    Messenger.send(WebviewCommand.toVSCode.useSample, item);
  };

  const onRepoClick = () => {
    Messenger.send(WebviewCommand.toVSCode.redirectTo, item.url);
  };

  const onViewClick = () => {
    navigate('/sp-dev-fx-sample-details-view', {state: { item: item }});
  };

  const image = useMemo(() => {
    if (item.image) {
      return (
        <img
          className={'w-full h-full object-cover'}
          src={item.image}
          alt={item.name}
          loading={'lazy'} />
      );
    }
    return null;
  }, [item.image, item.name]);

  const getDate = (dateString: string): string => {
    if (!dateString && dateString.length === 0) {
      return '';
    }

    try {
      return `Modified ${format(Date.parse(dateString), 'EEE MMM dd yyyy')}`;
    }
    catch {
      return '';
    }
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
    <li className={'sample_card'}>
      <div className='h-40'>
        {
          componentType &&
            <div className={'mt-3 absolute'}>
              <VSCodeTag className={'sample_card__component_type'} key={`${item.title}_${componentType}`}>{componentType}</VSCodeTag>
              <br />
              {
                extensionType &&
                  <VSCodeTag className={'sample_card__extension_type mt-1'} key={`${item.title}_${extensionType}`}>{extensionType}</VSCodeTag>
              }
            </div>
        }
        {image}
      </div>

      <div className={'p-2'}>

        <h3 className={'sample_card__title text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap'}>{item.title}</h3>

        <p className={'sample_card__description text-sm overflow-hidden text-ellipsis'}>{item.description}</p>

        <p className={'sample_card__spfx_version text-xs text-right underline overflow-hidden text-ellipsis mt-1 mb-2'}>SPFx version: {item.version}</p>

        <div className={'sample_card__actions text-right space-x-2'}>
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

        <div className={'text-right min-h-max'}>
          {
            item.tags && item?.tags.sort((a, b) => a.length - b.length).map(tag =>
              <VSCodeTag className={'mb-2 mr-1'} key={`${item.title}_${tag}`}>{tag}</VSCodeTag>)
          }
        </div>

        <div className={'flex flex-row items-center'}>
          <div className={'flex items-center'}>
            {
              item.authors && item.authors.map(author => (
                <div key={`${item.title}_${author.name}`} className={'sample_card__author_avatar inline-block'}>
                  <img className={'w-6 rounded-full'} loading='lazy' src={author.pictureUrl} alt={author.name} title={author.name} />
                </div>
              ))
            }
          </div>

          <div className={'sample_card__details ml-2 text-xs'}>
            <p className={'font-bold'}>{item.authors && item.authors.length > 0 && <>{item.authors[0].name}{item.authors.length > 1 ? <> +{item.authors.length - 1}</> : null}</>}</p>
            {
              <p>{getDate(item.updateDate)}</p>
            }
          </div>
        </div>
      </div>
    </li>
  );
};