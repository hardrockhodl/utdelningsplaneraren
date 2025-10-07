import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlatformLayout } from './components/PlatformLayout';
import { HomePage } from './pages/HomePage';
import { Utdelningsplaneraren } from './pages/Utdelningsplaneraren';
import { LonEfterSkatt } from './pages/LonEfterSkatt';
import { Tjanstepension } from './pages/Tjanstepension';
import { K10Blankett } from './pages/K10Blankett';
import { FaktureraRattTimpris } from './pages/FaktureraRattTimpris';
import { FormansbilCalculator } from './pages/FormansbilCalculator';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <PlatformLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lon-efter-skatt" element={<LonEfterSkatt />} />
          <Route path="/utdelningsplaneraren" element={<Utdelningsplaneraren />} />
          <Route path="/tjanstepension" element={<Tjanstepension />} />
          <Route path="/k10-blankett" element={<K10Blankett />} />
          <Route path="/fakturera-ratt-timpris" element={<FaktureraRattTimpris />} />
          <Route path="/formansbil" element={<FormansbilCalculator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PlatformLayout>
    </BrowserRouter>
  );
}

export default App;
