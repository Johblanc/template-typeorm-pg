# Get Wait You

Dans le fichier ```src/contacts/contacts.controller.ts``` ajouter la methode ```getWaitYou``` :

```ts
  @ApiBearerAuth('visitor')
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @UseGuards(VisitorAuthGuard)
  @Get("wait-you")
  async getWaitYou(
    @GetUser() user: User,
    @GetToken() token: string,
  ) {
    const fullUser = await this.usersService.findOneById(user.id)

    return {
      message: "Recupération de tous les contacts en attente de votre réponse",
      data: fullUser?.viewContacts(fullUser)?.wait_you,
      token: token,
    };
  }
```