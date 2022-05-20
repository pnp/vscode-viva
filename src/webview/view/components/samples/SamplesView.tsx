import * as React from 'react';
import useSamples from '../../hooks/useSamples';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import { List } from './List';
import { LibraryIcon } from '../icons/LibraryIcon';

export interface ISamplesViewProps {}

export const SamplesView: React.FunctionComponent<ISamplesViewProps> = (props: React.PropsWithChildren<ISamplesViewProps>) => {
  const { samples } = useSamples();

  return (
    <div className="w-full h-full max-w-7xl mx-auto sm:px-6 lg:px-8 py-16">
      {
        samples === undefined && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center h-16">
              <VSCodeProgressRing style={{
                width: '100%',
                height: '100%',
              }} />

              <p className='mt-4 text-xl'>Loading samples...</p>
            </div>
          </div>
        )
      }

      {
        samples !== undefined && samples.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center h-16">
              <p className='mt-4 text-xl'>No samples found.</p>
            </div>
          </div>
        )
      }

      {
        samples !== undefined && samples.length > 0 && (
          <div className='pb-16'>
            <div className={`flex items-center`}>
              <LibraryIcon className={`sample__icon w-16`} />

              <div className={`ml-4`}>
                <h1 className='text-2xl'>Samples</h1>
                <p>Explore our sample gallery filled with solutions created by the community.</p>
              </div>
            </div>

            <List items={samples} />
          </div>
        )
      }
    </div>
  );
};