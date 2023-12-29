import * as React from 'react';

export interface IClearIconProps { }

export const ClearIcon: React.FunctionComponent<IClearIconProps> = () => {
  return (
    <svg role="img" width="1em" height="1em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z" />
    </svg>
  );
};