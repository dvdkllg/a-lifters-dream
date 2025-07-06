
export function getPlateColor(weight: number, isKgSystem: boolean): string {
  if (isKgSystem) {
    switch (weight) {
      case 25: return 'bg-red-500';
      case 20: return 'bg-blue-500';
      case 15: return 'bg-yellow-500';
      case 10: return 'bg-green-500';
      case 5: return 'bg-gray-100 border-2 border-gray-400';
      case 2.5: return 'bg-black';
      case 1.25: return 'bg-gray-300';
      default: return 'bg-gray-100 border-2 border-gray-400';
    }
  } else {
    switch (weight) {
      case 55: return 'bg-red-500';
      case 45: return 'bg-blue-500';
      case 35: return 'bg-yellow-500';
      case 25: return 'bg-green-500';
      case 10: return 'bg-gray-100 border-2 border-gray-400';
      case 5: return 'bg-gray-100 border-2 border-gray-400';
      case 2.5: return 'bg-black';
      default: return 'bg-gray-100 border-2 border-gray-400';
    }
  }
}
