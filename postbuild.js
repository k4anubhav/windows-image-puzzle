const obfuscator = require('javascript-obfuscator');

const fs = require('fs');
const manifest = require('./build/asset-manifest.json');

let file_path = './build/' + manifest['files']['main.js'];

// list files in build folder
fs.readdirSync('./build/static/js').forEach(file => {
    console.log(file);
});



const obfuscationResult = obfuscator.obfuscate(
    fs.readFileSync
    (
        file_path,
        'utf8'
    ),
);

fs.writeFileSync(file_path, obfuscationResult.getObfuscatedCode());
