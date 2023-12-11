# Récupération de plusieurs Utilisateurs

## Validators

Ajouter les validator suivant pour le DTO de la query.

### IsStringIntOptionnal

Pour un Texte Optionnel contenant un Entier 

Créer un fichier ```src/validators/IsStringIntOptionnal.ts``` :

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsStringIntOptionnal', async: false })
export class IsStringIntOptionnal
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    return (
      value === undefined ||
      (
        typeof value === 'string' &&
        !Number.isNaN(Number(value)) &&
        Number(value) % 1 === 0
      )
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} doit être un entier`;
  }
}
```

### IsStringIntPositiveOptionnal

Pour un Texte Optionnel contenant un Entier Positif.

Créer un fichier ```src/validators/IsStringIntPositiveOptionnal.ts``` :

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsStringIntPositiveOptionnal', async: false })
export class IsStringIntPositiveOptionnal
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    return (
      value === undefined ||
      (
        typeof value === 'string' &&
        !Number.isNaN(Number(value)) &&
        Number(value) >= 1 &&
        Number(value) % 1 === 0
      )
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} doit être un entier positif`;
  }
}
```

### IsSortOrders

Pour s'assurer que le Texte Optionnel contient bien un liste de SortOrder.

Créer un fichier ```src/validators/IsSortOrders.ts``` :

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsSortOrders', async: false })
export class IsSortOrders
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    return (
      value === undefined ||
      (
        typeof value === 'string' &&
        value.split(",").reduce((acc,item)=> acc && ["asc", "desc"].includes(item), true)
      )
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} une liste de clés ('asc' ou 'desc') separées par ','`;
  }
}
```

### IsSortKeyUsers

Pour s'assurer que le Texte Optionnel contient bien un liste de Clé de l'objet User sans doublon.

Créer un fichier ```src/validators/IsSortKeyUsers.ts``` :

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsSortKeyUsers', async: false })
export class IsSortKeyUsers implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (value === undefined) {
      return true;
    }
    return (
      typeof value === 'string' &&
      value
        .split(',')
        .reduce(
          (acc, item, _, arr) =>
            acc &&
            ['pseudo', 'first_name', 'last_name', 'actif_at'].includes(item) &&
            arr.filter(elm=> elm === item).length === 1,
          true,
        )
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} une liste de clés Users ('pseudo', 'first_name', 'last_name' ou 'actif_at') separées par ',' et sans doublon`;
  }
}
```

## DTO 

Il faut créer une DTO pour la query. Cela permettra d'en vérifier les données.

Créer un fichier ```src/users/dto/get-users.query.dto.ts``` :

```ts
import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { IsSortKeyUsers } from "src/validators/IsSortKeyUsers";
import { IsSortOrders } from "src/validators/IsSortOrders";
import { IsStringIntOptionnal } from "src/validators/IsStringIntOptionnal";
import { IsStringIntPositiveOptionnal } from "src/validators/IsStringIntPositiveOptionnal";
import { IsStringTypeOptional } from "src/validators/IsStringTypeOptional";

export class GetUsersQueryDto {

  @ApiProperty()
  @Validate(IsStringIntPositiveOptionnal)
  itemsByPage?: string;

  @ApiProperty()
  @Validate(IsStringIntPositiveOptionnal)
  page?: string;

  @ApiProperty()
  @Validate(IsStringTypeOptional)
  pseudo?: string;

  @ApiProperty()
  @Validate(IsStringTypeOptional)
  first_name?: string;

  @ApiProperty()
  @Validate(IsStringTypeOptional)
  last_name?: string;

  @ApiProperty()
  @Validate(IsStringIntOptionnal)
  actif_from? : string;

  @ApiProperty()
  @Validate(IsSortKeyUsers)
  sort_keys? : string;

  @ApiProperty()
  @Validate(IsSortOrders)
  sort_orders? : string;

}
```
* ```itemsByPage``` : Nombre d'items par pages.
* ```page``` : La page souhaité.
* ```pseudo``` : Les pseudos des l'utilisateurs contiendront ce texte.
* ```first_name``` : Les prenoms des l'utilisateurs contiendront ce texte.
* ```last_name``` : Les noms des l'utilisateurs contiendront ce texte.
* ```actif_from``` : Nombre de minutes depuis activité des utilisateurs. Si positif, tous les utilisateurs actif dans les X minutes. Si négatif, tous les utilisateurs inactif dans les X minutes.
* ```sort_keys``` : Liste de clés de triage des utilisateurs.
* ```sort_orders``` : List des ordres de triage des utilisateurs.

Si ```itemsByPage``` est présent, mais pas ```page``` , ```page```  prend la valeur 1, à l'inverse, ```itemsByPage``` prend la valeur 10.

Si il y plus de ```sort_keys``` que de ```sort_orders```, le complément est dans l'ordre ascendant. A l'inverse, les ```sort_orders``` excédentaires seront simplement ignorés.


## Utilitaires

### Paging

Cette outil permet de facilement paginer les données. Pour cela, il nous faut un objet avec d'un coté les informations de paginations (nb items / pages, info sur les pages première / précédente / courante / suivante / finale. )

#### Type Page

Créer un fichier ```src/utilities/Paging/Page.type.ts``` :

```ts
export type TPage = {
  page : number;
  query : string;
}
```

Type pour les info d'une page :

* ```page``` Numéro de la page
* ```query``` Complément d'url pour obtenir la page


#### Type Paging

Créer un fichier ```src/utilities/Paging/Paging.type.ts``` :

```ts
import { TPage } from "./Page.type";

export type TPaging = {
  pagesCount : number;
  itemsCount : number;
  first : TPage;
  prev? : TPage;
  current : TPage;
  next? : TPage;
  last : TPage;
}
```

Type pour les info de toute la pagination :

* ```pagesCount``` Nombre de pages total
* ```itemsCount``` Nombre d'élement total
* ```first``` Info sur la première page
* ```prev``` Info sur l'eventuelle page précédente
* ```current``` Info sur la page courante
* ```next``` Info sur l'eventuelle page suivante
* ```last``` Info sur la page finale


#### Paging Generator

Fonction permetant la transformation des données en données paginées. Cette fonction est valable pour toutes les entités.

Créer un fichier ```src/utilities/Paging/Paging.generator.ts``` :

```ts
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
```

### Sorter

Fonction permetant de convertir une query en options de triage pour la methode ```BaseEntity.find({order : {```Sorter```}})```

Créer un fichier ```src/utilities/Sorters/SorterQuery.ts``` :

```ts
import { BaseEntity, FindOptionsOrder, FindOptionsOrderValue } from 'typeorm';

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
```


## Responser 

Dans le ```src/interceptors/responser.interceptor.ts``` :

Ajouter la propriété ```pages``` dans le typage de ```value``` dans le ```map``` et à la suite des ```token``` dans le ```return```.

```ts
/* ... */
export class ResponserInterceptor implements NestInterceptor 
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> 
  {
    /* ... */
    return next
      .handle()
      .pipe(
        map(
        (value?: {
          /* ... */
          token?: string;
          pages?: TPaging;
        }) => {
          if (value) {
            /* ... */
            return {
                /* ... */
                token : value.token,
                pages: value.pages,
            }
          }
          else {
            /* ... */
          }
        }),
      );
  }
}
```

## UsersFilter

Fonction permetant de vérifier si un utilisateur est conforme à la query.

Créer un fichier ```src/users/filters/users.filter.ts``` :

```ts
import { User } from '../entities/user.entity';

export function usersFilter(
  user: User,
  pseudo?: string,
  first_name?: string,
  last_name?: string,
  actif_from?: number,
): boolean {
  const limit = Math.floor(
    (Number(new Date()) - Number(new Date(user.actif_at))) / 60000,
  );

  return (
    (!pseudo || user.pseudo.search(pseudo) >= 0) &&
    (!first_name ||
      (user.first_name !== null && user.first_name.search(first_name) >= 0)) &&
    (!last_name ||
      (user.last_name !== null && user.last_name.search(last_name) >= 0)) &&
    (!actif_from ||
      (actif_from >= 0 && actif_from >= limit) ||
      (actif_from < 0 && -actif_from <= limit))
  );
}
```

## UsersService

Récupération des utilisiteur dans la base de données.

Dans le fichier ```src/users/users.service.ts```, ajout la methode :

```ts
async findMany(query: GetUsersQueryDto): Promise<User[]> {
  const { pseudo, first_name, last_name } = query;
  const actif_from = query.actif_from ? Number(query.actif_from) : undefined;

  const order = sorterQuery<User>(query.sort_keys, query.sort_orders);

  const users = (await User.find({ order }))
    .filter((item) =>
      usersFilter(item, pseudo, first_name, last_name, actif_from),
    )

  return users;
}
```

## UsersController

Création de la route de l'API

Dans le fichier ```src/users/users.controller.ts```, ajout la methode :

```ts
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Get()
async getMany(@Query() query: GetUsersQueryDto, @GetToken() token: string) {
  const users = await this.usersService.findMany(query);

  const { pages, data } = pagingGenerator<GetUsersQueryDto, User>(
    query,
    users,
  );

  return {
    message: 'Plusieurs utilisateurs',
    data,
    token,
    pages,
  };
}
```

