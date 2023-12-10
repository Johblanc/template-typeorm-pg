import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';


/**
 * Interaction entre controller et services et le reste de l'API
 */
@Module({
  imports : [],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [],
})
export class UsersModule {}
