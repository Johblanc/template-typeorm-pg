import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { IsPass } from "src/validators/IsPass";
import { IsPseudo } from "src/validators/IsPseudo";


/**
 * Contrôle des paramètres de création d'un utilisateur
 */
export class RegisterDto {

  /** Nom de l'utilisateur */
  @ApiProperty()
  @Validate(IsPseudo)
  pseudo : string ;

  /** Mot de passe de l'utilisateur */
  @ApiProperty()
  @Validate(IsPass)
  password : string ;
  
}
