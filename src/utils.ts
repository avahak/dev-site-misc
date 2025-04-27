import { useEffect, useRef } from "react";

/**
 * Custom hook that debounces the given callback function,
 * delaying its execution until a certain amount of time has passed
 * since the last call. The function call can be canceled during the delay if needed.
 */
function useDebounce<T extends (...args: any[]) => void>(cb: T, delay: number) {
    const timer = useRef<NodeJS.Timeout>();
    const callbackRef = useRef(cb);
    const delayRef = useRef(delay);

    // Update refs if cb or delay changes
    useEffect(() => {
        callbackRef.current = cb;
        delayRef.current = delay;
    }, [cb, delay]);

    const debouncedFunction = (...args: Parameters<T>) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            callbackRef.current(...args);
            timer.current = undefined;
        }, delayRef.current);
    };

    /**
     * Cancel the pending execution of the debounced function.
     * Returns true if a cancellation occurred, false if there was nothing pending.
     */
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
            clearTimeout(timer.current);
        };
    }, []);

    return debouncedFunction as T & { cancel: () => boolean };
}


export { useDebounce };