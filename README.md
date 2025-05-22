# Text to audio

Broken into separate steps for no good reason

## Installation / requirements
- `npm i`
- Make sure you have `ffmpeg` available in `PATH`

## 0. Prepare text files
When I did this from a PDF book scan, I converted PDF to PNGs with poppler's `pdftoppm` utility, and converted the images to text with `tesseract`. I think there are a lot of similar tools for this. If you have one text file, put it in `./text`. If you have a bunch, like chapters of a book, put them all in `./text` and they'll be processed in alphabetical order.

## 1. Chunk text

OpenAI has a character limit for input of 4096. So run:
```sh
npx ts-node chunkText.ts
``` 
That will create `./chunkedText/0001.txt`, `./chunkedText/0002.txt` ...

## 2. Text chunks to audio chunks

Open `tts.ts` and read the all-caps config variables at the top. Most importantly `START_FILE` and `FILES_TO_PROCESS`.

```sh
OPENAI_API_KEY="your_api_key_here" npx ts-node tts.js
```

That should create `./audioChunks/0001.mp3`, `./audioChunks/0002.mp3` ...

## 3. Combine audio chunks

Combines everything in `./audioChunks/` and saves to `./result.mp3`:

```sh
npx ts-node combineAudioChunks.ts
```