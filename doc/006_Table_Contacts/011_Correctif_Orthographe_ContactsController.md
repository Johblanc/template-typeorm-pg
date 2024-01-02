# Correctif Orthographe ContactsController

Dans ```src/contacts/contacts.controller.ts``` remplacer "bane" par "ban" :

```ts
/* ... */
export class ContactsController {
  /* ... */

  @Patch('ban/:uuid')
  async ban(/* ... */) {
    /* ... */
  }
  /* ... */
}

```