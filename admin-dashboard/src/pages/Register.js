import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiShield, FiCheck, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--spacing-lg);
`;

const RegisterCard = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
`;

const RegisterHeader = styled.div`
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

const RegisterForm = styled.form`
  padding: var(--spacing-2xl);
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
  
  &.success {
    border-color: var(--color-success);
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
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const PasswordStrength = styled.div`
  margin-top: var(--spacing-sm);
`;

const StrengthMeter = styled.div`
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: var(--spacing-xs);
`;

const StrengthBar = styled.div`
  height: 100%;
  width: ${props => props.strength * 25}%;
  background: ${props => {
    if (props.strength <= 1) return 'var(--color-error)';
    if (props.strength === 2) return '#fd7e14';
    if (props.strength === 3) return '#ffc107';
    return 'var(--color-success)';
  }};
  transition: all var(--transition-fast);
`;

const StrengthText = styled.p`
  font-size: var(--font-size-sm);
  color: ${props => {
    if (props.strength <= 1) return 'var(--color-error)';
    if (props.strength === 2) return '#fd7e14';
    if (props.strength === 3) return '#ffc107';
    return 'var(--color-success)';
  }};
  margin: 0;
`;

const PasswordRequirements = styled.div`
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
`;

const Requirement = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
  color: ${props => props.met ? 'var(--color-success)' : 'var(--text-tertiary)'};
`;

const RegisterButton = styled(motion.button)`
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

const LoginLink = styled.div`
  text-align: center;
  margin-top: var(--spacing-xl);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
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
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
});

const Register = () => {
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const password = watch('password', '');

  React.useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Checking authentication..." />;
  }

  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    setPasswordRequirements(requirements);

    const score = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength(score);
  };

  const getStrengthText = (strength) => {
    if (strength <= 1) return 'Weak password';
    if (strength === 2) return 'Fair password';
    if (strength === 3) return 'Good password';
    if (strength === 4) return 'Strong password';
    return 'Very strong password';
  };

  const onSubmit = async (data) => {
    if (passwordStrength < 3) {
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUser(data.firstName, data.lastName, data.email, data.password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RegisterHeader>
          <Logo>LA</Logo>
          <Title>Create Admin Account</Title>
          <Subtitle>Join the admin team to manage the e-commerce platform</Subtitle>
        </RegisterHeader>

        <RegisterForm onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">First Name</Label>
              <InputContainer>
                <InputIcon>
                  <FiUser />
                </InputIcon>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
                  className={errors.firstName ? 'error' : ''}
                  {...register('firstName')}
                />
              </InputContainer>
              {errors.firstName && (
                <ErrorMessage>
                  <FiX />
                  {errors.firstName.message}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <InputContainer>
                <InputIcon>
                  <FiUser />
                </InputIcon>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
                  className={errors.lastName ? 'error' : ''}
                  {...register('lastName')}
                />
              </InputContainer>
              {errors.lastName && (
                <ErrorMessage>
                  <FiX />
                  {errors.lastName.message}
                </ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

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
              <ErrorMessage>
                <FiX />
                {errors.email.message}
              </ErrorMessage>
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
                className={errors.password ? 'error' : passwordStrength >= 3 ? 'success' : ''}
                {...register('password')}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </InputContainer>
            
            {password && (
              <PasswordStrength>
                <StrengthMeter>
                  <StrengthBar strength={passwordStrength} />
                </StrengthMeter>
                <StrengthText strength={passwordStrength}>
                  {getStrengthText(passwordStrength)}
                </StrengthText>
                
                <PasswordRequirements>
                  <Requirement met={passwordRequirements.length}>
                    {passwordRequirements.length ? <FiCheck /> : <FiX />}
                    At least 8 characters
                  </Requirement>
                  <Requirement met={passwordRequirements.uppercase}>
                    {passwordRequirements.uppercase ? <FiCheck /> : <FiX />}
                    One uppercase letter
                  </Requirement>
                  <Requirement met={passwordRequirements.lowercase}>
                    {passwordRequirements.lowercase ? <FiCheck /> : <FiX />}
                    One lowercase letter
                  </Requirement>
                  <Requirement met={passwordRequirements.number}>
                    {passwordRequirements.number ? <FiCheck /> : <FiX />}
                    One number
                  </Requirement>
                  <Requirement met={passwordRequirements.special}>
                    {passwordRequirements.special ? <FiCheck /> : <FiX />}
                    One special character
                  </Requirement>
                </PasswordRequirements>
              </PasswordStrength>
            )}
            
            {errors.password && (
              <ErrorMessage>
                <FiX />
                {errors.password.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <RegisterButton
            type="submit"
            disabled={isSubmitting || passwordStrength < 3}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <LoadingSpinner size="20px" showText={false} />
            ) : (
              'Create Account'
            )}
          </RegisterButton>

          <LoginLink>
            Already have an account? <Link to="/login">Sign in instead</Link>
          </LoginLink>

          <SecurityNote>
            <FiShield />
            <span>
              Your account will be reviewed and activated by a super admin.
            </span>
          </SecurityNote>
        </RegisterForm>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
