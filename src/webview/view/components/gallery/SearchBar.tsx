import { VSCodeCheckbox, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
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
  // eslint-disable-next-line no-unused-vars
  onFilterByExtensionTypeChange: (event: any, option?: IDropdownOption) => void;
  initialQuery?: string;
  spfxVersions: IDropdownOption[];
}

export const SearchBar: React.FunctionComponent<ISearchBarProps> = ({ onSearchTextboxChange, onFilterBySPFxVersionChange, onFilterByComponentTypeChange, onFilterOnlyScenariosChange, onFilterByExtensionTypeChange, initialQuery, spfxVersions }: React.PropsWithChildren<ISearchBarProps>) => {
  const [query, setQuery] = useState<string>('');
  const [isExtensionSelected, setIsExtensionSelected] = useState<boolean>(false);

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

  const getExtensionTypes = (): IDropdownOption[] => {
    const extensionTypes: IDropdownOption[] = [
      { key: 'ListViewCommandSet', text: 'List view commandset' },
      { key: 'ApplicationCustomizer', text: 'Application customizer' },
      { key: 'FieldCustomizer', text: 'Field customizer' },
      { key: 'FormCustomizer', text: 'Form customizer' }
    ];

    return extensionTypes;
  };

  const componentTypes = getComponentTypes();
  const extensionTypes = getExtensionTypes();

  const handleComponentTypeChange = (event: any, option?: IDropdownOption) => {
    if (option?.key === 'extension') {
      setIsExtensionSelected(prevState => !prevState);
    }
    onFilterByComponentTypeChange(event, option);
  };

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
          <MultiSelect options={componentTypes} label="Component Type" onChange={handleComponentTypeChange}/>
        </div>
        <div>
          <VSCodeCheckbox onChange={onFilterOnlyScenariosChange}>show only scenarios</VSCodeCheckbox>
        </div>
        {isExtensionSelected && (
          <div>
            <MultiSelect options={extensionTypes} label="Extension type" onChange={onFilterByExtensionTypeChange} />
          </div>
        )}
      </div>
    </div>
  );
};