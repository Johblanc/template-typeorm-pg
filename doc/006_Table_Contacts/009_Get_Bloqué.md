# Get All Contact

Dans le fichier ```src/contacts/contacts.controller.ts``` ajouter la methode ```getBanned``` :

```ts
@ApiBearerAuth('visitor')
@ApiBearerAuth('user')
@ApiBearerAuth('admin')
@UseGuards(VisitorAuthGuard)
@Get("banned")
async getBanned(
  @GetUser() user: User,
  @GetToken() token: string,
) {
  const fullUser = await this.usersService.findOneById(user.id)

  return {
    message: "Recupération de tous les contacts bannis",
    data: fullUser?.viewContacts(fullUser)?.banned,
    token: token,
  };
}
```