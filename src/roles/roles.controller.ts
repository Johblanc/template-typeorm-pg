import {
  Body,
  Controller,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { GetToken } from 'src/auth/get-token.decorator';
import { GetUser } from 'src/auth/get-user.decorator';
import { VisitorAuthGuard } from 'src/auth/visitor_guard/visitor-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { PromoteToAdminDto } from './dto/promote-to-admin.dto';
import { AdminAuthGuard } from 'src/auth/admin_guard/admin-auth.guard';
import { PromoteDto } from './dto/promote-user.dto';
import { UsersService } from 'src/users/users.service';

/**
 * Routage et contrôle des requetes pour la table role
 */
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth('visitor')
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @UseGuards(VisitorAuthGuard)
  @Patch('promote-to-admin')
  async promoteToAdmin(
    @GetUser() user: User,
    @GetToken() token: string,
    @Body() _: PromoteToAdminDto,
  ) {
    const promoteUser = await this.rolesService.promoteToAdmin(user.id);

    return {
      message: 'Promotion au role admin',
      data: promoteUser,
      token: token,
    };
  }

  @ApiBearerAuth('admin')
  @UseGuards(AdminAuthGuard)
  @Patch()
  async promote(@GetToken() token: string, @Body() dto: PromoteDto) {
    const userExist = await this.usersService.findOneById(dto.user_id);
    if (userExist === null) {
      throw new NotFoundException("Cette utilisateur n'existe pas");
    }

    const promoteUser = await this.rolesService.promote(
      dto.user_id,
      dto.sub_roles,
    );

    return {
      message: "Promotion d'un utilisateur",
      data: promoteUser,
      token: token,
    };
  }
}
