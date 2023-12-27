# Correctif Validate User

## AuthService

Dans le fichier ```src/auth/auth.service.ts``` dans la methode ```validateUser``` , supprimer ```select``` dans ```findOne```

```ts
/* ... */
export class AuthService {
  /* ... */
  async validateUser(
    pseudo: string,
    password: string,
  ): Promise<(Partial<User> & { token: string }) | null> {
    const user = await User.findOne({
      where: { pseudo },
    });
    /* ... */
  }
}
```

## Entité User

Dans le fichier ```src/users/entities/user.entity.ts``` dans la propriété ```mail``` , supprimer ```select : false```

```ts
/* ... */

export class User extends BaseEntity {
  /* ... */
  @ApiProperty()
  @Column({ type: 'character varying', nullable: true })
  mail: string | null;
  /* ... */
}

```

