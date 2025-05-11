import fs from 'fs';
import sharp from 'sharp';

async function convertSplashScreen() {
  try {
    const svgBuffer = fs.readFileSync('./assets/splash-screen.svg');
    
    // Create splash screen
    await sharp(svgBuffer)
      .resize(1242, 2436)
      .png()
      .toFile('./assets/splash-screen.png');
    console.log('Created splash-screen.png');
    
    console.log('Splash screen created successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

convertSplashScreen();