import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

// Convert exec to a promise-based function
const execPromise = promisify(exec);

// Combine multiple audio files into one using ffmpeg
(async (): Promise<void> => {
    try {
        console.log('Combining audio files...');

        const audioDir = path.join(process.cwd(), 'audioChunks');
        const filePaths = fs.readdirSync(audioDir)
            .filter(f => f.endsWith('.mp3'))
            .sort()
            .map(f => path.join(audioDir, f));

        const outputPath = path.join(process.cwd(), 'result.mp3');

        // Create a text file listing all the audio files to concatenate
        const fileList = filePaths.map(file => `file '${file}'`).join('\n');
        const listFilePath = path.join(process.cwd(), 'audio_files_list.txt');
        fs.writeFileSync(listFilePath, fileList);

        // Use ffmpeg to concatenate the files
        const cmd = `ffmpeg -f concat -safe 0 -i "${listFilePath}" -c copy "${outputPath}"`;
        await execPromise(cmd);

        console.log(`Combined audio saved to ${outputPath}`);

        // Clean up the list file
        fs.unlinkSync(listFilePath);
    } catch (error) {
        console.error('Error combining audio files:', error);
    }
})();
