import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ottsaver.app',
  appName: 'ottsaver',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0, // Show for 2 seconds
      launchAutoHide: false, // Hide automatically
      backgroundColor: '#ffffff', // Match your white theme
      androidScaleType: 'CENTER_CROP',
      showSpinner: false, // Keep it clean
    },
    Keyboard: {
      resize: 'none', // This prevents the 'jumping' screen
    }
  },
};

export default config;
