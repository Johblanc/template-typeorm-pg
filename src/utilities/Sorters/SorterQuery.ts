import { BaseEntity, FindOptionsOrder, FindOptionsOrderValue } from 'typeorm';

/** Converti des sort keys et orders en FindOptionsOrder pour typeORM */
export function sorterQuery<TEntity extends BaseEntity>(
  sort_keys?: string,
  sort_orders?: string,
): FindOptionsOrder<TEntity> | undefined {
  const sortKeys = sort_keys
    ? (sort_keys.split(',') as (keyof TEntity)[])
    : undefined;
  const sortOrders = (
    sortKeys !== undefined && sort_orders ? sort_orders.split(',') : []
  ) as FindOptionsOrderValue[];

  if (sortKeys) {
    while (sortOrders.length < sortKeys.length) {
      sortOrders.push('asc');
    }
  }

  return sortKeys
    ? sortKeys.reduce((acc, item, i) => {
        return { ...acc, [item]: sortOrders[i] };
      }, {} as FindOptionsOrder<TEntity>)
    : undefined;
}
