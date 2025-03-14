'use client';

import { setError, setToken, setUser } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../app/globals.css';

// Définir l'interface pour le state global
interface RootState {
    auth: {
        token: string | null;
        error: string | null;
        user: {
            id: string;
            email: string;
            name: string;
        } | null;
    };
}

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    // Utiliser le type défini pour accéder à l'erreur
    const errorMessage = useSelector((state: RootState) => state.auth.error);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(setToken(token));
        }

        document.querySelector<HTMLInputElement>('input[type="email"]')?.focus();
    }, [dispatch]);

    const validateForm = (): boolean => {
        if (!email) {
            dispatch(setError('Veuillez entrer votre email.'));
            return false;
        }
        if (!password) {
            dispatch(setError('Veuillez entrer votre mot de passe.'));
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        dispatch(setError(null));

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LARAVEL_API_ENDPOINT}/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            if (!response.ok) {
                // Gestion des erreurs HTTP
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            const token = data.access_token;
            const user = data.user;

            localStorage.setItem("token", token);
            dispatch(setToken(token));
            dispatch(setUser(user));

            router.push("/transactions");

        } catch (error) { // Type 'unknown' est plus sûr que 'any'
            if (error instanceof Error) {
                dispatch(setError(error.message || 'Erreur de connexion'));
            } else {
                dispatch(setError('Une erreur inconnue est survenue.'));
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-primary bg-opacity-50">
            <div className="col-md-6 col-lg-4">
                <div className="card shadow-lg p-5 bg-white rounded-4">
                    <h2 className="text-center mb-4 text-primary">Connexion</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-muted">Email</label>
                            <input
                                type="email"
                                className="form-control border-2 rounded-3 p-3"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Votre email"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted">Mot de passe</label>
                            <input
                                type="password"
                                className="form-control border-2 rounded-3 p-3"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Votre mot de passe"
                                required
                            />
                        </div>

                        {errorMessage && (
                            <div className="alert alert-danger text-center">{errorMessage}</div>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-3 mt-3 rounded-3"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Connexion en cours...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;