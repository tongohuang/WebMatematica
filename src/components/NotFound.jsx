import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import Button from './Button';

export default function NotFound() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            404
          </h1>
          <p className="mt-2 text-3xl font-bold text-indigo-600">Página no encontrada</p>
          <p className="mt-4 text-lg text-gray-500">
            Lo sentimos, no pudimos encontrar la página que estás buscando.
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