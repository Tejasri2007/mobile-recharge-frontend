const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent">
                Recharge Hub
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner for instant mobile recharges. Fast, secure, and reliable service 
              available 24/7 with the best offers and cashback deals.
            </p>
            
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-400">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">Recharge Plans</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">Bill Payment</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">Support</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">About Us</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-400">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📧</span>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Email</p>
                  <p className="text-white font-medium">support@rechargehub.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📞</span>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Phone</p>
                  <p className="text-white font-medium">+1-234-567-8900</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🕒</span>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Support</p>
                  <p className="text-white font-medium">24/7 Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 RechargeHub. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-4 md:mt-0">
            Made with love for seamless mobile recharges
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;