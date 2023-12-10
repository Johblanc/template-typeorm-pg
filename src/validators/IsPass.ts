import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Validator pour le mot de passe
 */
@ValidatorConstraint({ name: 'IsPass', async: false })
export class IsPass implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return typeof value === "string" && Boolean(
      value.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      ),
    );
  }

  defaultMessage(args: ValidationArguments) {
    return (
      `${args.property} doit contenir au moins 8 caractères dont une minuscule,` +
      ` une majuscule, un chiffre et un symbole parmi : @ $ ! % * ? &.`
    )
  }
}
