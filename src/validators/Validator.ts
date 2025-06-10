import { validate } from 'class-validator';

export class InputValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InputValidationError';
        this.message = message;
    }
}

export default abstract class Validator {
    async validate() {
        const errors = await validate(this, {
            forbidNonWhitelisted: true,
            whitelist: true,
            stopAtFirstError: true,
        });
        if (errors.length > 0) {
            const firstErrorConstraint = Object.values(errors[0].constraints)[0];
            throw new InputValidationError(
                `The validation for ${errors[0].property} failed: ${firstErrorConstraint}`,
            );
        }
    }
}
