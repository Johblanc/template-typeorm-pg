import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { IsMailOptional } from "src/validators/IsMailOptional";
import { IsPassOptional } from "src/validators/IsPassOptional";
import { IsPseudoOptional } from "src/validators/IsPseudoOptional";
import { IsStringTypeOptional } from "src/validators/IsStringTypeOptional";

/**
 * Contrôle des paramètres de modification d'un utilisateur
 */
export class UpdateUserDto {

  /** Nom de l'utilisateur */
  @ApiProperty()
  @Validate(IsPseudoOptional)
  pseudo?: string ;

  /** Mot de passe de l'utilisateur */
  @ApiProperty()
  @Validate(IsPassOptional)
  password?: string ;
  
  /** Prénom de l'Utilisateur */
  @ApiProperty()
  @Validate(IsStringTypeOptional)
  first_name?: string ;

  /** Nom de l'Utilisateur */
  @ApiProperty()
  @Validate(IsStringTypeOptional)
  last_name?: string ;
  
  /** Mail de l'Utilisateur */
  @ApiProperty()
  @Validate(IsMailOptional)
  mail?: string ;
}
