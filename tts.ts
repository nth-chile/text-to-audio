import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

const START_FILE = 'chunkedText/0085.txt'; // First file to process
const FILES_TO_PROCESS = 50;

// OAI options
const VOICE = 'ash';
const MODEL = 'tts-1'; // balance quality and cost
const INSTRUCTIONS = ''; // Instructions don't work for tts-1 or tts-1-hd

// Initialize openai w/ your API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// OAI a chunk, returning path to the saved audio file
const ttsIt = async (
    text: string,
    chunkNumber: number,
): Promise<string> => {
    try {
        console.log(`TTSing chunk ${chunkNumber}...`);

        const response = await openai.audio.speech.create({
            model: MODEL,
            voice: VOICE,
            input: text,
            response_format: 'mp3',
            instructions: INSTRUCTIONS,
        });

        const outputPath = path.join(process.cwd(), "audioChunks", `${chunkNumber.toString().padStart(4, '0')}.mp3`);
        const buffer = Buffer.from(await response.arrayBuffer());
        fs.writeFileSync(outputPath, buffer);

        console.log(`Chunk ${chunkNumber} done`);
        return outputPath;
    } catch (error) {
        console.error(`Error TTSing chunk ${chunkNumber}:`, error);
        throw error;
    }
};

// Ensure output directory exists
if (!fs.existsSync("audioChunks")) {
    fs.mkdirSync("audioChunks");
}

(async function (): Promise<void> {
    try {
        // Get and sort files from chunkedText
        const allFiles = fs.readdirSync('chunkedText')
            .sort();

        // Find start index
        const startIndex = allFiles.indexOf(path.basename(START_FILE));
        if (startIndex === -1) throw new Error(`START_FILE ${START_FILE} not found`);

        // Get the slice to process
        const filesToProcess = allFiles.slice(startIndex, startIndex + FILES_TO_PROCESS);

        for (let i = 0; i < filesToProcess.length; i++) {
            const filePath = path.join('chunkedText', filesToProcess[i]);
            const text = fs.readFileSync(filePath, 'utf-8');
            await ttsIt(text, startIndex + 1 + i);
        }

        console.log('Processing complete!');
    } catch (error) {
        console.error('Error:', error);
    }
})();
