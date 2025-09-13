import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingBag, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { MagneticButton } from '../animations/EnhancedAnimations';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
`;

const SidebarContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    width: 100vw;
  }
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }
`;

const CartContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    margin-bottom: 0.5rem;
    color: #333;
  }

  p {
    margin-bottom: 1.5rem;
    opacity: 0.7;
  }
`;

const CartItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: white;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const ItemDetails = styled.div`
  flex: 1;

  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
  }

  .price {
    color: #667eea;
    font-weight: 600;
    font-size: 0.9rem;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;

  button {
    width: 28px;
    height: 28px;
    border: 1px solid #e1e5e9;
    background: white;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #f8f9fa;
      border-color: #667eea;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    min-width: 30px;
    text-align: center;
    font-weight: 600;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(220, 53, 69, 0.1);
    transform: scale(1.1);
  }
`;

const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e1e5e9;
  background: #f8f9fa;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const CheckoutButton = styled(MagneticButton)`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ContinueShoppingButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 2px solid #667eea;
  color: #667eea;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const CartSidebar = ({ isOpen, onClose }) => {
  const { items: cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/products');
  };

  const sidebarVariants = {
    closed: { x: '100%' },
    open: { x: 0 }
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />
          <SidebarContainer
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Header>
              <h2>
                <FiShoppingBag />
                Shopping Cart ({totalItems})
              </h2>
              <CloseButton onClick={onClose}>
                <FiX size={20} />
              </CloseButton>
            </Header>

            <CartContent>
              {cart.length === 0 ? (
                <EmptyCart>
                  <div className="icon">🛒</div>
                  <h3>Your cart is empty</h3>
                  <p>Add some products to get started!</p>
                  <MagneticButton
                    onClick={handleContinueShopping}
                    style={{ padding: '0.75rem 1.5rem' }}
                  >
                    Start Shopping
                  </MagneticButton>
                </EmptyCart>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      variants={itemVariants}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, x: 100 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <img src={item.image} alt={item.name} />
                      <ItemDetails>
                        <h4>{item.name}</h4>
                        <div className="price">₹{item.price}</div>
                        <QuantityControls>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus size={12} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <FiPlus size={12} />
                          </button>
                        </QuantityControls>
                      </ItemDetails>
                      <RemoveButton
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FiTrash2 size={16} />
                      </RemoveButton>
                    </CartItem>
                  ))}
                </motion.div>
              )}
            </CartContent>

            {cart.length > 0 && (
              <Footer>
                <TotalRow>
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </TotalRow>
                <CheckoutButton onClick={handleCheckout}>
                  Proceed to Checkout
                </CheckoutButton>
                <ContinueShoppingButton onClick={handleContinueShopping}>
                  Continue Shopping
                </ContinueShoppingButton>
              </Footer>
            )}
          </SidebarContainer>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
