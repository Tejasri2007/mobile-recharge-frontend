import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentTransactions: []
  });
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [newPlan, setNewPlan] = useState({ operator: '', price: '', validity: '', data: '', name: '', category: 'prepaid', benefits: '' });
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.role || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    // Load plans
    try {
      const response = await apiService.getPlans();
      if (response.success && response.plans) {
        setPlans(response.plans);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
      setPlans([]);
    }
    
    // Load users
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
    
    // Load stats
    try {
      const rechargeResponse = await apiService.getAllRecharges();
      if (rechargeResponse.success) {
        const recharges = rechargeResponse.recharges || [];
        const revenue = recharges.reduce((sum, txn) => sum + (txn.amount || 0), 0);
        const uniqueUsers = new Set(recharges.map(txn => txn.user?._id || txn.phoneNumber)).size;

        setStats({
          totalTransactions: recharges.length,
          totalRevenue: revenue,
          totalUsers: uniqueUsers,
          recentTransactions: recharges.slice(-5).reverse(),
          allTransactions: recharges
        });
      }
    } catch (error) {
      console.error('Error loading recharges:', error);
      setStats(prev => ({ ...prev, allTransactions: [] }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const getOperatorIcon = (operator) => {
    const icons = { airtel: '🔴', jio: '🔵', vi: '🟡', bsnl: '🟢' };
    return icons[operator] || '📱';
  };

  const handleAddPlan = async () => {
    if (!newPlan.operator || !newPlan.price || !newPlan.validity || !newPlan.data || !newPlan.name) {
      alert('Please fill all required fields');
      return;
    }
    
    setOperationLoading(true);
    try {
      const planData = {
        ...newPlan,
        price: parseInt(newPlan.price),
        validity: parseInt(newPlan.validity),
        benefits: newPlan.benefits ? newPlan.benefits.split(',').map(b => b.trim()).filter(b => b) : [],
        description: `${newPlan.name} - ${newPlan.data} for ${newPlan.validity} days`
      };
      
      console.log('Adding plan:', planData);
      const response = await fetch('http://localhost:5000/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(planData)
      });
      
      const result = await response.json();
      console.log('Add plan response:', result);
      
      if (result.success) {
        loadData(); // Reload plans
        setNewPlan({ operator: '', price: '', validity: '', data: '', name: '', category: 'prepaid', benefits: '' });
        setShowAddPlan(false);
        // Notify other tabs/windows about plan changes
        localStorage.setItem('plansUpdated', Date.now().toString());
        alert('Plan added successfully!');
      } else {
        alert(result.message || 'Failed to add plan');
      }
    } catch (error) {
      console.error('Error adding plan:', error);
      alert(error.message || 'Failed to add plan');
    }
    setOperationLoading(false);
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan.operator || !editingPlan.price || !editingPlan.validity || !editingPlan.data || !editingPlan.name) {
      alert('Please fill all required fields');
      return;
    }
    
    setOperationLoading(true);
    try {
      const planData = {
        ...editingPlan,
        price: parseInt(editingPlan.price),
        validity: parseInt(editingPlan.validity),
        benefits: editingPlan.benefits ? (typeof editingPlan.benefits === 'string' ? editingPlan.benefits.split(',').map(b => b.trim()).filter(b => b) : editingPlan.benefits) : [],
        description: `${editingPlan.name} - ${editingPlan.data} for ${editingPlan.validity} days`
      };
      
      const response = await apiService.updatePlan(editingPlan._id, planData);
      if (response.success) {
        loadData(); // Reload plans
        setEditingPlan(null);
        // Notify other tabs/windows about plan changes
        localStorage.setItem('plansUpdated', Date.now().toString());
        alert('Plan updated successfully!');
      }
    } catch (error) {
      alert(error.message || 'Failed to update plan');
    }
    setOperationLoading(false);
  };

  const handleDeletePlan = async (id) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    setOperationLoading(true);
    try {
      const response = await apiService.deletePlan(id);
      if (response.success) {
        loadData();
        // Notify other tabs/windows about plan changes
        localStorage.setItem('plansUpdated', Date.now().toString());
        alert('Plan deleted successfully!');
      }
    } catch (error) {
      alert(error.message || 'Failed to delete plan');
    }
    setOperationLoading(false);
  };



  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-gray-800">{stats.totalTransactions}</div>
            <div className="text-gray-600">Total Transactions</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-gray-800">₹{stats.totalRevenue}</div>
            <div className="text-gray-600">Total Revenue</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-gray-800">{stats.totalUsers}</div>
            <div className="text-gray-600">Total Users</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="card p-6 mb-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 rounded font-medium ${
                activeTab === 'plans' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Plan Management
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded font-medium ${
                activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded font-medium ${
                activeTab === 'transactions' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              All Transactions
            </button>
          </div>

          {/* Plan Management */}
          {activeTab === 'plans' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Plan Management</h2>
                <button onClick={() => setShowAddPlan(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Add Plan
                </button>
              </div>
          
              {loading ? (
                <div className="text-center py-8">Loading plans...</div>
              ) : plans.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No plans found. Add some plans to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plans.map(plan => (
                    <div key={plan._id} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{getOperatorIcon(plan.operator)}</span>
                        <span className="font-bold capitalize text-gray-700">{plan.operator}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-800 mb-1">{plan.name}</div>
                      <div className="text-lg font-bold text-blue-600 mb-1">₹{plan.price}</div>
                      <div className="text-sm text-gray-600 mb-1">{plan.data}</div>
                      <div className="text-sm text-gray-600 mb-2">{plan.validity} days</div>
                      <div className="text-xs text-gray-500 mb-1 capitalize">{plan.category}</div>
                      {plan.benefits && plan.benefits.length > 0 && (
                        <div className="text-xs text-gray-500 mb-3">
                          <div className="font-medium">Benefits:</div>
                          <ul className="list-disc list-inside">
                            {plan.benefits.slice(0, 2).map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))}
                            {plan.benefits.length > 2 && <li>+{plan.benefits.length - 2} more</li>}
                          </ul>
                        </div>
                      )}
                      <div className="flex space-x-2 mt-3">
                        <button onClick={() => setEditingPlan({...plan, benefits: Array.isArray(plan.benefits) ? plan.benefits.join(', ') : plan.benefits || ''})} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
                          Edit
                        </button>
                        <button onClick={() => handleDeletePlan(plan._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All Transactions */}
          {activeTab === 'transactions' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">All Transactions</h2>
              {stats.allTransactions ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Transaction ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Operator</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.allTransactions.map(txn => (
                        <tr key={txn._id}>
                          <td className="border border-gray-300 px-4 py-2 font-mono text-xs">{txn.transactionId}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="font-medium">{txn.user?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{txn.user?.email || 'N/A'}</div>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">{txn.phoneNumber}</td>
                          <td className="border border-gray-300 px-4 py-2 capitalize">
                            <span className="mr-2">{getOperatorIcon(txn.operator)}</span>
                            {txn.operator}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="font-bold">₹{txn.amount}</div>
                            {txn.discountApplied > 0 && (
                              <div className="text-xs text-gray-500">
                                <span className="line-through">₹{txn.originalAmount}</span>
                                <span className="text-green-600 ml-1">(-₹{txn.discountApplied})</span>
                              </div>
                            )}
                            {txn.discountCode && (
                              <div className="text-xs text-green-600">{txn.discountCode}</div>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              txn.status === 'success' ? 'bg-green-100 text-green-800' :
                              txn.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {txn.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm">
                            {new Date(txn.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Loading all transactions...
                </div>
              )}
            </div>
          )}

          {/* User Management */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">User Management</h2>
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No users found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Role</th>

                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id}>
                          <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                          <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                          <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Plan Modal */}
        {showAddPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Add New Plan</h3>
              <div className="space-y-3">
                <select value={newPlan.operator} onChange={(e) => setNewPlan({...newPlan, operator: e.target.value})} className="w-full border p-3 rounded">
                  <option value="">Select Operator</option>
                  <option value="airtel">Airtel</option>
                  <option value="jio">Jio</option>
                  <option value="vi">Vi</option>
                  <option value="bsnl">BSNL</option>
                </select>
                <input type="text" placeholder="Plan Name" value={newPlan.name} onChange={(e) => setNewPlan({...newPlan, name: e.target.value})} className="w-full border p-3 rounded" />
                <input type="number" placeholder="Price" value={newPlan.price} onChange={(e) => setNewPlan({...newPlan, price: e.target.value})} className="w-full border p-3 rounded" />
                <input type="number" placeholder="Validity (days)" value={newPlan.validity} onChange={(e) => setNewPlan({...newPlan, validity: e.target.value})} className="w-full border p-3 rounded" />
                <input type="text" placeholder="Data (e.g., 1.5GB/day)" value={newPlan.data} onChange={(e) => setNewPlan({...newPlan, data: e.target.value})} className="w-full border p-3 rounded" />
                <textarea placeholder="Benefits (comma separated)" value={newPlan.benefits} onChange={(e) => setNewPlan({...newPlan, benefits: e.target.value})} className="w-full border p-3 rounded" rows="3" />
                <select value={newPlan.category} onChange={(e) => setNewPlan({...newPlan, category: e.target.value})} className="w-full border p-3 rounded">
                  <option value="prepaid">Prepaid</option>
                  <option value="postpaid">Postpaid</option>
                </select>
              </div>
              <div className="flex space-x-3 mt-6">
                <button onClick={handleAddPlan} disabled={operationLoading} className="flex-1 bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 disabled:opacity-50">
                  {operationLoading ? 'Adding...' : 'Add Plan'}
                </button>
                <button onClick={() => setShowAddPlan(false)} className="flex-1 bg-gray-500 text-white px-4 py-3 rounded hover:bg-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Plan Modal */}
        {editingPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Edit Plan</h3>
              <div className="space-y-3">
                <select value={editingPlan.operator} onChange={(e) => setEditingPlan({...editingPlan, operator: e.target.value})} className="w-full border p-3 rounded">
                  <option value="airtel">Airtel</option>
                  <option value="jio">Jio</option>
                  <option value="vi">Vi</option>
                  <option value="bsnl">BSNL</option>
                </select>
                <input type="text" placeholder="Plan Name" value={editingPlan.name} onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})} className="w-full border p-3 rounded" />
                <input type="number" placeholder="Price" value={editingPlan.price} onChange={(e) => setEditingPlan({...editingPlan, price: e.target.value})} className="w-full border p-3 rounded" />
                <input type="number" placeholder="Validity (days)" value={editingPlan.validity} onChange={(e) => setEditingPlan({...editingPlan, validity: e.target.value})} className="w-full border p-3 rounded" />
                <input type="text" placeholder="Data" value={editingPlan.data} onChange={(e) => setEditingPlan({...editingPlan, data: e.target.value})} className="w-full border p-3 rounded" />
                <textarea placeholder="Benefits (comma separated)" value={editingPlan.benefits || ''} onChange={(e) => setEditingPlan({...editingPlan, benefits: e.target.value})} className="w-full border p-3 rounded" rows="3" />
                <select value={editingPlan.category || 'prepaid'} onChange={(e) => setEditingPlan({...editingPlan, category: e.target.value})} className="w-full border p-3 rounded">
                  <option value="prepaid">Prepaid</option>
                  <option value="postpaid">Postpaid</option>
                </select>
              </div>
              <div className="flex space-x-3 mt-6">
                <button onClick={handleUpdatePlan} disabled={operationLoading} className="flex-1 bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 disabled:opacity-50">
                  {operationLoading ? 'Updating...' : 'Update Plan'}
                </button>
                <button onClick={() => setEditingPlan(null)} className="flex-1 bg-gray-500 text-white px-4 py-3 rounded hover:bg-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}



        {/* Transaction History */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Transactions</h2>
            <button 
              onClick={() => setActiveTab('transactions')}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          {stats.recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {stats.recentTransactions.map(txn => (
                <div key={txn._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{getOperatorIcon(txn.operator)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{txn.phoneNumber}</div>
                      <div className="text-sm text-gray-600 capitalize">{txn.operator}</div>
                      <div className="text-xs text-gray-500">
                        {txn.user?.name || 'Unknown User'} ({txn.user?.email || 'N/A'})
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      ₹{txn.amount}
                      {txn.discountApplied > 0 && (
                        <div className="text-xs text-gray-500">
                          <span className="line-through">₹{txn.originalAmount}</span>
                          <span className="text-green-600 ml-1">-₹{txn.discountApplied}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(txn.createdAt || txn.date).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {txn.discountCode && (
                      <div className="text-xs text-green-600">{txn.discountCode}</div>
                    )}
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      txn.status === 'success' ? 'bg-green-100 text-green-800' :
                      txn.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {txn.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;