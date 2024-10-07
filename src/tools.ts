import { useEffect, useRef } from "react";

function clamp(t: number, minValue: number, maxValue: number) {
    return Math.max(minValue, Math.min(maxValue, t));
}

/**
 * A custom hook that debounces a callback function, delaying its execution 
 * until after a specified delay period since the last invocation.
 * The resulting function can be cancelled if needed.
 */
function useDebounce<T extends (...args: any[]) => void>(cb: T, delay: number) {
    const timer = useRef<NodeJS.Timeout>();
    const lastCall = useRef<number>(0);
  
    const debouncedFunction = (...args: Parameters<T>) => {
        const now = performance.now();
        clearTimeout(timer.current);

        if (now > lastCall.current+delay) {
            // Call immediately
            lastCall.current = now;
            cb(...args);
            return;
        }
        timer.current = setTimeout(() => {
            cb(...args);
            timer.current = undefined;
        }, delay);
    };

    /**
     * Cancels the pending execution of the debounced function.
     * Returns true if cancellation occurred, false if no execution was pending.
     */
    debouncedFunction.cancel = () => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = undefined;
            return true;
        }
        return false;
    };

    useEffect(() => {
        return () => {
            clearTimeout(timer.current);
            timer.current = undefined;
        };
    }, []);
  
    return debouncedFunction as (T & { cancel: () => boolean; });
}

export { useDebounce, clamp };