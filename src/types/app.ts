
export type TabType = 'supplements' | 'calculator' | 'timer' | 'platecalculator' | 'unitconverter';

export interface AppSettings {
  isDarkMode: boolean;
  isKg: boolean;
  setIsDarkMode: (value: boolean) => void;
  setIsKg: (value: boolean) => void;
}
