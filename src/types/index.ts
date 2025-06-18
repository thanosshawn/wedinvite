export interface TemplateInput {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'file';
  placeholder?: string;
  default?: string;
  required?: boolean;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  inputs: TemplateInput[];
  remotionId: string;
  tags: string[];
  theme: string;
}

export interface Invite {
  id: string;
  userId: string;
  templateId: string;
  values: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  previewUrl?: string;
  finalUrl?: string;
}
