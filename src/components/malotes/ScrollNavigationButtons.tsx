
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ScrollNavigationButtonsProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

export function ScrollNavigationButtons({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight
}: ScrollNavigationButtonsProps) {
  return (
    <>
      <div className="absolute top-1/2 left-2 -translate-y-1/2 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          className={`rounded-full shadow-md bg-white h-8 w-8 ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onScrollLeft}
          disabled={!canScrollLeft}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Deslizar para esquerda</span>
        </Button>
      </div>
      <div className="absolute top-1/2 right-2 -translate-y-1/2 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          className={`rounded-full shadow-md bg-white h-8 w-8 ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onScrollRight}
          disabled={!canScrollRight}
        >
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Deslizar para direita</span>
        </Button>
      </div>
    </>
  );
}
