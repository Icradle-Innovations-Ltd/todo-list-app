const fs = require('fs');
const sharp = require('sharp');

async function convertIcons() {
  try {
    const svgBuffer = fs.readFileSync('./assets/icon.svg');
    
    // Create main icon
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile('./assets/icon.png');
    console.log('Created icon.png');
    
    // Create adaptive icon
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile('./assets/adaptive-icon.png');
    console.log('Created adaptive-icon.png');
    
    // Create splash icon
    await sharp(svgBuffer)
      .resize(1242, 1242)
      .png()
      .toFile('./assets/splash-icon.png');
    console.log('Created splash-icon.png');
    
    // Create favicon
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile('./assets/favicon.png');
    console.log('Created favicon.png');
    
    console.log('All icons created successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

convertIcons();