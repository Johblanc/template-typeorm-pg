import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Validator pour les roles
 */
@ValidatorConstraint({ name: 'IsRoles', async: false })
export class IsRoles implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return (
      typeof value === 'string' && ['visitor', 'user', 'admin'].includes(value)
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} doit contenir être un liste de roles : visitor, user et admin`;
  }
}
