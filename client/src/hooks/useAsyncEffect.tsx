import { useEffect } from "react";

type UseAsyncEffectProps<T> = {
  asyncFn: () => Promise<T>;
  onSuccess: (data: T) => void;
  onError?: (error: unknown) => void;
  setLoading?: (val: boolean) => void;
  delay?: number; // delay before showing loader (e.g., 200ms)
  deps?: unknown[]; // dependencies to rerun the effect
};

export function useAsyncEffect<T>({
  asyncFn,
  onSuccess,
  onError,
  setLoading,
  delay = 200,
  deps = [],
}: UseAsyncEffectProps<T>) {
  useEffect(() => {
    let isMounted = true;
    let timeout: NodeJS.Timeout;

    const run = async () => {
      if (setLoading) {
        timeout = setTimeout(() => {
          if (isMounted) setLoading(true);
        }, delay);
      }

      try {
        const data = await asyncFn();
        if (isMounted) onSuccess(data);
      } catch (error) {
        if (isMounted && onError) onError(error);
      } finally {
        clearTimeout(timeout);
        if (isMounted && setLoading) setLoading(false);
      }
    };

    run();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
