import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Sample } from '../../../../models';
import { Card } from './Card';

export interface IListProps {
  items: Sample[];
}

const NR_OF_ITEMS = 12;

export const List: React.FunctionComponent<IListProps> = ({ items }: React.PropsWithChildren<IListProps>) => {
  const [page, setPage] = useState<number>(0);
  const [pagedItems, setPagedItems] = useState<Sample[]>([]);

  useEffect(() => {
    const newSet = items.slice(page * NR_OF_ITEMS, page * NR_OF_ITEMS + NR_OF_ITEMS);

    setPagedItems(newSet);
  }, [items]);

  useEffect(() => {
    const newSet = items.slice(page * NR_OF_ITEMS, page * NR_OF_ITEMS + NR_OF_ITEMS);

    setPagedItems(newSet);
  }, [page, items]);

  if (!pagedItems || pagedItems.length === 0) {
    return null;
  }

  return (
    <div className={`w-full flex justify-between flex-col flex-grow max-w-7xl mx-auto pt-6`}>
      <ul role="list" className={`grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8`}>
        {
          pagedItems.map((item, index) => (
            <Card key={`${index}-${item.name}`} item={item} />
          ))
        }
      </ul>

      <div className={`flex justify-center items-center space-x-4 mt-8`}>
        <VSCodeButton
          onClick={() => setPage(page - 1)}
          disabled={page === 0}>
          Previous
        </VSCodeButton>
        
        <VSCodeButton
          onClick={() => setPage(page + 1)}
          disabled={page * NR_OF_ITEMS + NR_OF_ITEMS >= items.length}>
          Next
        </VSCodeButton>
      </div>
    </div>
  );
};