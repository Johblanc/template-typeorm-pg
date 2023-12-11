import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Validator pour un texte convertible en entier positif
 */
@ValidatorConstraint({ name: 'IsStringIntPositiveOptionnal', async: false })
export class IsStringIntPositiveOptionnal
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    return (
      value === undefined ||
      (
        typeof value === 'string' &&
        !Number.isNaN(Number(value)) &&
        Number(value) >= 1 &&
        Number(value) % 1 === 0
      )
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} doit être un entier positif`;
  }
}
