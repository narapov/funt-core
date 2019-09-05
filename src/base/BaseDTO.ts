import {
    serialize,
    deserialize,
    plainToClass,
    classToPlain,
} from 'class-transformer';

export class BaseDTO {
    constructor(obj?: object) {
        if (obj) {
            return (this.constructor as typeof BaseDTO).fromPlain(obj);
        }
    }
    public static deserialize(json: string) {
        return deserialize(this, json, { excludeExtraneousValues: true });
    }

    public static fromPlain(obj: object) {
        return plainToClass(this, obj, { excludeExtraneousValues: true });
    }

    public serialize() {
        return serialize(this, { excludeExtraneousValues: true });
    }

    public toPlain() {
        return classToPlain(this, { excludeExtraneousValues: true });
    }
}
