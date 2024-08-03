import {useState} from "react";

export function useThrottling(delayInMs: number) {
    const [timeoutId, setTimeoutId] = useState<any>(null);

    return function invoke(action: () => void) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        setTimeoutId(setTimeout(action, delayInMs));

    }
}