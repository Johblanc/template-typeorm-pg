# Vue en fonction du role

## User

Dans le fichier ```src/roles/roles.controller.ts```, ajouter la methode ```view()``` :

```ts
/* ... */
@Entity('users')
export class User extends BaseEntity {
  /* ... */

  view(claimant?: User | "self" | "admin" | "user" ) {

    let role: string | undefined = undefined;

    if(typeof claimant === "string"){
      role = claimant
    }
    else if (claimant !== undefined){
      if (claimant.id === this.id) {
        role = 'self';
      } else if (claimant.role.acces_level === 2) {
        role = 'admin';
      } else if (claimant.role.acces_level === 1) {
        role = 'user';
      }
    }

    const base = {
      id: this.id,
      pseudo: this.pseudo,
      image: this.image,
    };
    const forUser = {
      ...base,
      actif_at: this.actif_at,
      role: this.role,
    };
    const forSelf = {
      ...forUser,
      first_name: this.first_name,
      last_name: this.last_name,
      mail: this.mail,
      creat_at: this.creat_at,
    };
    const forAdmin = {
      ...forSelf,
      sub_roles: this.sub_roles,
    };

    if (role === 'admin') {
      return forAdmin;
    }
    if (role === 'self') {
      return forSelf;
    }
    if (role === 'user') {
      return forUser;
    }
    return base;
  }
}
```

## RolesController

Dans le fichier ```src/roles/roles.controller.ts```, ajouter les methodes ```view()``` sur informations des utilisateurs :

```ts
/* ... */
export class RolesController {
  
  /* ... */
  async promoteToAdmin( /* ... */ ) {
    /* ... */
    return {
      message: 'Promotion au role admin',
      data: promoteUser?.view("admin"),
      token: token,
    };
  }

  /* ... */
  async promote( /* ... */ ) {
    /* ... */
    return {
      message: "Promotion d'un utilisateur",
      data: promoteUser?.view("admin"),
      token: token,
    };
  }
}
```

## UsersController

Faire de même dans le fichier ```src/users/users.controller.ts``` et corriger les ```@UseGuard(...)```. Supprimer l'import de ```UserAuthGuard```.

```ts
/* ... */

export class UsersController {

  /* ... */
  @Post('register')
  async register(/* ... */) {
    /* ... */
    return {
      message: `${dto.pseudo} bien enregistré`,
      data: newUser.view('self'),
    };
  }

  /* ... */
  async login(/* ... */) {
    const { sub_roles, ...result } = user;
    return {
      message: 'Vous êtes connecté',
      data: result,
      token: token,
    };
  }

  /* ... */
  async update(/* ... */) {
    /* ... */
    return {
      message: 'Profile mis à jour',
      data: updateUser.view('self'),
      token: token,
    };
  }

  /* ... */
  async getOne(/* ... */) {
    /* ... */
    return {
      message: "Récupération d'un utilisateur",
      data: targetUser.view(user),
      token: token,
    };
  }

  /* ... */
  async getMany(/* ... */) {
    /* ... */
    return {
      message: 'Plusieurs utilisateurs',
      data: data.map((item) => item.view(user)),
      token,
      pages,
    };
  }
}

```




