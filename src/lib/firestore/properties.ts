import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Property } from '@/types';

export async function getProperties(): Promise<Property[]> {
  try {
    const propertiesCollection = collection(db, 'properties');
    const propertiesQuery = query(propertiesCollection, orderBy('name'));
    const snapshot = await getDocs(propertiesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Property));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export async function getPropertiesByLocation(location: string): Promise<Property[]> {
  try {
    const propertiesCollection = collection(db, 'properties');
    const propertiesQuery = query(
      propertiesCollection,
      where('location', '==', location),
      orderBy('name')
    );
    const snapshot = await getDocs(propertiesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Property));
  } catch (error) {
    console.error('Error fetching properties by location:', error);
    return [];
  }
}
