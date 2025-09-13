import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar,
  FiEdit,
  FiSave,
  FiX,
  FiCamera,
  FiLock
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ProfileContainer = styled.div`
  padding: 0;
`;

const ProfileHeader = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const Title = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  height: fit-content;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-bottom: var(--spacing-lg);
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: 700;
  box-shadow: var(--shadow-lg);
`;

const AvatarUpload = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  border: 3px solid var(--bg-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  
  &:hover {
    transform: scale(1.1);
  }
`;

const UserName = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm);
`;

const UserRole = styled.span`
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-primary)20;
  color: var(--color-primary);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
`;

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--color-primary)20;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-xs);
`;

const InfoValue = styled.div`
  font-size: var(--font-size-base);
  color: var(--text-primary);
  font-weight: 500;
`;

const EditSection = styled.div``;

const SectionHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
`;

const Input = styled.input`
  padding: var(--spacing-md);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
  
  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    background: var(--bg-primary);
  }
  
  &.error {
    border-color: var(--color-error);
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &.primary {
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }
  
  &.secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-light);
    
    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }
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
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
});

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });

  const getUserInitials = (user) => {
    if (!user) return 'A';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        setIsEditing(false);
        reset(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Title>Profile</Title>
      </ProfileHeader>

      <ProfileGrid>
        <ProfileCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AvatarSection>
            <AvatarContainer>
              <Avatar>
                {getUserInitials(user)}
              </Avatar>
              <AvatarUpload>
                <FiCamera />
              </AvatarUpload>
            </AvatarContainer>
            <UserName>{user?.firstName} {user?.lastName}</UserName>
            <UserRole>{user?.role || 'Administrator'}</UserRole>
          </AvatarSection>

          <InfoSection>
            <InfoItem>
              <InfoIcon>
                <FiMail />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{user?.email}</InfoValue>
              </InfoContent>
            </InfoItem>

            {user?.phone && (
              <InfoItem>
                <InfoIcon>
                  <FiPhone />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Phone</InfoLabel>
                  <InfoValue>{user.phone}</InfoValue>
                </InfoContent>
              </InfoItem>
            )}

            <InfoItem>
              <InfoIcon>
                <FiCalendar />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Member Since</InfoLabel>
                <InfoValue>{formatDate(user?.createdAt)}</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FiCalendar />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Last Login</InfoLabel>
                <InfoValue>{formatDate(user?.lastLogin)}</InfoValue>
              </InfoContent>
            </InfoItem>
          </InfoSection>
        </ProfileCard>

        <ProfileCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <EditSection>
            <SectionHeader>
              <SectionTitle>Personal Information</SectionTitle>
              {!isEditing && (
                <EditButton onClick={() => setIsEditing(true)}>
                  <FiEdit />
                  Edit Profile
                </EditButton>
              )}
            </SectionHeader>

            {isEditing ? (
              <Form onSubmit={handleSubmit(onSubmit)}>
                <FormRow>
                  <FormGroup>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      className={errors.firstName ? 'error' : ''}
                      {...register('firstName')}
                    />
                    {errors.firstName && (
                      <ErrorMessage>{errors.firstName.message}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      className={errors.lastName ? 'error' : ''}
                      {...register('lastName')}
                    />
                    {errors.lastName && (
                      <ErrorMessage>{errors.lastName.message}</ErrorMessage>
                    )}
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    className={errors.email ? 'error' : ''}
                    {...register('email')}
                  />
                  {errors.email && (
                    <ErrorMessage>{errors.email.message}</ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    className={errors.phone ? 'error' : ''}
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <ErrorMessage>{errors.phone.message}</ErrorMessage>
                  )}
                </FormGroup>

                <ActionButtons>
                  <Button
                    type="button"
                    className="secondary"
                    onClick={handleCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiX />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="primary"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiSave />
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </ActionButtons>
              </Form>
            ) : (
              <InfoSection>
                <InfoItem>
                  <InfoIcon>
                    <FiUser />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Full Name</InfoLabel>
                    <InfoValue>{user?.firstName} {user?.lastName}</InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <FiMail />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Email Address</InfoLabel>
                    <InfoValue>{user?.email}</InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <FiPhone />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Phone Number</InfoLabel>
                    <InfoValue>{user?.phone || 'Not specified'}</InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <FiLock />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Password</InfoLabel>
                    <InfoValue>••••••••</InfoValue>
                  </InfoContent>
                </InfoItem>
              </InfoSection>
            )}
          </EditSection>
        </ProfileCard>
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default Profile;
