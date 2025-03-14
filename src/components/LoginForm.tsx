import { setError, setToken, setUser } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../app/globals.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    // Récupérer l'erreur depuis le store Redux
    const errorMessage = useSelector((state: any) => state.auth.error);  // Remplacez "any" par le type de votre RootState

    useEffect(() => {
        // Vérifier si un token est déjà présent dans localStorage et l'utiliser
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(setToken(token));
            // Ici, tu pourrais aussi récupérer et stocker les informations utilisateur, si nécessaire
        }

        // Mettre le focus sur le champ email à l'initialisation du formulaire
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

            const data = await response.json();

            if (response.ok) {
                const token = data.access_token;
                const user = data.user;

                // Stocker le token dans localStorage
                localStorage.setItem("token", token);
                dispatch(setToken(token));
                dispatch(setUser(user));

                // Rediriger vers la page des transactions
                router.push("/transactions");
            } else {
                let errorMessage = "Erreur d'authentification";
                if (data && data.message) {
                    errorMessage = data.message;
                }
                dispatch(setError(errorMessage));
            }
        } catch (error: any) {
            dispatch(setError(error.message || 'Erreur de connexion'));
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
