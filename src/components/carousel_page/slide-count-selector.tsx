import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface SlideCountSelectorProps {
  numberOfSlides: number;
  onSlideCountChange: (count: number) => void;
}

export function SlideCountSelector({ numberOfSlides, onSlideCountChange }: SlideCountSelectorProps) {
  return (
    <div className="w-full p-3 bg-glass/50 rounded-lg border border-white/10">
      <div className="space-y-3">
        <Label className="text-gray-200 text-sm font-medium">
          Number of Slides: <span className="font-bold text-blue-400">{numberOfSlides}</span>
        </Label>
        <Slider
          min={2}
          max={10}
          step={1}
          value={[numberOfSlides]}
          onValueChange={(value) => onSlideCountChange(value[0])}
          className="w-full"
        />
      </div>
    </div>
  );
} 