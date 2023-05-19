// useUpdatedRef.js

import { useRef, useEffect } from 'react';

/**
 * Custom hook that creates a Ref for a value, and ensures that it stays up-to-date.
 *
 * This hook is useful when you want to keep track of a value that can change over the lifetime of a component,
 * and you want to access its latest value from callbacks or effects, without causing unnecessary re-renders or
 * having to keep it in sync manually.
 *
 * @param {any} value - The value that you want to keep up-to-date in the Ref.
 * @returns {object} - A mutable Ref object whose .current property is initialized to the passed argument (value). 
 *                     The returned object will persist for the full lifetime of the component.
 */
function useUpdatedRef(value) {
    const valueRef = useRef(value);

    // The useEffect hook will run whenever the value changes...
    useEffect(() => {
        // ...and will update the ref's current value to the latest value
        valueRef.current = value;
    }, [value]);

    // Return the ref, which now will always hold the latest value
    return valueRef;
}

export default useUpdatedRef;
