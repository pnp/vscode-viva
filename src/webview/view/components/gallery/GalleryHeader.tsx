import * as React from 'react';
import { LibraryIcon } from '../icons';


export interface IGalleryHeaderProps {
}

export const GalleryHeader: React.FunctionComponent<IGalleryHeaderProps> = ({ }: React.PropsWithChildren<IGalleryHeaderProps>) => {
  return (
    <div className={'flex items-center'}>
      <LibraryIcon className={'sample__icon w-10'} />
      <div className={'ml-4'}>
        <h1 className='text-2xl'>Sample Gallery</h1>
        <p>Explore samples created by the Microsoft 365 and Power Platform community.</p>
      </div>
    </div>
  );
};