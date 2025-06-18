import type { Template, Invite, InviteValues } from '@/types';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, serverTimestamp, Timestamp, persistentLocalCache, persistentMultipleTabManager, orderBy, limit } from 'firebase/firestore';

// Use the existing db instance with persistent cache
const firestore = db;

// Cache for templates
let templatesCache: Template[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getTemplates(): Promise<Template[]> {
  const now = Date.now();
  
  // Return cached data if it's still valid
  if (templatesCache && (now - lastFetchTime) < CACHE_DURATION) {
    return templatesCache;
  }

  try {
    const templatesRef = collection(firestore, 'templates');
    const q = query(templatesRef, orderBy('title'), limit(50));
    const querySnapshot = await getDocs(q);
    
    const templates = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Template[];

    // Update cache
    templatesCache = templates;
    lastFetchTime = now;

    return templates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    // Return cached data if available, even if expired
    if (templatesCache) {
      return templatesCache;
    }
    throw error;
  }
}

export async function getTemplateById(id: string): Promise<Template | null> {
  try {
    const templateRef = doc(firestore, 'templates', id);
    const templateDoc = await getDoc(templateRef);

    if (!templateDoc.exists()) {
      return null;
    }

    return {
      id: templateDoc.id,
      ...templateDoc.data()
    } as Template;
  } catch (error) {
    console.error('Error fetching template:', error);
    throw error;
  }
}

export async function createInvite(userId: string, templateId: string, values: InviteValues, musicChoice?: string): Promise<string> {
  try {
    const invitesCol = collection(firestore, 'invites');
    const docRef = await addDoc(invitesCol, {
      userId,
      templateId,
      values,
      musicChoice: musicChoice ?? null,
      status: 'draft',
      videoUrl: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error: any) {
    console.error("Error creating invite: ", error);
    throw new Error('Failed to create invite. Please try again later.');
  }
}

export async function updateInvite(inviteId: string, data: Partial<Invite>): Promise<void> {
  try {
    const inviteRef = doc(firestore, 'invites', inviteId);
    await updateDoc(inviteRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error(`Error updating invite ${inviteId}: `, error);
    throw new Error('Failed to update invite. Please try again later.');
  }
}

export async function getUserInvites(userId: string): Promise<Invite[]> {
  try {
    const invitesCol = collection(firestore, 'invites');
    const q = query(invitesCol, where('userId', '==', userId));
    const inviteSnapshot = await getDocs(q);
    
    return inviteSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
      } as Invite;
    });
  } catch (error: any) {
    console.error("Error fetching user invites: ", error);
    throw new Error('Failed to fetch invites. Please try again later.');
  }
}

export async function getInvitesByUserId(userId: string): Promise<Invite[]> {
  try {
    const invitesRef = collection(firestore, 'invites');
    const q = query(
      invitesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Invite[];
  } catch (error) {
    console.error('Error fetching invites:', error);
    throw error;
  }
}

export async function getInviteById(id: string): Promise<Invite | null> {
  try {
    const inviteRef = doc(firestore, 'invites', id);
    const inviteDoc = await getDoc(inviteRef);

    if (!inviteDoc.exists()) {
      return null;
    }

    return {
      id: inviteDoc.id,
      ...inviteDoc.data()
    } as Invite;
  } catch (error) {
    console.error('Error fetching invite:', error);
    throw error;
  }
}
