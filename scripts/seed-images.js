#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Create uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create sample images (1x1 pixel PNGs with different colors)
const sampleImages = [
  {
    name: 'house-1.png',
    description: 'Sample house listing image',
    data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI/kxRc/wAAAABJRU5ErkJggg=='
  },
  {
    name: 'house-2.png', 
    description: 'Another sample house image',
    data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+A/EHwAChAI/kxRc/wAAAABJRU5ErkJggg=='
  },
  {
    name: 'house-3.png',
    description: 'Third sample house image',
    data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/x+IQAABZAI9lhqm+gAAAABJRU5ErkJggg=='
  }
];

// Create sample images
sampleImages.forEach((image, index) => {
  const imagePath = path.join(uploadsDir, image.name);
  if (!fs.existsSync(imagePath)) {
    const buffer = Buffer.from(image.data, 'base64');
    fs.writeFileSync(imagePath, buffer);
    console.log(`✓ Created sample image: ${image.name}`);
  }
});

// Create README for uploads directory
const readmePath = path.join(uploadsDir, 'README.md');
const readmeContent = `# Image Uploads

This directory contains uploaded images for the Modulist application.

## Development
- Sample images are automatically created by running \`pnpm seed:images\`
- Images are served statically at \`/uploads/*\` by the backend
- This directory is git-ignored for security and storage reasons

## Production Considerations
For production deployment, consider using:
- AWS S3 or similar object storage
- CDN for image delivery
- Image compression and optimization
- Proper file validation and security measures
`;

if (!fs.existsSync(readmePath)) {
  fs.writeFileSync(readmePath, readmeContent);
  console.log('✓ Created uploads README');
}

console.log(`\n✅ Image seeding complete!`);
console.log(`   Uploads directory: ${uploadsDir}`);
console.log(`   Sample images: ${sampleImages.length}`);
