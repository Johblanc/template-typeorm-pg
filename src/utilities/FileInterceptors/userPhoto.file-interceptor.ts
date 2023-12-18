
import { newOneFileInterceptor } from "./newOne.file-interceptor";


/** Intercepteur permatant de stoquer l'image d"un utilisateur */
export const UserImageFileInterceptor = newOneFileInterceptor("image","img/users")