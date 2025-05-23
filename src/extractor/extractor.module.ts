import { Module } from "@nestjs/common";
import { ExtractorController } from "./extractor.controller";
import { UsersExtractor } from "./extractor.users.service";
import { ImagesExtractor } from "./extractor.images.service";
import { RolesExtractor } from "./extractor.roles.service";
import { ContactsExtractor } from "./extractor.contacts.service";



/**
 * Module de gestion pour l'extraction zip
 */
@Module({
  imports : [],
  controllers: [ExtractorController],
  providers: [
    UsersExtractor,
    ImagesExtractor,
    RolesExtractor,
    ContactsExtractor,
  ],
  exports: [],
})
export class ExtractorModule {}
