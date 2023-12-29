import * as React from 'react';

export interface ICardIconProps {}

export const CardIcon: React.FunctionComponent<ICardIconProps> = () => {
  return (
    <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M1.5 2h13l.5.5v10l-.5.5h-13l-.5-.5v-10l.5-.5zM2 3v9h12V3H2zm2 2h8v1H4V5zm6 2H4v1h6V7zM4 9h4v1H4V9z"/>
    </svg>
  );
};