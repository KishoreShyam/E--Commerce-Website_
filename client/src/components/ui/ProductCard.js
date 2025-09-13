import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiEye, FiStar } from 'react-icons/fi';
import Button from './Button';

const CardContainer = styled(motion.div)`
  position: relative;
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const ProductImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
`;

const ImageOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const ActionButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    transform: scale(1.1);
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: #667eea;
  }
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Badge = styled(motion.span)`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${props => props.type === 'sale' && `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
  `}
  
  ${props => props.type === 'new' && `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  `}
  
  ${props => props.type === 'featured' && `
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
  `}
`;

const WishlistButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  z-index: 2;
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.isWishlisted ? '#ef4444' : '#6b7280'};
    fill: ${props => props.isWishlisted ? '#ef4444' : 'none'};
    transition: all 0.3s ease;
  }
`;

const ContentContainer = styled.div`
  padding: 1.5rem;
`;

const ProductTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductCategory = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.125rem;
`;

const Star = styled(FiStar)`
  width: 16px;
  height: 16px;
  color: ${props => props.filled ? '#fbbf24' : '#d1d5db'};
  fill: ${props => props.filled ? '#fbbf24' : 'none'};
`;

const RatingText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const PriceGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CurrentPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #9ca3af;
  text-decoration: line-through;
`;

const Discount = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #ef4444;
`;

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(product?.isWishlisted || false);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product.id, !isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} filled={index < Math.floor(rating)} />
    ));
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -12 }
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <CardContainer
      className={className}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <ImageContainer>
        <ProductImage
          src={product.image}
          alt={product.name}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
        
        <BadgeContainer>
          {product.isOnSale && (
            <Badge
              type="sale"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Sale
            </Badge>
          )}
          {product.isNew && (
            <Badge
              type="new"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              New
            </Badge>
          )}
          {product.isFeatured && (
            <Badge
              type="featured"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              Featured
            </Badge>
          )}
        </BadgeContainer>

        <WishlistButton
          isWishlisted={isWishlisted}
          onClick={handleWishlistClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiHeart />
        </WishlistButton>

        <AnimatePresence>
          {isHovered && (
            <ImageOverlay
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <ActionButton
                onClick={handleQuickView}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiEye />
              </ActionButton>
              <ActionButton
                onClick={handleAddToCart}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiShoppingCart />
              </ActionButton>
            </ImageOverlay>
          )}
        </AnimatePresence>
      </ImageContainer>

      <ContentContainer>
        <ProductCategory>{product.category}</ProductCategory>
        <ProductTitle>{product.name}</ProductTitle>
        
        <RatingContainer>
          <StarRating>
            {renderStars(product.rating)}
          </StarRating>
          <RatingText>({product.reviewCount})</RatingText>
        </RatingContainer>

        <PriceContainer>
          <PriceGroup>
            <CurrentPrice>${product.price}</CurrentPrice>
            {product.originalPrice && product.originalPrice > product.price && (
              <OriginalPrice>${product.originalPrice}</OriginalPrice>
            )}
          </PriceGroup>
          {product.originalPrice && product.originalPrice > product.price && (
            <Discount>
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Discount>
          )}
        </PriceContainer>

        <Button
          variant="primary"
          size="sm"
          onClick={handleAddToCart}
          style={{ width: '100%' }}
        >
          Add to Cart
        </Button>
      </ContentContainer>
    </CardContainer>
  );
};

export default ProductCard;
