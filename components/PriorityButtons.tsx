import { Circle } from 'lucide-react';

type Priority = 'red' | 'orange' | 'blue' | 'green';

interface PriorityButtonsProps {
  selectedPriority: Priority | null;
  onSelect: (priority: Priority | null) => void;
}

export default function PriorityButtons({ selectedPriority, onSelect }: PriorityButtonsProps) {
  const priorities: Priority[] = ['red', 'orange', 'blue', 'green'];
  
  return (
    <div className="flex flex-col gap-2">
      {priorities.map((priority) => (
        <button
          key={priority}
          onClick={() => onSelect(selectedPriority === priority ? null : priority)}
          className={`p-2 rounded ${
            selectedPriority === priority ? 'bg-gray-700' : 'hover:bg-gray-800'
          }`}
        >
          <Circle
            className={`h-4 w-4 text-${priority}-500`}
            fill={selectedPriority === priority ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );
}