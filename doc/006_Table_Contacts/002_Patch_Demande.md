# Demande de Contact

## ContactsService

Créer un fichier ```src/contacts/contacts.service.ts``` :

```ts
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  async create(user_a: User, user_b: User) {
    const contact = Contact.create({ user_a, user_b });
    return await contact.save();
  }
  async findOneStatus(user_a: User, user_b: User) {
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
      return contact.view_as_a('admin').status;
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
      return contact.view_as_b('admin').status;
    }

    return '00';
  }

  async update(
    user_a: User,
    user_b: User,
    status_a?: 0 | 1 | 2,
    status_b?: 0 | 1 | 2,
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
      if (status_a !== undefined){
        contact.status_a = status_a;
      }
      if (status_b !== undefined){
        contact.status_b = status_b;
      }
      return await contact.save()
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
      if (status_a !== undefined){
        contact.status_b = status_a;
      }
      if (status_b !== undefined){
        contact.status_a = status_b;
      }
      return await contact.save()
    }

    return null;
  }
}
```

## ContactsController

Créer un fichier ```src/contacts/contacts.controller.ts``` :

```ts
import { ConflictException, Controller, NotFoundException, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VisitorAuthGuard } from 'src/auth/visitor_guard/visitor-auth.guard';
import { GetToken } from 'src/auth/get-token.decorator';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth('visitor')
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @UseGuards(VisitorAuthGuard)
  @Patch('asking/:uuid')
  async asking(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @GetUser() user: User,
    @GetToken() token: string,
  ) {
    const targetUser = await this.usersService.findOneById(uuid);
    if (targetUser === null) {
      throw new NotFoundException("L'utilisateur n'est pas enregistré");
    }
    if (targetUser.id === user.id) {
      throw new ConflictException("Vous ne pouvez vous demander en contact");
    }

    const status = (await this.contactsService.findOneStatus(user,targetUser));

    if(status.split('')[0] === "1"){
      throw new ConflictException("Cette demande à déjà été réalisée");
    }
    else if(status === "00"){
      await this.contactsService.create(user, targetUser)
    }
    else {
      await this.contactsService.update(user, targetUser,1)
    }

    const updateUser = await this.usersService.findOneById(user.id)

    return {
      message: "Demande réalisée",
      data: updateUser!.view(user),
      token: token,
    };

  }
}
```

## ContactsModule

Créer un fichier ```src/contacts/contacts.module.ts``` :

```ts
import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [],
})
export class ContactsModule {}
```

## AppModule

Dans le fichier ```src/app.module.ts``` ajouter ```ContactsModule``` aux imports :

```ts
/* ... */
import { ContactsModule } from './contacts/contacts.module';

@Module({
  /* ... */
  imports: [
    /* ... */
    ContactsModule,
  ],
})
export class AppModule {}
```


