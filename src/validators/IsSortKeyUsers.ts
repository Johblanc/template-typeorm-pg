import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Validator pour une liste de sortKey pour la table users "pseudo", "first_name", "last_name" ou "actif_at"
 */
@ValidatorConstraint({ name: 'IsSortKeyUsers', async: false })
export class IsSortKeyUsers implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (value === undefined) {
      return true;
    }
    return (
      typeof value === 'string' &&
      value
        .split(',')
        .reduce(
          (acc, item, _, arr) =>
            acc &&
            ['pseudo', 'first_name', 'last_name', 'actif_at'].includes(item) &&
            arr.filter(elm=> elm === item).length === 1,
          true,
        )
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} une liste de clés Users ('pseudo', 'first_name', 'last_name' ou 'actif_at') separées par ',' et sans doublon`;
  }
}
