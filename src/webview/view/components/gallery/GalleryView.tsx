import * as React from 'react';
import { useEffect, useState } from 'react';
import useSamples from '../../hooks/useSamples';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import { List } from './List';
import { LibraryIcon } from '../icons/LibraryIcon';
import { SearchBar } from './SearchBar';


export type GalleryType = 'sp-dev-fx-aces-samples' | 'sp-dev-fx-aces-scenarios' | 'sp-dev-fx-extensions-samples' | 'sp-dev-fx-webparts-samples';

export interface IGalleryViewProps {
  type: GalleryType;
}

export const GalleryView: React.FunctionComponent<IGalleryViewProps> = ({ type }: React.PropsWithChildren<IGalleryViewProps>) => {
  const [samples, search] = useSamples(type);
  const [query, setQuery] = useState<string>('');

  const onSampleSearch = (event: any) => {
    const input: string = event.target.value;
    setQuery(input);
    search(input);
  };

  useEffect(() => {
    setQuery('');
  }, [type]);

  const translateTypeName = (galleryType: GalleryType): string => {
    switch (galleryType) {
      case 'sp-dev-fx-aces-samples':
        return 'ACE Samples';
      case 'sp-dev-fx-aces-scenarios':
        return 'ACE Scenarios';
      case 'sp-dev-fx-extensions-samples':
        return 'SPFx Extensions Samples';
      case 'sp-dev-fx-webparts-samples':
        return 'SPFx Web Parts Samples';
      default:
        return '';
    }
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto sm:px-6 lg:px-8 py-16">
      {
        samples === undefined && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center h-16">
              <VSCodeProgressRing style={{
                width: '100%',
                height: '100%',
              }} />

              <p className='mt-4 text-xl'>Loading {translateTypeName(type)}...</p>
            </div>
          </div>
        )
      }

      {
        samples !== undefined && (
          <div className='pb-16'>
            <div className={'flex items-center'}>
              <LibraryIcon className={'sample__icon w-16'} />
              <div className={'ml-4'}>
                <h1 className='text-2xl first-letter:uppercase'>{translateTypeName(type)}</h1>
                {
                  type !== 'sp-dev-fx-aces-scenarios' && (
                    <p>Explore our sample gallery filled with solutions created by the community.</p>
                  )
                }
                {
                  type === 'sp-dev-fx-aces-scenarios' && (
                    <p>Our scenarios provide you a guided experience to get you started with building a Viva Connections solution.</p>
                  )
                }
              </div>
            </div>
            <SearchBar onSearch={(event) => onSampleSearch(event)} initialQuery={query} />

            {
              samples.length === 0 && (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center h-16">
                    <p className='mt-4 text-xl'>No {translateTypeName(type)} found.</p>
                  </div>
                </div>
              )
            }

            {
              samples.length > 0 && (
                <List items={samples} />
              )
            }

          </div>
        )
      }
    </div>
  );
};