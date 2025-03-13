'use client';

import Transactions from '@/components/Transactions';
import store from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';

const TransactionsPage = () => {
  const router = useRouter();
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    if (!token) {
      router.push('/login'); 
    }
  }, [token, router]);

  return (
    <Provider store={store}>
      <Transactions />
    </Provider>
  );
};

export default TransactionsPage;