
export const APP_CONFIG = {
  name: "A Lifter's Dream",
  donateUrl: "https://gofund.me/c3c39102",
  defaultSettings: {
    isDarkMode: false,
    isKg: true
  }
} as const;

export const TAB_COLORS = {
  supplements: 'text-purple-400',
  calculator: 'text-blue-400',
  timer: 'text-green-400',
  platecalculator: 'text-orange-400',
  unitconverter: 'text-cyan-400'
} as const;

export const TAB_THEMES = {
  supplements: { active: 'bg-purple-600', text: 'text-white' },
  calculator: { active: 'bg-blue-600', text: 'text-white' },
  timer: { active: 'bg-green-600', text: 'text-white' },
  platecalculator: { active: 'bg-orange-600', text: 'text-white' },
  unitconverter: { active: 'bg-cyan-600', text: 'text-white' }
} as const;
