const https = require('https');
const fs = require('fs');
const path = require('path');

// Directory where images will be saved
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'countries');

// Check if directory exists, if not create it
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

// List of countries with their Unsplash image URLs (royalty-free images)
const countries = [
  {
    slug: 'canada',
    name: 'Canada',
    url: 'https://images.unsplash.com/photo-1519832979-6fa011b87667?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'usa',
    name: 'United States',
    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'uk',
    name: 'United Kingdom',
    url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'ireland',
    name: 'Ireland',
    url: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'australia',
    name: 'Australia',
    url: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'new-zealand',
    name: 'New Zealand',
    url: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'default',
    name: 'Default',
    url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=1200&auto=format&fit=crop'
  }
];

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(OUTPUT_DIR, filename);
    
    console.log(`Downloading ${url} to ${fullPath}...`);
    
    const file = fs.createWriteStream(fullPath);
    
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusMessage}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename} successfully`);
        resolve();
      });
      
      file.on('error', err => {
        fs.unlink(fullPath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', err => {
      fs.unlink(fullPath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting download of country images...');
  
  for (const country of countries) {
    const filename = `${country.slug}.jpg`;
    
    try {
      await downloadImage(country.url, filename);
      console.log(`✅ ${country.name} image downloaded`);
    } catch (error) {
      console.error(`❌ Error downloading ${country.name} image:`, error.message);
    }
  }
  
  console.log('Done downloading country images!');
}

// Run the script
downloadAllImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 