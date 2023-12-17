import { FilesInterceptor } from "@nestjs/platform-express";
import { zipFileFilter } from "./zip.file-filter";

export const ArchiveFileInterceptor = FilesInterceptor('files', undefined, {
  fileFilter: zipFileFilter,
})