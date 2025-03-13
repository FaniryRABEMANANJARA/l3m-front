// src/app/profile/page.tsx
'use client';

import Profil from '@/components/Profil'; // Assurez-vous que le chemin est correct
import store from '@/store';
import { Provider } from 'react-redux';

const ProfilePage = () => (
  <Provider store={store}>
    <Profil />
  </Provider>
);

export default ProfilePage;