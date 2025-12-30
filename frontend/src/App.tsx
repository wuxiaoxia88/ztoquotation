import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QuoteList from './pages/Quote/List';
import QuoteDetail from './pages/Quote/Detail';
import MainLayout from './components/Layout/MainLayout';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* 受保护的路由 */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <MainLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="quotes" element={<QuoteList />} />
          <Route path="quotes/:id" element={<QuoteDetail />} />
          {/* 更多路由将在后续添加 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
