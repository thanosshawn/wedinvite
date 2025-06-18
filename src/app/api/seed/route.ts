import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { Template } from '@/types';

const templates: Omit<Template, 'id'>[] = [
  {
    title: "Royal Rajasthani Wedding",
    description: "A majestic template inspired by the rich heritage of Rajasthan, featuring intricate mandala patterns and traditional motifs.",
    thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000",
    duration: 30,
    inputs: [
      { name: "brideName", label: "Bride's Name", type: "text", placeholder: "Enter bride's name" },
      { name: "groomName", label: "Groom's Name", type: "text", placeholder: "Enter groom's name" },
      { name: "weddingDate", label: "Wedding Date", type: "date" },
      { name: "venue", label: "Venue", type: "text", placeholder: "Enter wedding venue" },
      { name: "message", label: "Personal Message", type: "textarea", placeholder: "Share your special message" },
      { name: "music", label: "Background Music", type: "music" }
    ],
    remotionId: "RoyalRajasthaniWedding",
    tags: ["traditional", "royal", "mandala", "indian"],
    theme: "royal"
  },
  {
    title: "Modern Fusion Celebration",
    description: "A contemporary take on Indian weddings, blending modern aesthetics with traditional elements.",
    thumbnailUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000",
    duration: 25,
    inputs: [
      { name: "brideName", label: "Bride's Name", type: "text", placeholder: "Enter bride's name" },
      { name: "groomName", label: "Groom's Name", type: "text", placeholder: "Enter groom's name" },
      { name: "weddingDate", label: "Wedding Date", type: "date" },
      { name: "venue", label: "Venue", type: "text", placeholder: "Enter wedding venue" },
      { name: "message", label: "Personal Message", type: "textarea", placeholder: "Share your special message" },
      { name: "music", label: "Background Music", type: "music" }
    ],
    remotionId: "ModernFusionCelebration",
    tags: ["modern", "fusion", "contemporary", "minimal"],
    theme: "modern"
  },
  {
    title: "Floral Garden Wedding",
    description: "A romantic template adorned with delicate floral patterns and soft pastel colors.",
    thumbnailUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000",
    duration: 28,
    inputs: [
      { name: "brideName", label: "Bride's Name", type: "text", placeholder: "Enter bride's name" },
      { name: "groomName", label: "Groom's Name", type: "text", placeholder: "Enter groom's name" },
      { name: "weddingDate", label: "Wedding Date", type: "date" },
      { name: "venue", label: "Venue", type: "text", placeholder: "Enter wedding venue" },
      { name: "message", label: "Personal Message", type: "textarea", placeholder: "Share your special message" },
      { name: "music", label: "Background Music", type: "music" }
    ],
    remotionId: "FloralGardenWedding",
    tags: ["floral", "romantic", "garden", "pastel"],
    theme: "romantic"
  },
  {
    title: "Luxury Gold Affair",
    description: "An opulent template featuring gold accents and elegant typography for a luxurious celebration.",
    thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000",
    duration: 32,
    inputs: [
      { name: "brideName", label: "Bride's Name", type: "text", placeholder: "Enter bride's name" },
      { name: "groomName", label: "Groom's Name", type: "text", placeholder: "Enter groom's name" },
      { name: "weddingDate", label: "Wedding Date", type: "date" },
      { name: "venue", label: "Venue", type: "text", placeholder: "Enter wedding venue" },
      { name: "message", label: "Personal Message", type: "textarea", placeholder: "Share your special message" },
      { name: "music", label: "Background Music", type: "music" }
    ],
    remotionId: "LuxuryGoldAffair",
    tags: ["luxury", "gold", "elegant", "opulent"],
    theme: "luxury"
  },
  {
    title: "Minimalist Modern",
    description: "A clean and sophisticated template with minimal design elements and modern typography.",
    thumbnailUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000",
    duration: 22,
    inputs: [
      { name: "brideName", label: "Bride's Name", type: "text", placeholder: "Enter bride's name" },
      { name: "groomName", label: "Groom's Name", type: "text", placeholder: "Enter groom's name" },
      { name: "weddingDate", label: "Wedding Date", type: "date" },
      { name: "venue", label: "Venue", type: "text", placeholder: "Enter wedding venue" },
      { name: "message", label: "Personal Message", type: "textarea", placeholder: "Share your special message" },
      { name: "music", label: "Background Music", type: "music" }
    ],
    remotionId: "MinimalistModern",
    tags: ["minimal", "modern", "clean", "sophisticated"],
    theme: "modern"
  }
];

export async function POST() {
  try {
    const templatesCol = collection(db, 'templates');
    const results = [];
    
    for (const template of templates) {
      const docRef = await addDoc(templatesCol, template);
      results.push({ id: docRef.id, ...template });
    }
    
    return NextResponse.json({ success: true, templates: results });
  } catch (error) {
    console.error('Error seeding templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed templates' },
      { status: 500 }
    );
  }
} 