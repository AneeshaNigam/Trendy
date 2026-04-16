import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Trends from './pages/Trends';
import TrendDetail from './pages/TrendDetail';
import Opportunities from './pages/Opportunities';
import Insights from './pages/Insights';
import Pricing from './pages/Pricing';

function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#0f1115] font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <div className="flex pt-16 flex-1">
        {!isHomePage && (
          <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        )}

        <main className={`flex-1 ${!isHomePage ? (isSidebarCollapsed ? 'ml-20 p-8' : 'ml-64 p-8') : ''} overflow-y-auto transition-all duration-300`}>
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/trends"        element={<Trends />} />
            <Route path="/trends/:id"    element={<TrendDetail />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/insights"      element={<Insights />} />
            <Route path="/pricing"       element={<Pricing />} />
            <Route path="*"              element={<Home />} />
          </Routes>
        </main>
      </div>

      <div className={!isHomePage ? (isSidebarCollapsed ? 'ml-20 transition-all duration-300' : 'ml-64 transition-all duration-300') : ''}>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
