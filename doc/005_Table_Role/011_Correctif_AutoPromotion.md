# Correctif Autopromotion

Ajout des roles si il n'existe pas encore.

Dans ```src/roles/roles.service.ts```

```ts
import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesService {
  async promoteToAdmin(userId: string) {
    let roles = await Role.find();
    if (roles.length === 0) {
      roles = await this.reset()
    }
    /* ... */
  }

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