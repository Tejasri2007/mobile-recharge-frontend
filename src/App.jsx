import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RechargePlans from './pages/RechargePlans';
import Recharge from './pages/Recharge';
import RechargeSuccess from './pages/RechargeSuccess';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/plans" element={<RechargePlans />} />
                <Route path="/recharge" element={<Recharge />} />
                <Route path="/recharge-success" element={<RechargeSuccess />} />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />

                <Route path="/admin-dashboard" element={<AdminDashboard />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;