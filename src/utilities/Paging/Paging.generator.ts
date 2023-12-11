import { TPaging } from './Paging.type';

export function pagingGenerator<
  TQuery extends { itemsByPage?: string; page?: string },
  TData,
>(
  query: TQuery,
  items: TData[],
): { pages: TPaging | undefined; data: TData[] } {
  if (!(query.itemsByPage || query.page)) {
    return {
      pages: undefined,
      data: items,
    };
  }
  const itemsByPage = query.itemsByPage ? Number(query.itemsByPage) : 10;
  const page = query.page ? Number(query.page) : 1;
  const lastPage = Math.ceil(items.length / itemsByPage);

  const queryEnd = Object.keys(query)
    .filter((item) => item !== 'page')
    .map((item: string & keyof typeof query) => `${item}=${query[item]}`)
    .join('&');

  return {
    pages: {
      pagesCount: lastPage,
      itemsCount: items.length,
      first: {
        page: 1,
        query: `page=1&${queryEnd}`,
      },
      prev:
        page > 1
          ? {
              page: page - 1,
              query: `page=${page - 1}&${queryEnd}`,
            }
          : undefined,
      current: {
        page: page,
        query: `page=${page}&${queryEnd}`,
      },
      next:
        page !== lastPage
          ? {
              page: page + 1,
              query: `page=${page + 1}&${queryEnd}`,
            }
          : undefined,
      last: {
        page: lastPage,
        query: `page=${lastPage}&${queryEnd}`,
      },
    },
    data: items.filter(
      (_, i) =>
        page &&
        itemsByPage &&
        i >= (page - 1) * itemsByPage &&
        i < page * itemsByPage,
    ),
  };
}
