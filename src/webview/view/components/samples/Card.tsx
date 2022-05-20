import { VSCodeButton, VSCodeLink, VSCodeTag } from '@vscode/webview-ui-toolkit/react';
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
    if (item.thumbnails && item.thumbnails.length > 0) {
      return (
        <img 
          className={`w-full h-full object-cover`}
          src={item.thumbnails[0].url} 
          alt={item.name} 
          loading={`lazy`} />
      );
    }
    return null;
  }, [item.thumbnails, item.name]);

  return (
    <li className={`sample_card`}>
      <div className='h-48'>
        {image}
      </div>

      <div className={`p-4 space-y-2`}>
        <div className={`flex items-center space-x-2`}>{ item.products && item.products.map(product => <VSCodeTag key={product}>{product}</VSCodeTag>) }</div>
        
        <h2 className={`text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap`}>{ item.title }</h2>
        
        <p className={`sample_card__description text-sm overflow-hidden text-ellipsis`}>{ item.shortDescription }</p>

        <div className={`sample_card__actions flex flex-row space-x-2`}>
          <VSCodeLink href={item.url} title={`View in GitHub`}>
            <span slot={`start`}><GitHubIcon /></span>
            <span className="sr-only">View in GitHub</span>
          </VSCodeLink>
          
          <VSCodeLink className={``} onClick={onSampleClick} title={`Use sample`}>
            <span slot={`start`}><DesktopDownloadIcon /></span>
            <span slot='content' className='block'>Use sample</span>
          </VSCodeLink>
        </div>

        <div className={`flex flex-row items-center`}>
          <div className={`flex items-center`}>
            {
              item.authors && item.authors.map(author => (
                <div key={author.name} className={`sample_card__author_avatar inline-block`}>
                  <img className={`w-6 rounded-full`} loading="lazy" src={author.pictureUrl} alt={author.name} title={author.name} />
                </div>
              ))
            }
          </div>

          <div className={`sample_card__details ml-2 text-xs`}>
            <p className={`font-bold`}>{item.authors && item.authors.length > 0 && <>{item.authors[0].name}{item.authors.length > 1 ? <> +{item.authors.length - 1}</> : null}</>}</p>
            <p>Modified {format(Date.parse(item.updateDateTime), "EEE MMM dd yyyy")}</p>
          </div>
        </div>
      </div>
    </li>
  );
};