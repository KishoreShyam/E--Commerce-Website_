import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiArrowLeft, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { products as productData } from '../data/products';

const ProductDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--primary);
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 2rem;
  padding: 0.5rem 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageSection = styled.div`
  position: relative;
`;

const ProductImage = styled(motion.img)`
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const Badge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${props => props.type === 'sale' ? '#e53e3e' : '#38a169'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Category = styled.span`
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  margin: 0;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled(FiStar)`
  width: 16px;
  height: 16px;
  fill: ${props => props.filled ? '#fbbf24' : 'none'};
  color: #fbbf24;
`;

const RatingText = styled.span`
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CurrentPrice = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
`;

const OriginalPrice = styled.span`
  font-size: 1.25rem;
  color: var(--text-secondary);
  text-decoration: line-through;
`;

const Discount = styled.span`
  background: #e53e3e;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const Description = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 1.1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const AddToCartButton = styled(motion.button)`
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const FavoriteButton = styled(motion.button)`
  background: ${props => props.isFavorite ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${props => props.isFavorite ? 'white' : '#667eea'};
  border: 2px solid #667eea;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 12px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .icon {
    color: var(--primary);
    font-size: 1.25rem;
  }
  
  .text {
    font-weight: 500;
    color: var(--text-primary);
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use centralized product data
  const mockProducts = productData;

  useEffect(() => {
    // Find product by ID
    const foundProduct = mockProducts.find(p => p._id === id);
    setProduct(foundProduct);
    setLoading(false);
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} filled />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" filled />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} />);
    }

    return stars;
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleFavorite = () => {
    if (isFavorite(product._id)) {
      removeFavorite(product._id);
    } else {
      addFavorite(product);
    }
  };

  if (loading) {
    return (
      <ProductDetailContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Loading...</h2>
        </div>
      </ProductDetailContainer>
    );
  }

  if (!product) {
    return (
      <ProductDetailContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <BackButton onClick={() => navigate('/products')}>
            <FiArrowLeft /> Back to Products
          </BackButton>
        </div>
      </ProductDetailContainer>
    );
  }

  return (
    <ProductDetailContainer>
      <BackButton
        onClick={() => navigate('/products')}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowLeft /> Back to Products
      </BackButton>

      <ProductGrid>
        <ImageSection>
          <ProductImage
            src={product.image}
            alt={product.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          {product.badge && (
            <Badge type={product.badge}>
              {product.badge === 'sale' ? 'SALE' : 'NEW'}
            </Badge>
          )}
        </ImageSection>

        <ProductInfo>
          <Category>{product.category}</Category>
          <ProductTitle>{product.name}</ProductTitle>
          
          <Rating>
            <Stars>{renderStars(product.rating)}</Stars>
            <RatingText>({product.reviewCount} reviews)</RatingText>
          </Rating>

          <PriceSection>
            <CurrentPrice>₹{product.price}</CurrentPrice>
            {product.originalPrice && (
              <>
                <OriginalPrice>₹{product.originalPrice}</OriginalPrice>
                <Discount>
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Discount>
              </>
            )}
          </PriceSection>

          <Description>{product.description}</Description>

          <ActionButtons>
            <AddToCartButton
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiShoppingCart /> Add to Cart
            </AddToCartButton>
            <FavoriteButton
              onClick={handleToggleFavorite}
              isFavorite={isFavorite(product._id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiHeart />
            </FavoriteButton>
          </ActionButtons>
        </ProductInfo>
      </ProductGrid>

      <Features>
        <Feature>
          <FiTruck className="icon" />
          <span className="text">Free Shipping on orders over ₹2000</span>
        </Feature>
        <Feature>
          <FiShield className="icon" />
          <span className="text">1 Year Warranty</span>
        </Feature>
        <Feature>
          <FiRefreshCw className="icon" />
          <span className="text">30-Day Easy Returns</span>
        </Feature>
      </Features>
    </ProductDetailContainer>
  );
};

export default ProductDetail;
