
import * as bcrypt from 'bcrypt';
import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';

/**
 * Routage et contrôle des requetes pour la table users
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}
  
  /**
   * Demande d'enregistrement d'un utilisateur
   *
   * @param dto parametre de création d'un utilisateur
   * @returns le nouvel utilisateur
   */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const pseudoExist = await this.usersService.findOneByPseudo(dto.pseudo);

    if (pseudoExist) {
      throw new ConflictException('Ce Pseudo est déjà enregistré');
    }

    const salt = await bcrypt.genSalt(10)

    dto.password = await bcrypt.hash(dto.password, salt);

    const newUser = await this.usersService.register(dto);
    return {
      message: `${dto.pseudo} bien enregistré`,
      data: newUser,
    };
  }
  /* Ajouter les methodes de service ici */
}
