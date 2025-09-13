import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiDollarSign, FiSmartphone, FiGlobe } from 'react-icons/fi';

const PaymentContainer = styled.div`
  margin-bottom: 2rem;
`;

const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PaymentOption = styled(motion.div)`
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e5e9'};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? 'rgba(102, 126, 234, 0.05)' : 'white'};
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
    transition: all 0.3s ease;
  }

  .icon-container {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background: ${props => props.selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    transition: all 0.3s ease;

    svg {
      color: ${props => props.selected ? 'white' : '#667eea'};
      font-size: 1.5rem;
    }
  }

  .method-info {
    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: ${props => props.selected ? '#667eea' : '#333'};
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      color: #666;
      line-height: 1.4;
    }

    .features {
      margin-top: 0.75rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      .feature {
        background: ${props => props.selected ? 'rgba(102, 126, 234, 0.1)' : '#f8f9fa'};
        color: ${props => props.selected ? '#667eea' : '#666'};
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
      }
    }
  }

  .selected-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.75rem;
    opacity: ${props => props.selected ? 1 : 0};
    transform: scale(${props => props.selected ? 1 : 0.5});
    transition: all 0.3s ease;
  }
`;

const PaymentForm = styled(motion.div)`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SecurityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(56, 161, 105, 0.1);
  border: 1px solid rgba(56, 161, 105, 0.2);
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #38a169;

  .icon {
    color: #38a169;
  }
`;

const PaymentMethods = ({ formData, handleChange, handlePaymentMethodChange }) => {
  const paymentMethods = [
    {
      id: 'credit',
      name: 'Credit Card',
      description: 'Visa, Mastercard, American Express',
      icon: FiCreditCard,
      features: ['Instant', 'Secure', 'Rewards'],
      requiresForm: true
    },
    {
      id: 'debit',
      name: 'Debit Card',
      description: 'Direct bank account payment',
      icon: FiCreditCard,
      features: ['Instant', 'No fees', 'Secure'],
      requiresForm: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: FiGlobe,
      features: ['Buyer Protection', 'Quick', 'Trusted'],
      requiresForm: false
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      description: 'Touch ID or Face ID payment',
      icon: FiSmartphone,
      features: ['Touch ID', 'Secure', 'Fast'],
      requiresForm: false
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      description: 'Pay with Google account',
      icon: FiSmartphone,
      features: ['Fingerprint', 'Quick', 'Safe'],
      requiresForm: false
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank account transfer',
      icon: FiDollarSign,
      features: ['Low fees', 'Secure', '1-3 days'],
      requiresForm: false
    }
  ];

  const selectedMethod = paymentMethods.find(method => method.id === formData.paymentMethod);

  return (
    <PaymentContainer>
      <PaymentGrid>
        {paymentMethods.map((method) => (
          <PaymentOption
            key={method.id}
            selected={formData.paymentMethod === method.id}
            onClick={() => handlePaymentMethodChange(method.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="icon-container">
              <method.icon />
            </div>
            <div className="method-info">
              <h3>{method.name}</h3>
              <p>{method.description}</p>
              <div className="features">
                {method.features.map((feature, index) => (
                  <span key={index} className="feature">{feature}</span>
                ))}
              </div>
            </div>
            <div className="selected-indicator">✓</div>
          </PaymentOption>
        ))}
      </PaymentGrid>

      <AnimatePresence mode="wait">
        {selectedMethod?.requiresForm && (
          <PaymentForm
            key={formData.paymentMethod}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
              {selectedMethod.name} Details
            </h3>
            
            <FormGrid>
              <FormGroup className="full-width">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  maxLength="19"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  maxLength="5"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  type="text"
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleChange}
                  maxLength="4"
                  required
                />
              </FormGroup>
              
              <FormGroup className="full-width">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  type="text"
                  id="cardName"
                  name="cardName"
                  placeholder="John Doe"
                  value={formData.cardName}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="billingCountry">Billing Country</Label>
                <Select
                  id="billingCountry"
                  name="billingCountry"
                  value={formData.billingCountry || 'US'}
                  onChange={handleChange}
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IN">India</option>
                  <option value="JP">Japan</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="billingZip">Billing ZIP Code</Label>
                <Input
                  type="text"
                  id="billingZip"
                  name="billingZip"
                  placeholder="12345"
                  value={formData.billingZip}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormGrid>

            <SecurityInfo>
              <FiCreditCard className="icon" />
              Your payment information is encrypted with 256-bit SSL security
            </SecurityInfo>
          </PaymentForm>
        )}
      </AnimatePresence>

      {!selectedMethod?.requiresForm && selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '1rem',
            background: 'rgba(102, 126, 234, 0.05)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '8px',
            marginTop: '1rem',
            textAlign: 'center',
            color: '#667eea'
          }}
        >
          You will be redirected to {selectedMethod.name} to complete your payment securely.
        </motion.div>
      )}
    </PaymentContainer>
  );
};

export default PaymentMethods;
