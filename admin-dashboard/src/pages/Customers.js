import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiEdit, 
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiCalendar
} from 'react-icons/fi';
import { useQuery } from 'react-query';
import axios from 'axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CustomersContainer = styled.div`
  padding: 0;
`;

const CustomersHeader = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const Title = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
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

const CustomersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
`;

const CustomerCard = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  transition: all var(--transition-fast);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
  }
`;

const CustomerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const CustomerAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: var(--font-size-xl);
  flex-shrink: 0;
`;

const CustomerInfo = styled.div`
  flex: 1;
`;

const CustomerName = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
`;

const CustomerRole = styled.span`
  padding: var(--spacing-xs) var(--spacing-sm);
  background: ${props => props.role === 'admin' ? 'var(--color-warning)20' : 'var(--color-success)20'};
  color: ${props => props.role === 'admin' ? 'var(--color-warning)' : 'var(--color-success)'};
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
`;

const CustomerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
`;

const DetailIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
`;

const CustomerStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const StatItem = styled.div`
  text-align: center;
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
`;

const StatValue = styled.div`
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
`;

const StatLabel = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
`;

const CustomerActions = styled.div`
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
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-secondary);
`;

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: customersData, isLoading, error } = useQuery(
    ['customers', searchQuery],
    () => axios.get('/api/customers', {
      params: {
        search: searchQuery,
        limit: 50
      }
    }).then(res => res.data),
    {
      keepPreviousData: true
    }
  );

  // Mock data for demonstration
  const mockCustomers = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0101',
      role: 'customer',
      addresses: [{
        city: 'New York',
        state: 'NY',
        country: 'United States'
      }],
      createdAt: '2024-01-10T10:30:00Z',
      stats: {
        totalOrders: 12,
        totalSpent: 2499.99
      }
    },
    {
      _id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-0102',
      role: 'customer',
      addresses: [{
        city: 'Los Angeles',
        state: 'CA',
        country: 'United States'
      }],
      createdAt: '2024-01-08T14:20:00Z',
      stats: {
        totalOrders: 8,
        totalSpent: 1299.99
      }
    },
    {
      _id: '3',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@luxecommerce.com',
      phone: '+1-555-0100',
      role: 'admin',
      addresses: [{
        city: 'San Francisco',
        state: 'CA',
        country: 'United States'
      }],
      createdAt: '2024-01-01T09:00:00Z',
      stats: {
        totalOrders: 0,
        totalSpent: 0
      }
    },
    {
      _id: '4',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1-555-0103',
      role: 'customer',
      addresses: [{
        city: 'Chicago',
        state: 'IL',
        country: 'United States'
      }],
      createdAt: '2024-01-05T16:45:00Z',
      stats: {
        totalOrders: 5,
        totalSpent: 899.99
      }
    },
    {
      _id: '5',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1-555-0104',
      role: 'customer',
      addresses: [{
        city: 'Miami',
        state: 'FL',
        country: 'United States'
      }],
      createdAt: '2024-01-03T11:30:00Z',
      stats: {
        totalOrders: 15,
        totalSpent: 3299.99
      }
    }
  ];

  const customers = customersData?.customers || mockCustomers;

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading customers..." />;
  }

  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery)
  );

  const getUserInitials = (customer) => {
    return `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLocation = (customer) => {
    const address = customer.addresses?.[0];
    if (!address) return 'No address';
    return `${address.city}, ${address.state}`;
  };

  return (
    <CustomersContainer>
      <CustomersHeader>
        <Title>Customers</Title>
      </CustomersHeader>

      <FiltersContainer>
        <SearchContainer>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </FiltersContainer>

      {filteredCustomers.length === 0 ? (
        <EmptyState>
          <FiUser size={64} />
          <h3>No customers found</h3>
          <p>Try adjusting your search criteria.</p>
        </EmptyState>
      ) : (
        <CustomersGrid>
          {filteredCustomers.map((customer, index) => (
            <CustomerCard
              key={customer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CustomerHeader>
                <CustomerAvatar>
                  {getUserInitials(customer)}
                </CustomerAvatar>
                <CustomerInfo>
                  <CustomerName>
                    {customer.firstName} {customer.lastName}
                  </CustomerName>
                  <CustomerRole role={customer.role}>
                    {customer.role}
                  </CustomerRole>
                </CustomerInfo>
              </CustomerHeader>

              <CustomerDetails>
                <DetailItem>
                  <DetailIcon>
                    <FiMail />
                  </DetailIcon>
                  {customer.email}
                </DetailItem>
                {customer.phone && (
                  <DetailItem>
                    <DetailIcon>
                      <FiPhone />
                    </DetailIcon>
                    {customer.phone}
                  </DetailItem>
                )}
                <DetailItem>
                  <DetailIcon>
                    <FiMapPin />
                  </DetailIcon>
                  {getLocation(customer)}
                </DetailItem>
                <DetailItem>
                  <DetailIcon>
                    <FiCalendar />
                  </DetailIcon>
                  Joined {formatDate(customer.createdAt)}
                </DetailItem>
              </CustomerDetails>

              {customer.role === 'customer' && (
                <CustomerStats>
                  <StatItem>
                    <StatValue>{customer.stats?.totalOrders || 0}</StatValue>
                    <StatLabel>Orders</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>${(customer.stats?.totalSpent || 0).toLocaleString()}</StatValue>
                    <StatLabel>Spent</StatLabel>
                  </StatItem>
                </CustomerStats>
              )}

              <CustomerActions>
                <ActionButton>
                  <FiEye />
                  View
                </ActionButton>
                <ActionButton>
                  <FiEdit />
                  Edit
                </ActionButton>
              </CustomerActions>
            </CustomerCard>
          ))}
        </CustomersGrid>
      )}
    </CustomersContainer>
  );
};

export default Customers;
