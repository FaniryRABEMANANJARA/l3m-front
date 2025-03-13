import store from '@/store'; // Importez votre store Redux
import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'MaPlateforme',
    description: 'Plateforme de gestion de transactions',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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