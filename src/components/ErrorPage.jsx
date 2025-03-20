import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from './Layout';
import Button from './Button';

export default function ErrorPage() {
  const location = useLocation();
  const { error } = location.state || { error: { message: 'Se ha producido un error desconocido.' } };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Oops! Algo salió mal
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            {error.message || 'Se ha producido un error desconocido.'}
          </p>
          <div className="mt-10">
            <Button as={Link} to="/dashboard" variant="primary">
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 