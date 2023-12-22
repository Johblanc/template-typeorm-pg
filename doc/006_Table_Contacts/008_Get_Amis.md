# Get All Contact

Dans le fichier ```src/contacts/contacts.controller.ts``` ajouter la methode ```getFriends``` :

```ts
@ApiBearerAuth('visitor')
@ApiBearerAuth('user')
@ApiBearerAuth('admin')
@UseGuards(VisitorAuthGuard)
@Get("friends")
async getFriends(
  @GetUser() user: User,
  @GetToken() token: string,
) {
  const fullUser = await this.usersService.findOneById(user.id)

  return {
    message: "Recupération de tous les contacts amis",
    data: fullUser?.viewContacts(fullUser)?.friends,
    token: token,
  };
}
```