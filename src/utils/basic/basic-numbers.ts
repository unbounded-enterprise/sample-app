import { BasicError } from "src/types/error";
import { NumberResult } from "src/types/result";

export type SecurityTypes = 'strict' | 'relaxed' | 'loose';
interface NumberCoercionProps {
    security: SecurityTypes;
    round: boolean;
    negative: boolean;
}

const defaultNumberErrorResponse = { error: new BasicError('NaN', 412) };
const defaultCoercionProps = {
    security: 'relaxed',
    round: true, // floor numbers
    negative: false, // reject negative numbers
} as NumberCoercionProps;


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

export function isNumber(value: any, security: SecurityTypes = defaultCoercionProps.security) {
    if (Array.isArray(value)) return false;
    
    const valid = numberChecks[security](value);

    return valid;
}

// ~twice the speed of isNumber but less flexible
// only supports exact numbers
export function isPosNum(value: any): boolean {
    value = String(value);
    if (!value) return false;
    else if (value >= 0) return true;
    else return false;
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

export function toNumber(value: any, props:Partial<NumberCoercionProps> = defaultCoercionProps): NumberResult {
    if (Array.isArray(value)) return defaultNumberErrorResponse;
    else if (value === 0) return { result: value };
    
    const { security, round, negative } = { ...defaultCoercionProps, ...props };
    const valid = toNumberTypes[security](value);

    if (valid === false) return defaultNumberErrorResponse;
    else if (negative === false && valid < 0) return defaultNumberErrorResponse;

    return { result: valid };
}

// Returns '' || positive number string
// Only numbers / number strings are valid
// An array with a single item as above is also valid
export function toPosNumStr(value: any): string {
    value = String(value);
    if (value >= 0) return value;
    else return '';
}