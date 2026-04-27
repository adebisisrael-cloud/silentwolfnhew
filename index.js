// Inner Peace -- Silent Wolf.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startBot() {
    try {
        const wolfPath = path.join(__dirname, 'wolf.js');
        
        if (!fs.existsSync(wolfPath)) {
            console.error("❌ Error: wolf.js not found!");
            process.exit(1);
        }

        let botSource = fs.readFileSync(wolfPath, 'utf8');
        
        // This handles the obfuscated require logic inside wolf.js
        botSource = botSource.replace(
            /createRequire\(\[([^\]]+)\]/g,
            'createRequire(import.meta.url)'
        );

        // This fixes the "require of ES Module node:url" error specifically
        botSource = botSource.replace(/require\(['"]node:url['"]\)/g, '(await import("node:url")).default || await import("node:url")');
        botSource = botSource.replace(/require\(['"]url['"]\)/g, '(await import("url")).default || await import("url")');

        const tmpBot = path.join(__dirname, '.bot_run.mjs');
        fs.writeFileSync(tmpBot, botSource);

        console.log("🐺 WOLFBOT: Running patched source...");
        
        // The timestamp prevents Node from loading a cached/broken version
        await import(`./.bot_run.mjs?v=${Date.now()}`);
        
    } catch (error) {
        console.error("⚠️ Startup Error:", error);
        // If it still fails, it might be a dependency version issue in package.json
    }
}

startBot();
