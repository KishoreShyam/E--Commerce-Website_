import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiEdit, 
  FiTrash2, 
  FiEye,
  FiPackage,
  FiDollarSign
} from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

const ProductsContainer = styled.div`
  padding: 0;
`;

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 45px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
  
  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const ProductCard = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  transition: all var(--transition-fast);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.image ? `url(${props.image})` : 'var(--bg-tertiary)'};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const ProductBadge = styled.span`
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: ${props => props.featured ? 'var(--color-warning)' : 'var(--color-success)'};
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
`;

const ProductContent = styled.div`
  padding: var(--spacing-lg);
`;

const ProductName = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm);
  line-height: 1.4;
`;

const ProductDescription = styled.p`
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--spacing-md);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const Price = styled.span`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
`;

const ComparePrice = styled.span`
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  text-decoration: line-through;
`;

const ProductStock = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: ${props => props.low ? 'var(--color-error)' : 'var(--color-success)'};
  font-size: var(--font-size-sm);
  font-weight: 500;
`;

const ProductActions = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
  
  &.danger:hover {
    border-color: var(--color-error);
    color: var(--color-error);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-secondary);
`;

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const queryClient = useQueryClient();

  const { data: productsData, isLoading, error, refetch } = useQuery(
    ['products', searchQuery, selectedCategory],
    () => axios.get('/api/products', {
      params: {
        search: searchQuery,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        limit: 50
      }
    }).then(res => res.data),
    {
      keepPreviousData: true
    }
  );

  // Create product mutation
  const createProductMutation = useMutation(
    (productData) => axios.post('/api/products', productData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
        toast.success('Product created successfully!');
        setShowCreateForm(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create product');
      }
    }
  );

  // Update product mutation
  const updateProductMutation = useMutation(
    ({ id, data }) => axios.put(`/api/products/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
        toast.success('Product updated successfully!');
        setEditingProduct(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update product');
      }
    }
  );

  // Delete product mutation
  const deleteProductMutation = useMutation(
    (id) => axios.delete(`/api/products/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
        toast.success('Product deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  );

  const handleCreateProduct = (productData) => {
    createProductMutation.mutate(productData);
  };

  const handleUpdateProduct = (id, productData) => {
    updateProductMutation.mutate({ id, data: productData });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  // Mock data for demonstration
  const mockProducts = [
    {
      _id: '1',
      name: 'iPhone 15 Pro Max',
      shortDescription: 'Latest iPhone with titanium design and A17 Pro chip',
      price: 1199,
      comparePrice: 1299,
      images: [{ url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', isMain: true }],
      inventory: { stock: 50, lowStockThreshold: 10 },
      featured: true,
      status: 'active'
    },
    {
      _id: '2',
      name: 'MacBook Pro 16-inch',
      shortDescription: 'Professional laptop with M3 Pro chip',
      price: 2499,
      comparePrice: 2699,
      images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', isMain: true }],
      inventory: { stock: 25, lowStockThreshold: 5 },
      featured: true,
      status: 'active'
    },
    {
      _id: '3',
      name: 'Premium Leather Jacket',
      shortDescription: 'Genuine leather jacket with modern design',
      price: 299,
      comparePrice: 399,
      images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', isMain: true }],
      inventory: { stock: 45, lowStockThreshold: 10 },
      featured: false,
      status: 'active'
    },
    {
      _id: '4',
      name: 'Smart Security Camera',
      shortDescription: '4K security camera with smart features',
      price: 199,
      comparePrice: 249,
      images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', isMain: true }],
      inventory: { stock: 75, lowStockThreshold: 15 },
      featured: false,
      status: 'active'
    },
    {
      _id: '5',
      name: 'Wireless Bluetooth Headphones',
      shortDescription: 'Wireless headphones with noise cancellation',
      price: 149,
      comparePrice: 199,
      images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', isMain: true }],
      inventory: { stock: 8, lowStockThreshold: 20 },
      featured: true,
      status: 'active'
    }
  ];

  const products = productsData?.products || mockProducts;

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading products..." />;
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProductsContainer>
      <ProductsHeader>
        <Title>Products</Title>
        <AddButton
          onClick={() => setShowCreateForm(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiPlus />
          Add Product
        </AddButton>
      </ProductsHeader>

      <FiltersContainer>
        <SearchContainer>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
        <FilterButton>
          <FiFilter />
          Filters
        </FilterButton>
      </FiltersContainer>

      {filteredProducts.length === 0 ? (
        <EmptyState>
          <FiPackage size={64} />
          <h3>No products found</h3>
          <p>Try adjusting your search criteria or add a new product.</p>
        </EmptyState>
      ) : (
        <ProductsGrid>
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductImage image={product.images?.[0]?.url}>
                {product.featured && (
                  <ProductBadge featured>Featured</ProductBadge>
                )}
                {product.inventory.stock <= product.inventory.lowStockThreshold && (
                  <ProductBadge>Low Stock</ProductBadge>
                )}
              </ProductImage>
              
              <ProductContent>
                <ProductName>{product.name}</ProductName>
                <ProductDescription>{product.shortDescription}</ProductDescription>
                
                <ProductMeta>
                  <ProductPrice>
                    <Price>${product.price}</Price>
                    {product.comparePrice && (
                      <ComparePrice>${product.comparePrice}</ComparePrice>
                    )}
                  </ProductPrice>
                  <ProductStock low={product.inventory.stock <= product.inventory.lowStockThreshold}>
                    <FiPackage />
                    {product.inventory.stock} in stock
                  </ProductStock>
                </ProductMeta>
                
                <ProductActions>
                  <ActionButton>
                    <FiEye />
                    View
                  </ActionButton>
                  <ActionButton>
                    <FiEdit />
                    Edit
                  </ActionButton>
                  <ActionButton className="danger">
                    <FiTrash2 />
                    onClick={() => handleDeleteProduct(product._id)}
                    Delete
                  </ActionButton>
                </ProductActions>
              </ProductContent>
            </ProductCard>
          ))}
        </ProductsGrid>
      )}

      {/* Product Creation/Edit Modal would go here */}
      {showCreateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3>Add New Product</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const productData = {
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                category: formData.get('category'),
                brand: formData.get('brand'),
                sku: formData.get('sku'),
                image: formData.get('image'),
                inventory: {
                  stock: parseInt(formData.get('stock')) || 0,
                  lowStockThreshold: 10
                },
                status: 'active',
                featured: formData.get('featured') === 'on'
              };
              handleCreateProduct(productData);
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Product Name</label>
                <input name="name" type="text" required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label>Description</label>
                <textarea name="description" required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', minHeight: '80px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label>Price</label>
                  <input name="price" type="number" step="0.01" required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
                </div>
                <div>
                  <label>Stock</label>
                  <input name="stock" type="number" required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label>Category</label>
                  <input name="category" type="text" required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
                </div>
                <div>
                  <label>Brand</label>
                  <input name="brand" type="text" required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label>SKU</label>
                  <input name="sku" type="text" required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
                </div>
                <div>
                  <label>Image URL</label>
                  <input name="image" type="url" style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label>
                  <input name="featured" type="checkbox" style={{ marginRight: '0.5rem' }} />
                  Featured Product
                </label>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setShowCreateForm(false)}
                  style={{ padding: '0.75rem 1.5rem', border: '1px solid #ccc', background: 'white', borderRadius: '6px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createProductMutation.isLoading}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px' 
                  }}
                >
                  {createProductMutation.isLoading ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProductsContainer>
  );
};

export default Products;
