import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiPlus, FiEdit3, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { MagneticButton } from '../animations/EnhancedAnimations';

const AddressContainer = styled.div`
  margin-bottom: 2rem;
`;

const AddressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const AddAddressButton = styled(MagneticButton)`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const AddressCard = styled(motion.div)`
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e5e9'};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? 'rgba(102, 126, 234, 0.05)' : 'white'};
  position: relative;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  }

  .address-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    .address-type {
      background: ${props => props.selected ? '#667eea' : '#f8f9fa'};
      color: ${props => props.selected ? 'white' : '#667eea'};
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
  }

  &:hover .actions {
    opacity: 1;
  }

  .address-content {
    .name {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .address-line {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
      margin-bottom: 0.25rem;
    }

    .phone {
      color: #667eea;
      font-size: 0.9rem;
      font-weight: 500;
      margin-top: 0.5rem;
    }
  }

  .selected-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #667eea;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.8rem;
    opacity: ${props => props.selected ? 1 : 0};
    transform: scale(${props => props.selected ? 1 : 0.5});
    transition: all 0.3s ease;
  }
`;

const ActionButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &.edit {
    background: #667eea;
    color: white;

    &:hover {
      background: #5a67d8;
      transform: scale(1.1);
    }
  }

  &.delete {
    background: #dc3545;
    color: white;

    &:hover {
      background: #c82333;
      transform: scale(1.1);
    }
  }
`;

const AddressForm = styled(motion.div)`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
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
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

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
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const AddressManager = ({ selectedAddressId, onAddressSelect, onAddressChange }) => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    // Load saved addresses from localStorage
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      const parsedAddresses = JSON.parse(savedAddresses);
      setAddresses(parsedAddresses);
      
      // Auto-select default address if no address is selected
      if (!selectedAddressId) {
        const defaultAddress = parsedAddresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          onAddressSelect(defaultAddress.id);
          onAddressChange(defaultAddress);
        }
      }
    }
  }, [selectedAddressId, onAddressSelect, onAddressChange]);

  const saveAddresses = (newAddresses) => {
    localStorage.setItem('userAddresses', JSON.stringify(newAddresses));
    setAddresses(newAddresses);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const addressData = {
      ...formData,
      id: editingAddress ? editingAddress.id : Date.now().toString(),
      createdAt: editingAddress ? editingAddress.createdAt : new Date().toISOString()
    };

    let newAddresses;
    if (editingAddress) {
      newAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? addressData : addr
      );
    } else {
      newAddresses = [...addresses, addressData];
    }

    // If this is set as default, remove default from others
    if (formData.isDefault) {
      newAddresses = newAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressData.id
      }));
    }

    saveAddresses(newAddresses);
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      type: 'home',
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      phone: '',
      isDefault: false
    });

    // Auto-select the new/edited address
    onAddressSelect(addressData.id);
    onAddressChange(addressData);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowForm(true);
  };

  const handleDelete = (addressId) => {
    const newAddresses = addresses.filter(addr => addr.id !== addressId);
    saveAddresses(newAddresses);
    
    if (selectedAddressId === addressId) {
      const defaultAddress = newAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        onAddressSelect(defaultAddress.id);
        onAddressChange(defaultAddress);
      } else if (newAddresses.length > 0) {
        onAddressSelect(newAddresses[0].id);
        onAddressChange(newAddresses[0]);
      } else {
        onAddressSelect(null);
        onAddressChange(null);
      }
    }
  };

  const handleAddressSelect = (address) => {
    onAddressSelect(address.id);
    onAddressChange(address);
  };

  return (
    <AddressContainer>
      <AddressHeader>
        <h3>Delivery Address</h3>
        <AddAddressButton
          onClick={() => setShowForm(true)}
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        >
          <FiPlus /> Add Address
        </AddAddressButton>
      </AddressHeader>

      <AnimatePresence>
        {showForm && (
          <AddressForm
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 style={{ marginBottom: '1.5rem', color: '#333' }}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h4>
            
            <form onSubmit={handleSubmit}>
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="type">Address Type</Label>
                  <Select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Set as default address
                  </Label>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup className="full-width">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup className="full-width">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup className="full-width">
                  <Label htmlFor="apartment">Apartment, suite, etc. (Optional)</Label>
                  <Input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="city">City</Label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="state">State</Label>
                  <Select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select State</option>
                    <option value="AL">Alabama</option>
                    <option value="CA">California</option>
                    <option value="FL">Florida</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    {/* Add more states as needed */}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormGrid>

              <FormActions>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAddress(null);
                    setFormData({
                      type: 'home',
                      firstName: '',
                      lastName: '',
                      company: '',
                      address: '',
                      apartment: '',
                      city: '',
                      state: '',
                      zipCode: '',
                      country: 'US',
                      phone: '',
                      isDefault: false
                    });
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '2px solid #e1e5e9',
                    background: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <MagneticButton type="submit" style={{ padding: '0.75rem 1.5rem' }}>
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </MagneticButton>
              </FormActions>
            </form>
          </AddressForm>
        )}
      </AnimatePresence>

      {addresses.length > 0 && (
        <AddressGrid>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              selected={selectedAddressId === address.id}
              onClick={() => handleAddressSelect(address)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <div className="address-header">
                <div className="address-type">{address.type}</div>
                <div className="actions">
                  <ActionButton
                    className="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(address);
                    }}
                  >
                    <FiEdit3 size={12} />
                  </ActionButton>
                  <ActionButton
                    className="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(address.id);
                    }}
                  >
                    <FiTrash2 size={12} />
                  </ActionButton>
                </div>
              </div>
              
              <div className="address-content">
                <div className="name">
                  {address.firstName} {address.lastName}
                </div>
                {address.company && (
                  <div className="address-line">{address.company}</div>
                )}
                <div className="address-line">{address.address}</div>
                {address.apartment && (
                  <div className="address-line">{address.apartment}</div>
                )}
                <div className="address-line">
                  {address.city}, {address.state} {address.zipCode}
                </div>
                <div className="phone">{address.phone}</div>
              </div>
              
              <div className="selected-indicator">✓</div>
            </AddressCard>
          ))}
        </AddressGrid>
      )}

      {addresses.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: '#666',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '2px dashed #e1e5e9'
          }}
        >
          <FiMapPin size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>No addresses saved</h3>
          <p style={{ marginBottom: '1.5rem' }}>Add your first delivery address to continue</p>
          <MagneticButton
            onClick={() => setShowForm(true)}
            style={{ padding: '0.75rem 1.5rem' }}
          >
            <FiPlus style={{ marginRight: '0.5rem' }} />
            Add Address
          </MagneticButton>
        </motion.div>
      )}
    </AddressContainer>
  );
};

export default AddressManager;
