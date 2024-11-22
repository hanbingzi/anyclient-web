import { useCallback, useMemo, useState } from 'react';

export function useDragLine({ scrollLeft }: { scrollLeft: number }) {
  const [dragLineLeft, setDragLineLeft] = useState<number>(0);
  const [dragLineVisible, setDragLineVisible] = useState<boolean>(false);

  const handleDragLineStart = useCallback(
    (left: number) => {
      left = left - scrollLeft;
      setDragLineLeft(left);
      setDragLineVisible(true);
    },
    [scrollLeft],
  );

  const handleDragLineStop = useCallback(() => {
    setDragLineVisible(false);
  }, []);

  const handleDragLine = useCallback(
    (left: number) => {
      left = left - scrollLeft;
      setDragLineLeft(left);
    },
    [scrollLeft],
  );

  return { dragLineLeft, dragLineVisible, handleDragLineStart, handleDragLineStop, handleDragLine };
}
