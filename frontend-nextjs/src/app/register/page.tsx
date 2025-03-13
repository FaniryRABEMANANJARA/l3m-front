// src/app/register/page.tsx
'use client';

import RegisterForm from '@/components/RegisterForm'; // Importez RegisterForm
import store from '@/store';
import { Provider } from 'react-redux';

const RegisterPage = () => (
  <Provider store={store}>
    <RegisterForm /> // Utilisez RegisterForm
  </Provider>
);

export default RegisterPage;