import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Square, RectangleHorizontal, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

type AspectRatio = '1:1' | '4:5' | '9:16';

interface AspectRatioGroupProps {
  selectedRatio: AspectRatio;
  onRatioSelect: (ratio: AspectRatio) => void;
}

const ratioOptions: { value: AspectRatio; label: string; icon: React.ElementType }[] = [
  { value: '1:1', label: 'Square (1:1)', icon: Square },
  { value: '4:5', label: 'Portrait (4:5)', icon: RectangleHorizontal },
  { value: '9:16', label: 'Reels (9:16)', icon: Smartphone },
];

export function AspectRatioGroup({ selectedRatio, onRatioSelect }: AspectRatioGroupProps) {
  return (
    <div>
      <Label className="mb-2 block text-gray-200">Aspect Ratio</Label>
      <RadioGroup
        value={selectedRatio}
        onValueChange={(value) => onRatioSelect(value as AspectRatio)}
        className="grid grid-cols-2 sm:grid-cols-3 gap-2"
      >
        {ratioOptions.map((option) => (
          <Label
            key={option.value}
            htmlFor={`ratio-${option.value}`}
            className={cn(
              "flex flex-col items-center justify-center rounded-md border-2 bg-white/5 p-4 hover:bg-white/10 cursor-pointer transition-all",
              selectedRatio === option.value 
                ? "border-blue-400 bg-blue-500/20 text-blue-200" 
                : "border-white/20 text-gray-200 hover:text-white"
            )}
          >
            <RadioGroupItem value={option.value} id={`ratio-${option.value}`} className="sr-only" />
            <option.icon className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">{option.label}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
} 