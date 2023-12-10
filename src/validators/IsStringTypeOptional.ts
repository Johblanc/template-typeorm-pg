import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Validator pour le mail
 */
@ValidatorConstraint({ name: 'IsStringTypeOptional', async: false })
export class IsStringTypeOptional implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return value === undefined || typeof value === "string" 
  }

  defaultMessage(args: ValidationArguments) {
    return (
      `${args.property} doit être du texte`
    )
  }
}
