import { Routes, Route } from 'react-router-dom';
import App from './pages/App';
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  );
}
