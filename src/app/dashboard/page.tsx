
'use client';

import Dashboard from '@/components/Dashboard';
import store from '@/store';
import { Provider } from 'react-redux';

const DashboardPage = () => (
  <Provider store={store}>
    <Dashboard />
  </Provider>
);

export default DashboardPage;
