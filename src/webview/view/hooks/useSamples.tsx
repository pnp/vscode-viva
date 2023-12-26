import { useState, useEffect } from 'react';
import { Messenger } from '@estruyf/vscode/dist/client';
import { WebviewCommand } from '../../../constants';
import { Sample } from '../../../models';


// TODO: revert to: raw.githubusercontent.com/pnp/vscode-viva/main/data/
const SAMPLES_URL = 'https://raw.githubusercontent.com/Adam-it/vscode-viva/improve-sample-view/data/sp-dev-fx-samples.json';

// eslint-disable-next-line no-unused-vars
export default function useSamples(): [Sample[], ((query: string) => void)] {
  const [allSamples, setAllSamples] = useState<Sample[] | undefined>(undefined);
  const [samples, setSamples] = useState<Sample[] | undefined>(undefined);
  const state = Messenger.getState() as any || {};

  const fetchData = async () => {
    if (state['allSamples']) {
      setAllSamples(state['allSamples']);
    }

    try {
      const response = await fetch(SAMPLES_URL);
      const data = await response.json();
      const sortedSamples = data.samples.sort((a: Sample, b: Sample) => Date.parse(b.createDate) - Date.parse(a.createDate));
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

  const search = (query: string) => {
    const currentSamples: Sample[] = state['samples'];
    const samplesByTitle: Sample[] = currentSamples!.filter((sample: Sample) => sample.title.toString().toLowerCase().includes(query.toLowerCase()));
    const samplesByTag: Sample[] = currentSamples!.filter((sample: Sample) => sample.tags.some(tag => tag.toString().toLowerCase().includes(query.toLowerCase())));
    const samplesByAuthor: Sample[] = currentSamples!.filter((sample: Sample) => sample.authors.some(author => author.name.toString().toLowerCase().includes(query.toLowerCase())));
    const newSamples: Sample[] = samplesByTitle.concat(samplesByTag).concat(samplesByAuthor);
    const distinctSamples = newSamples.filter((value, index, self) =>
      index === self.findIndex((v) => v.name === value.name)
    );
    setSamples(distinctSamples);
  };

  return [samples!, search];
}