import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingBag, FiMinus, FiPlus, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`;

const Sidebar = styled(motion.div)`
  width: 420px;
  height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: -10px 0 50px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  @media (max-width: 480px) {
    width: 100vw;
  }
`;

const Header = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); }
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CloseButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const CartContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 3px;
  }
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #64748b;

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #334155;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

const CartItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
`;

const ItemDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemPrice = styled.p`
  font-size: 0.85rem;
  font-weight: 700;
  color: #667eea;
  margin: 0;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.25rem;
`;

const QuantityButton = styled(motion.button)`
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Quantity = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  min-width: 20px;
  text-align: center;
  color: #334155;
`;

const RemoveButton = styled(motion.button)`
  background: #fee2e2;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #dc2626;

  &:hover {
    background: #fecaca;
  }
`;

const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: white;
`;

const TotalSection = styled.div`
  margin-bottom: 1.5rem;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &.total {
    font-size: 1.1rem;
    font-weight: 700;
    padding-top: 0.5rem;
    border-top: 1px solid #e2e8f0;
    color: #667eea;
  }
`;

const CheckoutButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  }
`;

const CartSidebar = () => {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart 
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const sidebarVariants = {
    hidden: {
      x: '100%',
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const itemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
        >
          <Sidebar
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <HeaderContent>
                <Title>
                  <FiShoppingBag />
                  Cart ({totalItems})
                </Title>
                <CloseButton
                  onClick={closeCart}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX />
                </CloseButton>
              </HeaderContent>
            </Header>

            <CartContent>
              {items.length === 0 ? (
                <EmptyCart>
                  <FiShoppingBag className="icon" />
                  <h3>Your cart is empty</h3>
                  <p>Add some items to get started!</p>
                </EmptyCart>
              ) : (
                <motion.div variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      variants={itemVariants}
                      layout
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <ItemImage src={item.image} alt={item.name} />
                      <ItemDetails>
                        <ItemName>{item.name}</ItemName>
                        <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                      </ItemDetails>
                      <QuantityControls>
                        <QuantityButton
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiMinus />
                        </QuantityButton>
                        <Quantity>{item.quantity}</Quantity>
                        <QuantityButton
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiPlus />
                        </QuantityButton>
                      </QuantityControls>
                      <RemoveButton
                        onClick={() => removeFromCart(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiTrash2 />
                      </RemoveButton>
                    </CartItem>
                  ))}
                </motion.div>
              )}
            </CartContent>

            {items.length > 0 && (
              <Footer>
                <TotalSection>
                  <TotalRow>
                    <span>Subtotal:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </TotalRow>
                  <TotalRow>
                    <span>Shipping:</span>
                    <span>{totalPrice > 2000 ? 'FREE' : '₹150.00'}</span>
                  </TotalRow>
                  <TotalRow className="total">
                    <span>Total:</span>
                    <span>₹{(totalPrice + (totalPrice > 2000 ? 0 : 150)).toFixed(2)}</span>
                  </TotalRow>
                </TotalSection>
                <CheckoutButton
                  onClick={handleCheckout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                  <FiArrowRight />
                </CheckoutButton>
              </Footer>
            )}
          </Sidebar>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
