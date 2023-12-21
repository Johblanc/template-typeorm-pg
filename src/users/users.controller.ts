import * as bcrypt from 'bcrypt';
import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { GetToken } from 'src/auth/get-token.decorator';
import { GetUser } from 'src/auth/get-user.decorator';
import { LocalAuthGuard } from 'src/auth/local_guard/local-auth.guard';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersQueryDto } from './dto/get-users.query.dto';
import { pagingGenerator } from 'src/utilities/Paging/Paging.generator';
import { UserImageFileInterceptor } from 'src/utilities/FileInterceptors/userPhoto.file-interceptor';
import { ImagesService } from 'src/images/images.service';
import { VisitorAuthGuard } from 'src/auth/visitor_guard/visitor-auth.guard';

/**
 * Routage et contrôle des requetes pour la table users
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly imagesService: ImagesService,
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

    const salt = await bcrypt.genSalt(10);

    dto.password = await bcrypt.hash(dto.password, salt);

    const newUser = await this.usersService.register(dto);
    return {
      message: `${dto.pseudo} bien enregistré`,
      data: newUser.view('self'),
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUser() user: User, @GetToken() token: string) {
    const { sub_roles, ...result } = user;
    return {
      message: 'Vous êtes connecté',
      data: result,
      token: token,
    };
  }

  /**
   * Demande de modification d'un utilisateur
   *
   * @param user L'utilidateur donné par le token
   * @param dto parametre de modification d'un utilisateur
   * @returns L'utilidateur et le token
   */
  @ApiBearerAuth('visitor')
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @UseGuards(VisitorAuthGuard)
  @UseInterceptors(UserImageFileInterceptor)
  @Patch()
  async update(
    @GetUser() user: User,
    @GetToken() token: string,
    @Body() dto: UpdateUserDto,
    @UploadedFiles() savedFiles: Express.Multer.File[] = [],
  ) {
    if (dto.pseudo) {
      const pseudoExist = await this.usersService.findOneByPseudo(dto.pseudo);

      if (pseudoExist && pseudoExist.pseudo !== user.pseudo) {
        throw new ConflictException('Ce Pseudo est déjà enregistré');
      }
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.mail) {
      const mailExist = await this.usersService.findOneByMail(dto.mail);

      if (mailExist && dto.mail !== user.mail) {
        throw new ConflictException('Ce Mail est déjà enregistré');
      }
    }

    let updateUser = (await this.usersService.update(user.id, dto)) as User;

    if (savedFiles.length > 0) {
      if (updateUser.image !== null) {
        await this.usersService.update(user.id, { image: null });
        await this.imagesService.remove(
          updateUser.image.dir,
          updateUser.image.file,
        );
      }

      const image = await this.imagesService.createOrUpdate(
        savedFiles[0],
        'img/users',
        updateUser!.id,
        `Avatar ${updateUser!.pseudo}`,
      );

      updateUser = (await this.usersService.update(user.id, { image })) as User;
    }

    return {
      message: 'Profile mis à jour',
      data: updateUser.view('self'),
      token: token,
    };
  }

  /**
   * Récupération d'un utilisateur
   *
   * @returns l'utilisateur recherché
   */
  @ApiBearerAuth('visitor')
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @UseGuards(VisitorAuthGuard)
  @Get(':uuid')
  async getOne(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @GetUser() user: User,
    @GetToken() token: string,
  ) {

    const targetUser = await this.usersService.findOneById(uuid);
    if (targetUser === null) {
      throw new NotFoundException("L'utilisateur n'est pas enregistré");
    }

    return {
      message: "Récupération d'un utilisateur",
      data: targetUser.view(user),
      token: token,
    };
  }

  /**
   * Récupération d'un utilisateur
   *
   * @returns l'utilisateur recherché
   */
  @ApiBearerAuth('visitor')
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @UseGuards(VisitorAuthGuard)
  @Get()
  async getMany(
    @Query() query: GetUsersQueryDto,
    @GetUser() user: User,
    @GetToken() token: string,
  ) {
    const users = await this.usersService.findMany(query);

    const { pages, data } = pagingGenerator<GetUsersQueryDto, User>(
      query,
      users,
    );

    return {
      message: 'Plusieurs utilisateurs',
      data: data.map((item) => item.view(user)),
      token,
      pages,
    };
  }
}
