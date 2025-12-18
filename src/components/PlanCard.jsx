import { useState } from 'react';

const PlanCard = ({ plan, onSelect, isPopular = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getOperatorIcon = (operator) => {
    const icons = {
      airtel: '🔴',
      jio: '🔵', 
      vi: '🟡',
      bsnl: '🟢'
    };
    return icons[operator] || '📱';
  };

  return (
    <div 
      className={`relative card p-6 ${isPopular ? 'ring-2 ring-gray-500 bg-gradient-to-br from-gray-50 to-gray-100' : 'bg-white'} transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
            Most Popular
          </span>
        </div>
      )}

      {/* Operator Badge */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
          <span className="text-lg">{getOperatorIcon(plan.operator)}</span>
          <span className="text-sm font-medium text-gray-700 capitalize">{plan.operator}</span>
        </div>
      </div>

      {/* Plan Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
            ₹{plan.price}
          </span>
        </div>
        <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full">
          <span className="text-sm text-gray-600">Valid for </span>
          <span className="text-sm font-bold text-gray-800 ml-1">{plan.validity} days</span>
        </div>
      </div>

      {/* Plan Features */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs"></span>
            </div>
            <span className="font-medium text-gray-700">Data</span>
          </div>
          <span className="font-bold text-gray-600">{plan.data}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs"></span>
            </div>
            <span className="font-medium text-gray-700">Calls</span>
          </div>
          <span className="font-bold text-gray-700">{plan.calls}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xs"></span>
            </div>
            <span className="font-medium text-gray-700">SMS</span>
          </div>
          <span className="font-bold text-gray-800">{plan.sms}</span>
        </div>
      </div>

      {/* Additional Benefits */}
      {plan.benefits && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Additional Benefits:</h4>
          <ul className="space-y-1">
            {plan.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Select Button */}
      <button 
        onClick={() => onSelect(plan)}
        className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
          isPopular 
            ? 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white' 
            : 'btn-primary'
        }`}
      >
        {isHovered ? 'Recharge Now' : 'Select Plan'}
      </button>

      {/* Savings Badge */}
      {plan.savings && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Save ₹{plan.savings}
          </span>
        </div>
      )}
    </div>
  );
};

export default PlanCard;