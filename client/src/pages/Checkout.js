import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiCreditCard, FiUser, FiMapPin, FiShield, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import PaymentMethods from '../components/checkout/PaymentMethods';
import AddressManager from '../components/address/AddressManager';
import { EnhancedPageTransition } from '../components/animations/EnhancedAnimations';

const CheckoutContainer = styled.div`
  margin-top: 70px;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  min-height: 80vh;
  background: var(--bg-primary, #ffffff);
  color: var(--text-primary, #333333);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 2rem;
  transition: color 0.2s ease;

  &:hover {
    color: #764ba2;
  }
`;

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const CheckoutForm = styled.div``;

const OrderSummary = styled.div`
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.1));
  height: fit-content;
  position: sticky;
  top: 90px;
`;

const Section = styled.section`
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.1));
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color, #e1e5e9);

  .icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.1rem;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary, #333333);
  }
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
  color: var(--text-primary, #333333);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid var(--border-color, #e1e5e9);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--bg-primary, #ffffff);
  color: var(--text-primary, #333333);

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
  border: 2px solid var(--border-color, #e1e5e9);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--bg-primary, #ffffff);
  color: var(--text-primary, #333333);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const PaymentOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PaymentOption = styled.div`
  border: 2px solid ${props => props.selected ? '#667eea' : 'var(--border-color, #e1e5e9)'};
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? 'rgba(102, 126, 234, 0.05)' : 'var(--bg-primary, #ffffff)'};

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }

  .icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: ${props => props.selected ? '#667eea' : 'var(--text-secondary, #666666)'};
  }

  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary, #333333);
  }
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color, #e1e5e9);

  &:last-child {
    border-bottom: none;
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
  }

  .details {
    flex: 1;

    h4 {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: var(--text-primary, #333333);
    }

    p {
      font-size: 0.8rem;
      color: var(--text-secondary, #666666);
      margin: 0;
    }
  }

  .price {
    font-weight: 600;
    color: #667eea;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: ${props => props.total ? '1rem' : '0.5rem'};
  border-bottom: ${props => props.total ? '2px solid var(--border-color, #e1e5e9)' : '1px solid var(--border-color, #e1e5e9)'};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .label {
    color: var(--text-secondary, #666666);
    font-weight: ${props => props.total ? '700' : '500'};
  }

  .value {
    font-weight: ${props => props.total ? '800' : '600'};
    color: ${props => props.total ? '#667eea' : 'var(--text-primary, #333333)'};
    font-size: ${props => props.total ? '1.25rem' : '1rem'};
  }
`;

const PlaceOrderButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
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

const Checkout = () => {
  const navigate = useNavigate();
  const { items: cart, totalPrice, totalItems, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment Information
    paymentMethod: 'credit',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingCountry: 'US',
    billingZip: ''
  });
  
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentMethodChange = (method) => {
    setFormData({
      ...formData,
      paymentMethod: method
    });
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleAddressChange = (address) => {
    setSelectedAddress(address);
    if (address) {
      setFormData(prev => ({
        ...prev,
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country || 'United States'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear cart and redirect to success page
      clearCart();
      navigate('/order-success', { 
        state: { 
          orderNumber: `LUX${Date.now()}`,
          total: total.toFixed(2)
        }
      });
    } catch (error) {
      console.error('Order failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = totalPrice;
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <CheckoutContainer>
        <Header>
          <Title>Checkout</Title>
        </Header>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before proceeding to checkout.</p>
          <Link 
            to="/products" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontWeight: '600',
              marginTop: '1rem'
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <BackButton to="/cart">
        <FiArrowLeft /> Back to Cart
      </BackButton>
      
      <Header>
        <Title>Checkout</Title>
      </Header>

      <form onSubmit={handleSubmit}>
        <CheckoutContent>
          <CheckoutForm>
            {/* Address Management */}
            <Section>
              <SectionHeader>
                <div className="icon">
                  <FiMapPin />
                </div>
                <h2>Shipping Information</h2>
              </SectionHeader>
              
              <AddressManager
                selectedAddressId={selectedAddressId}
                onAddressSelect={handleAddressSelect}
                onAddressChange={handleAddressChange}
              />

              {/* Contact Information */}
              <FormGrid style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </FormGrid>
            </Section>

            {/* Payment Information */}
            <Section>
              <SectionHeader>
                <div className="icon">
                  <FiCreditCard />
                </div>
                <h2>Payment Information</h2>
              </SectionHeader>
              
              <PaymentMethods
                formData={formData}
                handleChange={handleChange}
                handlePaymentMethodChange={handlePaymentMethodChange}
              />
            </Section>
          </CheckoutForm>

          <OrderSummary>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
              Order Summary
            </h2>
            
            <div style={{ marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
              {cart.map((item) => (
                <OrderItem key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="price">₹{(item.price * item.quantity).toFixed(2)}</div>
                </OrderItem>
              ))}
            </div>
            
            <SummaryRow>
              <span className="label">Subtotal ({totalItems} items)</span>
              <span className="value">₹{subtotal.toFixed(2)}</span>
            </SummaryRow>
            
            <SummaryRow>
              <span className="label">Shipping</span>
              <span className="value">
                {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
              </span>
            </SummaryRow>
            
            <SummaryRow>
              <span className="label">Tax</span>
              <span className="value">₹{tax.toFixed(2)}</span>
            </SummaryRow>
            
            <SummaryRow total>
              <span className="label">Total</span>
              <span className="value">₹{total.toFixed(2)}</span>
            </SummaryRow>

            <PlaceOrderButton
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Processing...' : (
                <>
                  <FiCheck /> Place Order
                </>
              )}
            </PlaceOrderButton>
          </OrderSummary>
        </CheckoutContent>
      </form>
    </CheckoutContainer>
  );
};

export default Checkout;
