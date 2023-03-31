import { BasicError } from "src/types/error";
import { NumberResult } from "src/types/result";

export type SecurityTypes = 'strict' | 'relaxed' | 'loose';

const defaultSecurity = 'relaxed';

const numberChecks = {
    // valid if value is a number
    strict: (value: any): boolean => {
        if (typeof value !== 'number') return false;
        else if (isNaN(value)) return false;

        const num = parseInt(value as any);
        return !(Number.isNaN(num));
    },
    // valid if string is an exact number
    relaxed: (value: any): boolean => {
        if (isNaN(value)) return false;

        const num = parseInt(value);
        return !(Number.isNaN(num));
    },
    // valid if string starts with a number
    loose: (value: any): boolean => {
        const num = parseInt(value);
        return !(Number.isNaN(num));
    }
}

export function isNumber(value: any, security: SecurityTypes = defaultSecurity) {
    if (Array.isArray(value)) return false;
    
    const valid = numberChecks[security](value);

    return valid;
}

const toNumberTypes = {
    // valid if value is a number
    strict: (value: any): number | false => {
        if (typeof value !== 'number') return false;
        else if (isNaN(value)) return false;

        const num = parseInt(value as any);
        return (Number.isNaN(num)) ? false : num;
    },
    // valid if string is an exact number
    relaxed: (value: any): number | false => {
        if (isNaN(value)) return false;

        const num = parseInt(value);
        return (Number.isNaN(num)) ? false : num;
    },
    // valid if string starts with a number
    loose: (value: any): number | false => {
        const num = parseInt(value);
        return (Number.isNaN(num)) ? false : num;
    }
}

export function toNumber(value: any, security: SecurityTypes = defaultSecurity): NumberResult {
    if (Array.isArray(value)) return { error: new BasicError('NaN', 412) };
    
    const valid = toNumberTypes[security](value);

    if (valid === false) return { error: new BasicError('NaN', 412) };

    return { result: valid as number };
}