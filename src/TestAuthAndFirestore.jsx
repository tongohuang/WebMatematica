import React, { useState } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

function TestAuthAndFirestore() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Función para iniciar sesión
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Inicio de sesión exitoso");
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para agregar datos a Firestore
  const addDataToFirestore = async () => {
    try {
      const docRef = await addDoc(collection(db, "testCollection"), {
        name: "Prueba",
        timestamp: new Date(),
      });
      console.log("Documento añadido con ID:", docRef.id);
      setData({ id: docRef.id, name: "Prueba" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Prueba de Autenticación y Firestore</h1>

      {/* Formulario de Inicio de Sesión */}
      <div>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Iniciar Sesión</button>
      </div>

      {/* Botón para Agregar Datos a Firestore */}
      <div>
        <button onClick={addDataToFirestore}>Agregar Datos a Firestore</button>
      </div>

      {/* Mostrar Errores o Datos */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && (
        <p>
          Datos agregados: ID = {data.id}, Nombre = {data.name}
        </p>
      )}
    </div>
  );
}

export default TestAuthAndFirestore;