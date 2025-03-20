import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Collection references
const coursesRef = collection(db, 'courses');
const studentsRef = collection(db, 'students');
const activitiesRef = collection(db, 'activities');
const progressRef = collection(db, 'progress');

// Generic CRUD operations
export const createDocument = (collectionName, data) => {
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateDocument = (collectionName, id, data) => {
  const docRef = doc(db, collectionName, id);
  return updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteDocument = (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  return deleteDoc(docRef);
};

export const getDocument = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const getCollection = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Specific operations for courses
export const getCourses = async () => {
  const q = query(coursesRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCoursesByUser = async (userId) => {
  const q = query(coursesRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Specific operations for student progress
export const getStudentProgress = async (studentId) => {
  const q = query(progressRef, where('studentId', '==', studentId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateStudentProgress = async (progressId, activityId, status, score) => {
  const docRef = doc(db, 'progress', progressId);
  return updateDoc(docRef, {
    [`activities.${activityId}`]: {
      status,
      score,
      completedAt: serverTimestamp()
    },
    updatedAt: serverTimestamp()
  });
}; 