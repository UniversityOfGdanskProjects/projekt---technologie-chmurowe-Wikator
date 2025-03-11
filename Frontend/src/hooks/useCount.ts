import { useState, useCallback } from 'react';

export default function useCount(initialCount: number) {
  const [count, setCount] = useState(initialCount);

  const incrementCount = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []);

  return { count, setCount, incrementCount };
}