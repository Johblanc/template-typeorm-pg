import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Validator :
 * * Texte
 * * 5 charactères
 */
@ValidatorConstraint({ name: 'IsPseudo', async: false })
export class IsPseudo implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) : boolean {
    return typeof value === "string" && value.length > 4;
  }

  defaultMessage(args: ValidationArguments) : string {
    return (
      `${args.property} doit être du texte d'au moins 5 charactères`
    );
  }
}
