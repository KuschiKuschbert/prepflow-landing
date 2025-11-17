import { useState, useEffect, useRef } from 'react';

interface DrawerState {
  dragY: number;
  isDragging: boolean;
  startY: number;
  lastY: number;
  lastTime: number;
  velocity: number;
  canDrag: boolean;
  isAtTop: boolean;
  upwardMovement: number;
  dragProgress: number;
  maxUpwardMovementRef: React.MutableRefObject<number | null>;
}

export function useDrawerState(
  isOpen: boolean,
  contentRef: React.RefObject<HTMLDivElement | null>,
) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [canDrag, setCanDrag] = useState(false);
  const maxUpwardMovementRef = useRef(0);
  const [isAtTop, setIsAtTop] = useState(false);
  const [upwardMovement, setUpwardMovement] = useState(0);
  const [dragProgress, setDragProgress] = useState(0);
  useEffect(() => {
    if (!isOpen) {
      setDragY(0);
      setIsDragging(false);
      setVelocity(0);
      setCanDrag(false);
      maxUpwardMovementRef.current = 0;
      setIsAtTop(false);
      setUpwardMovement(0);
      setDragProgress(0);
    } else if (contentRef.current) setIsAtTop(contentRef.current.scrollTop <= 5);
  }, [isOpen, contentRef]);
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    const handleScroll = () => {
      if (contentRef.current) setIsAtTop(contentRef.current.scrollTop <= 5);
    };
    const content = contentRef.current;
    content.addEventListener('scroll', handleScroll, { passive: true });
    return () => content.removeEventListener('scroll', handleScroll);
  }, [isOpen, contentRef]);
  return {
    dragY,
    setDragY,
    isDragging,
    setIsDragging,
    startY,
    setStartY,
    lastY,
    setLastY,
    lastTime,
    setLastTime,
    velocity,
    setVelocity,
    canDrag,
    setCanDrag,
    isAtTop,
    setIsAtTop,
    upwardMovement,
    setUpwardMovement,
    dragProgress,
    setDragProgress,
    maxUpwardMovementRef,
  };
}
