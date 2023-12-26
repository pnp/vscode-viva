import * as React from 'react';
import { useState } from 'react';
import useSamples from '../../hooks/useSamples';
import { List } from './List';
import { SearchBar } from './SearchBar';
import { NoResults } from './NoResults';
import { GalleryHeader } from './GalleryHeader';
import { GalleryLoader } from './GalleryLoader';


export interface IGalleryViewProps { }

export const GalleryView: React.FunctionComponent<IGalleryViewProps> = ({ }: React.PropsWithChildren<IGalleryViewProps>) => {
  const [samples, search] = useSamples();
  const [query, setQuery] = useState<string>('');

  const onSampleSearch = (event: any) => {
    const input: string = event.target.value;
    setQuery(input);
    search(input);
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto sm:px-6 lg:px-8 py-16">
      {
        samples === undefined && (
          <GalleryLoader />
        )
      }

      {
        samples !== undefined && (
          <div className='pb-16'>
            <GalleryHeader />
            <SearchBar onSearch={(event) => onSampleSearch(event)} initialQuery={query} />

            {
              samples.length === 0 && (
                <NoResults />
              )
            }

            {
              samples.length > 0 && (
                <div>
                  <List items={samples} />
                </div>
              )
            }

          </div>
        )
      }
    </div>
  );
};