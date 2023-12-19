import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { UsersModule } from 'src/users/users.module';

/**
 * Interaction entre controller et services et le reste de l'API
 */
@Module({
  imports: [UsersModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [],
})
export class RolesModule {}
