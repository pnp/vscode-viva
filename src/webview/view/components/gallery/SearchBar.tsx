import { VSCodeCheckbox, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { SearchIcon } from '../icons';
import { IDropdownOption } from '@fluentui/react';
import { MultiSelect } from '../controls';
import { useDebounce } from 'use-debounce';


export interface ISearchBarProps {
  onSearchTextboxChange: (event: any) => void;
  onFilterBySPFxVersionChange: (event: any, option?: IDropdownOption) => void;
  onFilterByComponentTypeChange: (event: any, option?: IDropdownOption) => void;
  onFilterOnlyScenariosChange: (event: any) => void;
  initialQuery?: string;
  spfxVersions: IDropdownOption[];
}

export const SearchBar: React.FunctionComponent<ISearchBarProps> = ({ onSearchTextboxChange, onFilterBySPFxVersionChange, onFilterByComponentTypeChange, onFilterOnlyScenariosChange, initialQuery, spfxVersions }: React.PropsWithChildren<ISearchBarProps>) => {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    setQuery(initialQuery ?? '');
  }, [initialQuery]);

  useEffect(() => {
    onSearchTextboxChange({ target: { value: debouncedQuery } });
  }, [debouncedQuery, onSearchTextboxChange]);

  const onInputChange = (event: any) => {
    const input: string = event.target.value;
    setQuery(input);
  };

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
          <VSCodeTextField size="100" placeholder="Search" value={query} onInput={onInputChange}>
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
          <VSCodeCheckbox onChange={onFilterOnlyScenariosChange}>show only scenarios</VSCodeCheckbox>
        </div>
      </div>
    </div>
  );
};