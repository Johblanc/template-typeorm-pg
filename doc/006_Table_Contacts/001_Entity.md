# Entité Contact

## TContact

Créer un fichier ```src/contacts/entities/contact.type.ts``` : 

```ts
import { User } from "src/users/entities/user.entity";

export type TContact = {
  wait_for: Partial<User>[];
  wait_you: Partial<User>[];
  friends: Partial<User>[];
  banned: Partial<User>[];
  banned_you: Partial<User>[];
}
```

## Contact

Créer un fichier ```src/contacts/entities/contact.entity.ts``` : 

```ts
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contact')
export class Contact extends BaseEntity {
  
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ default: 1 })
  status_a: number;

  @ApiProperty()
  @Column({ default: 0 })
  status_b: number;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.contacts_a)
  user_a: User;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.contacts_b)
  user_b: User;

  view_as_a (claimant?: User | "self" | "admin" | "user"){
    return {
      status : `${this.status_a}${this.status_b}`,
      user : this.user_b.view(claimant)
    }
  }

  view_as_b (claimant?: User | "self" | "admin" | "user"){
    return {
      status : `${this.status_b}${this.status_a}`,
      user : this.user_a.view(claimant)
    }
  }
}
```

## User

Dans le fichier ```src/users/entities/user.entity.ts``` : 

```ts
/* ... */
import { Contact } from 'src/contacts/entities/contact.entity';
import { TContact } from 'src/contacts/entities/contact.type';
/* ... */
import {
  /* ... */
  OneToMany,
  /* ... */
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  /* ... */

  @ApiProperty()
  @OneToMany(() => Contact, (contact) => contact.user_a)
  contacts_a: Contact[];

  @ApiProperty()
  @OneToMany(() => Contact, (contact) => contact.user_b)
  contacts_b: Contact[];

  /* ... */

  viewContacts(claimant?: User | 'self' | 'admin' | 'user'): TContact | undefined {
    if (this.contacts_a === undefined || this.contacts_b === undefined) {
      return undefined;
    }

    const c = [
      ...(this.contacts_a || []).map((item) => item.view_as_a(claimant)),
      ...(this.contacts_b || []).map((item) => item.view_as_b(claimant)),
    ];
    return {
      wait_for: c
        .filter((item) => item.status === '01')
        .map((item) => item.user),
      wait_you: c
        .filter((item) => item.status === '10')
        .map((item) => item.user),
      friends: c
        .filter((item) => item.status === '11')
        .map((item) => item.user),
      banned: c
        .filter((item) => item.status.split('')[0] === '2')
        .map((item) => item.user),
      banned_you: c
        .filter((item) => item.status.split('')[1] === '2')
        .map((item) => item.user),
    };
  }

  view(claimant?: User | 'self' | 'admin' | 'user'): Partial<User> & {contacts? : TContact | undefined} {
    /* ... */
    const forSelf = {
      /* ... */,
      contacts: this.viewContacts(claimant),
    };
    /* ... */
  }
}
```

## AppModule

Dans le fichier ```src/app.module.ts``` ajouter ```Contact``` aux entities : 

```ts
/* ... */
import { Contact } from './contacts/entities/contact.entity';

@Module({
  /* ... */
  imports: [
    /* ... */
    TypeOrmModule.forRoot({
      /* ... */
      entities: [
        /* ... */
        Contact,
      ],
    }),
    /* ... */
  ],
})
export class AppModule {}
```

## AuthService

Dans le fichier ```src/auth/auth.service.ts``` ajouter les relations contacts aux appels dans la BdD : 

```ts
/* ... */
export class AuthService {

  /* ... */
  async validateUser(/* ... */){
    const user = await User.findOne({
      /* ... */
      relations: {
        contacts_a : {user_b : true},
        contacts_b : {user_a : true},
      }
    });
    /* ... */
  }

  /* ... */
  async findOneByToken(/* ... */){
    const user = await User.findOne({
      /* ... */
      relations: {
        contacts_a : {user_b : true},
        contacts_b : {user_a : true},
      }
    });
    /* ... */
  }
}

```

## UsersService

Dans le fichier ```src/users/users.service.ts``` ajouter les relations contacts aux appels dans la BdD : 

```ts
/* ... */
export class UsersService {
  /* ... */
  async findOneByPseudo(pseudo: string): Promise<User | null> {
    return await User.findOne({
      where: { pseudo },
      relations: {
        contacts_a: { user_b: true },
        contacts_b: { user_a: true },
      },
    });
  }

  /* ... */
  async findOneByMail(mail: string): Promise<User | null> {
    return await User.findOne({
      where: { mail },
      relations: {
        contacts_a: { user_b: true },
        contacts_b: { user_a: true },
      },
    });
  }

  /* ... */
  async findOneById(id: string): Promise<User | null> {
    return await User.findOne({
      where: { id },
      relations: {
        contacts_a: { user_b: true },
        contacts_b: { user_a: true },
      },
    });
  }

  /* ... */
  async findMany(query: GetUsersQueryDto): Promise<User[]> {
    /* ... */
    const users = (
      await User.find({
        order,
        relations: {
          contacts_a: { user_b: true },
          contacts_b: { user_a: true },
        },
      })
    )/* ... */
  }

  /* ... */
  async update(id: string, dto: Partial<User>): Promise<User | null> {
    const user = await User.findOne({
      where: { id },
      relations: {
        contacts_a: { user_b: true },
        contacts_b: { user_a: true },
      },
    });
    /* ... */
  }
}
```