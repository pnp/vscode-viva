import * as React from 'react';

export interface ILibraryIconProps {
  className?: string;
}

export const LibraryIcon: React.FunctionComponent<ILibraryIconProps> = ({className}: React.PropsWithChildren<ILibraryIconProps>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || ''} aria-hidden="true" role="img" viewBox="0 0 16 16">
      <path fill="currentColor" fillRule="evenodd" d="m5 2.5l.5-.5h2l.5.5v11l-.5.5h-2l-.5-.5v-11zM6 3v10h1V3H6zm3.171.345l.299-.641l1.88-.684l.64.299l3.762 10.336l-.299.641l-1.879.684l-.64-.299L9.17 3.345zm1.11.128l3.42 9.396l.94-.341l-3.42-9.397l-.94.342zM1 2.5l.5-.5h2l.5.5v11l-.5.5h-2l-.5-.5v-11zM2 3v10h1V3H2z" clipRule="evenodd"/>
    </svg>
  );
};