import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Sample } from '../../../../models';
import { Card } from './Card';
import { Counter } from './Counter';
import { CardIcon, ListIcon } from '../icons';
import { Row } from './Row';


export interface IListProps {
  items: Sample[];
}

const INITIAL_PAGE = 0;
const NR_OF_ITEMS = 80;

export const List: React.FunctionComponent<IListProps> = ({ items }: React.PropsWithChildren<IListProps>) => {
  const [page, setPage] = useState<number>(0);
  const [pagedItems, setPagedItems] = useState<Sample[]>([]);
  const [isCardView, setIsCardView] = useState<boolean>(true);

  useEffect(() => {
    setPage(INITIAL_PAGE);
    setPagedItems(getNewSet(INITIAL_PAGE));
  }, []);

  useEffect(() => {
    setPage(INITIAL_PAGE);
    setPagedItems(getNewSet(INITIAL_PAGE));
  }, [items]);

  useEffect(() => {
    setPagedItems(getNewSet(page));
  }, [page, items]);

  const getNewSet = (pageNumber: number): Sample[] => items.slice(pageNumber * NR_OF_ITEMS, page * NR_OF_ITEMS + NR_OF_ITEMS);

  if (!pagedItems || pagedItems.length === 0) {
    return null;
  }

  return (
    <div className={'w-full flex justify-between flex-col flex-grow max-w-7xl mx-auto pt-6'}>
      <div className={'text-right w-full mb-2'}>
        <VSCodeButton onClick={() => setIsCardView(!isCardView)} appearance={isCardView ? '' : 'secondary'} className={'float-right ml-1'}>
          <span><CardIcon /></span>
        </VSCodeButton>
        <VSCodeButton onClick={() => setIsCardView(!isCardView)} appearance={!isCardView ? '' : 'secondary'} className={'float-right ml-1'}>
          <span><ListIcon /></span>
        </VSCodeButton>
        <Counter itemsCount={items.length} />
      </div>
      <ul role="list" className={isCardView ? 'grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-3 lg:grid-cols-4 xl:gap-x-2' : ''}>
        {
          pagedItems.map((item, index) => (
            isCardView ? <Card key={`${index}-${item.name}`} item={item} /> : <Row key={`${index}-${item.name}`} item={item} />
          ))
        }
      </ul>

      <div className={'flex justify-center items-center space-x-4 mt-8'}>
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