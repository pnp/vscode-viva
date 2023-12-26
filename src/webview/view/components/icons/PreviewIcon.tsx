import * as React from 'react';

export interface IPreviewIconProps {}

export const PreviewIcon: React.FunctionComponent<IPreviewIconProps> = (props: React.PropsWithChildren<IPreviewIconProps>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" role="img" width="1.5em" height="1.5em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
      <path fill="currentColor" d="M2 2h12l1 1v10l-1 1H2l-1-1V3l1-1zm0 11h12V3H2v10zm11-9H3v3h10V4zm-1 2H4V5h8v1zm-3 6h4V8H9v4zm1-3h2v2h-2V9zM7 8H3v1h4V8zm-4 3h4v1H3v-1z"></path>
    </svg>
  );
};