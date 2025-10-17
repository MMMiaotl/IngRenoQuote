// Copy necessary files to dist directory before build
const fs = require('fs');
const path = require('path');

const filesToCopy = [
    { src: 'dist/start-mac.sh', dest: 'dist/start-mac.sh' },
    { src: 'dist/README-MAC.md', dest: 'dist/README-MAC.md' },
    { src: 'dist/使用说明.txt', dest: 'dist/使用说明.txt' },
    { src: 'dist/start.bat', dest: 'dist/start.bat' }
];

console.log('📋 Preparing dist directory...');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
    console.log('✅ Created dist directory');
}

// Ensure data directory exists in dist
if (!fs.existsSync('dist/data')) {
    fs.mkdirSync('dist/data', { recursive: true });
    console.log('✅ Created dist/data directory');
}

// Copy data files if they don't exist in dist
if (fs.existsSync('data/price_data.xlsx')) {
    fs.copyFileSync('data/price_data.xlsx', 'dist/data/price_data.xlsx');
    console.log('✅ Copied price_data.xlsx to dist/data');
}

// Ensure public directory exists in dist
if (!fs.existsSync('dist/public')) {
    fs.mkdirSync('dist/public', { recursive: true });
    console.log('✅ Created dist/public directory');
}

// Copy public files
if (fs.existsSync('public')) {
    const publicFiles = fs.readdirSync('public');
    publicFiles.forEach(file => {
        const srcPath = path.join('public', file);
        const destPath = path.join('dist', 'public', file);
        if (fs.statSync(srcPath).isFile()) {
            fs.copyFileSync(srcPath, destPath);
        }
    });
    console.log('✅ Copied public files to dist/public');
}

console.log('✅ Dist directory prepared successfully');

