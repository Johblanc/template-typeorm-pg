# Entity User

## Preparation

Dans ```src/users/entities``` :

```ts
import { BaseEntity, Entity } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  /* Ajouter les propriétés ici */
}


```

### @Entity()

Permet de définir le nom dans la base de données


###  extends BaseEntity

Permet l'usage des methodes de requete de typeORM :
* .find()
* .findOne()
* .update()
* .save()
* .remove()

Pour les principales

## Propriétés principales

### Id

Soit numérique : 

```ts
@ApiProperty()
@PrimaryGeneratedColumn()
id : number ;
```

Soit uuid :

```ts
@ApiProperty()
@PrimaryGeneratedColumn("uuid")
id : string ;
```

Le décorateur ```@ApiProperty()``` permet à Swagger de générér la documentation.

Le décorateur ```@PrimaryGeneratedColumn()``` indique à la base de donnée le comportement de la colonne. Ici "Clé Primaire" et "Auto Générée"


### Pseudonime

```ts
@ApiProperty()
@Column({ unique : true})
pseudo : string ;
```

Le décorateur ```@Column()``` indique une colonne simple. On y ajoute l'option ```unique : true``` pour interdire les doublons.

### Mot de passe

```ts
@Exclude()
@ApiProperty()
@Column()
password : string ;
```

Le décorateur ```@Exclude()``` interdis la sortie de cette propriété de l'API

## Propriétés optionnelles

### Prénom

```ts
@ApiProperty()
@Column({nullable: true})
first_name : string ;
```

L'option ```nullable: true``` autorise cette colonne à être vide

### Nom

```ts
@ApiProperty()
@Column({nullable: true})
last_name : string ;
```

### Mail

```ts
@ApiProperty()
@Column({ nullable: true, select : false})
mail : string ;
```

L'option ```select : false``` empèche la selection automatique de cette propriété.

### Date de création

```ts
@ApiProperty()
@CreateDateColumn({type:"timestamptz"})
creat_at : string ;
```

Le décorateur ```@CreateDateColumn()``` indique une colonne de date de création. Elle est remplie automatiquement

L'option ```type:"timestamptz"``` indique à la base de données un typage spéciale. Ici, une date avec zone heure locale sous la forme de texte.


### Date de dernière activité

```ts
@ApiProperty()
@Column({type:"timestamptz"})
actif_at : string ;
```

## Déclaration

Il faut maintenant que la base de données puisse identifier cette Entité comme une Table. Pour cela, dans ```src/app.module.ts```, dans l'option ```entities: []```, ajouter la :

```ts
import { User } from './users/entities/user.entity';
/* ... */

@Module({
  /* ... */
  imports: [
    /* ... */
    TypeOrmModule.forRoot({
      /* ... */
      entities: [
        User,
      ],
    }),
  ],
})
export class AppModule {}
```


