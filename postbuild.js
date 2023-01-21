const obfuscator = require('javascript-obfuscator');

const fs = require('fs');
const manifest = require('./build/asset-manifest.json');

let file_path = './build/' + manifest['files']['main.js'];


const obfuscationResult = obfuscator.obfuscate(fs.readFileSync(file_path, 'utf8'), {
    forceTransformStrings: ['1234567890',],
    stringArrayEncoding: ['rc4'],
    debugProtection: true,
    disableConsoleOutput: true,
    controlFlowFlattening: true
});

fs.writeFileSync(file_path, obfuscationResult.getObfuscatedCode());
