import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../utils/api';

const Recharge = () => {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    operator: '',
    circle: '',
    selectedPlan: null
  });

  const [availablePlans, setAvailablePlans] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Load selected plan from RechargePlans.jsx
  useEffect(() => {
    const savedPlan = localStorage.getItem('selectedPlan');
    if (savedPlan) {
      const plan = JSON.parse(savedPlan);
      setFormData(prev => ({ ...prev, selectedPlan: plan }));
      localStorage.removeItem('selectedPlan');
    }
  }, []);

  // Basic operator list
  const operators = [
    { id: 'airtel', name: 'Airtel', icon: '🔴' },
    { id: 'jio', name: 'Jio', icon: '🔵' },
    { id: 'vi', name: 'Vi', icon: '🟡' },
    { id: 'bsnl', name: 'BSNL', icon: '🟢' }
  ];

  const fetchPlansByOperator = async (operator) => {
    try {
      const plans = await apiService.getPlans(operator);
      setAvailablePlans(plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setAvailablePlans([]);
    }
  };

  const offers = [
    { id: 1, code: 'FIRST10', discount: 10, minAmount: 100 },
    { id: 2, code: 'SAVE20', discount: 20, minAmount: 300 },
    { id: 3, code: 'CASHBACK50', discount: 50, minAmount: 500 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'operator') {
      // Load plans from API based on operator
      fetchPlansByOperator(value);
      setDiscounts(offers);
    }
  };

  const handleRecharge = async () => {
    if (!isLoggedIn) {
      navigate('/signup');
      return;
    }

    if (!formData.mobileNumber || !formData.operator || !formData.selectedPlan) {
      alert("Please fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Calculate final amount with discount if applicable
      const originalAmount = formData.selectedPlan.price;
      let finalAmount = originalAmount;
      let discountApplied = 0;
      let discountCode = null;
      
      if (selectedDiscount && originalAmount >= selectedDiscount.minAmount) {
        discountApplied = selectedDiscount.discount;
        finalAmount = originalAmount - discountApplied;
        discountCode = selectedDiscount.code;
      }

      // Prepare recharge data
      const rechargeData = {
        phoneNumber: formData.mobileNumber,
        operator: formData.operator,
        plan: formData.selectedPlan._id || formData.selectedPlan.id,
        amount: finalAmount,
        originalAmount: originalAmount,
        discountApplied: discountApplied,
        discountCode: discountCode
      };

      console.log('Recharge data:', JSON.stringify(rechargeData, null, 2));

      // Send to MongoDB backend
      const response = await apiService.createRecharge(rechargeData);
      console.log('Recharge response:', JSON.stringify(response, null, 2));
      
      if (response && response.success) {
        // Save successful recharge data for success page
        localStorage.setItem('rechargeData', JSON.stringify({
          phoneNumber: rechargeData.phoneNumber,
          operator: rechargeData.operator,
          amount: rechargeData.amount,
          plan: formData.selectedPlan,
          transactionId: response.recharge?.transactionId || 'TXN' + Date.now(),
          timestamp: response.recharge?.createdAt || new Date().toISOString()
        }));
        
        navigate("/recharge-success");
      } else {
        console.error('Recharge failed - Full response:', JSON.stringify(response, null, 2));
        alert(`Recharge failed: ${response?.message || response?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Recharge error:', error);
      alert(`Recharge failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-xl mx-auto px-4">

        <h1 className="text-4xl font-bold text-center mb-6">Mobile Recharge</h1>

        {/* Mobile Number */}
        <input
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleInputChange}
          className="w-full border p-3 rounded mb-6"
          placeholder="Enter mobile number"
        />

        {/* Operator */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {operators.map(op => (
            <button
              key={op.id}
              onClick={() =>
                handleInputChange({ target: { name: 'operator', value: op.id } })
              }
              className={`p-3 border rounded ${
                formData.operator === op.id ? 'bg-gray-300' : ''
              }`}
            >
              {op.icon} {op.name}
            </button>
          ))}
        </div>

        {/* Browse Plans Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/plans')}
            className="w-full bg-blue-500 text-white py-3 rounded font-bold hover:bg-blue-600"
          >
            Browse All Plans
          </button>
        </div>

        {/* Available Plans */}
        {availablePlans.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold mb-2">Available Plans</h2>
            <div className="grid grid-cols-1 gap-2">
              {availablePlans.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setFormData(prev => ({ ...prev, selectedPlan: plan }))}
                  className={`p-3 border rounded text-left ${
                    formData.selectedPlan?.id === plan.id ? 'bg-gray-300' : ''
                  }`}
                >
                  <div className="font-bold">{plan.name}</div>
                  <div className="font-bold">₹{plan.price}</div>
                  <div className="text-sm">{plan.data} • {plan.validity} days</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Plan */}
        {formData.selectedPlan && (
          <div className="p-4 border rounded mb-6 bg-gray-100">
            <h2 className="font-bold">Selected Plan</h2>
            <p className="font-medium">{formData.selectedPlan.name}</p>
            <p>₹{formData.selectedPlan.price}</p>
            <p>{formData.selectedPlan.data}</p>
            <p>{formData.selectedPlan.validity} days</p>
          </div>
        )}

        {/* Discount Selection */}
        {formData.operator && discounts.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold mb-2">Select Discount (Optional)</h2>
            <div className="grid grid-cols-1 gap-2">
              {discounts.map(discount => (
                <button
                  key={discount.id}
                  onClick={() => setSelectedDiscount(discount)}
                  className={`p-3 border rounded ${
                    selectedDiscount?.id === discount.id ? 'bg-gray-300' : ''
                  }`}
                >
                  {discount.code} - ₹{discount.discount} off (Min ₹{discount.minAmount})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Proceed */}
        <button
          onClick={handleRecharge}
          disabled={isLoading}
          className="w-full bg-black text-white py-3 rounded font-bold"
        >
          {isLoading ? "Processing..." : "Proceed to Pay"}
        </button>

      </div>
    </div>
  );
};

export default Recharge;
