# Entité Role

## Entité

Créer un fichier ```src/roles/entities/role.entity.ts``` : 

```ts
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";
import { Entity, BaseEntity, Column, PrimaryColumn, ManyToMany } from "typeorm";

@Entity("roles")
export class Role extends BaseEntity {

  @ApiProperty()
  @PrimaryColumn({name : 'name'})
  name: string;

  @ApiProperty()
  @Column()
  acces_level: number;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.sub_roles )
  users : User[];
}
```
## Relation Users / Roles

Dans le fichier ```src/users/entities/user.entity.ts```,  ajouter le relation et la colonne calculée :

```ts
/* ... */
import { Role } from "src/roles/entities/role.entity";
import { /* ... */, JoinTable, ManyToMany} from "typeorm";

@Entity("users")
export class User extends BaseEntity {

  /* ... */

  @ApiProperty()
  @ManyToMany(() => Role, (role) => role.users , {eager : true})
  @JoinTable()
  sub_roles : Role[];

  @ApiProperty()
  @Expose()
  get role (){
    let acces_level = 0;
    if (this.sub_roles.length > 0){
      this.sub_roles.forEach( item => {
        acces_level = Math.max(acces_level, item.acces_level);
      })
    }
    return {
      acces_level,
    }
  }
}
```

## Déclaration


Dans le fichier ```src/app.module.ts```, ajouter ```Role``` aux entities :

```ts
/* ... */
import { Role } from './roles/entities/role.entity';

@Module({
  /* ... */
  imports: [
    /* ... */
    TypeOrmModule.forRoot({
      /* ... */
      entities: [
        User,
        Image,
        Role,
      ],
      /* ... */
    }),
    /* ... */
  ],
})
export class AppModule {}
```


## Mise à jour Auth Service


Dans le fichier ```src/auth/auth.service.ts```, ajouter ```role``` aux ```return``` des methodes ```validateUser``` et ```findOneByToken``` :

```ts
/* ... */

@Injectable()
export class AuthService {
  /* ... */

  async validateUser(/* ... */): Promise<(Partial<User> & { token: string }) | null> {
    /* ... */
    if (user !== null) {
      /* ... */
      if (isOk) {
        /* ... */
        const { password, ...result } = {
          ...user,
          role: user.role,        // <---- ICI
          token: this.token(user),
        };
        return result;
      }
    }
    return null;
  }

  async findOneByToken(/* ... */): Promise<(Partial<User> & { token: string }) | null> {
    /* ... */
    if (user !== null) {
      /* ... */
      return {
        ...user,
        role: user.role,        // <---- ET LA
        token: this.token(user),
      };
    }
    return null;
  }
}
```



