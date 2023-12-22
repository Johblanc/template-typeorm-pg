# Get Wait For

Dans le fichier `src/contacts/contacts.controller.ts` ajouter la methode `getWaitFor` :

```ts
@ApiBearerAuth('visitor')
@ApiBearerAuth('user')
@ApiBearerAuth('admin')
@UseGuards(VisitorAuthGuard)
@Get("wait-for")
async getWaitFor(
  @GetUser() user: User,
  @GetToken() token: string,
) {
  const fullUser = await this.usersService.findOneById(user.id)

  return {
    message: "Recupération de tous les contacts déjà demandés",
    data: fullUser?.viewContacts(fullUser)?.wait_for,
    token: token,
  };
}
```
