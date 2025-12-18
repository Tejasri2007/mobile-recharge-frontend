import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RechargeSuccess = () => {
  const [rechargeData, setRechargeData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('rechargeData');
    if (data) {
      setRechargeData(JSON.parse(data));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleDownloadReceipt = () => {
    if (!rechargeData) return;

    const receiptContent = `
MOBILE RECHARGE RECEIPT
========================
Transaction ID: ${rechargeData.transactionId}
Date: ${new Date(rechargeData.timestamp).toLocaleString()}
Mobile Number: ${rechargeData.phoneNumber}
Operator: ${rechargeData.operator.toUpperCase()}
Plan Amount: ₹${rechargeData.plan.price}
Final Amount: ₹${rechargeData.amount}
Status: SUCCESS
========================
Thank you for using MobileRecharge!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${rechargeData.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = (platform) => {
    if (!rechargeData) return;

    const message = `I just recharged my mobile for ₹${rechargeData.amount} with ${rechargeData.operator.toUpperCase()}. Transaction ID: ${rechargeData.transactionId}. #MobileRecharge`;
    const url = window.location.origin; // Or a specific URL if available

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  if (!rechargeData) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Recharge Successful!</h1>
          <p className="text-xl text-gray-600">Your mobile has been recharged successfully</p>
        </div>

        {/* Transaction Details */}
        <div className="card p-8 mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              
              Transaction Completed
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">₹{rechargeData.amount}</div>
                <div className="text-sm text-gray-600">Amount Paid</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{rechargeData.plan.validity}</div>
                <div className="text-sm text-gray-600">Days Validity</div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {rechargeData.transactionId}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mobile Number:</span>
                <span className="font-medium">{rechargeData.phoneNumber}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Operator:</span>
                <span className="font-medium capitalize">{rechargeData.operator}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{rechargeData.plan.data} • {rechargeData.plan.validity} days</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium">
                  {new Date(rechargeData.timestamp).toLocaleString()}
                </span>
              </div>

              {rechargeData.discount && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Discount Applied:</span>
                  <span className="font-medium">
                    {rechargeData.discount.code} (-₹{rechargeData.discount.discount})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleDownloadReceipt}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <span>📄</span>
            <span>Download Receipt</span>
          </button>
          
          <Link
            to="/recharge"
            className="btn-primary flex items-center justify-center space-x-2 text-center"
          >
            <span>🔄</span>
            <span>Recharge Again</span>
          </Link>
          
          <Link
            to="/"
            className="btn-secondary flex items-center justify-center space-x-2 text-center"
          >
            <span>🏠</span>
            <span>Go Home</span>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="card p-6 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📱 What's Next?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <div className="font-medium text-gray-800">Instant Activation</div>
                <div className="text-gray-600">Your plan is now active and ready to use</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <div className="font-medium text-gray-800">SMS Confirmation</div>
                <div className="text-gray-600">You'll receive SMS confirmation shortly</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 mt-1">ℹ️</span>
              <div>
                <div className="font-medium text-gray-800">Customer Support</div>
                <div className="text-gray-600">Need help? Contact us 24/7</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-purple-500 mt-1">🎁</span>
              <div>
                <div className="font-medium text-gray-800">Earn Rewards</div>
                <div className="text-gray-600">Get cashback on your next recharge</div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Success */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">Share your experience with friends!</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleShare('facebook')}
              className="w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
            >
              📘
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300"
            >
              📱
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="w-12 h-12 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors duration-300"
            >
              🐦
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeSuccess;