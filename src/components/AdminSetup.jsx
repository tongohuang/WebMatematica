import { useState } from 'react';
import { Link } from 'react-router-dom';
import { setupExampleData } from '../scripts/setupData';
import Layout from './Layout';
import Button from './Button';

export default function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSetup() {
    try {
      setLoading(true);
      setError(null);
      
      const setupResult = await setupExampleData();
      setResult(setupResult);
      
      if (!setupResult.success) {
        setError(setupResult.message);
      }
    } catch (err) {
      console.error('Error during setup:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Configuración Inicial</h1>
          <p className="mt-4 text-lg text-gray-600">
            Esta página le permite configurar datos iniciales para la aplicación WebMatemática.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">¿Qué hace esta configuración?</h2>
          <div className="prose max-w-none text-gray-600">
            <p>Al ejecutar esta configuración se realizarán las siguientes acciones:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Crear un usuario administrador con las credenciales:</li>
              <ul className="list-disc pl-6 mt-1">
                <li>Email: <code className="bg-gray-100 px-1 py-0.5 rounded">docente@webmatematica.com</code></li>
                <li>Contraseña: <code className="bg-gray-100 px-1 py-0.5 rounded">WebMatematica1</code></li>
              </ul>
              <li>Crear un curso de ejemplo sobre "Sucesiones Matemáticas"</li>
              <li>Crear secciones para el curso con los siguientes temas:</li>
              <ul className="list-disc pl-6 mt-1">
                <li>Progresiones aritméticas</li>
                <li>Progresiones geométricas</li>
                <li>Sucesiones por recurrencia</li>
              </ul>
              <li>Crear actividades relacionadas con cada sección</li>
            </ul>
          </div>
          
          <div className="mt-6">
            <Button
              onClick={handleSetup}
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              {loading ? 'Configurando...' : 'Ejecutar configuración inicial'}
            </Button>
          </div>
        </div>

        {result && result.success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Configuración completada</h2>
            <p className="text-green-700 mb-6">
              {result.message}
            </p>
            
            <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Credenciales de administrador</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Email:</div>
                <div>{result.details?.admin?.email}</div>
                <div className="font-medium">Contraseña:</div>
                <div>{result.details?.admin?.password}</div>
              </div>
            </div>
            
            {result.details?.courseId && (
              <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Curso creado</h3>
                <p className="text-gray-600 mb-3">
                  Se ha creado un curso de ejemplo sobre "Sucesiones" con sus respectivas secciones y actividades.
                </p>
                <Button as={Link} to={`/courses/${result.details.courseId}`} variant="secondary" size="sm">
                  Ver curso
                </Button>
              </div>
            )}
            
            <div className="mt-6 flex gap-3">
              <Button as={Link} to="/login" variant="primary">
                Ir a iniciar sesión
              </Button>
              <Button as={Link} to="/" variant="secondary">
                Ir a la página principal
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </Layout>
  );
} 