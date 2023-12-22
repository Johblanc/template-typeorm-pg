# Refus de contact

## ContactsService

Dans le ficher ```src\contacts\contacts.service.ts``` ajouter la methode ```remove``` :

```ts
async remove(
  user_a: User,
  user_b: User,
) {
  let contact = await Contact.findOne({
    where: {
      user_a: { id: user_a.id },
      user_b: { id: user_b.id },
    },
    relations: {
      user_a: true,
      user_b: true,
    },
  });

  if (contact !== null) {
    return await contact.remove()
  }
  contact = await Contact.findOne({
    where: {
      user_a: { id: user_b.id },
      user_b: { id: user_a.id },
    },
    relations: {
      user_a: true,
      user_b: true,
    },
  });

  if (contact !== null) {
    return await contact.remove()
  }

  return null;
}
```

## ContactsController

Dans le ficher ```src\contacts\contacts.controller.ts``` ajouter la methode ```remove``` :

```ts
@ApiBearerAuth('visitor')
@ApiBearerAuth('user')
@ApiBearerAuth('admin')
@UseGuards(VisitorAuthGuard)
@Patch('refuse/:uuid')
async refuse(
  @Param('uuid', new ParseUUIDPipe()) uuid: string,
  @GetUser() user: User,
  @GetToken() token: string,
) {
  const targetUser = await this.usersService.findOneById(uuid);
  if (targetUser === null) {
    throw new NotFoundException("L'utilisateur n'est pas enregistré");
  }
  if (targetUser.id === user.id) {
    throw new ConflictException("Vous ne pouvez vous refuser en contact");
  }

  const status = (await this.contactsService.findOneStatus(user,targetUser));

  if(status === "00"){
    throw new NotFoundException("Aucun contact trouvé");
  }
  else if(status === "10" || status === "11" || status === "01") {
    await this.contactsService.remove(user, targetUser)
  }
  else {
    await this.contactsService.update(user, targetUser,0)
  }
  

  const updateUser = await this.usersService.findOneById(user.id)

  return {
    message: "Refus réalisé",
    data: updateUser!.view(user),
    token: token,
  };
}
```