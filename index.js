// Inner Peace -- Silent Wolf.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startBot() {
    try {
        const wolfPath = path.join(__dirname, 'wolf.js');
        
        if (!fs.existsSync(wolfPath)) {
            console.error("❌ Error: wolf.js not found!");
            process.exit(1);
        }

        const botSource = fs.readFileSync(wolfPath, 'utf8');
        
        // Patching the source to handle require context in ESM
        const patchedSource = botSource.replace(
            /createRequire\(\[([^\]]+)\]/g,
            'createRequire(import.meta.url'
        );

        // Using a .mjs extension ensures Node treats the temp file as a module
        const tmpBot = path.join(__dirname, '.bot_run.mjs');
        fs.writeFileSync(tmpBot, patchedSource);

        console.log("🐺 WOLFBOT: Patching source and starting...");
        
        await import(`./.bot_run.mjs?update=${Date.now()}`);
        
    } catch (error) {
        console.error("⚠️ Startup Error:", error);
    }
}

startBot();
