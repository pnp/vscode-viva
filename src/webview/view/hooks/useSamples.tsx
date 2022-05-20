import { useState, useEffect } from 'react';
import { Messenger } from '@estruyf/vscode/dist/client';
import { WebviewCommand } from '../../../constants';
import { Sample } from '../../../models';

const SAMPLES_URL = "https://pnp.github.io/sp-dev-fx-aces/samples.json";

export default function useSamples() {
  const [samples, setSamples] = useState<Sample[] | undefined>(undefined);

  useEffect(() => {
    async function fetchData() {
      const state = Messenger.getState() as any || {};

      if (state['samples']) {
        setSamples(state['samples']);
      }

      try {
        const response = await fetch(SAMPLES_URL);
        const data = await response.json();
        
        setSamples(data);
        Messenger.setState({ 
          ...state,
          samples: data
        });
      } catch (e) {
        Messenger.send(WebviewCommand.toVSCode.logError, `useSamples: ${(e as Error).message}`);
        setSamples([]);
      }
    }

    fetchData();
  }, ['']);

  return {
    samples
  };
}