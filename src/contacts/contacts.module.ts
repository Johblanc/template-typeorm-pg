import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { UsersModule } from 'src/users/users.module';

/**
 * Interaction entre controller et services et le reste de l'API
 */
@Module({
  imports: [UsersModule],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [],
})
export class ContactsModule {}
