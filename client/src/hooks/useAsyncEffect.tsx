import { useEffect } from "react";

type UseAsyncEffectProps<T> = {
  asyncFn: () => Promise<T>;
  onSuccess: (data: T) => void;
  onError?: (error: unknown) => void;
  setLoading?: (val: boolean) => void;
  deps?: unknown[]; // dependencies to rerun the effect
  minimumLoading?: number;
};

export function useAsyncEffect<T>({
  asyncFn,
  onSuccess,
  onError,
  setLoading,
  deps = [],
  minimumLoading = 1000,
}: UseAsyncEffectProps<T>) {
  useEffect(() => {
    let isMounted = true;
    let timeout: NodeJS.Timeout;
    const start = new Date().getTime();
    const run = async () => {
      if (setLoading) {
        console.log("set loading");
        setLoading(true);
      }

      try {
        const data = await asyncFn();
        if (isMounted) onSuccess(data);
      } catch (error) {
        if (isMounted && onError) onError(error);
      } finally {
        const duration = new Date().getTime() - start;

        timeout = setTimeout(() => {
          setLoading(false);
        }, Math.max(minimumLoading - duration, 0));
      }
    };

    run();

    return () => {
      isMounted = false;
      console.log("cancel loading");
      clearTimeout(timeout);
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
