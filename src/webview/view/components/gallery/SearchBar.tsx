import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { SearchIcon } from '../icons';
import { IDropdownOption } from '@fluentui/react';
import { MultiSelect } from '../controls';


export interface ISearchBarProps {
  // eslint-disable-next-line no-unused-vars
  onSearchTextboxChange: (event: any) => void;
  // eslint-disable-next-line no-unused-vars
  onFilterBySPFxVersionChange: (event: any, option?: IDropdownOption) => void;
  // eslint-disable-next-line no-unused-vars
  onFilterByComponentTypeChange: (event: any, option?: IDropdownOption) => void;
  initialQuery?: string;
  spfxVersions: IDropdownOption[];
}

export const SearchBar: React.FunctionComponent<ISearchBarProps> = ({ onSearchTextboxChange, onFilterBySPFxVersionChange, onFilterByComponentTypeChange, initialQuery, spfxVersions }: React.PropsWithChildren<ISearchBarProps>) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setQuery(initialQuery ?? '');
  }, [initialQuery]);

  const getComponentTypes = (): IDropdownOption[] => {
    const componentTypes: IDropdownOption[] = [
      { key: 'webpart', text: 'Web Part' },
      { key: 'extension', text: 'Extension' },
      { key: 'adaptiveCardExtension', text: 'ACE' }
    ];

    return componentTypes;
  };

  const componentTypes = getComponentTypes();

  return (
    <div>
      <div className={'mt-2 columns-1 md:columns-4'}>
        <div>
          <VSCodeTextField size="100" placeholder="Search" value={query} onInput={onSearchTextboxChange}>
            <span slot='start' className='mt-0'>
              <SearchIcon />
            </span>
          </VSCodeTextField>
        </div>
        <div>
          <MultiSelect options={spfxVersions} label="SPFx version" onChange={onFilterBySPFxVersionChange}/>
        </div>
        <div>
          <MultiSelect options={componentTypes} label="Component Type" onChange={onFilterByComponentTypeChange}/>
        </div>
        <div>
        </div>
      </div>
    </div>
  );
};