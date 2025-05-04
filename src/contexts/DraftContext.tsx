
import React, { createContext, useContext, useState, useEffect } from "react";
import { Draft, AIPrompt, AIResponse } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";

type DraftContextType = {
  drafts: Draft[];
  isLoading: boolean;
  generateContent: (prompt: AIPrompt) => Promise<AIResponse>;
  saveDraft: (draft: Partial<Draft>) => Promise<Draft>;
  updateDraft: (id: string, updates: Partial<Draft>) => Promise<Draft>;
  deleteDraft: (id: string) => Promise<void>;
  getDraft: (id: string) => Draft | undefined;
  aiResponse: AIResponse | null;
};

const DraftContext = createContext<DraftContextType | undefined>(undefined);

export const useDraft = () => {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error("useDraft must be used within a DraftProvider");
  }
  return context;
};

const mockAIResponse: AIResponse = {
  postIdeas: [
    "How AI is transforming the way social media teams work",
    "5 time-saving automation tools every social media manager needs",
    "The future of content creation: Human creativity meets AI assistance",
    "Behind the scenes: How our team leverages AI for better engagement",
    "Case study: How AI-powered content increased our engagement by 45%"
  ],
  captions: {
    linkedin: "AI isn't replacing social media managers—it's supercharging them. Here's how our team has transformed our workflow with intelligent tools while keeping the human touch that our audience values. #AIInMarketing #SocialMediaStrategy",
    facebook: "Working smarter, not harder! 💪 Our social media team has been testing new AI tools to help with content creation, and we've seen some incredible results! Have you tried incorporating AI into your marketing strategy? #MarketingTips",
    twitter: "AI + human creativity = social media magic ✨ We've cut our content planning time in half while boosting engagement. Here's our approach:"
  },
  hashtags: ["#AIMarketing", "#ContentStrategy", "#SocialMediaTips", "#DigitalMarketing", "#MarketingAutomation"]
};

export const DraftProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load drafts from localStorage when user changes
    if (user) {
      const storedDrafts = localStorage.getItem(`drafts_${user.id}`);
      if (storedDrafts) {
        setDrafts(JSON.parse(storedDrafts));
      } else {
        // Initialize with empty array
        setDrafts([]);
        localStorage.setItem(`drafts_${user.id}`, JSON.stringify([]));
      }
    } else {
      setDrafts([]);
    }
  }, [user]);

  const saveDraftsToStorage = (updatedDrafts: Draft[]) => {
    if (user) {
      localStorage.setItem(`drafts_${user.id}`, JSON.stringify(updatedDrafts));
    }
  };

  const generateContent = async (prompt: AIPrompt): Promise<AIResponse> => {
    setIsLoading(true);
    try {
      // In a real app, we would call the OpenAI API here
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Using mock data for now
      setAIResponse(mockAIResponse);
      
      toast({
        title: "Content generated",
        description: "AI suggestions are ready for review",
      });
      
      return mockAIResponse;
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Unable to generate content. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = async (draftData: Partial<Draft>): Promise<Draft> => {
    setIsLoading(true);
    try {
      // Create a new draft
      const now = new Date().toISOString();
      const newDraft: Draft = {
        id: "draft-" + Math.random().toString(36).substr(2, 9),
        title: draftData.title || "Untitled Draft",
        caption: draftData.caption || "",
        hashtags: draftData.hashtags || [],
        imageUrl: draftData.imageUrl,
        createdAt: now,
        updatedAt: now,
        aiPrompt: draftData.aiPrompt,
      };
      
      const updatedDrafts = [newDraft, ...drafts];
      setDrafts(updatedDrafts);
      saveDraftsToStorage(updatedDrafts);
      
      toast({
        title: "Draft saved",
        description: "Your content has been saved as a draft",
      });
      
      return newDraft;
    } catch (error) {
      toast({
        title: "Failed to save draft",
        description: "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDraft = async (id: string, updates: Partial<Draft>): Promise<Draft> => {
    setIsLoading(true);
    try {
      const draftIndex = drafts.findIndex(draft => draft.id === id);
      if (draftIndex === -1) {
        throw new Error("Draft not found");
      }
      
      const updatedDraft = {
        ...drafts[draftIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedDrafts = [...drafts];
      updatedDrafts[draftIndex] = updatedDraft;
      
      setDrafts(updatedDrafts);
      saveDraftsToStorage(updatedDrafts);
      
      toast({
        title: "Draft updated",
        description: "Your changes have been saved",
      });
      
      return updatedDraft;
    } catch (error) {
      toast({
        title: "Failed to update draft",
        description: "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDraft = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      const updatedDrafts = drafts.filter(draft => draft.id !== id);
      setDrafts(updatedDrafts);
      saveDraftsToStorage(updatedDrafts);
      
      toast({
        title: "Draft deleted",
        description: "The draft has been removed",
      });
    } catch (error) {
      toast({
        title: "Failed to delete draft",
        description: "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getDraft = (id: string): Draft | undefined => {
    return drafts.find(draft => draft.id === id);
  };

  const value = {
    drafts,
    isLoading,
    generateContent,
    saveDraft,
    updateDraft,
    deleteDraft,
    getDraft,
    aiResponse,
  };

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
};
