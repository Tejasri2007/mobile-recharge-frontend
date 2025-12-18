import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PlanCard from '../components/PlanCard';

const LandingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const featuredPlans = [
    {
      id: 1,
      name: "Smart Starter",
      price: 199,
      validity: 28,
      data: "1.5GB/day",
      calls: "Unlimited",
      sms: "100/day",
      benefits: ["Free Roaming", "Music Streaming"],
      savings: 50
    },
    {
      id: 2,
      name: "Premium Choice",
      price: 399,
      validity: 56,
      data: "2GB/day",
      calls: "Unlimited",
      sms: "100/day",
      benefits: ["Free Roaming", "OTT Subscriptions", "Priority Network"],
      savings: 100
    },
    {
      id: 3,
      name: "Ultimate Power",
      price: 599,
      validity: 84,
      data: "3GB/day",
      calls: "Unlimited",
      sms: "100/day",
      benefits: ["Free Roaming", "All OTT Apps", "5G Access", "Priority Support"],
      savings: 200
    }
  ];

  const services = [
    { icon: "📱", title: "Mobile Recharge", desc: "Instant prepaid & postpaid recharges" },
    { icon: "🎯", title: "Data Cards", desc: "Internet data packs for all networks" }
  ];

  const operators = [
  {
    name: "Airtel",
    users: "350M+",
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
    name: "Jio",
    users: "450M+",
    logo: (
      <svg width="28" height="28" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#0A66C2" />
        <text
          x="50"
          y="63"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          fontSize="40"
          fill="#ffffff"
        >
          Jio
        </text>
      </svg>
    )
  },

  {
    name: "Vi",
    users: "280M+",
    logo: (
      <svg width="28" height="28" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="12" fill="#FF0000" />
        <text
          x="50"
          y="63"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          fontSize="42"
          fill="#ffffff"
        >
          Vi
        </text>
      </svg>
    )
  },

  {
    name: "BSNL",
    users: "120M+",
    logo: (
      <svg width="28" height="28" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#1CAF5E" />
        <text
          x="50"
          y="63"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          fontSize="34"
          fill="#ffffff"
        >
          BSNL
        </text>
      </svg>
    )
  }
];


  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    localStorage.setItem('selectedPlan', JSON.stringify(plan));
    navigate('/recharge');
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#e3e8e9'}}>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden" style={{background: `linear-gradient(to bottom right, #6b7280, #374151, #1f2937)`}}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4" style={{backgroundColor: 'rgba(107, 114, 128, 0.5)'}}>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Trusted by 10M+ Users
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">
              Instant Recharge, Anytime!
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{color: '#e3e8e9'}}>
              Instant recharges, best offers, maximum cashback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/recharge"
                className="inline-flex items-center justify-center px-6 py-3 font-bold rounded-xl transition-all duration-300 shadow-lg hover:opacity-90"
                style={{backgroundColor: '#e3e8e9', color: '#6b7280'}}
              >
                
                Recharge Now
              </Link>
              <Link
                to="/plans"
                className="inline-flex items-center justify-center px-6 py-3 border-2 text-white font-bold rounded-xl transition-all duration-300"
                style={{borderColor: '#e3e8e9'}}
              >
                
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12" style={{backgroundColor: '#e3e8e9'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{color: '#6b7280'}}>How It Works</h2>
            <p style={{color: '#8b7d6b'}}>Simple steps to recharge your mobile</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{background: `linear-gradient(to bottom right, #6b7280, #374151)`}}>
                <span className="text-xl text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{color: '#6b7280'}}>Enter Details</h3>
              <p className="text-sm" style={{color: '#8b7d6b'}}>Enter mobile number and select operator</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{background: `linear-gradient(to bottom right, #6b7280, #374151)`}}>
                <span className="text-xl text-white font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{color: '#6b7280'}}>Choose Plan</h3>
              <p className="text-sm" style={{color: '#8b7d6b'}}>Select from best plans with offers</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{background: `linear-gradient(to bottom right, #6b7280, #374151)`}}>
                <span className="text-xl text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{color: '#6b7280'}}>Pay & Done</h3>
              <p className="text-sm" style={{color: '#8b7d6b'}}>Secure payment and instant recharge</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12" style={{backgroundColor: '#f0f2f3'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{color: '#6b7280'}}>All Services</h2>
            <p style={{color: '#8b7d6b'}}>Complete digital payment solutions</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} className="rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1" style={{backgroundColor: '#e3e8e9'}}>
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{color: '#6b7280'}}>{service.title}</h3>
                <p className="text-sm" style={{color: '#8b7d6b'}}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operators Section */}
      <section className="py-12" style={{backgroundColor: '#e3e8e9'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{color: '#6b7280'}}>Supported Networks</h2>
            <p style={{color: '#8b7d6b'}}>All major operators across India</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {operators.map((operator, index) => (
              <div key={index} className="rounded-xl p-6 text-center transition-all duration-300 group shadow-lg hover:shadow-xl" style={{backgroundColor: '#f0f2f3'}}>
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {operator.logo}
                </div>
                <h3 className="text-lg font-bold mb-1" style={{color: '#6b7280'}}>{operator.name}</h3>
                <p className="text-sm font-semibold" style={{color: '#8b7d6b'}}>{operator.users} users</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12" style={{backgroundColor: '#f0f2f3'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{color: '#6b7280'}}>
              Why Choose Us?
            </h2>
            <p style={{color: '#8b7d6b'}}>
              Best mobile recharge platform with unmatched benefits
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="rounded-xl p-10 text-center shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1" style={{backgroundColor: '#e3e8e9'}}>
              
              <h3 className="text-xl font-bold mb-3" style={{color: '#6b7280'}}>Fast Recharge</h3>
              <p className="text-lg mb-3" style={{color: '#8b7d6b'}}>
                Complete recharge in under 5 seconds.
              </p>
              <div className="flex items-center justify-center space-x-1 text-lg font-semibold" style={{color: '#8b7d6b'}}>
                <span>⏱️</span>
                <span>Avg: 3.2 sec</span>
              </div>
            </div>
            
            <div className="rounded-xl p-10 text-center shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1" style={{backgroundColor: '#e3e8e9'}}>
              
              <h3 className="text-xl font-bold mb-3" style={{color: '#6b7280'}}>Secure Payments</h3>
              <p className="text-lg mb-3" style={{color: '#8b7d6b'}}>
                Bank-level security and encryption.
              </p>
              <div className="flex items-center justify-center space-x-2 text-lg font-semibold" style={{color: '#8b7d6b'}}>
                <span>🛡️</span>
                <span>SSL Encrypted</span>
              </div>
            </div>
            
            <div className="rounded-xl p-10 text-center shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1" style={{backgroundColor: '#e3e8e9'}}>
              
              <h3 className="text-xl font-bold mb-2" style={{color: '#6b7280'}}>Best Cashback</h3>
              <p className="text-lg mb-3" style={{color: '#8b7d6b'}}>
                Up to 10% cashback plus exclusive offers.
              </p>
              <div className="flex items-center justify-center space-x-1 text-lg font-semibold" style={{color: '#8b7d6b'}}>
                <span>🎁</span>
                <span>Up to ₹500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="py-12 text-white" style={{background: `linear-gradient(to bottom right, #6b7280, #374151, #1f2937)`}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Recharging Today
          </h2>
          <p className="mb-6" style={{color: '#e3e8e9'}}>
            Join millions of users for instant recharges with best offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/recharge"
              className="inline-flex items-center justify-center px-6 py-3 font-bold rounded-xl transition-all duration-300 shadow-lg hover:opacity-90"
              style={{backgroundColor: '#e3e8e9', color: '#6b7280'}}
            >
              
              Recharge Now
            </Link>
            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center px-6 py-3 border-2 text-white font-bold rounded-xl transition-all duration-300"
              style={{borderColor: '#e3e8e9'}}
            >
              
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;