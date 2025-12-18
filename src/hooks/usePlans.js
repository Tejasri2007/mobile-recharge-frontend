import { useState, useEffect, useCallback } from 'react';

const usePlans = (autoRefreshInterval = 30000) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://mobile-recharge-backend-9hk1.onrender.com/');
      const data = await response.json();
      
      if (data.success && data.plans) {
        setPlans(data.plans);
      } else {
        setPlans([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError(err.message);
      setPlans([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlans();
    
    // Auto-refresh plans at specified interval
    const interval = setInterval(fetchPlans, autoRefreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchPlans, autoRefreshInterval]);

  // Listen for storage events to detect admin plan changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'plansUpdated') {
        fetchPlans();
        localStorage.removeItem('plansUpdated');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchPlans]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      fetchPlans();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchPlans]);

  return {
    plans,
    loading,
    error,
    refetch: fetchPlans
  };
};

export default usePlans;
