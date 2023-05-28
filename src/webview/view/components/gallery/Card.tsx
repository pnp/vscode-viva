import { VSCodeLink, VSCodeTag } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { useMemo } from 'react';
import { Sample } from '../../../../models';
import { format } from 'date-fns';
import { Messenger } from '@estruyf/vscode/dist/client';
import { WebviewCommand } from '../../../../constants';
import { GitHubIcon, DesktopDownloadIcon } from '../icons';


export interface ICardProps {
  item: Sample;
}

export const Card: React.FunctionComponent<ICardProps> = ({ item }: React.PropsWithChildren<ICardProps>) => {

  const onSampleClick = () => {
    Messenger.send(WebviewCommand.toVSCode.useSample, item);
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

  return (
    <li className={'sample_card'}>
      <div className='h-48'>
        {image}
      </div>

      <div className={'p-4 space-y-2'}>
        <div className={'items-center space-x-2'}>{item.tags && item.tags.map(tag => <VSCodeTag className={'mb-2'} key={tag}>{tag}</VSCodeTag>)}</div>

        <h2 className={'text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap'}>{item.title}</h2>

        <p className={'sample_card__description text-sm overflow-hidden text-ellipsis'}>{item.description}</p>

        <div className={'sample_card__actions flex flex-row space-x-2'}>
          <VSCodeLink href={item.url} title={'View in GitHub'}>
            <span slot={'start'}><GitHubIcon /></span>
            <span className="sr-only">View in GitHub</span>
          </VSCodeLink>

          <VSCodeLink className={''} onClick={onSampleClick} title={'Use sample'}>
            <span slot={'start'}><DesktopDownloadIcon /></span>
            <span slot='content' className='block'>Use sample</span>
          </VSCodeLink>
        </div>

        <div className={'flex flex-row items-center'}>
          <div className={'flex items-center'}>
            {
              item.authors && item.authors.map(author => (
                <div key={author.name} className={'sample_card__author_avatar inline-block'}>
                  <img className={'w-6 rounded-full'} loading='lazy' src={author.pictureUrl} alt={author.name} title={author.name} />
                </div>
              ))
            }
          </div>

          <div className={'sample_card__details ml-2 text-xs'}>
            <p className={'font-bold'}>{item.authors && item.authors.length > 0 && <>{item.authors[0].name}{item.authors.length > 1 ? <> +{item.authors.length - 1}</> : null}</>}</p>
            {
              item.updateDate && item.updateDate.length > 0 &&
              <p>Modified {format(Date.parse(item.updateDate), 'EEE MMM dd yyyy')}</p>
            }
          </div>
        </div>
      </div>
    </li>
  );
};