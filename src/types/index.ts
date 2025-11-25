// src/types/index.ts

export interface Photo {
  id: string;
  url: string;
  file?: File;
}

export interface TimelineEvent {
  _id?: string;
  year: string;
  title: string;
  description: string;
  photos: string[]; // URLs from Cloudinary
  backgroundBlurImage?: string;
}

export interface Wish {
  _id?: string;
  author: string;
  message: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'none';
  reactions: number;
  isApproved: boolean;
}

export interface MosaicConfig {
  tileSize: number;
  cols: number;
  rows: number;
  frameStyle: 'square' | 'rounded' | 'polaroid' | 'shadow';
  shapeType: 'none' | 'silhouette' | 'number' | 'letter' | 'heart' | 'star' | 'circle';
  shapeValue?: string;
  colorMatching: boolean;
}

export interface BirthdayConfig {
  name: string;
  age: number;
  message: string;
  theme: 'party' | 'neon' | 'minimal' | 'elegant';
  backgroundColor: string;
  showCountdown: boolean;
  birthdayDate?: string;
}

export interface AnimationConfig {
  reveal: boolean;
  confetti: boolean;
  balloons: boolean;
  fireworks: boolean;
  fadeIn: boolean;
}