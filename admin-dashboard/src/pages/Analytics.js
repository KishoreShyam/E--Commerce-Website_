import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiUsers, 
  FiShoppingCart, 
  FiDollarSign,
  FiPackage,
  FiCalendar,
  FiDownload
} from 'react-icons/fi';
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
import { useQuery } from 'react-query';
import axios from 'axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AnalyticsContainer = styled.div`
  padding: 0;
`;

const AnalyticsHeader = styled.div`
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

const TimeRangeSelector = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs);
  border: 1px solid var(--border-light);
`;

const TimeRangeButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  background: ${props => props.active ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  font-weight: 500;
  
  &:hover {
    background: ${props => props.active ? 'var(--color-primary)' : 'var(--bg-tertiary)'};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const MetricCard = styled(motion.div)`
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

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
`;

const MetricIcon = styled.div`
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

const MetricChange = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: ${props => props.positive ? 'var(--color-success)' : 'var(--color-error)'};
`;

const MetricValue = styled.h2`
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
`;

const MetricLabel = styled.p`
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

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const ChartTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: analyticsData, isLoading } = useQuery(
    ['analytics', timeRange],
    () => axios.get(`/api/analytics?range=${timeRange}`).then(res => res.data),
    {
      refetchInterval: 60000, // Refetch every minute
    }
  );

  // Mock data for demonstration
  const mockRevenueData = [
    { date: '2024-01-01', revenue: 4200, orders: 42, customers: 38 },
    { date: '2024-01-02', revenue: 3800, orders: 35, customers: 32 },
    { date: '2024-01-03', revenue: 5200, orders: 48, customers: 45 },
    { date: '2024-01-04', revenue: 4600, orders: 41, customers: 39 },
    { date: '2024-01-05', revenue: 5800, orders: 52, customers: 48 },
    { date: '2024-01-06', revenue: 6200, orders: 58, customers: 52 },
    { date: '2024-01-07', revenue: 5400, orders: 49, customers: 46 }
  ];

  const mockCategoryData = [
    { name: 'Electronics', value: 45, revenue: 28500 },
    { name: 'Fashion', value: 30, revenue: 19200 },
    { name: 'Home & Garden', value: 15, revenue: 9600 },
    { name: 'Sports', value: 10, revenue: 6400 }
  ];

  const mockTopProducts = [
    { name: 'iPhone 15 Pro Max', sales: 145, revenue: 173855 },
    { name: 'MacBook Pro 16"', sales: 89, revenue: 222411 },
    { name: 'Premium Leather Jacket', sales: 234, revenue: 69966 },
    { name: 'Wireless Headphones', sales: 312, revenue: 46488 }
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading analytics..." />;
  }

  const timeRanges = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
    { key: '1y', label: '1 Year' }
  ];

  return (
    <AnalyticsContainer>
      <AnalyticsHeader>
        <Title>Analytics</Title>
        <TimeRangeSelector>
          {timeRanges.map(range => (
            <TimeRangeButton
              key={range.key}
              active={timeRange === range.key}
              onClick={() => setTimeRange(range.key)}
            >
              {range.label}
            </TimeRangeButton>
          ))}
        </TimeRangeSelector>
      </AnalyticsHeader>

      <MetricsGrid>
        <MetricCard
          color="#3b82f6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricHeader>
            <MetricIcon color="#3b82f6">
              <FiDollarSign />
            </MetricIcon>
            <MetricChange positive>
              <FiTrendingUp />
              +15.3%
            </MetricChange>
          </MetricHeader>
          <MetricValue>$34,200</MetricValue>
          <MetricLabel>Total Revenue</MetricLabel>
        </MetricCard>

        <MetricCard
          color="#10b981"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricHeader>
            <MetricIcon color="#10b981">
              <FiShoppingCart />
            </MetricIcon>
            <MetricChange positive>
              <FiTrendingUp />
              +8.7%
            </MetricChange>
          </MetricHeader>
          <MetricValue>325</MetricValue>
          <MetricLabel>Total Orders</MetricLabel>
        </MetricCard>

        <MetricCard
          color="#8b5cf6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MetricHeader>
            <MetricIcon color="#8b5cf6">
              <FiUsers />
            </MetricIcon>
            <MetricChange positive>
              <FiTrendingUp />
              +12.1%
            </MetricChange>
          </MetricHeader>
          <MetricValue>260</MetricValue>
          <MetricLabel>New Customers</MetricLabel>
        </MetricCard>

        <MetricCard
          color="#f59e0b"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetricHeader>
            <MetricIcon color="#f59e0b">
              <FiPackage />
            </MetricIcon>
            <MetricChange>
              <FiTrendingDown />
              -2.3%
            </MetricChange>
          </MetricHeader>
          <MetricValue>$105</MetricValue>
          <MetricLabel>Avg. Order Value</MetricLabel>
        </MetricCard>
      </MetricsGrid>

      <ChartsGrid>
        <ChartCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ChartHeader>
            <ChartTitle>Revenue Trend</ChartTitle>
            <ExportButton>
              <FiDownload />
              Export
            </ExportButton>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={mockRevenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
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
          <ChartHeader>
            <ChartTitle>Sales by Category</ChartTitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={350}>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <ChartCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <ChartHeader>
          <ChartTitle>Top Performing Products</ChartTitle>
          <ExportButton>
            <FiDownload />
            Export
          </ExportButton>
        </ChartHeader>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockTopProducts} layout="horizontal">
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </AnalyticsContainer>
  );
};

export default Analytics;
