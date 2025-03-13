// src/components/RegisterForm.tsx
'use client';

import { setError } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../app/globals.css';

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    // Récupérer l'erreur depuis le store
    const errorMessage = useSelector((state: React.MouseEvent<HTMLButtonElement>) => state.auth.error);

    useEffect(() => {
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus(); 
    },);

    const validateForm = (): boolean => {
        if (!name) {
            dispatch(setError('Veuillez entrer votre nom.'));
            return false;
        }
        if (!email) {
            dispatch(setError('Veuillez entrer votre email.'));
            return false;
        }
        if (!password) {
            dispatch(setError('Veuillez entrer votre mot de passe.'));
            return false;
        }
        if (!passwordConfirmation) {
            dispatch(setError('Veuillez confirmer votre mot de passe.'));
            return false;
        }
        if (password !== passwordConfirmation) {
            dispatch(setError('Les mots de passe ne correspondent pas.'));
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
                `${process.env.NEXT_PUBLIC_LARAVEL_API_ENDPOINT}/register`, // Assurez-vous que votre route d'inscription est correcte
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }), // Utilisez password_confirmation pour Laravel
                }
            );

            const data = await response.json();

            if (response.ok) {
                router.push('/login');
            } else {
                // Erreur lors de l'inscription
                let errorMessage = "Erreur d'inscription";
                if (data && data.message) {
                    errorMessage = data.message;
                }
                dispatch(setError(errorMessage));
            }
        } catch (error: React.MouseEvent<HTMLButtonElement>) {
            dispatch(setError(error.message || 'Erreur de connexion'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-primary bg-opacity-50">
            <div className="col-md-6 col-lg-4">
                <div className="card shadow-lg p-5 bg-white rounded-4">
                    <h2 className="text-center mb-4 text-primary">Inscription</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-muted">Nom</label>
                            <input
                                type="text"
                                className="form-control border-2 rounded-3 p-3"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Votre nom"
                                required
                            />
                        </div>
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
                        <div className="mb-3">
                            <label className="form-label text-muted">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                className="form-control border-2 rounded-3 p-3"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                placeholder="Confirmer votre mot de passe"
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
                                    Inscription en cours...
                                </>
                            ) : (
                                'S\'inscrire'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;