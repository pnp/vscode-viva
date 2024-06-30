import { VSCodeCheckbox, VSCodeTextField, VSCodeTag } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { SearchIcon } from '../icons';
import { IDropdownOption } from '@fluentui/react';
import { MultiSelect } from '../controls';

export interface ISearchBarProps {
  onSearchTextboxChange: (event: any) => void;
  onFilterBySPFxVersionChange: (event: any, option?: IDropdownOption) => void;
  onFilterByComponentTypeChange: (event: any, option?: IDropdownOption) => void;
  onFilterOnlyScenariosChange: (event: any) => void;
  initialQuery?: string;
  spfxVersions: IDropdownOption[];
  selectedFilters:ISelectedFilter[];
  onRemoveFilterBySPFxVersion: (key:string) => void;
  onRemoveFilterByComponentType: (key:string) => void;
  clearAllFilters: () => void;
  onClearTextboxChange: () => void;
  showOnlyScenarios: boolean;
}

export interface ISelectedFilter {
  key:string | null;
  kind:'spfxVersion'|'componentType'
}

export const SearchBar: React.FunctionComponent<ISearchBarProps> = ({ onSearchTextboxChange, onFilterBySPFxVersionChange, onFilterByComponentTypeChange, onFilterOnlyScenariosChange, initialQuery, spfxVersions, selectedFilters,onRemoveFilterByComponentType, onRemoveFilterBySPFxVersion, clearAllFilters, 
 onClearTextboxChange, showOnlyScenarios }: React.PropsWithChildren<ISearchBarProps>) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setQuery(initialQuery ?? '');
  }, [initialQuery]);

  const getComponentTypeOptions = (): IDropdownOption[] => {
    const options: IDropdownOption[] = [
      { key: 'webpart', text: 'Web Part' },
      { key: 'extension', text: 'Extension' },
      { key: 'adaptiveCardExtension', text: 'ACE' }
    ];

    selectedFilters.forEach(filter => {
      if (filter.kind === 'componentType') {
        const matchingOption = options.find(option => option.key === filter.key);
        if (matchingOption) {
          matchingOption.selected = true;
        }
      }
    });

    return options;
  };

  const componentTypes = getComponentTypeOptions();

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
          <VSCodeCheckbox checked={showOnlyScenarios} onChange={onFilterOnlyScenariosChange}>show only scenarios</VSCodeCheckbox>
        </div>
      </div>

      <div className={'flex flex-wrap'}>
        {query && <div className={'p-1 cursor-pointer'} onClick={() => {
          setQuery('');
          onClearTextboxChange();
        }}><VSCodeTag >{query} <strong>X</strong></VSCodeTag></div>}
        {selectedFilters.length > 0 && selectedFilters.map((filter, index) => {
          if (filter.kind === 'spfxVersion') {
            return <div className={'p-1 cursor-pointer'} onClick={() => onRemoveFilterBySPFxVersion(filter.key as string)}><VSCodeTag key={index} >{filter.key} <strong>X</strong></VSCodeTag></div>;
          }

          return <div className={'p-1 cursor-pointer'} onClick={() => onRemoveFilterByComponentType(filter.key as string)}><VSCodeTag key={index} >{filter.key} <strong>X</strong></VSCodeTag></div>;
        })}
        {(selectedFilters.length > 0 || query)&& <div className={'p-1 cursor-pointer'} onClick={clearAllFilters}><strong style={{color:'#3664be'}}>Clear all</strong></div>}
      </div>
    </div>
  );
};