# Get All Contact

Dans le fichier ```src/contacts/contacts.controller.ts``` ajouter la methode ```getAll``` :

```ts
@ApiBearerAuth('visitor')
@ApiBearerAuth('user')
@ApiBearerAuth('admin')
@UseGuards(VisitorAuthGuard)
@Get()
async getAll(
  @GetUser() user: User,
  @GetToken() token: string,
) {
  const fullUser = await this.usersService.findOneById(user.id)
  
  return {
    message: "Recupération de tous les contacts",
    data: fullUser?.viewContacts(fullUser),
    token: token,
  };
}
```