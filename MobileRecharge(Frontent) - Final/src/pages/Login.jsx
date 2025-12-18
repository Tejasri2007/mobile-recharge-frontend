import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schemas/authSchemas";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');

    try {
      const result = await login(data);

      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          if (result.user?.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="card p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="user"
                  checked={role === 'user'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2"
                />
                User
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2"
                />
                Admin
              </label>
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email")}
              placeholder={role === 'admin' ? 'Admin Email (admin@admin.com)' : 'Email'}
              className="input"
            />
            {errors.email && <p className="error">{errors.email?.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder={role === 'admin' ? 'Admin Password (admin123)' : 'Password'}
              className="input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            {errors.password && <p className="error">{errors.password?.message}</p>}
          </div>

          {error && (
            <div className="error text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 text-center text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              `Sign In as ${role === 'admin' ? 'Admin' : 'User'}`
            )}
          </button>
        </form>

        {role === 'user' && (
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold">
              Sign up
            </Link>
          </p>
        )}
        
        {role === 'admin' && (
          <p className="text-center mt-4 text-sm text-gray-600">
            Demo admin credentials: admin@admin.com / admin123
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;