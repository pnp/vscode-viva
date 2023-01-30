import { useState, useEffect, useCallback } from 'react';
import { Messenger } from '@estruyf/vscode/dist/client';
import { WebviewCommand } from '../../../constants';
import { Sample } from '../../../models';
import { GalleryType } from '../components/gallery';

const SAMPLES_URL = "https://pnp.github.io/sp-dev-fx-aces/samples.json";

export default function useSamples(type: GalleryType): [Sample[], ((query: string) => void)] {
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

      setAllSamples(data);
      Messenger.setState({ 
        ...state,
        allSamples: data
      });
    } catch (e) {
      Messenger.send(WebviewCommand.toVSCode.logError, `useSamples: ${(e as Error).message}`);
      setAllSamples([]);
    }
  }

  useEffect(() => {
    if (!allSamples) {
      fetchData();
      return;
    }

    const samples: Sample[] = allSamples.filter(sample => sample.url.includes(`/${type}/`));
    setSamples(samples);
    Messenger.setState({ 
      ...state,
      samples: samples
    });
  }, [type, allSamples]);

  const search = (query: string) => {
    const samples: Sample[] = state['samples'];
    const newSamples: Sample[] = samples!.filter((sample: Sample) => sample.name.toLowerCase().includes(query.toLowerCase()));
    setSamples(newSamples);
  };

  return [samples!, search];
}