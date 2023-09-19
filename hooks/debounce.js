import { useState, useCallback, useEffect } from 'react';

export const useDebounce = (value, delay = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState();

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, delay);
    };
  };

  const startTimer = useCallback(debounce((val) => {
    setDebouncedValue(val);
  }), []);

  useEffect(() => {
    startTimer(value);
  }, [value]);

  return debouncedValue;
}