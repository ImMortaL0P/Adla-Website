const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputLogo = path.join(__dirname, '../../public/images/logo/adla-crest.png');
const publicDir = path.join(__dirname, '../../public');

async function processLogos() {
  try {
    const img = sharp(inputLogo);

    // apple-touch-icon.png (180x180)
    await img.clone().resize(180, 180).toFile(path.join(publicDir, 'apple-touch-icon.png'));

    // favicon-32.png (32x32)
    await img.clone().resize(32, 32).toFile(path.join(publicDir, 'favicon-32.png'));

    // favicon-512.png (512x512)
    await img.clone().resize(512, 512).toFile(path.join(publicDir, 'favicon-512.png'));

    // og-image.png (1200x630, fit inside)
    await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([{ input: await img.clone().resize(500, 500, { fit: 'inside' }).toBuffer() }])
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));

    console.log('Favicons and og-image regenerated successfully.');
  } catch (err) {
    console.error('Error generating favicons:', err);
  }
}

processLogos();
