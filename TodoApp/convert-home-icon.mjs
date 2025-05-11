import fs from 'fs';
import sharp from 'sharp';

async function convertHomeIcon() {
  try {
    const svgBuffer = fs.readFileSync('./assets/home-icon.svg');
    
    // Create main icon
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile('./assets/home-icon.png');
    console.log('Created home-icon.png');
    
    // Create Android adaptive icon foreground
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile('./assets/adaptive-home-icon.png');
    console.log('Created adaptive-home-icon.png');
    
    console.log('Home icons created successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

convertHomeIcon();