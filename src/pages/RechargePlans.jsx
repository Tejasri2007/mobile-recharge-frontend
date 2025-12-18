import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import PlanCard from '../components/PlanCard';
import apiService from '../utils/api';

const RechargePlans = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('prepaid');
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://mobile-recharge-backend-9hk1.onrender.com');
      const data = await response.json();
      console.log('RechargePlans - API response:', data);
      
      if (data.success && data.plans) {
        setPlans(data.plans);
        console.log('RechargePlans - Plans loaded:', data.plans.length);
      } else {
        setPlans([]);
        console.log('RechargePlans - No plans found');
      }
      setError(null);
    } catch (err) {
      console.error('RechargePlans - Error:', err);
      setError(err.message);
      setPlans([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
    
    // Auto-refresh plans every 30 seconds to sync with admin changes
    const interval = setInterval(fetchPlans, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Add focus event listener to refresh plans when user returns to page
  useEffect(() => {
    const handleFocus = () => {
      fetchPlans();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Listen for storage events to detect admin plan changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'plansUpdated') {
        fetchPlans();
        localStorage.removeItem('plansUpdated'); // Clean up
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);



  // ---------------- Operator Logos ----------------
  const operators = [
    { id: 'all', name: 'All Operators', logo: '📱' },

    {
      id: 'airtel',
      name: 'Airtel',
      logo: (
        <svg width="28" height="28" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="#E4002B" />
          <text
            x="50"
            y="63"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="700"
            fontSize="50"
            fill="#ffffff"
          >
            a
          </text>
        </svg>
      )
    },

    { 
      id: 'jio', 
      name: 'Jio', 
      logo: (
        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          J
        </div>
      )
    },

    { 
      id: 'vi', 
      name: 'Vi', 
      logo: (
        <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
          VI
        </div>
      )
    },

    { 
      id: 'bsnl', 
      name: 'BSNL', 
      logo: (
        <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
          B
        </div>
      )
    }
  ];

  // ---------------- Filters ----------------
  const currentPlans = selectedCategory === 'prepaid'
    ? plans.filter(plan => plan.category === 'prepaid')
    : plans.filter(plan => plan.category === 'postpaid');

  const filteredPlans = currentPlans.filter(plan => {
    const matchesOperator = selectedOperator === 'all' || plan.operator === selectedOperator;
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.price.toString().includes(searchTerm);
    return matchesOperator && matchesSearch;
  });

  // ------------- Handle plan click: redirect to Recharge ----------------
  const handlePlanSelect = (plan) => {
    localStorage.setItem("selectedPlan", JSON.stringify(plan));
    navigate("/recharge");
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <section className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-5">Recharge Plans</h1>
          <p className="text-xl">Choose the best plan that suits your needs</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-wrap gap-6 items-center">

            {/* Category */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setSelectedCategory('prepaid')}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  selectedCategory === 'prepaid' ? 'bg-gray-700 text-white' : 'text-gray-600'
                }`}
              >
                Prepaid
              </button>

              <button
                onClick={() => setSelectedCategory('postpaid')}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  selectedCategory === 'postpaid' ? 'bg-gray-700 text-white' : 'text-gray-600'
                }`}
              >
                Postpaid
              </button>
            </div>

            {/* Operators */}
            <div className="flex flex-wrap gap-2">
              {operators.map(op => (
                <button
                  key={op.id}
                  onClick={() => setSelectedOperator(op.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    selectedOperator === op.id
                      ? 'bg-gray-700 text-white'
                      : 'bg-white border border-gray-300'
                  }`}
                >
                  {op.logo}
                  <span>{op.name}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search plans..."
              className="px-4 py-3 border rounded-lg w-full max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Available Plans ({filteredPlans.length})
          </h2>
          <button
            onClick={fetchPlans}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            <span className={loading ? 'animate-spin' : ''}>🔄</span>
            Refresh
          </button>
        </div>

        {/* Plans */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading plans...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <h3 className="text-xl font-bold">Error loading plans</h3>
            <p>{error}</p>
          </div>
        ) : filteredPlans.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlans.map(plan => (
              <PlanCard
                key={plan._id || plan.id}
                plan={plan}
                onSelect={handlePlanSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-700">
            <h3 className="text-xl font-bold">No Plans Found</h3>
            <button
              onClick={() => { setSelectedOperator('all'); setSearchTerm(''); }}
              className="mt-4 px-6 py-3 bg-gray-700 text-white rounded-lg"
            >
              Reset
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default RechargePlans;
