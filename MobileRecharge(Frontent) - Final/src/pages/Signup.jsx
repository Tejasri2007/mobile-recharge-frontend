import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../schemas/authSchemas";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [role, setRole] = useState('user');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');

    try {
      const result = await registerUser({ ...data, role });

      if (result.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="card p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        {error && <p className="error text-center">{error}</p>}
        {success && <p className="text-green-600 text-center text-sm">{success}</p>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Account Type</label>
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

          <input {...register("username")} placeholder="Username" className="input" />
          <p className="error">{errors.username?.message}</p>

          <input {...register("name")} placeholder="Full Name" className="input" />
          <p className="error">{errors.name?.message}</p>

          <input {...register("email")} placeholder="Email" className="input" />
          <p className="error">{errors.email?.message}</p>

          <input {...register("phone")} placeholder="Phone" className="input" />
          <p className="error">{errors.phone?.message}</p>

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              👁️
            </button>
          </div>
          <p className="error">{errors.password?.message}</p>

          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="input"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              👁️
            </button>
          </div>
          <p className="error">{errors.confirmPassword?.message}</p>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
