import * as React from 'react';

export interface ISearchIconProps {}

export const SearchIcon: React.FunctionComponent<ISearchIconProps> = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
      <path fill="currentColor" d="M15.25 0a8.25 8.25 0 0 0-6.18 13.72L1 22.88l1.12 1l8.05-9.12A8.251 8.251 0 1 0 15.25.01V0zm0 15a6.75 6.75 0 1 1 0-13.5a6.75 6.75 0 0 1 0 13.5z"></path>
    </svg>
  );
};