import { Module } from "@nestjs/common";
import { ExtractorController } from "./extractor.controller";
import { UsersExcractor } from "./extractor.users.service";



/**
 * Module de gestion pour l'extraction zip
 */
@Module({
  imports : [],
  controllers: [ExtractorController],
  providers: [UsersExcractor],
  exports: [],
})
export class ExtractorModule {}
