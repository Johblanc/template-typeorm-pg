import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';


/**
 * Interaction entre controller et services et le reste de l'API
 */
@Module({
  imports : [forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [],
})
export class UsersModule {}
