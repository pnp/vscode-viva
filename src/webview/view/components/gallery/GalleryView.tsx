import * as React from 'react';
import { useState } from 'react';
import useSamples from '../../hooks/useSamples';
import { List } from './List';
import { SearchBar } from './SearchBar';
import { NoResults } from './NoResults';
import { GalleryHeader } from './GalleryHeader';
import { GalleryLoader } from './GalleryLoader';
import { IDropdownOption } from '@fluentui/react';


export interface IGalleryViewProps { }

export const GalleryView: React.FunctionComponent<IGalleryViewProps> = ({ }: React.PropsWithChildren<IGalleryViewProps>) => {
  const [samples, versions, search] = useSamples();
  const [query, setQuery] = useState<string>('');
  const [spfxVersions, setSPFxVersions] = useState<string[]>();
  const [showOnlyScenarios, setShowOnlyScenarios] = useState<boolean>(false);
  const [componentTypes, setComponentTypes] = useState<string[]>();

  const onSearchTextboxChange = (event: any) => {
    const input: string = event.target.value;
    setQuery(input);
    search(input, componentTypes ?? [], spfxVersions ?? [], showOnlyScenarios);
  };

  const onFilterOnlyScenariosChange = () => {
    setShowOnlyScenarios(!showOnlyScenarios);
    search(query, componentTypes ?? [], spfxVersions ?? [], !showOnlyScenarios);
  };

  const onFilterBySPFxVersionChange = (event: any, option?: IDropdownOption) => {
    let spfxVersionsInput: string[] = [];
    if (option?.selected) {
      spfxVersionsInput = [...spfxVersions ?? [], option.key as string];
    } else {
      spfxVersionsInput = spfxVersions?.filter(componentType => componentType !== option?.key) ?? [];
    }

    setSPFxVersions(spfxVersionsInput);
    search(query, componentTypes ?? [], spfxVersionsInput, showOnlyScenarios);
  };

  const onFilterByComponentTypeChange = (event: any, option?: IDropdownOption) => {
    let componentTypesInput: string[] = [];
    if (option?.selected) {
      componentTypesInput = [...componentTypes ?? [], option.key as string];
    } else {
      componentTypesInput = componentTypes?.filter(componentType => componentType !== option?.key) ?? [];
    }

    setComponentTypes(componentTypesInput);
    search(query, componentTypesInput, spfxVersions ?? [], showOnlyScenarios);
  };

  const getSPFxVersions = (): IDropdownOption[] => {
    const dropdownOptions: IDropdownOption[] = versions.map(version => ({
      key: version,
      text: version,
    })).filter((value, index, self) =>
      value.key !== null &&
      index === self.findIndex((v) => v.key === value.key)
    );
    return dropdownOptions;
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
              initialQuery={query}
              spfxVersions={getSPFxVersions()} />

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