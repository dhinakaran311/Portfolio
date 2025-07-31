
import { db } from './firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

// Collection names
const COLLECTIONS = {
  PROJECTS: 'projects',
  SKILLS: 'skills',
  EXPERIENCES: 'experiences',
  CERTIFICATIONS: 'certifications'
};

// Save portfolio data to Firebase
export const savePortfolioData = async (data) => {
  try {
    const portfolioRef = doc(db, 'portfolio', 'main');
    await setDoc(portfolioRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    console.log('Portfolio data saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving portfolio data:', error);
    return false;
  }
};

// Load portfolio data from Firebase
export const loadPortfolioData = async () => {
  try {
    const portfolioRef = doc(db, 'portfolio', 'main');
    const docSnap = await getDoc(portfolioRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Remove Firebase metadata
      delete data.updatedAt;
      return data;
    } else {
      console.log('No portfolio data found in Firebase');
      return null;
    }
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    return null;
  }
};

// Save individual collection data
export const saveCollectionData = async (collectionName, data) => {
  try {
    const collectionRef = doc(db, collectionName, 'data');
    await setDoc(collectionRef, {
      items: data,
      updatedAt: new Date().toISOString()
    });
    console.log(`${collectionName} data saved successfully`);
    return true;
  } catch (error) {
    console.error(`Error saving ${collectionName} data:`, error);
    return false;
  }
};

// Load individual collection data
export const loadCollectionData = async (collectionName) => {
  try {
    const collectionRef = doc(db, collectionName, 'data');
    const docSnap = await getDoc(collectionRef);
    
    if (docSnap.exists()) {
      return docSnap.data().items || [];
    } else {
      console.log(`No ${collectionName} data found in Firebase`);
      return [];
    }
  } catch (error) {
    console.error(`Error loading ${collectionName} data:`, error);
    return [];
  }
};

// Backup current data to Firebase
export const backupToFirebase = async (data) => {
  try {
    await savePortfolioData(data);
    return true;
  } catch (error) {
    console.error('Error backing up to Firebase:', error);
    return false;
  }
};

// Restore data from Firebase
export const restoreFromFirebase = async () => {
  try {
    return await loadPortfolioData();
  } catch (error) {
    console.error('Error restoring from Firebase:', error);
    return null;
  }
};
