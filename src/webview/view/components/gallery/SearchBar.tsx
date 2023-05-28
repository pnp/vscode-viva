import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { SearchIcon } from '../icons/SearchIcon';


export interface ISearchBarProps {
  // eslint-disable-next-line no-unused-vars
  onSearch: (event: any) => void;
  initialQuery?: string;
}

export const SearchBar: React.FunctionComponent<ISearchBarProps> = ({ onSearch, initialQuery }: React.PropsWithChildren<ISearchBarProps>) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setQuery(initialQuery ?? '');
  }, [initialQuery]);

  return (
    <div className={'flex'}>
      <div className={'pl-6 pr-6 w-2/5'}>
        <VSCodeTextField size="100" placeholder="Search" value={query} onInput={onSearch}>
          <span slot='start' className='mt-0'>
            <SearchIcon />
          </span>
        </VSCodeTextField>
      </div>
    </div>
  );
};