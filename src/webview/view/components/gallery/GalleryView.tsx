import * as React from 'react';
import { useEffect, useState } from 'react';
import useSamples from '../../hooks/useSamples';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import { List } from './List';
import { LibraryIcon } from '../icons/LibraryIcon';
import { SearchBar } from './SearchBar';


export interface IGalleryViewProps {}

export const GalleryView: React.FunctionComponent<IGalleryViewProps> = ({ }: React.PropsWithChildren<IGalleryViewProps>) => {
  const [samples, search] = useSamples();
  const [query, setQuery] = useState<string>('');

  const onSampleSearch = (event: any) => {
    const input: string = event.target.value;
    setQuery(input);
    search(input);
  };

  useEffect(() => {
    setQuery('');
  });

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

              <p className='mt-4 text-xl'>Loading Sample Gallery...</p>
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
                <h1 className='text-2xl'>Sample Gallery</h1>
                <p>Explore samples created by the Microsoft 365 and Power Platform community.</p>
              </div>
            </div>
            <SearchBar onSearch={(event) => onSampleSearch(event)} initialQuery={query} />

            {
              samples.length === 0 && (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center h-16">
                    <p className='mt-4 text-xl'>No samples found.</p>
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