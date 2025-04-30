import { useCallback, useEffect, useRef } from "react";

type DebouncedFunction<T extends (...args: any[]) => void> = 
    ((...args: Parameters<T>) => void) & { cancel: () => boolean };

/**
 * Trailing-edge debounce - executes only after the delay when calls stop
 */
function useTrailingDebounce<T extends (...args: any[]) => void>(cb: T, delay: number) {
    const timer = useRef<ReturnType<typeof setTimeout>>();
    const callbackRef = useRef(cb);
    const delayRef = useRef(delay);

    // Update callback and delay refs if they change
    useEffect(() => {
        callbackRef.current = cb;
        delayRef.current = delay;
    }, [cb, delay]);

    const debouncedFunction = useCallback((...args: Parameters<T>) => {
        // Clear any existing timer
        if (timer.current) 
            clearTimeout(timer.current);

        // Set new timer
        timer.current = setTimeout(() => {
            callbackRef.current(...args);
        }, delayRef.current);
    }, []) as DebouncedFunction<T>;

    debouncedFunction.cancel = () => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = undefined;
            return true;
        }
        return false;
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, []);

    return debouncedFunction;
}

/**
 * Leading-edge debounce that:
 * 1. Executes immediately on first call
 * 2. Queues the latest call during cooldown
 * 3. Executes the queued call after delay
 */
function useLeadingDebounce<T extends (...args: any[]) => void>(cb: T, delay: number) {
    const timer = useRef<ReturnType<typeof setTimeout>>();
    const callbackRef = useRef(cb);
    const lastArgs = useRef<Parameters<T> | null>(null);
    const delayRef = useRef(delay);

    // Update callback and delay refs if they change
    useEffect(() => {
        callbackRef.current = cb;
        delayRef.current = delay;
    }, [cb, delay]);

    const debouncedFunction = useCallback((...args: Parameters<T>) => {
        if (timer.current) {
            // During cooldown: update with latest arguments
            lastArgs.current = args;
            return;
        }

        // No timer: execute immediately
        callbackRef.current(...args);

        // Start cooldown timer
        timer.current = setTimeout(() => {
            if (lastArgs.current) {
                // Execute the most recent call after delay
                callbackRef.current(...lastArgs.current);
                lastArgs.current = null;
            }
            timer.current = undefined;
        }, delayRef.current);
    }, []) as DebouncedFunction<T>;

    debouncedFunction.cancel = () => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = undefined;
            lastArgs.current = null;
            return true;
        }
        return false;
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, []);

    return debouncedFunction;
}

/**
 * Leading debounce.
 */
function leadingDebounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
): DebouncedFunction<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let lastArgs: Parameters<T> | undefined;

    const debouncedFunction = ((...args: Parameters<T>) => {
        if (!timeoutId) {
            // No timeout - execute immediately
            callback(...args);
        } else {
            // Calls during cooldown - store latest args
            lastArgs = args;
            return;
        }

        // Start cooldown period
        timeoutId = setTimeout(() => {
            if (lastArgs) {
                // Execute with latest args if any calls occurred during cooldown
                callback(...lastArgs);
                lastArgs = undefined;
            }
            timeoutId = undefined;
        }, delay);
    }) as DebouncedFunction<T>;

    debouncedFunction.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
            lastArgs = undefined;
            return true;
        }
        return false;
    };

    return debouncedFunction;
}

function clamp(t: number, minValue: number, maxValue: number) {
    return Math.max(minValue, Math.min(maxValue, t));
}

export type { DebouncedFunction };
export { useLeadingDebounce, useTrailingDebounce, leadingDebounce, clamp };