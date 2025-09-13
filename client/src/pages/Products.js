import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiStar, FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { products as productData } from '../data/products';

const ProductsContainer = styled.div`
  margin-top: 70px;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.active ? '#667eea' : '#e1e5e9'};
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: ${props => props.active ? '#667eea' : 'rgba(102, 126, 234, 0.1)'};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  position: relative;
  height: 250px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const ProductBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${props => props.type === 'sale' ? '#e53e3e' : '#38a169'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ProductActions = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(0) !important;
  transition: all 0.3s ease;
  z-index: 100;
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95) !important;
  color: #333;
  display: flex !important;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  opacity: 1 !important;
  visibility: visible !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #667eea !important;
    color: white;
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductCategory = styled.div`
  font-size: 0.75rem;
  color: #667eea;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const ProductDescription = styled.p`
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.125rem;
`;

const Star = styled(FiStar)`
  width: 14px;
  height: 14px;
  fill: ${props => props.filled ? '#fbbf24' : 'none'};
  color: #fbbf24;
`;

const RatingText = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CurrentPrice = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
`;

const Discount = styled.span`
  font-size: 0.75rem;
  color: #e53e3e;
  font-weight: 600;
  background: rgba(229, 62, 62, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const AddToCartButton = styled(motion.button)`
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: #666;
`;

// Use centralized product data
const mockProducts = productData;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const categories = ['All', 'Electronics', 'Fashion', 'Beauty', 'Accessories', 'Food & Beverage', 'Sports'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, activeCategory, searchTerm]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleToggleFavorite = (product) => {
    toggleFavorite(product);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} filled={index < Math.floor(rating)} />
    ));
  };

  if (loading) {
    return (
      <ProductsContainer>
        <LoadingSpinner>Loading products...</LoadingSpinner>
      </ProductsContainer>
    );
  }

  return (
    <ProductsContainer>
      <Header>
        <Title>Our Products</Title>
        <Subtitle>
          Discover our curated collection of premium products, carefully selected for quality and style.
        </Subtitle>
      </Header>

      <FilterSection>
        <SearchBox>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>

        <FilterButtons>
          {categories.map(category => (
            <FilterButton
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </FilterButton>
          ))}
        </FilterButtons>
      </FilterSection>

      <ProductGrid>
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
          >
            <ProductImage>
              <img src={product.image} alt={product.name} />
              {product.badge && (
                <ProductBadge type={product.badge}>
                  {product.badge}
                </ProductBadge>
              )}
              <ProductActions>
                <ActionButton
                  onClick={() => handleAddToCart(product)}
                  title="Add to Cart"
                >
                  <FiShoppingCart />
                </ActionButton>
                <ActionButton
                  onClick={() => handleToggleFavorite(product)}
                  style={{ 
                    background: isFavorite(product._id) ? '#e53e3e' : 'rgba(255, 255, 255, 0.9)',
                    color: isFavorite(product._id) ? 'white' : '#333'
                  }}
                  title="Add to Favorites"
                >
                  <FiHeart />
                </ActionButton>
                <ActionButton as={Link} to={`/products/${product._id}`} title="View Details">
                  <FiEye />
                </ActionButton>
              </ProductActions>
            </ProductImage>

            <ProductInfo>
              <ProductCategory>{product.category}</ProductCategory>
              <ProductName>{product.name}</ProductName>
              <ProductDescription>{product.description}</ProductDescription>
              
              <ProductRating>
                <Stars>{renderStars(product.rating)}</Stars>
                <RatingText>({product.reviewCount})</RatingText>
              </ProductRating>

              <ProductPrice>
                <CurrentPrice>₹{product.price}</CurrentPrice>
                {product.originalPrice && (
                  <>
                    <OriginalPrice>₹{product.originalPrice}</OriginalPrice>
                    <Discount>
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Discount>
                  </>
                )}
              </ProductPrice>

              <AddToCartButton
                onClick={() => handleAddToCart(product)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiShoppingCart />
                Add to Cart
              </AddToCartButton>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </ProductsContainer>
  );
};

export default Products;
