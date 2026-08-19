import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const zipPath = path.join(rootDir, 's1ck-shopify-theme.zip');

const script = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('${zipPath.replace(/\\/g, '\\\\')}')
$zip.Entries | Select-Object -First 25 | ForEach-Object { $_.FullName }
$zip.Dispose()
`;

const res = execSync(`powershell -Command "${script.replace(/\n/g, '; ')}"`).toString();
console.log('Zip file entries:');
console.log(res);
