export interface TemplateInput {
  name: string;
  label: string;
  type: 'text' | 'date' | 'textarea' | 'music'; // Added music type for AI suggestion
  defaultValue?: string;
  placeholder?: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  inputs: TemplateInput[];
  remotionId: string; // Corresponds to Composition ID in Remotion
  tags: string[]; // e.g., ["wedding", "floral", "elegant"]
  theme: string; // For AI music suggestion, e.g. "romantic", "party"
}

export interface InviteValues {
  [key: string]: string; // Dynamic keys based on template inputs
}

export interface Invite {
  id: string;
  userId: string;
  templateId: string;
  values: InviteValues;
  musicChoice?: string; // Could be a URL or identifier for selected music
  videoUrl?: string; // URL from Supabase after rendering
  status: 'draft' | 'rendering' | 'rendered' | 'error';
  createdAt: Date; // Firestore Timestamp would be better, but Date for simplicity here
  updatedAt: Date;
}
