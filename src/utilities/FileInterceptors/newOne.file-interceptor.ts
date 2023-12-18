
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { imageFileFilter } from "./image.file-filter";
import { dataDestination } from "./data.destination";
import { dataFilename } from "./data.file-name";

/** Interceptor pour un seul fichier */
export const newOneFileInterceptor = (attribut : string, folder : string) => FilesInterceptor(attribut, 1, {
  storage: diskStorage({
    destination: (req, file, cb) =>
    dataDestination(req, file, cb, folder),
    filename:  (req, file, cb) => dataFilename(req, file, cb),
  }),
  fileFilter: imageFileFilter,
})