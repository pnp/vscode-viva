import { useState, useEffect } from 'react';
import { Messenger } from '@estruyf/vscode/dist/client';
import { WebviewCommand } from '../../../constants';
import { Sample } from '../../../models';
import { GalleryType } from '../components/gallery';

const SAMPLES_URL = "https://pnp.github.io/sp-dev-fx-aces/samples.json";

export default function useSamples(type: GalleryType) {
  const [allSamples, setAllSamples] = useState<Sample[] | undefined>(undefined);
  const [samples, setSamples] = useState<Sample[] | undefined>(undefined);

  const fetchData = async () => {
    const state = Messenger.getState() as any || {};

    if (state['samples']) {
      setAllSamples(state['samples']);
    }

    try {
      const response = await fetch(SAMPLES_URL);
      const data = await response.json();
      
      setAllSamples(data);
      Messenger.setState({ 
        ...state,
        samples: data
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

    setSamples(allSamples.filter(sample => sample.url.includes(`/${type}/`)));
  }, [type, allSamples]);

  return {
    samples
  };
}