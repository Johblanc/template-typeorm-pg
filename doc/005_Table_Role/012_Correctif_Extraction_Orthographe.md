# Correctif Extraction Orthographe

Dans ```src/extractor/extractor.roles.service.ts``` corriger "nmae" pour "name" :

```ts
/* ... */
export class RolesExtractor {
  /* ... */
  async reset() {
    const roles = [
      {
        name : "visitor",
        acces_level : 0
      },
      {
        name : "user",
        acces_level : 1
      },
      {
        name : "admin",
        acces_level : 2
      }
    ]

    return await Promise.all(
      roles.map(async (item) => {
        const newRole = Role.create({...item});
        return await newRole.save();
      }),
    );
  }
}
```