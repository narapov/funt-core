import {
    ValidatorConstraintInterface,
    ValidationArguments,
    ValidatorConstraint,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';
import validation from '../consts/validation';

export enum OrderBy {
    ASC = 'ASC',
    DESC = 'DESC',
}

export function isOrderBy(value: any): value is OrderBy {
    return (
        typeof value === 'string' &&
        (value === OrderBy.ASC || value === OrderBy.DESC)
    );
}

export interface IOrdered<Keys extends string> {
    order?: Array<[Keys, OrderBy]>;
}

@ValidatorConstraint({ async: false })
class IsValidOrderConstraint implements ValidatorConstraintInterface {
    public validate(order: any, args: ValidationArguments) {
        if (order === undefined) {
            return true;
        }
        if (!order) {
            return false;
        }

        const keys: string[] = args.constraints[0];
        const usedKeys: string[] = [];

        if (order instanceof Array === false) {
            return false;
        }

        for (const elem of order) {
            const isValidEl =
                elem instanceof Array &&
                elem.length === 2 &&
                elem[0] &&
                keys.includes(elem[0]) &&
                !usedKeys.includes(elem[0]) &&
                isOrderBy(elem[1]);

            if (isValidEl) {
                usedKeys.push(elem[0]);
            } else {
                return false;
            }
        }
        return true;
    }

    public defaultMessage(args: ValidationArguments) {
        return validation.ORDER_MISMATCH;
    }
}

export function IsValidOrder(
    keys: string[],
    validationOptions?: ValidationOptions
) {
    if (keys.some(key => !key)) {
        throw new Error('Ordered keys has empty value');
    }
    if (new Set(keys).size !== keys.length) {
        throw new Error('Ordered keys contain duplicates');
    }

    // tslint:disable-next-line: ban-types
    return function(object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidOrderConstraint,
        });
    };
}
