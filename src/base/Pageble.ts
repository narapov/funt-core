import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    ValidationOptions,
    registerDecorator,
} from 'class-validator';
import validation from '../consts/validation';

export interface IPageble {
    pagable?: {
        limit: number;
        offset: number;
    };
}

@ValidatorConstraint({ async: false })
class IsValidPagableConstraint implements ValidatorConstraintInterface {
    public validate(pagable: any, args: ValidationArguments) {
        if (pagable === undefined) {
            return true;
        }
        if (!pagable) {
            return false;
        }

        return (
            typeof pagable === 'object' &&
            typeof pagable.limit === 'number' &&
            pagable.limit > 0 &&
            typeof pagable.offset === 'object' &&
            pagable.offset >= 0
        );
    }

    public defaultMessage(args: ValidationArguments) {
        return validation.PAGABLE_MISMATCH;
    }
}

export function IsValidPagable(validationOptions?: ValidationOptions) {
    // tslint:disable-next-line: ban-types
    return function(object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidPagableConstraint,
        });
    };
}
