import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiEdit, 
  FiTruck,
  FiPackage,
  FiClock,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

const OrdersContainer = styled.div`
  padding: 0;
`;

const OrdersHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
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

const StatusFilter = styled.select`
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  
  &:focus {
    border-color: var(--color-primary);
    outline: none;
  }
`;

const OrdersTable = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr 0.5fr;
  padding: var(--spacing-lg);
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-light);
  font-weight: 600;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr 0.5fr;
    
    .hide-mobile {
      display: none;
    }
  }
`;

const OrderRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr 0.5fr;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
  align-items: center;
  transition: background var(--transition-fast);
  
  &:hover {
    background: var(--bg-secondary);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr 0.5fr;
    
    .hide-mobile {
      display: none;
    }
  }
`;

const OrderId = styled.span`
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const CustomerName = styled.span`
  font-weight: 500;
  color: var(--text-primary);
`;

const CustomerEmail = styled.span`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
`;

const StatusBadge = styled.span`
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: ${props => {
    switch (props.status) {
      case 'delivered': return 'var(--color-success)20';
      case 'shipped': return 'var(--color-info)20';
      case 'processing': return 'var(--color-warning)20';
      case 'pending': return 'var(--color-gray-200)';
      case 'cancelled': return 'var(--color-error)20';
      default: return 'var(--color-gray-200)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'delivered': return 'var(--color-success)';
      case 'shipped': return 'var(--color-info)';
      case 'processing': return 'var(--color-warning)';
      case 'pending': return 'var(--text-secondary)';
      case 'cancelled': return 'var(--color-error)';
      default: return 'var(--text-secondary)';
    }
  }};
`;

const OrderTotal = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`;

const OrderDate = styled.span`
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    transform: scale(1.05);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-secondary);
`;

const getStatusIcon = (status) => {
  switch (status) {
    case 'delivered': return <FiCheck />;
    case 'shipped': return <FiTruck />;
    case 'processing': return <FiPackage />;
    case 'pending': return <FiClock />;
    case 'cancelled': return <FiX />;
    default: return <FiClock />;
  }
};

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading, error, refetch } = useQuery(
    ['orders', searchQuery, statusFilter],
    () => axios.get('/api/orders', {
      params: {
        search: searchQuery,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        limit: 50
      }
    }).then(res => res.data),
    {
      keepPreviousData: true
    }
  );

  // Update order status mutation
  const updateOrderMutation = useMutation(
    ({ id, status, note }) => axios.put(`/api/orders/${id}`, { status, note }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders']);
        toast.success('Order status updated successfully!');
        setEditingOrder(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update order status');
      }
    }
  );

  const handleUpdateOrderStatus = (orderId, status, note = '') => {
    updateOrderMutation.mutate({ id: orderId, status, note });
  };

  // Mock data for demonstration
  const mockOrders = [
    {
      _id: '1',
      orderNumber: '#ORD-12345',
      customerInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      },
      status: 'delivered',
      pricing: { total: 299.99 },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      orderNumber: '#ORD-12346',
      customerInfo: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
      },
      status: 'shipped',
      pricing: { total: 159.99 },
      createdAt: '2024-01-14T14:20:00Z'
    },
    {
      _id: '3',
      orderNumber: '#ORD-12347',
      customerInfo: {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com'
      },
      status: 'processing',
      pricing: { total: 89.99 },
      createdAt: '2024-01-13T09:15:00Z'
    },
    {
      _id: '4',
      orderNumber: '#ORD-12348',
      customerInfo: {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@example.com'
      },
      status: 'pending',
      pricing: { total: 199.99 },
      createdAt: '2024-01-12T16:45:00Z'
    },
    {
      _id: '5',
      orderNumber: '#ORD-12349',
      customerInfo: {
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@example.com'
      },
      status: 'cancelled',
      pricing: { total: 449.99 },
      createdAt: '2024-01-11T11:30:00Z'
    }
  ];

  const orders = ordersData?.orders || mockOrders;

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading orders..." />;
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${order.customerInfo?.firstName} ${order.customerInfo?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo?.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <OrdersContainer>
      <OrdersHeader>
        <Title>Orders</Title>
      </OrdersHeader>

      <FiltersContainer>
        <SearchContainer>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
        <StatusFilter
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </StatusFilter>
      </FiltersContainer>

      {filteredOrders.length === 0 ? (
        <EmptyState>
          <FiPackage size={64} />
          <h3>No orders found</h3>
          <p>Try adjusting your search criteria.</p>
        </EmptyState>
      ) : (
        <OrdersTable>
          <TableHeader>
            <div>Order ID</div>
            <div>Customer</div>
            <div>Status</div>
            <div className="hide-mobile">Total</div>
            <div className="hide-mobile">Date</div>
            <div>Actions</div>
          </TableHeader>
          
          {filteredOrders.map((order, index) => (
            <OrderRow
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <OrderId>{order.orderNumber}</OrderId>
              <CustomerInfo>
                <CustomerName>
                  {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                </CustomerName>
                <CustomerEmail>{order.customerInfo?.email}</CustomerEmail>
              </CustomerInfo>
              <StatusBadge 
                status={order.status}
                onClick={() => setEditingOrder(order)}
                style={{ cursor: 'pointer' }}
              >
                {getStatusIcon(order.status)}
                {order.status}
              </StatusBadge>
              <OrderTotal className="hide-mobile">
                ${order.pricing.total.toFixed(2)}
              </OrderTotal>
              <OrderDate className="hide-mobile">
                {formatDate(order.createdAt)}
              </OrderDate>
              <ActionsContainer>
                <ActionButton title="View Order">
                  <FiEye />
                </ActionButton>
                <ActionButton 
                  title="Edit Order"
                  onClick={() => setEditingOrder(order)}
                >
                  <FiEdit />
                </ActionButton>
              </ActionsContainer>
            </OrderRow>
          ))}
        </OrdersTable>
      )}

      {/* Order Status Update Modal */}
      {editingOrder && (
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
            maxWidth: '400px'
          }}>
            <h3>Update Order Status</h3>
            <p>Order: {editingOrder.orderNumber}</p>
            <p>Customer: {editingOrder.customerInfo?.firstName} {editingOrder.customerInfo?.lastName}</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleUpdateOrderStatus(
                editingOrder._id,
                formData.get('status'),
                formData.get('note')
              );
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Status</label>
                <select 
                  name="status" 
                  defaultValue={editingOrder.status}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label>Note (Optional)</label>
                <textarea 
                  name="note" 
                  placeholder="Add a note about this status change..."
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', minHeight: '60px' }} 
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setEditingOrder(null)}
                  style={{ padding: '0.75rem 1.5rem', border: '1px solid #ccc', background: 'white', borderRadius: '6px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={updateOrderMutation.isLoading}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px' 
                  }}
                >
                  {updateOrderMutation.isLoading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OrdersContainer>
  );
};

export default Orders;
