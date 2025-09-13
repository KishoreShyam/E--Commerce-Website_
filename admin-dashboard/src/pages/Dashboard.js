import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiShoppingCart, 
  FiDollarSign,
  FiPackage,
  FiAlertCircle,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import { useQuery } from 'react-query';
import axios from 'axios';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DashboardContainer = styled.div`
  padding: 0;
`;

const DashboardHeader = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const Title = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm);
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const StatCard = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || 'var(--color-primary)'};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: ${props => props.color || 'var(--color-primary)'}20;
  color: ${props => props.color || 'var(--color-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: ${props => props.positive ? 'var(--color-success)' : 'var(--color-error)'};
`;

const StatValue = styled.h2`
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
`;

const StatLabel = styled.p`
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
`;

const ChartTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-lg);
`;

const TablesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const TableCard = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  border-bottom: 2px solid var(--border-light);
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid var(--border-light);
  }
`;

const TableHeaderCell = styled.th`
  text-align: left;
  padding: var(--spacing-md) var(--spacing-sm);
  font-weight: 600;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
`;

const TableCell = styled.td`
  padding: var(--spacing-md) var(--spacing-sm);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
`;

const StatusBadge = styled.span`
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'delivered': return 'var(--color-success)20';
      case 'shipped': return 'var(--color-info)20';
      case 'processing': return 'var(--color-warning)20';
      case 'pending': return 'var(--color-gray-200)';
      default: return 'var(--color-gray-200)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'delivered': return 'var(--color-success)';
      case 'shipped': return 'var(--color-info)';
      case 'processing': return 'var(--color-warning)';
      case 'pending': return 'var(--text-secondary)';
      default: return 'var(--text-secondary)';
    }
  }};
`;

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: dashboardData, isLoading, error } = useQuery(
    ['dashboard', timeRange],
    () => axios.get(`/api/dashboard/stats?range=${timeRange}`).then(res => res.data),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const { data: revenueData } = useQuery(
    ['revenue-chart', timeRange],
    () => axios.get(`/api/dashboard/revenue-chart?range=${timeRange}`).then(res => res.data),
    {
      refetchInterval: 60000, // Refetch every minute
    }
  );

  const { data: recentOrders } = useQuery(
    'recent-orders',
    () => axios.get('/api/dashboard/recent-orders').then(res => res.data),
    {
      refetchInterval: 30000,
    }
  );

  const { data: topProducts } = useQuery(
    'top-products',
    () => axios.get('/api/dashboard/top-products').then(res => res.data),
    {
      refetchInterval: 300000, // Refetch every 5 minutes
    }
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <FiAlertCircle size={48} color="var(--color-error)" />
          <h2>Failed to load dashboard</h2>
          <p>Please try refreshing the page</p>
        </div>
      </DashboardContainer>
    );
  }

  const stats = dashboardData?.stats || {};
  const mockRevenueData = [
    { name: 'Mon', revenue: 2400, orders: 24 },
    { name: 'Tue', revenue: 1398, orders: 18 },
    { name: 'Wed', revenue: 9800, orders: 45 },
    { name: 'Thu', revenue: 3908, orders: 32 },
    { name: 'Fri', revenue: 4800, orders: 38 },
    { name: 'Sat', revenue: 3800, orders: 29 },
    { name: 'Sun', revenue: 4300, orders: 35 }
  ];

  const mockCategoryData = [
    { name: 'Electronics', value: 45, color: '#3b82f6' },
    { name: 'Fashion', value: 30, color: '#8b5cf6' },
    { name: 'Home & Garden', value: 15, color: '#10b981' },
    { name: 'Sports', value: 10, color: '#f59e0b' }
  ];

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>Dashboard</Title>
        <Subtitle>Welcome back! Here's what's happening with your store today.</Subtitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard
          color="#3b82f6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatHeader>
            <StatIcon color="#3b82f6">
              <FiDollarSign />
            </StatIcon>
            <StatChange positive>
              <FiArrowUp />
              +12.5%
            </StatChange>
          </StatHeader>
          <StatValue>${stats.totalRevenue?.toLocaleString() || '24,580'}</StatValue>
          <StatLabel>Total Revenue</StatLabel>
        </StatCard>

        <StatCard
          color="#10b981"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatHeader>
            <StatIcon color="#10b981">
              <FiShoppingCart />
            </StatIcon>
            <StatChange positive>
              <FiArrowUp />
              +8.2%
            </StatChange>
          </StatHeader>
          <StatValue>{stats.totalOrders?.toLocaleString() || '1,245'}</StatValue>
          <StatLabel>Total Orders</StatLabel>
        </StatCard>

        <StatCard
          color="#8b5cf6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatHeader>
            <StatIcon color="#8b5cf6">
              <FiUsers />
            </StatIcon>
            <StatChange positive>
              <FiArrowUp />
              +15.3%
            </StatChange>
          </StatHeader>
          <StatValue>{stats.totalCustomers?.toLocaleString() || '892'}</StatValue>
          <StatLabel>Total Customers</StatLabel>
        </StatCard>

        <StatCard
          color="#f59e0b"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatHeader>
            <StatIcon color="#f59e0b">
              <FiPackage />
            </StatIcon>
            <StatChange>
              <FiArrowDown />
              -2.1%
            </StatChange>
          </StatHeader>
          <StatValue>{stats.totalProducts?.toLocaleString() || '156'}</StatValue>
          <StatLabel>Total Products</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ChartTitle>Revenue Overview</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData?.data || mockRevenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ChartTitle>Sales by Category</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {mockCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <TablesGrid>
        <TableCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <ChartTitle>Recent Orders</ChartTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Order ID</TableHeaderCell>
                <TableHeaderCell>Customer</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {(recentOrders?.orders || [
                { id: '#12345', customer: 'John Doe', status: 'delivered', total: 299.99 },
                { id: '#12346', customer: 'Jane Smith', status: 'shipped', total: 159.99 },
                { id: '#12347', customer: 'Mike Johnson', status: 'processing', total: 89.99 },
                { id: '#12348', customer: 'Sarah Wilson', status: 'pending', total: 199.99 }
              ]).map((order, index) => (
                <TableRow key={index}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status}>
                      {order.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>${order.total}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableCard>

        <TableCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <ChartTitle>Top Products</ChartTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Product</TableHeaderCell>
                <TableHeaderCell>Sales</TableHeaderCell>
                <TableHeaderCell>Revenue</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {(topProducts?.products || [
                { name: 'iPhone 15 Pro Max', sales: 45, revenue: 53955 },
                { name: 'MacBook Pro 16"', sales: 23, revenue: 57477 },
                { name: 'Premium Leather Jacket', sales: 67, revenue: 20033 },
                { name: 'Wireless Headphones', sales: 89, revenue: 13261 }
              ]).map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sales}</TableCell>
                  <TableCell>${product.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableCard>
      </TablesGrid>
    </DashboardContainer>
  );
};

export default Dashboard;
