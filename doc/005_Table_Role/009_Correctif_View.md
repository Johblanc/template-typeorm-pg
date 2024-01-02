# Correctif View

Dans ```src\users\entities\user.entity.ts```, dans la methode ```User.view()``` faire passer la condition pour l'admin en premier :

```ts
/* ... */
export class User extends BaseEntity {
  /* ... */
  view(/* ... */): Partial<User> & { contacts?: TContact | undefined } {
    /* ... */

    if (typeof claimant === 'string') {
      role = claimant;
    } else if (claimant !== undefined) {
      if (claimant.role.acces_level === 2) {
        role = 'admin';
      } else if (claimant.id === this.id) {
        role = 'self';
      } else if (claimant.role.acces_level === 1) {
        role = 'user';
      }
    }
    /* ... */
  }
}

```