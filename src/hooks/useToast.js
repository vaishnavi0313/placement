import { useCallback, useRef, useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef();

  const show = useCallback((message, tone = 'default') => {
    clearTimeout(timer.current);
    setToast({ message, tone, key: Date.now() });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  return { toast, show, dismiss: () => setToast(null) };
}
