import { savePortfolioData, loadPortfolioData } from './firebaseService';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Mock the Firebase initialization file
jest.mock('./firebase', () => ({
    db: {} // Return an empty object for the database reference
}));

// Mock the entire firebase/firestore module
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
}));

describe('firebaseService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        console.log.mockRestore();
        console.error.mockRestore();
    });

    describe('savePortfolioData', () => {
        it('should call setDoc with correct parameters and return true', async () => {
            const testData = { name: 'Test User', role: 'Dev' };
            setDoc.mockResolvedValueOnce(undefined);
            doc.mockReturnValue('mock-doc-ref');

            const result = await savePortfolioData(testData);

            expect(doc).toHaveBeenCalled();
            expect(setDoc).toHaveBeenCalledWith(
                'mock-doc-ref',
                expect.objectContaining({
                    ...testData,
                    updatedAt: expect.any(String)
                }),
                { merge: true }
            );
            expect(result).toBe(true);
        });

        it('should return false if saving fails', async () => {
            setDoc.mockRejectedValueOnce(new Error('Firebase Error'));
            const result = await savePortfolioData({});
            expect(result).toBe(false);
        });
    });

    describe('loadPortfolioData', () => {
        it('should return data and remove updatedAt if document exists', async () => {
            const mockData = { name: 'Dk', updatedAt: '2026-03-04' };
            getDoc.mockResolvedValueOnce({
                exists: () => true,
                data: () => ({ ...mockData })
            });

            const result = await loadPortfolioData();

            expect(result).toEqual({ name: 'Dk' });
            expect(result.updatedAt).toBeUndefined();
        });

        it('should return null if document does not exist', async () => {
            getDoc.mockResolvedValueOnce({
                exists: () => false
            });

            const result = await loadPortfolioData();
            expect(result).toBeNull();
        });

        it('should return null if loading fails', async () => {
            getDoc.mockRejectedValueOnce(new Error('Database Down'));
            const result = await loadPortfolioData();
            expect(result).toBeNull();
        });
    });
});
