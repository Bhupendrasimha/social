/**
 * Login Component
 * 
 * A React component that handles user authentication through a login form.
 * Uses React Hook Form for form handling and validation, Redux for state management,
 * and RTK Query for API calls.
 */

import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { setCredentials } from "../../slice/authSlice";
import "./login.scss";
import { useLoginMutation } from "../../slice/apiSlice";

/**
 * Form validation rules for email and password fields
 */
const validationRules = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
  },
};

/**
 * Login component that renders a login form and handles authentication
 * @returns {JSX.Element} Login form component
 */
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize form handling with React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // RTK Query mutation hook for login API call
  const [loginCall] = useLoginMutation();

  /**
   * Handle form submission
   * @param {Object} data - Form data containing email and password
   */
  const onSubmit = async (data) => {
    try {
      const response = await loginCall(data);
console.log(response)
      if (response.error) {
        throw new Error("Login Failed || Invalid Credentials");
      }

      // Store user credentials in Redux store
      dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.token,
        })
      );

      // Redirect to posts page on successful login
      navigate("/posts");
    } catch (err) {
      setFormError("root", {
        type: "custom",
        message: err.message,
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome</h2>
        {errors.root && <div className="auth-error">{errors.root.message}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              rules={validationRules.email}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  id="email"
                  className={`form-input ${errors.email ? "error" : ""}`}
                />
              )}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <Controller
              name="password"
              control={control}
              rules={validationRules.password}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  id="password"
                  className={`form-input ${errors.password ? "error" : ""}`}
                />
              )}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <Link to="/register" className="auth-link">
          Don&apos;t have an account? Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;
