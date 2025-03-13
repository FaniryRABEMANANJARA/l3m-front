'use client';
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import './globals.css';

export default function Home() {
  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="text-center p-5 bg-light bg-opacity-75 rounded">
        <h1 className="mb-4 animate__animated animate__fadeInDown">
          Bienvenue sur notre plateforme !
        </h1>
        <p className="lead animate__animated animate__fadeInUp animate__delay-1s">
          Découvrez une expérience unique et innovante pour gérer vos transactions.
        </p>
        <div className="d-grid gap-2 d-md-block mt-4">
          <Link
            href="/login"
            className="btn btn-primary btn-lg animate__animated animate__pulse animate__infinite"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="btn btn-success btn-lg ms-md-2 animate__animated animate__pulse animate__infinite"
          >
            Inscription
          </Link>
        </div>
      </div>
    </div>
  );
}
