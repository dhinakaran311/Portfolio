
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Save portfolio data to Firebase
export const savePortfolioData = async (data) => {
  try {
    console.log('Saving to Firebase:', JSON.stringify(data, null, 2));
    const portfolioRef = doc(db, 'portfolio', 'main');
    await setDoc(portfolioRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('✅ Portfolio data saved successfully to Firebase');
    return true;
  } catch (error) {
    console.error('❌ Error saving portfolio data to Firebase:', error);
    return false;
  }
};

// Load portfolio data from Firebase
export const loadPortfolioData = async () => {
  try {
    console.log('🔍 Loading data from Firebase...');
    const portfolioRef = doc(db, 'portfolio', 'main');
    const docSnap = await getDoc(portfolioRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Remove Firebase metadata
      delete data.updatedAt;
      console.log('✅ Successfully loaded data from Firebase');
      return data;
    } else {
      console.log('ℹ️ No portfolio data found in Firebase');
      return null;
    }
  } catch (error) {
    console.error('❌ Error loading portfolio data from Firebase:', error);
    return null;
  }
};

// Backup current data to Firebase
export const backupToFirebase = async (data) => {
  return await savePortfolioData(data);
};

// Restore data from Firebase
export const restoreFromFirebase = async () => {
  return await loadPortfolioData();
};
