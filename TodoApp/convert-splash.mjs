import fs from 'fs';
import sharp from 'sharp';

async function convertSplashScreen() {
  try {
    const svgBuffer = fs.readFileSync('./assets/splash-screen.svg');
    
    // Create splash screen with higher resolution to ensure full coverage
    await sharp(svgBuffer)
      .resize(1500, 3000) // Increased size for better coverage
      .png()
      .toFile('./assets/splash-screen.png');
    console.log('Created splash-screen.png');
    
    console.log('Splash screen created successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

convertSplashScreen();