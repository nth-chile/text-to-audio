import fs from 'fs';
import path from 'path';

// Split text into chunks of maximum size. OAI has a limit of 4096 characters
const splitTextIntoChunks = (text: string, maxChunkSize: number = 4000): string[] => {
    const chunks: string[] = [];
    // Split by sentences to avoid cutting in the middle of a sentence
    const sentences = text.split(/(?<=[.!?])\s+/);
    let currentChunk = '';

    for (const sentence of sentences) {
        // If adding this sentence would exceed the chunk size, save current chunk and start a new one
        if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk);
            currentChunk = sentence;
        } else {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
    }

    // Add the last chunk if it's not empty
    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
};

// Get list of text files in the 'text' directory, sorted alphabetically
const files = fs.readdirSync('./text')
    .filter(file => fs.statSync(path.join('./text', file)).isFile())
    .sort();

// Create the 'chunkedText' directory if it doesn't exist
if (!fs.existsSync('./chunkedText')) {
    fs.mkdirSync('./chunkedText');
}

let chunkCounter = 1;

// Put all the text in the 'text' directory into chunks and save them in the 'chunkedText' directory
for (const file of files) {
    console.log('Chunking:', file);
    const content = fs.readFileSync(path.join('./text', file), 'utf-8');
    const chunks = splitTextIntoChunks(content)
    for (const chunk of chunks) {
        const filename = path.join('./chunkedText', chunkCounter.toString().padStart(4, '0') + '.txt');
        fs.writeFileSync(filename, chunk, 'utf-8');
        chunkCounter++;
    }
}
