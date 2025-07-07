
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5e4c0439ba494f199b083a0c7e192d1a',
  appName: 'a-lifters-dream',
  webDir: 'dist',
  server: {
    url: 'https://5e4c0439-ba49-4f19-9b08-3a0c7e192d1a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#FF4D6D",
      sound: "beep.wav",
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2D3748",
      showSpinner: false,
    },
  },
};

export default config;
