import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { GetToken } from 'src/auth/get-token.decorator';
import { GetUser } from 'src/auth/get-user.decorator';
import { VisitorAuthGuard } from 'src/auth/visitor_guard/visitor-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { PromoteToAdminDto } from './dto/promote-to-admin.dto';

/**
 * Routage et contrôle des requetes pour la table users
 */
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiBearerAuth('visitor')
  @ApiBearerAuth('user')
  @ApiBearerAuth('admin')
  @UseGuards(VisitorAuthGuard)
  @Patch('promote-to-admin')
  async promoteToAdmin(@GetUser() user: User, @GetToken() token: string, @Body() _ : PromoteToAdminDto) {

    const promoteUser = await this.rolesService.promoteToAdmin(user.id)
    
    return {
      message: 'Promotion au role admin',
      data: promoteUser,
      token: token,
    };
  }
}
