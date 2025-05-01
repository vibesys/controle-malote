
import { useRef, useState, useEffect } from 'react';

interface ScrollState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export function useHorizontalScroll(): ScrollState {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollContainer.scrollTo({ 
          left: scrollContainer.scrollWidth,
          behavior: 'smooth'
        });
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        event.preventDefault();
        scrollContainer.scrollLeft += event.deltaX || event.deltaY;
        checkScrollability();
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;
      
      setIsScrolling(true);
      setStartX(event.pageX);
      setScrollLeft(scrollContainer.scrollLeft);
      
      scrollContainer.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isScrolling) return;
      
      const dx = event.pageX - startX;
      scrollContainer.scrollLeft = scrollLeft - dx;
      checkScrollability();
    };

    const handleMouseUp = () => {
      if (!isScrolling) return;
      
      setIsScrolling(false);
      scrollContainer.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const handleMouseLeave = () => {
      if (isScrolling) {
        setIsScrolling(false);
        scrollContainer.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    checkScrollability();
    scrollContainer.addEventListener('scroll', checkScrollability);
    window.addEventListener('resize', checkScrollability);
    window.addEventListener('keydown', handleKeyDown);
    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    scrollContainer.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      scrollContainer.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
      window.removeEventListener('keydown', handleKeyDown);
      scrollContainer.removeEventListener('wheel', handleWheel);
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isScrolling, startX, scrollLeft]);

  return {
    canScrollLeft,
    canScrollRight,
    scrollContainerRef
  };
}
