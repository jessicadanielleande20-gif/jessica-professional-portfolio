# Jessica Danielle C. Ande — Professional Portfolio

## Stage 1
This version includes:
- Responsive professional portfolio
- Dark/light mode
- Mobile navigation
- Animated sections
- New profile photo included
- Pre-designed portfolio chatbot with prepared answers

## Run locally

1. Open this folder in VS Code.
2. Open a terminal in the project folder.
3. Run:

```bash
npm install
npm start
```

4. Open http://localhost:3000

## Important
Do NOT put a Groq API key inside `public/script.js`.
In Stage 2, the key will be stored in `.env` and used by the server.

## Profile photo
Your new profile photo is already placed at `public/assets/profile.jpg`.

## Next stage
Connect the chatbot to Groq through the Node.js backend, then deploy the project on Render.


## Projects
The portfolio includes four uploaded project PDFs:
- PCU Enrollment Form
- Loops & Iterations
- Birth Month Calendar
- Multiplication Table

Each project has an **Open PDF** button in the Projects section.


## Groq AI chatbot
The chatbot now sends questions to `/api/chat`. It can answer both portfolio questions and general questions when `GROQ_API_KEY` is configured. The API key stays on the Node.js server and is never placed in `public/script.js`.

### Connect Groq locally
1. Create a `.env` file in the project root (next to `server.js`).
2. Add:

```env
GROQ_API_KEY=your_real_groq_api_key_here
PORT=3000
```

3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

5. Open `http://localhost:3000` and test questions such as `What is HTML?`, `Explain JavaScript loops`, or `What is Jessica's IT experience?`.

Never upload `.env` to GitHub. It is already excluded by `.gitignore`.
