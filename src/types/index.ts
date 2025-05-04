
export interface User {
  id: string;
  email: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultIndustry: string;
  defaultTone: string;
  defaultAudience: string;
}

export interface Draft {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  aiPrompt?: AIPrompt;
}

export interface AIPrompt {
  industry: string;
  tone: string;
  audience: string;
}

export interface AIResponse {
  postIdeas: string[];
  captions: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  hashtags: string[];
}

export interface SocialAccount {
  platform: 'linkedin' | 'facebook' | 'twitter' | 'instagram';
  username: string;
  connected: boolean;
}

export interface PostAnalytics {
  id: string;
  postId: string;
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  date: string;
}
