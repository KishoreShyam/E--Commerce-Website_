import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';

const CartContainer = styled.div`
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

const CartCount = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary, #666666);
  margin: 0;
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const CartItems = styled.div``;

const CartItem = styled(motion.div)`
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.1));
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 1rem;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px var(--shadow-color, rgba(0, 0, 0, 0.15));
  }

  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }
`;

const ItemImage = styled.div`
  img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 12px;
  }
`;

const ItemDetails = styled.div`
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-primary, #333333);
  }

  p {
    color: var(--text-secondary, #666666);
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }

  .price {
    font-size: 1.1rem;
    font-weight: 700;
    color: #667eea;
    margin-top: 0.5rem;
  }
`;

const ItemActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary, #f8f9fa);
  border-radius: 8px;
  padding: 0.25rem;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: var(--bg-primary, #ffffff);
  color: var(--text-primary, #333333);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px var(--shadow-color, rgba(0, 0, 0, 0.1));

  &:hover {
    background: #667eea;
    color: white;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Quantity = styled.span`
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary, #333333);
`;

const RemoveButton = styled.button`
  background: #fee;
  color: #e53e3e;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e53e3e;
    color: white;
    transform: scale(1.05);
  }
`;

const CartSummary = styled.div`
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.1));
  height: fit-content;
  position: sticky;
  top: 90px;
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary, #333333);
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
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

const CheckoutButton = styled(motion.button)`
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
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary, #666666);

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: #ccc;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-primary, #333333);
  }

  p {
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`;

const ContinueShoppingButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }
`;

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount, clearCart } = useCart();

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <CartContainer>
        <Header>
          <Title>Shopping Cart</Title>
          <CartCount>Your cart is currently empty</CartCount>
        </Header>
        
        <EmptyCart>
          <div className="icon">
            <FiShoppingBag />
          </div>
          <h2>Your cart is empty</h2>
          <p>
            Looks like you haven't added any items to your cart yet.<br />
            Start shopping to fill it up with amazing products!
          </p>
          <ContinueShoppingButton to="/products">
            <FiShoppingCart />
            Continue Shopping
          </ContinueShoppingButton>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <Header>
        <Title>Shopping Cart</Title>
        <CartCount>{getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in your cart</CartCount>
      </Header>

      <CartContent>
        <CartItems>
          {cart.map((item, index) => (
            <CartItem
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ItemImage>
                <img src={item.image} alt={item.name} />
              </ItemImage>
              
              <ItemDetails>
                <h3>{item.name}</h3>
                <p>Category: {item.category}</p>
                <p>Size: {item.size || 'Standard'}</p>
                <div className="price">₹{item.price}</div>
              </ItemDetails>
              
              <ItemActions>
                <QuantityControls>
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus />
                  </QuantityButton>
                  <Quantity>{item.quantity}</Quantity>
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <FiPlus />
                  </QuantityButton>
                </QuantityControls>
                
                <RemoveButton onClick={() => removeFromCart(item.id)}>
                  <FiTrash2 />
                </RemoveButton>
              </ItemActions>
            </CartItem>
          ))}
        </CartItems>

        <CartSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          
          <SummaryRow>
            <span className="label">Subtotal ({getCartCount()} items)</span>
            <span className="value">${subtotal.toFixed(2)}</span>
          </SummaryRow>
          
          <SummaryRow>
            <span className="label">Shipping</span>
            <span className="value">
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </span>
          </SummaryRow>
          
          <SummaryRow>
            <span className="label">Tax</span>
            <span className="value">${tax.toFixed(2)}</span>
          </SummaryRow>
          
          <SummaryRow total>
            <span className="label">Total</span>
            <span className="value">${total.toFixed(2)}</span>
          </SummaryRow>

          <CheckoutButton
            as={Link}
            to="/checkout"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Proceed to Checkout <FiArrowRight />
          </CheckoutButton>
          
          <ContinueShoppingButton 
            to="/products" 
            style={{ 
              marginTop: '1rem', 
              background: 'transparent', 
              color: '#667eea', 
              border: '2px solid #667eea',
              fontSize: '0.9rem'
            }}
          >
            Continue Shopping
          </ContinueShoppingButton>
        </CartSummary>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;
