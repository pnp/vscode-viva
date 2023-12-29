import * as React from 'react';

export interface IChevronDownIconProps {}

export const ChevronDownIcon: React.FunctionComponent<IChevronDownIconProps> = () => {
  return (
    <svg role="img" width="1.2em" height="1.2em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"/>
    </svg>
  );
};