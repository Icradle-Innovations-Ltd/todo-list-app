const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Check if sharp is installed
let sharpInstalled = false;
try {
  require.resolve('sharp');
  sharpInstalled = true;
} catch (e) {
  console.log('Installing sharp package...');
  exec('npm install sharp', (error) => {
    if (error) {
      console.error(`Error installing sharp: ${error}`);
      process.exit(1);
    }
    console.log('Sharp installed successfully. Please run this script again.');
    process.exit(0);
  });
}

// If sharp is not installed, exit early
if (!sharpInstalled) {
  return;
}

const sharp = require('sharp');

// Create the necessary directories
const directories = ['./assets'];
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Read the SVG file
const svgBuffer = fs.readFileSync('./assets/icon.svg');

// Convert SVG to PNG for different purposes
async function convertToPng() {
  try {
    // Main app icon (1024x1024)
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile('./assets/icon.png');
    console.log('Created icon.png');

    // Adaptive icon for Android (foreground)
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile('./assets/adaptive-icon.png');
    console.log('Created adaptive-icon.png');

    // Splash screen icon
    await sharp(svgBuffer)
      .resize(1242, 1242)
      .png()
      .toFile('./assets/splash-icon.png');
    console.log('Created splash-icon.png');

    // Favicon for web
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile('./assets/favicon.png');
    console.log('Created favicon.png');

    console.log('All icons created successfully!');
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
  }
}

convertToPng();