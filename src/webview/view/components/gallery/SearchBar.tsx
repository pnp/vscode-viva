import { VSCodeCheckbox, VSCodeTextField, VSCodeTag } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { SearchIcon } from '../icons';
import { IDropdownOption } from '@fluentui/react';
import { MultiSelect } from '../controls';
import { CloseIcon } from '../icons/CloseIcon';
import { useDebounce } from 'use-debounce';


export interface ISearchBarProps {
  onSearchTextboxChange: (event: any) => void;
  onFilterBySPFxVersionChange: (event: any, option?: IDropdownOption) => void;
  onFilterByComponentTypeChange: (event: any, option?: IDropdownOption) => void;
  onFilterOnlyScenariosChange: (event: any) => void;
  onFilterByExtensionTypeChange: (event: any, option?: IDropdownOption) => void;
  initialQuery?: string;
  spfxVersions: IDropdownOption[];
  selectedFilters: ISelectedFilter[];
  onRemoveFilterBySPFxVersion: (key: string) => void;
  onRemoveFilterByComponentType: (key: string) => void;
  clearAllFilters: () => void;
  onClearTextboxChange: () => void;
  showOnlyScenarios: boolean;
}

export interface ISelectedFilter {
  key: string | null;
  text: string;
  kind: 'spfxVersion' | 'componentType'
}

export const SearchBar: React.FunctionComponent<ISearchBarProps> = ({ onSearchTextboxChange, onFilterBySPFxVersionChange, onFilterByComponentTypeChange, onFilterOnlyScenariosChange, onFilterByExtensionTypeChange, initialQuery, spfxVersions, selectedFilters, onRemoveFilterByComponentType, onRemoveFilterBySPFxVersion, clearAllFilters, onClearTextboxChange, showOnlyScenarios }: React.PropsWithChildren<ISearchBarProps>) => {
  const [query, setQuery] = useState<string>(initialQuery ?? '');
  const [debouncedQuery, setDebounceQuery] = useDebounce(query, 300);
  const [isExtensionSelected, setIsExtensionSelected] = useState<boolean>(false);

  useEffect(() => {
    setDebounceQuery(query);
  }, [query]);

  useEffect(() => {
    onSearchTextboxChange({ target: { value: debouncedQuery } });
  }, [debouncedQuery, onSearchTextboxChange]);

  const onInputChange = (event: any) => {
    const input: string = event.target.value;
    setQuery(input);
  };

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

  const getExtensionTypeOptions = (): IDropdownOption[] => {
    const extensionTypes: IDropdownOption[] = [
      { key: 'ListViewCommandSet', text: 'List view commandset' },
      { key: 'ApplicationCustomizer', text: 'Application customizer' },
      { key: 'FieldCustomizer', text: 'Field customizer' },
      { key: 'FormCustomizer', text: 'Form customizer' }
    ];

    return extensionTypes;
  };

  const clearQueryAndTextbox = () => {
    setQuery('');
    onClearTextboxChange();
  };

  const resetQueryAndFilters = () => {
    clearQueryAndTextbox();
    clearAllFilters();
  };

  const componentTypes = getComponentTypeOptions();
  const extensionTypes = getExtensionTypeOptions();

  const handleComponentTypeChange = (event: any, option?: IDropdownOption) => {
    if (option?.key === 'extension') {
      setIsExtensionSelected(prevState => !prevState);
    }
    onFilterByComponentTypeChange(event, option);
  };

  return (
    <div>
      <div className={'mt-2 columns-1 md:columns-5'}>
        <div>
          <VSCodeTextField size="100" placeholder="Search" value={query} onInput={onInputChange}>
            <span slot='start' className='mt-0'>
              <SearchIcon />
            </span>
          </VSCodeTextField>
        </div>
        <div>
          <MultiSelect options={spfxVersions} label="SPFx version" onChange={onFilterBySPFxVersionChange} />
        </div>
        <div>
          <MultiSelect options={componentTypes} label="Component Type" onChange={handleComponentTypeChange} />
        </div>
        {isExtensionSelected && (
          <div>
            <MultiSelect options={extensionTypes} label="Extension type" onChange={onFilterByExtensionTypeChange} />
          </div>
        )}
        <div>
          <VSCodeCheckbox checked={showOnlyScenarios} onChange={onFilterOnlyScenariosChange}>show only scenarios</VSCodeCheckbox>
        </div>
      </div>

      <div className={'flex flex-wrap'}>
        {query &&
          <label className={'p-1'}>
            <VSCodeTag>
              <div className={'flex'}>
                {query}
                <label className="cursor-pointer" onClick={clearQueryAndTextbox}>
                  <CloseIcon />
                </label>
              </div>
            </VSCodeTag>
          </label>
        }
        {selectedFilters.length > 0 && selectedFilters.map((filter, index) => {
          if (filter.kind === 'spfxVersion') {
            return (
              <label className={'p-1'} >
                <VSCodeTag key={index} >
                  <div className={'flex'}>
                    {filter.text}
                    <label className="cursor-pointer" onClick={() => onRemoveFilterBySPFxVersion(filter.key as string)}>
                      <CloseIcon />
                    </label>
                  </div>
                </VSCodeTag>
              </label>);
          }

          return (
            <label className={'p-1'} >
              <VSCodeTag key={index} >
                <div className={'flex'}>
                  {filter.text}
                  <label className="cursor-pointer" onClick={() => onRemoveFilterByComponentType(filter.key as string)}>
                    <CloseIcon />
                  </label>
                </div>
              </VSCodeTag>
            </label>);
        })}
        {(selectedFilters.length > 0 || query) &&
          <label className={'p-1'}>
            <strong onClick={resetQueryAndFilters} className="text-blueClearAll cursor-pointer bg-vscode">Clear all</strong>
          </label>
        }
      </div>
    </div>
  );
};