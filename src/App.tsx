import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlatformLayout } from './components/PlatformLayout';
import { HomePage } from './pages/HomePage';
import { Utdelningsplaneraren } from './pages/Utdelningsplaneraren';

function App() {
  return (
    <BrowserRouter>
      <PlatformLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/utdelningsplaneraren" element={<Utdelningsplaneraren />} />
        </Routes>
      </PlatformLayout>
    </BrowserRouter>
  );
}

export default App;
