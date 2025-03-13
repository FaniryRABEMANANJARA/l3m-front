
'use client';

import RegisterForm from '@/components/RegisterForm';
import store from '@/store';
import { Provider } from 'react-redux';

const RegisterPage = () => (
  <Provider store={store}>
    <RegisterForm /> 
  </Provider>
);

export default RegisterPage;