# Get All Contact

Dans le fichier ```src/contacts/contacts.controller.ts``` ajouter la methode ```getBanedYou``` :

```ts
@ApiBearerAuth('visitor')
@ApiBearerAuth('user')
@ApiBearerAuth('admin')
@UseGuards(VisitorAuthGuard)
@Get("banned-you")
async getBannedYou(
  @GetUser() user: User,
  @GetToken() token: string,
) {
  const fullUser = await this.usersService.findOneById(user.id)

  return {
    message: "Recupération de tous les contacts qui vous ont bannis",
    data: fullUser?.viewContacts(fullUser)?.banned_you,
    token: token,
  };
}
```