import { useState, useEffect } from 'react';
import { Messenger } from '@estruyf/vscode/dist/client';
import { WebviewCommand } from '../../../constants';
import { Sample } from '../../../models';


const SAMPLES_URL = 'https://raw.githubusercontent.com/pnp/vscode-viva/main/data/sp-dev-fx-samples.json';

export default function useSamples(): [Sample[], string[], ((query: string, componentTypes: string[], spfxVersions: string[], showOnlyScenarios: boolean) => void)] {
  const [allSamples, setAllSamples] = useState<Sample[] | undefined>(undefined);
  const [samples, setSamples] = useState<Sample[] | undefined>(undefined);
  const state = Messenger.getState() as any || {};
  const [versions, setVersions] = useState<string[]>([]);

  const fetchData = async () => {
    if (state['allSamples']) {
      setAllSamples(state['allSamples']);
    }

    try {
      const response = await fetch(SAMPLES_URL);
      const data = await response.json();
      const sortedSamples = data.samples.sort((a: Sample, b: Sample) => Date.parse(b.createDate) - Date.parse(a.createDate));

      const samplesVersions = (data.samples.map((sample: Sample) => sample.version) as string[])
        .filter((value, index, self) => value !== null && index === self.findIndex((v) => v === value))
        .sort((a, b) => {
          const aNumericPart = a.split('-')[0];
          const bNumericPart = b.split('-')[0];

          const parts1 = aNumericPart.split('.').map(Number);
          const parts2 = bNumericPart.split('.').map(Number);

          for (let i = 0; i < parts1.length; i++) {
            if (parts1[i] > parts2[i]) {
              return -1;
            } else if (parts1[i] < parts2[i]) {
              return 1;
            }
          }

          return 0;
        });

      setVersions(samplesVersions);
      setAllSamples(sortedSamples);
      Messenger.setState({
        ...state,
        allSamples: sortedSamples
      });
    } catch (e) {
      Messenger.send(WebviewCommand.toVSCode.logError, `useSamples: ${(e as Error).message}`);
      setAllSamples([]);
    }
  };

  useEffect(() => {
    if (!allSamples) {
      fetchData();
      return;
    }

    setSamples(allSamples);
    Messenger.setState({
      ...state,
      samples: allSamples
    });
  }, [allSamples]);

  const search = (query: string, componentTypes: string[], spfxVersions: string[], showOnlyScenarios: boolean) => {
    const currentSamples: Sample[] = state['samples'];
    const samplesByTitle: Sample[] = currentSamples!.filter((sample: Sample) => sample.title.toString().toLowerCase().includes(query.toLowerCase()));
    const samplesByTag: Sample[] = currentSamples!.filter((sample: Sample) => sample.tags.some(tag => tag.toString().toLowerCase().includes(query.toLowerCase())));
    const samplesByAuthor: Sample[] = currentSamples!.filter((sample: Sample) => sample.authors.some(author => author.name && author.name.toString().toLowerCase().includes(query.toLowerCase())));
    let newSamples: Sample[] = samplesByTitle.concat(samplesByTag).concat(samplesByAuthor);
    if (showOnlyScenarios){
      newSamples = newSamples.filter((sample: Sample) => sample.sampleType === 'scenarios');
    }
    const distinctSamples = newSamples.filter((value, index, self) =>
      index === self.findIndex((v) => v.name === value.name)
    );

    let filteredSamplesByComponentType = distinctSamples;
    if (componentTypes.length > 0) {
      filteredSamplesByComponentType = distinctSamples.filter((sample: Sample) => componentTypes.includes(sample.componentType));
    }

    let filteredSamplesBySPFxVersion = filteredSamplesByComponentType;
    if (spfxVersions.length > 0) {
      filteredSamplesBySPFxVersion = filteredSamplesByComponentType.filter((sample: Sample) => spfxVersions.includes(sample.version));
    }

    let filteredSamplesByExtension = filteredSamplesBySPFxVersion;
    if (extensionTypes.length > 0 && componentTypes.includes('extension')) {
      filteredSamplesByExtension = filteredSamplesBySPFxVersion.filter((sample: Sample) => extensionTypes.includes(sample.extensionType));
    }

    setSamples(filteredSamplesByExtension);
  };

  return [samples!, versions, search];
}