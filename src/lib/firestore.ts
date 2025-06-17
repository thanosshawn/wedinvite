import type { Template, Invite, InviteValues } from '@/types';
import { db } from './firebase'; // Assuming Firebase is initialized
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, serverTimestamp, Timestamp } from 'firebase/firestore';

// MOCK DATA (Remove when Firestore is fully integrated)
const mockTemplates: Template[] = [
  {
    id: 'floral-wedding-01',
    title: 'Enchanted Floral Wedding',
    description: 'A beautiful and elegant floral-themed wedding invitation.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    duration: 30,
    inputs: [
      { name: 'partner1', label: "Partner 1's Name", type: 'text', defaultValue: 'Sarah', placeholder: 'e.g., Sarah' },
      { name: 'partner2', label: "Partner 2's Name", type: 'text', defaultValue: 'Michael', placeholder: 'e.g., Michael' },
      { name: 'weddingDate', label: 'Wedding Date', type: 'date', defaultValue: '2024-12-25' },
      { name: 'weddingTime', label: 'Time', type: 'text', defaultValue: '2:00 PM', placeholder: 'e.g., 2:00 PM' },
      { name: 'venueName', label: 'Venue Name', type: 'text', defaultValue: 'The Grand Ballroom', placeholder: 'e.g., The Grand Ballroom' },
      { name: 'venueAddress', label: 'Venue Address', type: 'textarea', defaultValue: '123 Main Street, Anytown', placeholder: '123 Main St, Anytown, USA' },
    ],
    remotionId: 'FloralWedding',
    tags: ['wedding', 'floral', 'elegant', 'romantic'],
    theme: 'romantic floral wedding'
  },
  {
    id: 'modern-party-01',
    title: 'Neon Nights Party Invite',
    description: 'Get ready for an electrifying night with this modern party invitation.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    duration: 15,
    inputs: [
      { name: 'eventName', label: 'Event Name', type: 'text', defaultValue: "Sarah's Birthday Bash", placeholder: "e.g., John's Birthday" },
      { name: 'eventDate', label: 'Event Date', type: 'date', defaultValue: '2024-11-10' },
      { name: 'eventTime', label: 'Time', type: 'text', defaultValue: '8:00 PM', placeholder: 'e.g., 8:00 PM onwards' },
      { name: 'eventLocation', label: 'Location', type: 'text', defaultValue: 'Club Neon', placeholder: 'e.g., Club Neon' },
      { name: 'rsvpInfo', label: 'RSVP Details', type: 'textarea', defaultValue: 'RSVP to Jane by Nov 1st: jane@example.com', placeholder: 'RSVP to ... by ...' },
    ],
    remotionId: 'ModernParty',
    tags: ['party', 'modern', 'neon', 'birthday'],
    theme: 'modern energetic party'
  },
];


export async function getTemplates(): Promise<Template[]> {
  // return mockTemplates; // Using mock data for now
  try {
    const templatesCol = collection(db, 'templates');
    const templateSnapshot = await getDocs(templatesCol);
    const templateList = templateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Template));
    if (templateList.length === 0) return mockTemplates; // fallback to mock if firestore is empty
    return templateList;
  } catch (error) {
    console.error("Error fetching templates: ", error);
    return mockTemplates; // Fallback to mock data on error
  }
}

export async function getTemplateById(id: string): Promise<Template | null> {
  // const template = mockTemplates.find(t => t.id === id);
  // return template ?? null; // Using mock data for now
  try {
    const templateRef = doc(db, 'templates', id);
    const templateSnap = await getDoc(templateRef);
    if (templateSnap.exists()) {
      return { id: templateSnap.id, ...templateSnap.data() } as Template;
    } else {
      console.warn(`Template with id ${id} not found.`);
      // Fallback to mock data if not found in Firestore for dev purposes
      const mockTemplate = mockTemplates.find(t => t.id === id);
      return mockTemplate ?? null;
    }
  } catch (error) {
    console.error(`Error fetching template ${id}: `, error);
    const mockTemplate = mockTemplates.find(t => t.id === id);
    return mockTemplate ?? null; // Fallback to mock data on error
  }
}

export async function createInvite(userId: string, templateId: string, values: InviteValues, musicChoice?: string): Promise<string> {
  try {
    const invitesCol = collection(db, 'invites');
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
  } catch (error) {
    console.error("Error creating invite: ", error);
    throw error;
  }
}

export async function updateInvite(inviteId: string, data: Partial<Invite>): Promise<void> {
  try {
    const inviteRef = doc(db, 'invites', inviteId);
    await updateDoc(inviteRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating invite ${inviteId}: `, error);
    throw error;
  }
}

export async function getUserInvites(userId: string): Promise<Invite[]> {
  try {
    const invitesCol = collection(db, 'invites');
    const q = query(invitesCol, where('userId', '==', userId));
    const inviteSnapshot = await getDocs(q);
    
    return inviteSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(), // Convert Firestore Timestamp to Date
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
      } as Invite;
    });
  } catch (error) {
    console.error("Error fetching user invites: ", error);
    return [];
  }
}
