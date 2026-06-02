import { memo } from "react";
import { InfiniteCarousel } from "@/components/features/infinite-carousel";
import { type OpportunityCardData } from "@/lib/data";

interface CarouselSectionProps {
  distributedCarousel1: OpportunityCardData[];
  distributedCarousel2: OpportunityCardData[];
}

export const CarouselSection = memo(function CarouselSection({
  distributedCarousel1,
  distributedCarousel2,
}: CarouselSectionProps) {
  return (
    <div className="space-y-2 sm:space-y-4">
      <InfiniteCarousel
        opportunities={distributedCarousel1}
        direction="right"
        speed="slow"
        from="home"
      />
      <InfiniteCarousel
        opportunities={distributedCarousel2}
        direction="left"
        speed="slow"
        from="home"
      />
    </div>
  );
});
