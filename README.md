# Izumiya POS - iOS App

This is the iOS version of the Izumiya POS system, built using Capacitor to wrap the existing web application.

## Prerequisites

To build and run the iOS app, you need:

1. **macOS** (iOS development requires macOS)
2. **Xcode** (latest version recommended)
3. **Node.js** (version 16 or higher)
4. **CocoaPods** (for iOS dependencies)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install CocoaPods (if not already installed):
   ```bash
   sudo gem install cocoapods
   ```

## Building the iOS App

1. **Copy web assets to iOS project:**
   ```bash
   npm run build:ios
   ```

2. **Open in Xcode:**
   ```bash
   npm run open:ios
   ```

3. **Or run directly on simulator/device:**
   ```bash
   npm run run:ios
   ```

## Development Workflow

1. **Make changes to web files** in the `www/` directory
2. **Copy changes to iOS project:**
   ```bash
   npm run build:ios
   ```
3. **Test in Xcode** or run on device

## Project Structure

```
Izumiya/
├── www/                    # Web application files
│   ├── index.html         # Main HTML file
│   ├── main.js           # Main JavaScript
│   ├── menu.js           # Menu functionality
│   ├── capacitor-app.js  # Capacitor integration
│   └── ...               # Other JS files
├── ios/                   # iOS native project (generated)
├── capacitor.config.json  # Capacitor configuration
└── package.json          # Node.js dependencies
```

## Native Features

The app includes the following native iOS features:

- **Status Bar Integration** - Custom status bar styling
- **Splash Screen** - Custom launch screen
- **App State Management** - Handle background/foreground transitions
- **Local Storage** - Offline data persistence
- **Device Information** - Access to device capabilities

## Configuration

### Capacitor Config (`capacitor.config.json`)

- **App ID**: `com.izumiya.pos`
- **App Name**: `Izumiya POS`
- **Splash Screen**: 2-second duration, brown background
- **Status Bar**: Dark style, brown background

### iOS Specific Settings

- **Content Inset**: Always enabled for safe areas
- **Orientation**: Portrait only (configured in Xcode)
- **Permissions**: Camera, microphone (if needed)

## Troubleshooting

### Common Issues

1. **CocoaPods not installed:**
   ```bash
   sudo gem install cocoapods
   cd ios/App && pod install
   ```

2. **Xcode build errors:**
   - Clean build folder in Xcode
   - Delete derived data
   - Re-run `npm run build:ios`

3. **Web assets not updating:**
   - Run `npm run build:ios` after changes
   - Check that files are in `www/` directory

### Development Tips

1. **Use Xcode for debugging** - Set breakpoints in web code
2. **Test on real device** - Simulator may not show all native features
3. **Check console logs** - Use Safari Web Inspector for web debugging

## Deployment

### App Store Submission

1. **Configure signing** in Xcode
2. **Set bundle identifier** to match your App Store Connect app
3. **Add app icons** and launch screens
4. **Archive and upload** through Xcode

### Enterprise Distribution

1. **Configure enterprise signing**
2. **Build archive** in Xcode
3. **Export for enterprise distribution**

## Firebase Integration

The app maintains full Firebase integration:

- **Firestore** - Real-time database
- **Authentication** - User management
- **Analytics** - Usage tracking
- **Offline Support** - Local data persistence

## Security Considerations

- **HTTPS Required** - All network requests use HTTPS
- **Local Storage** - Sensitive data stored securely
- **App Transport Security** - Configured for secure connections

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Capacitor documentation
3. Check Firebase console for backend issues 