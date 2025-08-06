import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Square, RectangleVertical, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

type AspectRatio = '1:1' | '4:5' | '9:16';

interface AspectRatioGroupProps {
  selectedRatio: AspectRatio;
  onRatioSelect: (ratio: AspectRatio) => void;
}

const ratioOptions: { value: AspectRatio; label: string; icon: React.ElementType; name: string }[] = [
  { value: '4:5', label: '4:5', icon: RectangleVertical, name: 'Carousel' },
  { value: '1:1', label: '1:1', icon: Square, name: 'Square' },
  { value: '9:16', label: '9:16', icon: Smartphone, name: 'Reels' },
];

export function AspectRatioGroup({ selectedRatio, onRatioSelect }: AspectRatioGroupProps) {
  return (
    <div>
      <Label className="mb-3 block text-gray-200 text-sm font-medium">Format</Label>
      <RadioGroup
        value={selectedRatio}
        onValueChange={(value) => onRatioSelect(value as AspectRatio)}
        className="flex justify-center gap-4"
      >
        {ratioOptions.map((option) => (
          <Label
            key={option.value}
            htmlFor={`ratio-${option.value}`}
            className={cn(
              "relative flex flex-col items-center gap-3 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105",
              selectedRatio === option.value 
                ? "border-blue-400 bg-gradient-to-br from-blue-500/40 to-blue-600/30 text-white shadow-xl shadow-blue-500/30" 
                : "border-white/20 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/40"
            )}
          >
            <RadioGroupItem value={option.value} id={`ratio-${option.value}`} className="sr-only" />
            
            {/* Selection indicator */}
            {selectedRatio === option.value && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
            
            {/* Prominent icon */}
            <div className={cn(
              "p-3 rounded-lg transition-all",
              selectedRatio === option.value 
                ? "bg-white/25 ring-2 ring-white/30" 
                : "bg-white/10"
            )}>
              <option.icon className="h-8 w-8" />
            </div>
            
            {/* Clear information hierarchy */}
            <div className="text-center space-y-1">
              <div className="text-lg font-bold font-mono">{option.label}</div>
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">{option.name}</div>
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
} 