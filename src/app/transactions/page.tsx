'use client';

import Transactions from '@/components/Transactions';
import store from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';

// Définir un type pour l'état global
interface RootState {
  auth: {
    token: string | null;
  };
}

const TransactionsPage = () => {
  const router = useRouter();
  
  // Utiliser le type spécifique RootState
  const token = useSelector((state: RootState) => state.auth.token);

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
