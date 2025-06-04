import { useCallback } from "react";

type Callback = (...args :unknown[])=>void

const debounce = <T extends Callback>(cb:T, delay:number) => {
  let timeout : ReturnType<typeof setTimeout> | null;
  return (...args:Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
      timeout = null;
    }, delay);
  };
};

const throttle = <T extends Callback>(cb:T, timelimit:number)=>{
    let inThrottle = false;
    return (...args:Parameters<T>)=>{
      if(!inThrottle){
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, timelimit);
        cb(...args);
      }
    }
}

/**
 * A custom hook that returns a debounced version of the provided callback function.
 * The debounced function delays the execution of the callback until after the specified delay has passed
 * since the last time the debounced function was invoked. Note: The returned function will execute with a delay.
 *
 * @param callback - The function to debounce.
 * @param delay - The delay in milliseconds.
 * @returns A debounced version of the callback function.
 */
export const useDebounce = (callback:Callback, delay:number=300) => useCallback(debounce(callback, delay), [callback, delay]);



export const useThrottle = (callback:Callback, timeLimit:number=300) => useCallback(throttle(callback, timeLimit), [callback, timeLimit]);


