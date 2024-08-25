import * as React from 'react';
import { useEffect } from 'react';
import useSamples from '../../hooks/useSamples';
import { List } from './List';
import { ISelectedFilter, SearchBar } from './SearchBar';
import { NoResults } from './NoResults';
import { GalleryHeader } from './GalleryHeader';
import { GalleryLoader } from './GalleryLoader';
import { IDropdownOption } from '@fluentui/react';
import useLocalStorage from '../../hooks/useLocalStorage ';


export interface IGalleryViewProps { }

export const GalleryView: React.FunctionComponent<IGalleryViewProps> = ({ }: React.PropsWithChildren<IGalleryViewProps>) => {
  const [samples, versions, search] = useSamples();
  const [selectedFilters, setSelectedFilters] = useLocalStorage<ISelectedFilter[]>('selectedFilters', []);
  const [query, setQuery] = useLocalStorage<string>('query', '');
  const [spfxVersions, setSPFxVersions] = useLocalStorage<string[]>('spfxVersions', []);
  const [showOnlyScenarios, setShowOnlyScenarios] = useLocalStorage('showOnlyScenarios', false);
  const [componentTypes, setComponentTypes] = useLocalStorage<string[]>('componentTypes', []);
  const [extensionTypes, setExtensionTypes] = useLocalStorage<string[]>('extensionTypes', []);
  const [isExtensionSelected, setIsExtensionSelected] = useLocalStorage<boolean>('isExtensionSelected', false);

  const onSearchTextboxChange = (event: any) => {
    const input: string = event.target.value;
    setQuery(input);
    search(input, componentTypes ?? [], spfxVersions ?? [], extensionTypes ?? [], showOnlyScenarios);
  };

  const onClearTextboxChange = () => {
    setQuery('');
    search('', componentTypes ?? [], spfxVersions ?? [], extensionTypes ?? [], showOnlyScenarios);
  };

  const onFilterOnlyScenariosChange = () => {
    setShowOnlyScenarios(!showOnlyScenarios);
    search(query, componentTypes ?? [], spfxVersions ?? [], extensionTypes ?? [], !showOnlyScenarios);
  };

  const onFilterBySPFxVersionChange = (event: any, option?: IDropdownOption) => {
    let spfxVersionsInput: string[] = [];
    if (option?.selected) {
      spfxVersionsInput = [...spfxVersions ?? [], option.key as string];
      setSelectedFilters([...selectedFilters, {
        key: option.key as string,
        text: option.key as string,
        kind: 'spfxVersion'
      }]);
    } else {
      spfxVersionsInput = spfxVersions?.filter(componentType => componentType !== option?.key) ?? [];
      const removedFilter = selectedFilters.filter(filter => filter.key !== option?.key);
      setSelectedFilters(removedFilter);
    }
    setSPFxVersions(spfxVersionsInput);
    search(query, componentTypes ?? [], spfxVersionsInput, extensionTypes ?? [], showOnlyScenarios);
  };

  const onRemoveFilterBySPFxVersion = (key: string) => {
    onFilterBySPFxVersionChange(null, { key: key, text: key, selected: false });
  };

  const onRemoveFilterByComponentType = (key: string) => {
    onFilterByComponentTypeChange(null, { key: key, text: key, selected: false });
  };

  const onFilterByComponentTypeChange = (event: any, option?: IDropdownOption) => {
    if (option?.key === 'extension') {
      setIsExtensionSelected(prevState => !prevState);
    }

    let componentTypesInput: string[] = [];
    if (option?.selected) {
      componentTypesInput = [...componentTypes ?? [], option.key as string];
      setSelectedFilters([...selectedFilters, {
        key: option.key as string,
        text: option.text as string,
        kind: 'componentType'
      }]);
    } else {
      componentTypesInput = componentTypes?.filter(componentType => componentType !== option?.key) ?? [];
      let removedFilter = selectedFilters.filter(filter => filter.key !== option?.key);
      if (option?.key === 'extension') {
        setExtensionTypes([]);
        removedFilter = removedFilter.filter(filter => filter.kind !== 'extensionType');
      }
      setSelectedFilters(removedFilter);
    }
    setComponentTypes(componentTypesInput);
    search(query, componentTypesInput, spfxVersions ?? [], extensionTypes ?? [], showOnlyScenarios);
  };

  const onRemoveFilterByExtensionType = (key: string) => {
    onFilterByExtensionTypeChange(null, { key: key, text: key, selected: false });
  };

  const onFilterByExtensionTypeChange = (event: any, option?: IDropdownOption) => {
    let extensionTypesInput: string[] = [];

    if (option?.selected) {
      extensionTypesInput = [...extensionTypes ?? [], option.key as string];
      setSelectedFilters([...selectedFilters, {
        key: option.key as string,
        text: option.text as string,
        kind: 'extensionType'
      }]);
    } else {
      extensionTypesInput = extensionTypes?.filter(componentType => componentType !== option?.key) ?? [];
      const removedFilter = selectedFilters.filter(filter => filter.key !== option?.key);
      setSelectedFilters(removedFilter);
    }
    setExtensionTypes(extensionTypesInput);
    search(query, componentTypes ?? [], spfxVersions ?? [], extensionTypesInput, showOnlyScenarios);
  };

  const getSPFxVersions = (): IDropdownOption[] => {
    const dropdownOptions: IDropdownOption[] = versions.map(version => ({
      key: version,
      text: version,
      selected: selectedFilters.filter(filter => filter.key === version).length > 0
    })).filter((value, index, self) =>
      value.key !== null &&
      index === self.findIndex((v) => v.key === value.key)
    );
    return dropdownOptions;
  };

  useEffect(() => {
    if (samples !== undefined) {
      setShowOnlyScenarios(showOnlyScenarios);
      search(query, componentTypes ?? [], spfxVersions ?? [], extensionTypes ?? [], showOnlyScenarios);
    }
  }, [samples]);

  const clearFilters = () => {
    localStorage.clear();
    setSelectedFilters([]);
    setSPFxVersions([]);
    setComponentTypes([]);
    setExtensionTypes([]);
    setShowOnlyScenarios(false);
    setQuery('');
    search('', [], [], [], false);
    setIsExtensionSelected(false);
  };

  const onClearExtensionTypes = () => {
    setExtensionTypes([]);
  };

  return (
    <div className={'w-full h-full max-w-7xl mx-auto sm:px-6 lg:px-8 py-16'}>
      {
        samples === undefined && (
          <GalleryLoader />
        )
      }
      {
        samples !== undefined && (
          <div className={'pb-16'}>
            <GalleryHeader />
            <SearchBar
              onSearchTextboxChange={(event) => onSearchTextboxChange(event)}
              onFilterBySPFxVersionChange={(event, option) => onFilterBySPFxVersionChange(event, option)}
              onFilterByComponentTypeChange={(event, option) => onFilterByComponentTypeChange(event, option)}
              onFilterOnlyScenariosChange={() => onFilterOnlyScenariosChange()}
              onFilterByExtensionTypeChange={(event, option) => onFilterByExtensionTypeChange(event, option)}
              initialQuery={query}
              selectedFilters={selectedFilters}
              onRemoveFilterBySPFxVersion={onRemoveFilterBySPFxVersion}
              onRemoveFilterByComponentType={onRemoveFilterByComponentType}
              onRemoveFilterByExtensionType={onRemoveFilterByExtensionType}
              clearAllFilters={clearFilters}
              onClearTextboxChange={onClearTextboxChange}
              showOnlyScenarios={showOnlyScenarios}
              spfxVersions={getSPFxVersions()}
              isExtensionSelected={isExtensionSelected} />
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