import { Routes, Route } from 'react-router-dom';
import { Homepage } from './pages/Homepage';
import { BriefingCanvas } from './components/BriefingCanvas';

function App() {
  return (
    <div className="min-h-screen bg-background text-textPrimary relative overflow-hidden">
      {/* Subtle Premium Newsroom Lens Flare - Boosted Opacity */}
      <div 
        className="fixed top-[-30%] right-[-10%] w-[70vw] h-[70vw] pointer-events-none z-0 opacity-20"
        style={{ background: 'radial-gradient(circle at center, rgba(232, 55, 42, 0.4) 0%, transparent 70%)' }}
      />
      <div className="relative z-10 h-full">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/briefing/:topicId" element={<BriefingCanvas />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
