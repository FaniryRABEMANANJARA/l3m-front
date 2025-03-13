'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import store from '../store';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Provider store={store}>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
