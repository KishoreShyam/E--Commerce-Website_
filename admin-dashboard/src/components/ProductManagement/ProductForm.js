import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, 
  FiX, 
  FiPlus, 
  FiMinus, 
  FiImage,
  FiSave,
  FiEye,
  FiTrash2
} from 'react-icons/fi';

const FormContainer = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormSection = styled(motion.div)`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &:invalid {
    border-color: #ef4444;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ImageUploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragOver ? '#f0f9ff' : 'white'};
  border-color: ${props => props.isDragOver ? '#667eea' : '#d1d5db'};
  
  &:hover {
    border-color: #667eea;
    background: #f0f9ff;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreview = styled(motion.div)`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  border: 2px solid ${props => props.isMain ? '#667eea' : '#e5e7eb'};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageActions = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 4px;
`;

const ImageAction = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const VariantSection = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const VariantHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const RemoveButton = styled.button`
  padding: 0.25rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #dc2626;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f1f5f9;
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: #f3f4f6;
    color: #374151;
    border: 2px solid #e5e7eb;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
      transform: translateY(-2px);
    }
  `}
`;

const ProductForm = ({ product, onSave, onCancel, categories = [], brands = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    category: '',
    brand: '',
    sku: '',
    status: 'draft',
    featured: false,
    tags: '',
    images: [],
    variants: [],
    specifications: [],
    inventory: {
      stock: '',
      lowStockThreshold: '10',
      trackQuantity: true,
      allowBackorder: false
    },
    seo: {
      title: '',
      description: '',
      keywords: ''
    }
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        tags: product.tags?.join(', ') || '',
        seo: {
          title: product.seo?.title || '',
          description: product.seo?.description || '',
          keywords: product.seo?.keywords?.join(', ') || ''
        }
      });
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      isMain: formData.images.length === 0
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleImageRemove = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const handleSetMainImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isMain: img.id === imageId
      }))
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        id: Date.now(),
        name: '',
        options: [{ name: '', value: '', priceAdjustment: 0, stock: 0 }]
      }]
    }));
  };

  const removeVariant = (variantId) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== variantId)
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, {
        id: Date.now(),
        name: '',
        value: '',
        group: ''
      }]
    }));
  };

  const removeSpecification = (specId) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter(s => s.id !== specId)
    }));
  };

  const handleSubmit = async (status = 'draft') => {
    setIsLoading(true);
    
    try {
      const submitData = {
        ...formData,
        status,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords.split(',').map(kw => kw.trim()).filter(Boolean)
        }
      };

      await onSave(submitData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FormHeader>
        <Title>{product ? 'Edit Product' : 'Add New Product'}</Title>
      </FormHeader>

      <FormGrid>
        <MainForm>
          {/* Basic Information */}
          <FormSection
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SectionTitle>Basic Information</SectionTitle>
            
            <FormGroup>
              <Label>Product Name *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Short Description</Label>
              <TextArea
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Brief product description for listings"
                rows={3}
              />
            </FormGroup>

            <FormGroup>
              <Label>Full Description *</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed product description"
                rows={6}
                required
              />
            </FormGroup>
          </FormSection>

          {/* Pricing */}
          <FormSection
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SectionTitle>Pricing</SectionTitle>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormGroup>
                <Label>Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Compare Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.comparePrice}
                  onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                  placeholder="0.00"
                />
              </FormGroup>
            </div>
          </FormSection>

          {/* Images */}
          <FormSection
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SectionTitle><FiImage /> Product Images</SectionTitle>
            
            <ImageUploadArea
              isDragOver={isDragOver}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                handleImageUpload(e.dataTransfer.files);
              }}
              onClick={() => document.getElementById('image-upload').click()}
            >
              <FiUpload size={48} color="#9ca3af" />
              <p>Drag and drop images here, or click to select</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Supports: JPG, PNG, WebP (Max 5MB each)
              </p>
            </ImageUploadArea>

            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleImageUpload(e.target.files)}
            />

            {formData.images.length > 0 && (
              <ImageGrid>
                {formData.images.map((image) => (
                  <ImagePreview
                    key={image.id}
                    isMain={image.isMain}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <img src={image.url} alt="Product" />
                    <ImageActions>
                      {!image.isMain && (
                        <ImageAction
                          onClick={() => handleSetMainImage(image.id)}
                          title="Set as main image"
                        >
                          <FiEye />
                        </ImageAction>
                      )}
                      <ImageAction
                        onClick={() => handleImageRemove(image.id)}
                        title="Remove image"
                      >
                        <FiX />
                      </ImageAction>
                    </ImageActions>
                  </ImagePreview>
                ))}
              </ImageGrid>
            )}
          </FormSection>

          {/* Specifications */}
          <FormSection
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SectionTitle>
              Specifications
              <AddButton onClick={addSpecification}>
                <FiPlus /> Add Specification
              </AddButton>
            </SectionTitle>

            {formData.specifications.map((spec, index) => (
              <div key={spec.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', marginBottom: '1rem' }}>
                <Input
                  placeholder="Specification name"
                  value={spec.name}
                  onChange={(e) => {
                    const newSpecs = [...formData.specifications];
                    newSpecs[index].name = e.target.value;
                    setFormData(prev => ({ ...prev, specifications: newSpecs }));
                  }}
                />
                <Input
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) => {
                    const newSpecs = [...formData.specifications];
                    newSpecs[index].value = e.target.value;
                    setFormData(prev => ({ ...prev, specifications: newSpecs }));
                  }}
                />
                <RemoveButton onClick={() => removeSpecification(spec.id)}>
                  <FiTrash2 />
                </RemoveButton>
              </div>
            ))}
          </FormSection>
        </MainForm>

        <Sidebar>
          {/* Product Organization */}
          <FormSection
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SectionTitle>Organization</SectionTitle>
            
            <FormGroup>
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Brand *</Label>
              <Input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="Brand name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>SKU *</Label>
              <Input
                type="text"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                placeholder="Product SKU"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Tags</Label>
              <Input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </FormGroup>
          </FormSection>

          {/* Inventory */}
          <FormSection
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SectionTitle>Inventory</SectionTitle>
            
            <FormGroup>
              <Label>Stock Quantity</Label>
              <Input
                type="number"
                value={formData.inventory.stock}
                onChange={(e) => handleInputChange('inventory.stock', e.target.value)}
                placeholder="0"
              />
            </FormGroup>

            <FormGroup>
              <Label>Low Stock Threshold</Label>
              <Input
                type="number"
                value={formData.inventory.lowStockThreshold}
                onChange={(e) => handleInputChange('inventory.lowStockThreshold', e.target.value)}
                placeholder="10"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  checked={formData.inventory.trackQuantity}
                  onChange={(e) => handleInputChange('inventory.trackQuantity', e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Track Quantity
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  checked={formData.inventory.allowBackorder}
                  onChange={(e) => handleInputChange('inventory.allowBackorder', e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Allow Backorder
              </Label>
            </FormGroup>
          </FormSection>

          {/* Status */}
          <FormSection
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SectionTitle>Status</SectionTitle>
            
            <FormGroup>
              <Label>Product Status</Label>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Featured Product
              </Label>
            </FormGroup>
          </FormSection>
        </Sidebar>
      </FormGrid>

      <ActionButtons>
        <Button
          variant="secondary"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => handleSubmit('draft')}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiSave />
          Save Draft
        </Button>
        
        <Button
          variant="primary"
          onClick={() => handleSubmit('active')}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiSave />
          {product ? 'Update Product' : 'Publish Product'}
        </Button>
      </ActionButtons>
    </FormContainer>
  );
};

export default ProductForm;
