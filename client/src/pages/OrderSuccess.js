import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiCheck, FiShoppingBag, FiMail, FiHome } from 'react-icons/fi';

const SuccessContainer = styled.div`
  margin-top: 70px;
  padding: 4rem 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  min-height: 80vh;
  background: var(--bg-primary, #ffffff);
  color: var(--text-primary, #333333);
  text-align: center;
`;

const SuccessIcon = styled(motion.div)`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  font-size: 3rem;
  box-shadow: 0 10px 40px rgba(56, 161, 105, 0.3);
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary, #666666);
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const OrderDetails = styled(motion.div)`
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.1));
  border: 2px solid rgba(56, 161, 105, 0.1);
`;

const OrderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color, #e1e5e9);

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 500;
    color: var(--text-secondary, #666666);
  }

  .value {
    font-weight: 600;
    color: var(--text-primary, #333333);
  }

  &.total .value {
    font-size: 1.25rem;
    color: #38a169;
  }
`;

const NextSteps = styled.div`
  background: var(--bg-secondary, #f8f9fa);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  text-align: left;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-primary, #333333);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 1rem;
      color: var(--text-secondary, #666666);
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }

      .icon {
        color: #38a169;
        margin-top: 0.25rem;
        flex-shrink: 0;
      }
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }
  }

  &.secondary {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;

    &:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }
  }
`;

const OrderSuccess = () => {
  const location = useLocation();
  const { orderNumber, total } = location.state || {};

  return (
    <SuccessContainer>
      <SuccessIcon
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      >
        <FiCheck />
      </SuccessIcon>

      <Title>Order Placed Successfully!</Title>
      <Subtitle>
        Thank you for your purchase! Your order has been confirmed and is being processed.
      </Subtitle>

      <OrderDetails
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <OrderRow>
          <span className="label">Order Number</span>
          <span className="value">{orderNumber || 'LUX123456789'}</span>
        </OrderRow>
        <OrderRow>
          <span className="label">Order Date</span>
          <span className="value">{new Date().toLocaleDateString()}</span>
        </OrderRow>
        <OrderRow>
          <span className="label">Payment Status</span>
          <span className="value">Confirmed</span>
        </OrderRow>
        <OrderRow className="total">
          <span className="label">Total Amount</span>
          <span className="value">₹{total || '0.00'}</span>
        </OrderRow>
      </OrderDetails>

      <NextSteps>
        <h3>What happens next?</h3>
        <ul>
          <li>
            <FiMail className="icon" />
            You'll receive an order confirmation email within the next few minutes
          </li>
          <li>
            <FiShoppingBag className="icon" />
            Your order will be processed and prepared for shipping within 1-2 business days
          </li>
          <li>
            <FiCheck className="icon" />
            You'll receive a shipping confirmation with tracking information once your order ships
          </li>
          <li>
            <FiHome className="icon" />
            Estimated delivery time is 3-5 business days for standard shipping
          </li>
        </ul>
      </NextSteps>

      <ActionButtons>
        <ActionButton to="/products" className="primary">
          <FiShoppingBag />
          Continue Shopping
        </ActionButton>
        <ActionButton to="/account/orders" className="secondary">
          View Order History
        </ActionButton>
      </ActionButtons>
    </SuccessContainer>
  );
};

export default OrderSuccess;
