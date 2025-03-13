// src/app/login/page.tsx
'use client';

import LoginForm from '@/components/LoginForm';
import store from '@/store';
import { Provider } from 'react-redux';

const LoginPage = () => (
  <Provider store={store}>
    <LoginForm />
  </Provider>
);

export default LoginPage;
