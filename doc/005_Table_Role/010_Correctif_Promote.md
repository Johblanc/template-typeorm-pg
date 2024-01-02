# Correctif Promote

Corriger ```scr``` pour que lorsque subRoles est vide, alors tous les rôles sont supprimiés et non pas donnés :

```ts
/* ... */
export class RolesService {
  /* ... */
  async promote(/* ... */) {
    /* ... */
    if (user !== null) {
      user.sub_roles = sub_roles.length !== 0 ? roles : [];
      /* ... */
    }
    /* ... */
  }
}
```