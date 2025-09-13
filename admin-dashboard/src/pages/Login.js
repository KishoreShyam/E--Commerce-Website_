import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--spacing-lg);
`;

const LoginCard = styled(motion.div)`
  width: 100%;
  max-width: 450px;
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
`;

const LoginHeader = styled.div`
  padding: var(--spacing-2xl) var(--spacing-2xl) var(--spacing-xl);
  text-align: center;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: bold;
`;

const Title = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm);
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  margin: 0;
`;

const LoginForm = styled.form`
  padding: var(--spacing-2xl);
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 45px;
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
  
  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    background: var(--bg-primary);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
  
  &.error {
    border-color: var(--color-error);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: var(--text-primary);
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin: var(--spacing-xs) 0 0;
`;

const LoginButton = styled(motion.button)`
  width: 100%;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SecurityNote = styled.div`
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
`;

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
});

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  // Check for saved email on component mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('savedAdminEmail');
    if (savedEmail) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Checking authentication..." />;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await login(data.email, data.password);
      
      // Save email if remember me is checked and login was successful
      if (result.success && rememberMe) {
        localStorage.setItem('savedAdminEmail', data.email);
      } else if (!rememberMe) {
        localStorage.removeItem('savedAdminEmail');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginHeader>
          <Logo>LA</Logo>
          <Title>Admin Portal</Title>
          <Subtitle>Sign in to manage your e-commerce platform</Subtitle>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputContainer>
              <InputIcon>
                <FiMail />
              </InputIcon>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                {...register('email')}
              />
            </InputContainer>
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputContainer>
              <InputIcon>
                <FiLock />
              </InputIcon>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
                {...register('password')}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </InputContainer>
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </FormGroup>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: 'var(--spacing-lg)',
            gap: 'var(--spacing-sm)'
          }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ margin: 0 }}
            />
            <label 
              htmlFor="remember" 
              style={{ 
                margin: 0, 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              Remember me
            </label>
          </div>

          <LoginButton
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <LoadingSpinner size="20px" showText={false} />
            ) : (
              'Sign In'
            )}
          </LoginButton>

          <SecurityNote>
            <FiShield />
            <span>
              This is a secure admin portal. Only authorized personnel can access this system.
            </span>
          </SecurityNote>

          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>Create admin account</Link>
          </div>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
