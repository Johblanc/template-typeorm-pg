
import * as bcrypt from 'bcrypt';
import { Body, ConflictException, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { GetToken } from 'src/auth/get-token.decorator';
import { GetUser } from 'src/auth/get-user.decorator';
import { LocalAuthGuard } from 'src/auth/local_guard/local-auth.guard';
import { User } from './entities/user.entity';
import { UserAuthGuard } from 'src/auth/user_guard/user-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUser() user: User, @GetToken() token : string) {
    return {
      message: 'Vous êtes connecté',
      data: user,
      token: token
    }
  }

  /**
   * Demande de modification d'un utilisateur
   *
   * @param user L'utilidateur donné par le token
   * @param dto parametre de modification d'un utilisateur
   * @returns L'utilidateur et le token
   */
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Patch()
  async update(@GetUser() user: User, @GetToken() token : string, @Body() dto: UpdateUserDto) {
    if (dto.pseudo) {
      const pseudoExist = await this.usersService.findOneByPseudo(dto.pseudo);

      if (pseudoExist && pseudoExist.pseudo !== user.pseudo) {
        throw new ConflictException('Ce Pseudo est déjà enregistré');
      }
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.mail){
      const mailExist = await this.usersService.findOneByMail(dto.mail);
      
      if (mailExist && dto.mail !== user.mail) {
        throw new ConflictException("Ce Mail est déjà enregistré");
      }
    }
    return {
      message: 'Profile mis à jour',
      data:  await this.usersService.update(
        user.id,
        dto,
      ),
      token: token,
    };
  }
  /* Ajouter les methodes de service ici */
}
