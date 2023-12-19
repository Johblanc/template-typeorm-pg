import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

/**
 * Interaction entre controller et services et le reste de l'API
 */
@Module({
  imports: [],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [],
})
export class RolesModule {}
