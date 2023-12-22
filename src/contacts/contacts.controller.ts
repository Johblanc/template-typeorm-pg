import { ConflictException, Controller, NotFoundException, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VisitorAuthGuard } from 'src/auth/visitor_guard/visitor-auth.guard';
import { GetToken } from 'src/auth/get-token.decorator';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

/**
 * Routage et contrôle des requetes pour la table contacts
 */
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
}
