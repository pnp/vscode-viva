import * as React from 'react';

export interface IAddIconProps {}

export const AddIcon: React.FunctionComponent<IAddIconProps> = () => {
  return (
    <svg role="img" width="1.5em" height="1.5em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 7v1H8v6H7V8H1V7h6V1h1v6h6z"/>
    </svg>
  );
};