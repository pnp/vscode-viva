import * as React from 'react';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';


export interface IGalleryLoaderProps {
}

export const GalleryLoader: React.FunctionComponent<IGalleryLoaderProps> = ({ }: React.PropsWithChildren<IGalleryLoaderProps>) => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center h-16">
        <VSCodeProgressRing style={{
          width: '100%',
          height: '100%',
        }} />

        <p className='mt-4 text-xl'>Loading Sample Gallery...</p>
      </div>
    </div>
  );
};