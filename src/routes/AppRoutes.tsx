import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/dashboard/Dashboard';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/" element={<Dashboard />} />
    </Routes>
  );
}
