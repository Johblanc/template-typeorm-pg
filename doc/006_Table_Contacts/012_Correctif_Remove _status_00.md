# Correctif Remove status 00

Dans ```src/contacts/contacts.service.ts``` il faut retirer les contacts ayant un status "00"

```ts
/* ... */

@Injectable()
export class ContactsService {
  /* ... */
  async update(/* ... */) {
    /* ... */
    if (contact !== null) {
      /* ... */
      if (contact.status_a === 0 && contact.status_b === 0 ){
        return await contact.remove();
      }
      /* ... */
    }
    /* ... */
    if (contact !== null) {
      /* ... */
      if (contact.status_a === 0 && contact.status_b === 0 ){
        return await contact.remove();
      }
      /* ... */
    }
    /* ... */
  }
  /* ... */
}
```