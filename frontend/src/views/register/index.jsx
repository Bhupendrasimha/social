/**
 * Register Component
 * 
 * A React component that handles user registration through a form.
 * Uses React Hook Form for form handling and validation, Redux for state management,
 * and RTK Query for API calls.
 */

import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { setCredentials } from '../../slice/authSlice';
import { useRegisterMutation } from '../../slice/apiSlice';

/**
 * Form validation rules for username, email, password and confirm password fields
 */
const validationRules = {
  username: {
    required: 'Username is required',
    minLength: {
      value: 3,
      message: 'Username must be at least 3 characters'
    },
    maxLength: {
      value: 20,
      message: 'Username must not exceed 20 characters'
    }
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters'
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  confirmPassword: {
    required: 'Please confirm your password'
  }
};

/**
 * Register component that renders a registration form and handles user registration
 * @returns {JSX.Element} Registration form component
 */
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  // Initialize form handling with React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    reset
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onChange'
  });

  // Watch password field for confirmation validation
  const password = watch('password');

  /**
   * Handle form submission
   * @param {Object} data - Form data containing username, email, password and confirmPassword
   */
  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    try {
      const userData = {
        username: data.username,
        email: data.email,
        password: data.password
      };

      const response = await register(userData).unwrap();

      // Store user credentials in Redux store
      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.token,
      }));

      // Reset form and redirect to posts page on successful registration
      reset();
      navigate('/posts');
    } catch (err) {
      setError('root', {
        type: 'custom',
        message: err.message || 'Registration failed'
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        {errors.root && <div className="auth-error">{errors.root.message}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <Controller
              name="username"
              control={control}
              rules={validationRules.username}
              render={({ field }) => (
                <input
                  {...field}
                  id="username"
                  className={`form-input ${errors.username ? 'error' : ''}`}
                />
              )}
            />
            {errors.username && (
              <span className="error-message">{errors.username.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <Controller
              name="email"
              control={control}
              rules={validationRules.email}
              render={({ field }) => (
                <input
                  {...field}
                  id="email"
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                />
              )}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <Controller
              name="password"
              control={control}
              rules={validationRules.password}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  id="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                />
              )}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                ...validationRules.confirmPassword,
                validate: (value) => value === password || 'Passwords do not match'
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  id="confirmPassword"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
              )}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <Link to="/login" className="auth-link">
          Already have an account? Login here
        </Link>
      </div>
    </div>
  );
};

export default Register;