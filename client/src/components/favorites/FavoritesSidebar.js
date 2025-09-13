import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useFavorites } from '../../contexts/FavoritesContext';
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

const FavoritesContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const EmptyFavorites = styled.div`
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

const FavoriteItem = styled(motion.div)`
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
    cursor: pointer;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  cursor: pointer;

  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
  }

  .price {
    color: #f5576c;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .description {
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.25rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.8rem;

  &.add-to-cart {
    background: #667eea;
    color: white;

    &:hover {
      background: #5a67d8;
      transform: scale(1.05);
    }
  }

  &.remove {
    background: #dc3545;
    color: white;

    &:hover {
      background: #c82333;
      transform: scale(1.05);
    }
  }
`;

const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e1e5e9;
  background: #f8f9fa;
`;

const ContinueShoppingButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 2px solid #f5576c;
  color: #f5576c;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f5576c;
    color: white;
  }
`;

const FavoritesSidebar = ({ isOpen, onClose }) => {
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const handleRemoveFromFavorites = (itemId) => {
    removeFavorite(itemId);
  };

  const handleItemClick = (itemId) => {
    onClose();
    navigate(`/products/${itemId}`);
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
                <FiHeart />
                Favorites ({favorites.length})
              </h2>
              <CloseButton onClick={onClose}>
                <FiX size={20} />
              </CloseButton>
            </Header>

            <FavoritesContent>
              {favorites.length === 0 ? (
                <EmptyFavorites>
                  <div className="icon">💝</div>
                  <h3>No favorites yet</h3>
                  <p>Save your favorite products here!</p>
                  <MagneticButton
                    onClick={handleContinueShopping}
                    style={{ padding: '0.75rem 1.5rem' }}
                  >
                    Discover Products
                  </MagneticButton>
                </EmptyFavorites>
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
                  {favorites.map((item) => (
                    <FavoriteItem
                      key={item._id}
                      variants={itemVariants}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, x: 100 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name}
                        onClick={() => handleItemClick(item._id)}
                      />
                      <ItemDetails onClick={() => handleItemClick(item._id)}>
                        <h4>{item.name}</h4>
                        <div className="price">₹{item.price}</div>
                        {item.description && (
                          <div className="description">
                            {item.description.substring(0, 50)}...
                          </div>
                        )}
                      </ItemDetails>
                      <ActionButtons>
                        <ActionButton
                          className="add-to-cart"
                          onClick={() => handleAddToCart(item)}
                          title="Add to Cart"
                        >
                          <FiShoppingCart size={14} />
                        </ActionButton>
                        <ActionButton
                          className="remove"
                          onClick={() => handleRemoveFromFavorites(item._id)}
                          title="Remove from Favorites"
                        >
                          <FiTrash2 size={14} />
                        </ActionButton>
                      </ActionButtons>
                    </FavoriteItem>
                  ))}
                </motion.div>
              )}
            </FavoritesContent>

            <Footer>
              <ContinueShoppingButton onClick={handleContinueShopping}>
                Continue Shopping
              </ContinueShoppingButton>
            </Footer>
          </SidebarContainer>
        </>
      )}
    </AnimatePresence>
  );
};

export default FavoritesSidebar;
