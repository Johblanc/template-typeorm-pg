# Bloquage de Contact

# Refus de contact

## ContactsService

Dans le ficher ```src\contacts\contacts.service.ts``` modifier la methode ```create``` :

```ts
async create(
  user_a: User,
  user_b: User,
  status_a?: 0 | 1 | 2,
  status_b?: 0 | 1 | 2,
) {
  const contact = Contact.create({ user_a, user_b, status_a, status_b });
  return await contact.save();
}
```

## ContactsController

Dans le ficher ```src\contacts\contacts.controller.ts``` ajouter la methode ```bane``` :

```ts
@ApiBearerAuth('visitor')
@ApiBearerAuth('user')
@ApiBearerAuth('admin')
@UseGuards(VisitorAuthGuard)
@Patch('bane/:uuid')
async bane(
  @Param('uuid', new ParseUUIDPipe()) uuid: string,
  @GetUser() user: User,
  @GetToken() token: string,
) {
  const targetUser = await this.usersService.findOneById(uuid);
  if (targetUser === null) {
    throw new NotFoundException("L'utilisateur n'est pas enregistré");
  }
  if (targetUser.id === user.id) {
    throw new ConflictException("Vous ne pouvez vous bannir en contact");
  }

  const status = (await this.contactsService.findOneStatus(user,targetUser));
  
  if(status.split('')[0] === "2"){
    throw new ConflictException("Ce bannissement a déjà été réalisé");
  }
  else if(status === "00"){
    await this.contactsService.create(user, targetUser,2)
  }
  else {
    await this.contactsService.update(user, targetUser,2)
  }

  const updateUser = await this.usersService.findOneById(user.id)

  return {
    message: "Bannissement réalisé",
    data: updateUser!.view(user),
    token: token,
  };
}
```