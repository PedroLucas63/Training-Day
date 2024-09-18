import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAgeGreaterThan(
  minAge: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAgeGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: Date, args: ValidationArguments) {
          if (!value) return true;

          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDifference = today.getMonth() - birthDate.getMonth();
          const dayDifference = today.getDate() - birthDate.getDate();

          const adjustedAge =
            age -
            (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)
              ? 1
              : 0);

          return adjustedAge >= minAge;
        },
        defaultMessage(args: ValidationArguments) {
          return `Age must be at least ${minAge} years`;
        },
      },
    });
  };
}
