import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Validator :
 * * Mot de passe admin
 */
@ValidatorConstraint({ name: 'IsPromoteWord', async: false })
export class IsPromoteWord implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) : boolean {
    return value !== undefined && value === process.env.ADMIN_WORD ;
  }

  defaultMessage(args: ValidationArguments) : string {
    return (
      `${args.property} est incorrecte`
    );
  }
}
