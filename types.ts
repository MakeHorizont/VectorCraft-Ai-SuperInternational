
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type GenerationMode = 'create' | 'transform';

export interface GeneratedSvg {
  id: string;
  content: string;
  prompt: string; // Keeps the full prompt for display
  timestamp: number;
}

export interface ReferenceImage {
  id: string;
  data: string; // base64
  mimeType: string;
}

export interface ResolutionConfig {
  width: number;
  height: number;
  isCustom: boolean;
}

export interface GenerationOptions {
  mode: GenerationMode;
  prompt: string; // What to draw or How to modify
  stylePrompt: string; // Visual style
  animationPrompt?: string; // New: Tech specs (animation, effects)
  sourceSvg?: string; // New: For transformation mode
  images: ReferenceImage[];
  urls: string[];
  useSearch: boolean;
  resolution: ResolutionConfig; // New: Output size
}

export interface ApiError {
  message: string;
  details?: string;
}
