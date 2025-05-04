
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

// Function to generate dynamic content based on user input
const generateDynamicContent = (prompt: AIPrompt): AIResponse => {
  const { industry, tone, audience } = prompt;
  
  // Generate post ideas based on industry and tone
  let postIdeas = [
    `How ${industry} is transforming with the latest ${tone.toLowerCase()} approaches`,
    `5 ways ${industry} professionals can leverage ${tone.toLowerCase()} communication`,
    `The future of ${industry}: Connecting with ${audience ? audience.split(" ")[0] : "your"} audience through ${tone.toLowerCase()} content`,
    `Behind the scenes: How our ${industry} team creates ${tone.toLowerCase()} content that resonates`,
    `Case study: How a ${tone.toLowerCase()} approach in ${industry} increased engagement by 45%`
  ];
  
  // Generate captions based on selected parameters
  const linkedinCaption = `${industry} isn't standing still—it's evolving rapidly. Here's how our team has transformed our workflow with ${tone.toLowerCase()} messaging that ${audience ? audience : "our audience"} truly values. #${industry.replace(/\s+/g, '')}Trends #SocialMediaStrategy`;
  
  const facebookCaption = `Working smarter in ${industry}! 💪 Our team has been using ${tone.toLowerCase()} messaging to connect with ${audience ? audience : "our audience"}, and we've seen some incredible results! Have you tried this approach? #${industry.replace(/\s+/g, '')}Tips`;
  
  const twitterCaption = `${industry} + ${tone.toLowerCase()} content = engagement magic ✨ We've boosted our connection with ${audience ? audience : "our audience"}. Here's our approach:`;
  
  // Generate relevant hashtags
  const hashtags = [
    `#${industry.replace(/\s+/g, '')}`,
    `#${tone.replace(/\s+/g, '')}Content`,
    `#SocialMediaTips`,
    `#${industry.replace(/\s+/g, '')}Marketing`,
    `#ContentStrategy`
  ];
  
  return {
    postIdeas,
    captions: {
      linkedin: linkedinCaption,
      facebook: facebookCaption,
      twitter: twitterCaption
    },
    hashtags
  };
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Generate dynamic content based on user input
      const generatedResponse = generateDynamicContent(prompt);
      
      setAIResponse(generatedResponse);
      
      toast({
        title: "Content generated",
        description: "AI suggestions are ready for review",
      });
      
      return generatedResponse;
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
