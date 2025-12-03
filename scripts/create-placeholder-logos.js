const fs = require('fs');
const { createCanvas } = require('canvas');

// University placeholders to create
const universities = [
  'default-university',
  'oxford',
  'ucl',
  'manchester',
  'kcl',
  'warwick',
  'glasgow',
  'bristol',
  'birmingham',
  'nottingham',
  'sheffield'
];

// Create directory if it doesn't exist
const logoDir = './public/logos';
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}

// Create a placeholder logo for each university
universities.forEach((uni) => {
  // Create a 300x300 canvas
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext('2d');

  // Fill background with light gray
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, 300, 300);

  // Draw a border
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 5;
  ctx.strokeRect(10, 10, 280, 280);

  // Add university name
  ctx.fillStyle = '#555555';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const name = uni === 'default-university' ? 'University' : uni.charAt(0).toUpperCase() + uni.slice(1);
  ctx.fillText(name, 150, 120);
  
  // Add "Logo Placeholder" text
  ctx.font = '18px Arial';
  ctx.fillText('Logo Placeholder', 150, 160);

  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`${logoDir}/${uni}-logo-placeholder.png`, buffer);
  console.log(`Created ${uni}-logo-placeholder.png`);
});

console.log('Placeholder logos created successfully!'); 