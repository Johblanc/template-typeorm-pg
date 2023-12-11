import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Validator pour une liste de sortKey "asc" ou "desc"
 */
@ValidatorConstraint({ name: 'IsSortOrders', async: false })
export class IsSortOrders
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    return (
      value === undefined ||
      (
        typeof value === 'string' &&
        value.split(",").reduce((acc,item)=> acc && ["asc", "desc"].includes(item), true)
      )
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} une liste de clés ('asc' ou 'desc') separées par ','`;
  }
}
