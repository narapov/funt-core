import { validate, ValidatorOptions, ValidationError } from 'class-validator';
import { BaseDTO } from './BaseDTO';

export interface IValidator {
    validate(validatorOptions: ValidatorOptions): Promise<ValidationError[]>;
}

export class ValidationDTO extends BaseDTO implements IValidator {
    public async validate(validatorOptions: ValidatorOptions = {}) {
        return await validate(this as any, {
            validationError: { target: false },
            ...validatorOptions,
        });
    }
}
