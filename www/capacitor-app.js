// Capacitor App Integration for Izumiya POS
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';

class CapacitorApp {
    constructor() {
        this.isNative = Capacitor.isNativePlatform();
        this.init();
    }

    async init() {
        if (this.isNative) {
            console.log('Running on native platform');
            await this.setupNativeFeatures();
        } else {
            console.log('Running on web platform');
        }
    }

            async setupNativeFeatures() {
            try {
                // Hide status bar completely and set full screen
                await StatusBar.hide();
                
                // Set status bar to overlay webview for full screen
                await StatusBar.setOverlaysWebView({ overlay: true });

            // Hide splash screen after app is ready
            setTimeout(async () => {
                await SplashScreen.hide();
            }, 2000);

            // Handle app state changes
            App.addListener('appStateChange', ({ isActive }) => {
                console.log('App state changed. Is active?', isActive);
                if (isActive) {
                    // App became active - could refresh data here
                    this.onAppResume();
                }
            });

            App.addListener('appUrlOpen', (data) => {
                console.log('App opened with URL:', data.url);
            });

            App.addListener('appRestoredResult', (data) => {
                console.log('Restored result:', data);
            });

            // Get device info
            const deviceInfo = await Device.getInfo();
            console.log('Device info:', deviceInfo);

            // Set up preferences for offline data
            await this.setupPreferences();

        } catch (error) {
            console.error('Error setting up native features:', error);
        }
    }

    async setupPreferences() {
        try {
            // Initialize default preferences
            const defaults = {
                'app_version': '1.0.0',
                'last_sync': new Date().toISOString(),
                'offline_mode': false
            };

            for (const [key, value] of Object.entries(defaults)) {
                await Preferences.set({ key, value: JSON.stringify(value) });
            }
        } catch (error) {
            console.error('Error setting up preferences:', error);
        }
    }

    async onAppResume() {
        // Called when app becomes active
        console.log('App resumed');
        
        // Check Firebase connection
        if (window.ensureFirestoreConnection) {
            const isConnected = await window.ensureFirestoreConnection();
            console.log('Firebase connection status:', isConnected);
        }
    }

    // Utility methods for native features
    async saveToPreferences(key, value) {
        try {
            await Preferences.set({ key, value: JSON.stringify(value) });
            return true;
        } catch (error) {
            console.error('Error saving to preferences:', error);
            return false;
        }
    }

    async getFromPreferences(key) {
        try {
            const result = await Preferences.get({ key });
            return result.value ? JSON.parse(result.value) : null;
        } catch (error) {
            console.error('Error getting from preferences:', error);
            return null;
        }
    }

    async removeFromPreferences(key) {
        try {
            await Preferences.remove({ key });
            return true;
        } catch (error) {
            console.error('Error removing from preferences:', error);
            return false;
        }
    }

    // Check if running on iOS
    isIOS() {
        return Capacitor.getPlatform() === 'ios';
    }

    // Check if running on Android
    isAndroid() {
        return Capacitor.getPlatform() === 'android';
    }

    // Get platform info
    getPlatform() {
        return Capacitor.getPlatform();
    }
}

// Initialize Capacitor app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.capacitorApp = new CapacitorApp();
});

// Export for use in other modules
export default CapacitorApp; 