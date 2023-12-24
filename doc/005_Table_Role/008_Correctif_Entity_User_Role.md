# Correectif User Entity role

Corriger ```src/users/entities/user.entity.ts```

Remplacer ```this.sub_roles.length > 0``` par ```this.sub_roles && this.sub_roles.length > 0``` :

```ts
/* ... */
@Entity('users')
export class User extends BaseEntity {
  /* ... */
  get role() {
    let acces_level = 0;
    if (this.sub_roles && this.sub_roles.length > 0) {
      /* ... */
    }
    return {
      acces_level,
    };
  }
  /* ... */
}

```