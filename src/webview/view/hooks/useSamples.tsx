import { useState, useEffect } from 'react';
import { Messenger } from '@estruyf/vscode/dist/client';
import { WebviewCommand } from '../../../constants';
import { Sample } from '../../../models';
import { GalleryType } from '../components/gallery';


const SAMPLES_URL = 'https://raw.githubusercontent.com/pnp/vscode-viva/main/data/';

// eslint-disable-next-line no-unused-vars
export default function useSamples(type: GalleryType): [Sample[], ((query: string) => void)] {
  const [allSamples, setAllSamples] = useState<Sample[] | undefined>(undefined);
  const [samples, setSamples] = useState<Sample[] | undefined>(undefined);
  const state = Messenger.getState() as any || {};

  const fetchData = async () => {
    if (state['allSamples']) {
      setAllSamples(state['allSamples']);
    }

    try {
      const response = await fetch(`${SAMPLES_URL}${type}.json`);
      const data = await response.json();

      setAllSamples(data.samples);
      Messenger.setState({
        ...state,
        allSamples: data.samples,
        type: type
      });
    } catch (e) {
      Messenger.send(WebviewCommand.toVSCode.logError, `useSamples: ${(e as Error).message}`);
      setAllSamples([]);
    }
  };

  useEffect(() => {
    if (!allSamples || (state['type'] && state['type'] !== type)) {
      fetchData();
      return;
    }

    setSamples(allSamples);
    Messenger.setState({
      ...state,
      samples: allSamples,
      type: type
    });
  }, [type, allSamples]);

  const search = (query: string) => {
    const currentSamples: Sample[] = state['samples'];
    const newSamples: Sample[] = currentSamples!.filter((sample: Sample) => sample.title.toString().toLowerCase().includes(query.toLowerCase()));
    setSamples(newSamples);
  };

  return [samples!, search];
}