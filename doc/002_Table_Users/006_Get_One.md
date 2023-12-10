# Récupération d'un Utilisateur

## UsersService

Dans le fichier ```src/users/users.service.ts```, ajouter la methode :

```ts
async findOneById(id: string): Promise<User | null> {
  return await User.findOneBy({ id });
}
```

## UsersController

Dans le fichier ```src/users/users.controller.ts```, ajouter la methode :

```ts
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Get(':id')
async getOne(@Param('id') id: string, @GetToken() token: string) {
  const user = await this.usersService.findOneById(id);
  if (user === null) {
    throw new NotFoundException("L'utilisateur n'est pas enregistré");
  }
  return {
    message: "Récupération d'un utilisateur",
    data: user,
    token: token,
  };
}
```

