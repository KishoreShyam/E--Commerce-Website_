import React from 'react';
import styled from 'styled-components';

const OrdersContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Orders = () => {
  return (
    <OrdersContainer>
      <h1>My Orders</h1>
      <p>Order history coming soon...</p>
    </OrdersContainer>
  );
};

export default Orders;
