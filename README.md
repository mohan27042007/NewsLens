# NewsLens 🚀

**NewsLens** is an AI-native News Intelligence Platform built for the ET AI Hackathon 2026. 

Traditional news platforms force you to read static articles. NewsLens shifts the unit of consumption from a single article to a dynamic, 30-day **Story Arc**. Powered by Gemini 2.5 Flash, it synthesizes raw news data into interactive, real-time intelligence briefings tailored to the user's specific persona context (e.g., Student vs. Investor).

---

## 🔥 Hero Features

1. **The Infinite Story Scrubber (D3.js)**
   A dynamic vertical timeline that tracks a topic across 30 days. Clicking "Play Arc" drops a 15-second scrubber line down the timeline, synchronously highlighting and pulsing correlated intelligence cards as time progresses.
2. **Live Persona Toggle (REST API)**
   A top-level navbar switch bridging the gap between general news and hyper-personalized insights. Switching to "Investor" forces the backend to cross-reference a custom stock watchlist (e.g. `HDFCBANK`, `TATAMOTORS`), instantly generating and rendering a brand new analytical card via Framer Motion without reloading the application.
3. **The Contrarian Radar**
   Instead of just summarizing the consensus, the AI actively hunts for dissenting opinions. The radar expands to display contrarian takes and citations directly mapped to the source, proving advanced comparative intelligence.
4. **Source-Grounded Q&A (WebSockets & NLP)**
   Chat directly with the Story Arc. The UI retains a sliding memory of your conversational history, making API calls blazingly fast while rendering verified source-grounded citations natively inside the chat bubbles to eliminate hallucination.

---

## 🛠️ Technology Stack

**Frontend (React/Vite)**
*   **Core:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS v4, Framer Motion
*   **State Management:** Zustand
*   **Animation & Viz:** D3.js, Lucide Icons

**Backend (Python/FastAPI)**
*   **Core:** FastAPI (Asynchronous Orchestration)
*   **Real-time Protocol:** WebSockets (Bi-directional streaming)
*   **AI Engine:** Google Gemini 2.5 Flash API

---

## 🚀 How to Run the Project Locally

Follow these steps exactly to run the platform on your own machine. 

### Prerequisites
*   Node.js (v18+)
*   Python (3.12+)
*   A valid **Google Gemini API Key**

### 1. Clone the Repository
```bash
git clone <your-repo-link>
cd NewsLens
```

### 2. Set Up the Backend Engine
The Python backend manages the WebSocket orchestrations and the Gemini LLM calls.

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment (Recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install the Python dependencies
pip install -r requirements.txt

# Configure your Environment Variables
```
**Important:** Rename `backend/.env.example` (or create a new `backend/.env` file) and add your actual API key:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

```bash
# Boot the FastAPI Server
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
*The backend should now be running cleanly on `http://localhost:8000`.*

### 3. Set Up the Frontend Interface
Leave the backend terminal running, and open a brand **new terminal tab**.

```bash
# Navigate to the frontend directory
cd frontend

# Install the Node dependencies
npm install

# Start the Vite Development Server
npm run dev
```

### 4. Enter the Matrix
Open your browser and navigate to the local Vite address (usually **`http://localhost:5173/`**). 
You will see the Landing Page. Search or click on a Dashboard Trending Topic (e.g., *Union Budget 2026*) to launch the real-time AI Briefing Canvas!

---

## 🏗️ Architecture Note
*This codebase utilizes a decoupled, socket-first architecture to create the illusion of seamless local UI updates while maintaining complex asynchronous data fetching on the server side.*
