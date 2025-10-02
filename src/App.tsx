import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlatformLayout } from './components/PlatformLayout';
import { HomePage } from './pages/HomePage';
import { Utdelningsplaneraren } from './pages/Utdelningsplaneraren';
import { LonEfterSkatt } from './pages/LonEfterSkatt';
import { Tjanstepension } from './pages/Tjanstepension';

function App() {
  return (
    <BrowserRouter>
      <PlatformLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lon-efter-skatt" element={<LonEfterSkatt />} />
          <Route path="/utdelningsplaneraren" element={<Utdelningsplaneraren />} />
          <Route path="/tjanstepension" element={<Tjanstepension />} />
        </Routes>
      </PlatformLayout>
    </BrowserRouter>
  );
}

export default App;
