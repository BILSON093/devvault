import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import MainLayout from '@/components/Layout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Resources from '@/pages/Resources';
import AddResource from '@/pages/AddResource';
import Collections from '@/pages/Collections';
import CollectionDetail from '@/pages/CollectionDetail';
import LearningPaths from '@/pages/LearningPaths';
import PathDetail from '@/pages/PathDetail';
import Explore from '@/pages/Explore';
import Search from '@/pages/Search';
import Notifications from '@/pages/Notifications';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter basename="/devvault">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="resources" element={<Resources />} />
          <Route path="resources/add" element={<AddResource />} />
          <Route path="collections" element={<Collections />} />
          <Route path="collections/:id" element={<CollectionDetail />} />
          <Route path="paths" element={<LearningPaths />} />
          <Route path="paths/:id" element={<PathDetail />} />
          <Route path="explore" element={<Explore />} />
          <Route path="search" element={<Search />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
