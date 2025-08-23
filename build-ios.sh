#!/bin/bash

# Izumiya POS iOS Build Script

echo "🚀 Building Izumiya POS for iOS..."

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Error: iOS development requires macOS"
    exit 1
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "⚠️  Warning: Xcode not found. Install Xcode from the App Store."
    echo "   You can still build the project, but won't be able to run it."
fi

# Check if CocoaPods is installed
if ! command -v pod &> /dev/null; then
    echo "⚠️  Warning: CocoaPods not found. Install with: sudo gem install cocoapods"
    echo "   This is required for iOS dependencies."
fi

# Install npm dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
fi

# Copy web assets to iOS project
echo "📱 Copying web assets to iOS project..."
npm run build:ios

# Check if iOS project exists
if [ -d "ios" ]; then
    echo "✅ iOS project created successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Install Xcode from the App Store"
    echo "2. Install CocoaPods: sudo gem install cocoapods"
    echo "3. Open the project: npm run open:ios"
    echo "4. Or run on simulator: npm run run:ios"
    echo ""
    echo "📁 Project structure:"
    echo "   - Web files: www/"
    echo "   - iOS project: ios/"
    echo "   - Configuration: capacitor.config.json"
else
    echo "❌ Error: iOS project not created"
    exit 1
fi

echo "�� Build complete!" 