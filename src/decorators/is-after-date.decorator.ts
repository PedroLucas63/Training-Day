import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsAfterDateConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [comparisonDate] = args.constraints;

    return new Date(value) > new Date(comparisonDate);
  }

  defaultMessage(args: ValidationArguments) {
    const [comparisonDate] = args.constraints;
    return `The date ($value) must be after ${comparisonDate.toISOString()}`;
  }
}

export function IsAfterDate(date: Date, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [date],
      validator: IsAfterDateConstraint,
    });
  };
}
