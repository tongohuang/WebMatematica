import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  setDoc,
  doc
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { logError } from '../utils/errorLogger';

/**
 * Creates an admin user with specified credentials
 * @returns {Promise<void>}
 */
export const createAdminUser = async (email, password, displayName) => {
  try {
    // Check if user already exists by trying to sign in
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (signInError) {
      // User doesn't exist, create a new one
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Add user document to Firestore with admin role
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName,
        role: 'admin',
        createdAt: serverTimestamp()
      });
      
      return user;
    }
  } catch (error) {
    logError('Error creating admin user', { email, error });
    throw new Error(`No se pudo crear el usuario administrador: ${error.message}`);
  }
};

/**
 * Creates example course data
 * @returns {Promise<void>}
 */
export const createExampleCourse = async (authorId) => {
  try {
    // Make sure we're signed in as the admin
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado');
    }
    
    // Add course document
    const courseRef = await addDoc(collection(db, 'courses'), {
      title: 'Sucesiones',
      description: 'Curso introductorio sobre sucesiones matemáticas, progresiones aritméticas, geométricas y sucesiones por recurrencia.',
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/web-matematica.appspot.com/o/course-images%2Fsucesiones.jpg?alt=media',
      level: 'Intermedio',
      duration: '8 horas',
      requirements: 'Conocimientos básicos de álgebra',
      authorId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    const courseId = courseRef.id;
    
    // Create sections for the course
    const section1 = await createSection(courseId, {
      title: 'Progresiones Aritméticas',
      description: 'Aprende sobre progresiones aritméticas, término general y suma de términos.',
      order: 1,
      videoUrl: 'https://www.youtube.com/watch?v=c9bPMnAVDnY',
      content: `# Progresiones Aritméticas

## Introducción
Una progresión aritmética es una sucesión de números en la que cada término se obtiene sumando un valor constante al término anterior. Este valor constante se denomina **diferencia común** o **razón** de la progresión.

## Término General
El término general de una progresión aritmética se puede expresar como:
an = a1 + (n - 1)d

Donde:
- an es el término de la posición n
- a1 es el primer término
- d es la diferencia común
- n es la posición del término

## Suma de los n primeros términos
La suma de los n primeros términos de una progresión aritmética se calcula mediante la fórmula:
Sn = n/2 · (a1 + an) = n/2 · [2a1 + (n - 1)d]

## Ejemplos
1. Si a1 = 3 y d = 2, los primeros términos son: 3, 5, 7, 9, 11, ...
2. Si a1 = 10 y d = -3, los primeros términos son: 10, 7, 4, 1, -2, ...`
    });
    
    // Add activities for section 1
    await createActivitiesForSection(section1.id, [
      {
        title: 'Identificar progresiones aritméticas',
        description: 'Determine cuáles de las siguientes secuencias son progresiones aritméticas',
        type: 'quiz',
        content: JSON.stringify({
          questions: [
            {
              question: '¿Cuál de las siguientes secuencias es una progresión aritmética?',
              options: [
                '2, 4, 8, 16, 32',
                '3, 7, 11, 15, 19',
                '1, 2, 4, 7, 11',
                '5, 10, 20, 40, 80'
              ],
              correctAnswerIndex: 1
            }
          ]
        })
      },
      {
        title: 'Calcular términos',
        description: 'Calcule el término general y términos específicos de progresiones aritméticas',
        type: 'problem',
        content: 'Encuentra el término 50 de la progresión aritmética: 5, 8, 11, 14, ...'
      }
    ]);
    
    const section2 = await createSection(courseId, {
      title: 'Progresiones Geométricas',
      description: 'Aprende sobre progresiones geométricas, término general y suma de términos.',
      order: 2,
      videoUrl: 'https://www.youtube.com/watch?v=pp7rn2NuLKQ',
      content: `# Progresiones Geométricas

## Introducción
Una progresión geométrica es una sucesión de números en la que cada término se obtiene multiplicando el término anterior por un valor constante. Este valor constante se denomina **razón** de la progresión.

## Término General
El término general de una progresión geométrica se puede expresar como:
an = a1 · r^(n-1)

Donde:
- an es el término de la posición n
- a1 es el primer término
- r es la razón
- n es la posición del término

## Suma de los n primeros términos
La suma de los n primeros términos de una progresión geométrica se calcula mediante la fórmula:
Sn = a1 · (1 - r^n) / (1 - r)  (para r ≠ 1)

Para r < 1, cuando n tiende a infinito, la suma de todos los términos converge a:
S = a1 / (1 - r)

## Ejemplos
1. Si a1 = 2 y r = 3, los primeros términos son: 2, 6, 18, 54, 162, ...
2. Si a1 = 100 y r = 1/2, los primeros términos son: 100, 50, 25, 12.5, 6.25, ...`
    });
    
    // Add activities for section 2
    await createActivitiesForSection(section2.id, [
      {
        title: 'Identificar progresiones geométricas',
        description: 'Determine cuáles de las siguientes secuencias son progresiones geométricas',
        type: 'quiz',
        content: JSON.stringify({
          questions: [
            {
              question: '¿Cuál de las siguientes secuencias es una progresión geométrica?',
              options: [
                '3, 6, 9, 12, 15',
                '4, 8, 16, 32, 64',
                '1, 3, 6, 10, 15',
                '5, 8, 11, 14, 17'
              ],
              correctAnswerIndex: 1
            }
          ]
        })
      },
      {
        title: 'Calcular suma de términos',
        description: 'Calcule la suma de los términos de una progresión geométrica',
        type: 'problem',
        content: 'Calcula la suma de los 10 primeros términos de la progresión geométrica: 3, 6, 12, 24, ...'
      }
    ]);
    
    const section3 = await createSection(courseId, {
      title: 'Sucesiones por Recurrencia',
      description: 'Aprende sobre sucesiones definidas por recurrencia, como la sucesión de Fibonacci.',
      order: 3,
      videoUrl: 'https://www.youtube.com/watch?v=v6PTrc0z4w4',
      content: `# Sucesiones por Recurrencia

## Introducción
Una sucesión recurrente es aquella en la que cada término se define a partir de términos anteriores mediante una regla o fórmula.

## Ejemplos de Sucesiones Recurrentes

### Sucesión de Fibonacci
La sucesión de Fibonacci es quizás la sucesión recurrente más famosa:
F₁ = 1, F₂ = 1
Fₙ = Fₙ₋₁ + Fₙ₋₂ para n > 2

Los primeros términos son: 1, 1, 2, 3, 5, 8, 13, 21, 34, ...

### Sucesión de Lucas
Similar a Fibonacci pero con valores iniciales diferentes:
L₁ = 1, L₂ = 3
Lₙ = Lₙ₋₁ + Lₙ₋₂ para n > 2

Los primeros términos son: 1, 3, 4, 7, 11, 18, 29, ...

## Resolución de Sucesiones Recurrentes
Para encontrar el término general (fórmula explícita) de una sucesión recurrente:

1. Identifica el patrón y la relación recurrente
2. Usa técnicas como ecuaciones características para sucesiones lineales
3. Para casos más complejos, utiliza métodos como funciones generatrices

## Aplicaciones
Las sucesiones recurrentes tienen numerosas aplicaciones en:
- Matemáticas
- Ciencias de la computación (análisis de algoritmos)
- Economía (crecimiento poblacional, interés compuesto)
- Biología (modelos de crecimiento)`
    });
    
    // Add activities for section 3
    await createActivitiesForSection(section3.id, [
      {
        title: 'Calcular términos en la sucesión de Fibonacci',
        description: 'Calcule términos específicos de la sucesión de Fibonacci',
        type: 'quiz',
        content: JSON.stringify({
          questions: [
            {
              question: '¿Cuál es el 8º término de la sucesión de Fibonacci?',
              options: [
                '13',
                '21',
                '34',
                '55'
              ],
              correctAnswerIndex: 1
            }
          ]
        })
      },
      {
        title: 'Resolver sucesiones recurrentes',
        description: 'Resuelve problemas sobre sucesiones definidas por recurrencia',
        type: 'problem',
        content: 'Dada la sucesión recurrente a₁ = 4, a₂ = 10 y aₙ = aₙ₋₁ + 2aₙ₋₂ para n ≥ 3, encuentra el valor de a₆'
      }
    ]);
    
    return courseId;
  } catch (error) {
    logError('Error creating example course', { error });
    throw new Error(`No se pudo crear el curso de ejemplo: ${error.message}`);
  }
};

async function createSection(courseId, sectionData) {
  try {
    const sectionRef = await addDoc(collection(db, 'sections'), {
      courseId,
      ...sectionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return {
      id: sectionRef.id,
      ...sectionData
    };
  } catch (error) {
    logError('Error creating section', { courseId, sectionData, error });
    throw new Error(`No se pudo crear la sección: ${error.message}`);
  }
}

async function createActivitiesForSection(sectionId, activitiesData) {
  try {
    const createdActivities = [];
    
    for (const activityData of activitiesData) {
      const activityRef = await addDoc(collection(db, 'activities'), {
        sectionId,
        ...activityData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      createdActivities.push({
        id: activityRef.id,
        ...activityData
      });
    }
    
    return createdActivities;
  } catch (error) {
    logError('Error creating activities', { sectionId, activitiesData, error });
    throw new Error(`No se pudo crear las actividades: ${error.message}`);
  }
}

// Export a function to run the setup
export async function setupExampleData() {
  try {
    // Create admin user
    const adminUser = await createAdminUser('docente@webmatematica.com', 'WebMatematica1', 'Docente');
    
    // Create example course with sections and activities
    const courseId = await createExampleCourse(adminUser.uid);
    
    return {
      success: true,
      message: 'Configuración inicial completada con éxito',
      details: {
        admin: {
          email: 'docente@webmatematica.com',
          password: 'WebMatematica1'
        },
        courseId
      }
    };
  } catch (error) {
    logError('Error en la configuración inicial', { error });
    return {
      success: false,
      message: `Error en la configuración: ${error.message}`
    };
  }
} 