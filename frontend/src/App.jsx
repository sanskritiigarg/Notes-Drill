import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
