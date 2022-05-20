import * as React from 'react';

export interface IDesktopDownloadIconProps {}

export const DesktopDownloadIcon: React.FunctionComponent<IDesktopDownloadIconProps> = (props: React.PropsWithChildren<IDesktopDownloadIconProps>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16">
      <path fill="currentColor" fill-rule="evenodd" d="M4 15v-1c2 0 2-.6 2-1H1.5l-.5-.5v-10l.5-.5h13l.5.5v9.24l-1-1V3H2v9h5.73l-.5.5l2.5 2.5H4zm7.86 0l2.5-2.5l-.71-.7L12 13.45V7h-1v6.44l-1.64-1.65l-.71.71l2.5 2.5h.71z" clipRule="evenodd"></path>
    </svg>
  );
};