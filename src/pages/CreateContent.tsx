
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useDraft } from "@/contexts/DraftContext";
import { AIPrompt } from "@/types";

// Sample industry and tone options
const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Marketing",
  "E-commerce",
  "Travel",
  "Food & Beverage",
  "Entertainment",
  "Non-profit",
];

const tones = [
  "Professional",
  "Casual",
  "Enthusiastic",
  "Humorous",
  "Inspirational",
  "Educational",
  "Conversational",
  "Formal",
];

const CreateContent: React.FC = () => {
  const { user } = useAuth();
  const { generateContent, saveDraft, isLoading, aiResponse } = useDraft();
  const navigate = useNavigate();

  // Form state
  const [industry, setIndustry] = useState(user?.preferences.defaultIndustry || "Technology");
  const [tone, setTone] = useState(user?.preferences.defaultTone || "Professional");
  const [audience, setAudience] = useState(user?.preferences.defaultAudience || "");
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerate = async () => {
    setError(null); // Reset error state before each attempt
    
    const prompt: AIPrompt = {
      industry,
      tone,
      audience,
    };
    
    try {
      await generateContent(prompt);
      // Reset selections
      setSelectedPostIndex(null);
      setSelectedPlatform(null);
    } catch (error) {
      console.error("Failed to generate content:", error);
      setError(
        "Unable to generate content. Please check your API key configuration or try again later."
      );
    }
  };
  
  const handleSaveDraft = async () => {
    if (aiResponse && selectedPostIndex !== null && selectedPlatform !== null) {
      const platform = selectedPlatform as keyof typeof aiResponse.captions;
      
      try {
        const draft = await saveDraft({
          title: aiResponse.postIdeas[selectedPostIndex],
          caption: aiResponse.captions[platform] || "",
          hashtags: aiResponse.hashtags,
          aiPrompt: {
            industry,
            tone,
            audience,
          },
        });
        
        navigate(`/drafts/${draft.id}`);
      } catch (error) {
        console.error("Failed to save draft:", error);
        setError("Failed to save draft. Please try again.");
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create Content</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate AI Content</CardTitle>
          <CardDescription>
            Describe your industry, preferred tone, and target audience to generate content ideas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Show API key error message if applicable */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!import.meta.env.VITE_OPENAI_API_KEY && (
            <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-300">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>API Key Missing</AlertTitle>
              <AlertDescription>
                OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your environment variables.
                Using fallback content generation until configured.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="audience">Audience Description</Label>
            <Textarea
              id="audience"
              placeholder="Describe your target audience (age, interests, demographics, etc.)"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleGenerate} 
            className="bg-primary hover:bg-primary-dark" 
            disabled={isLoading || !industry || !tone || !audience}
          >
            {isLoading ? "Generating..." : "Generate Content Ideas"}
          </Button>
        </CardContent>
      </Card>
      
      {aiResponse && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              Select a post idea and platform to preview the content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Post Ideas */}
            <div className="space-y-4">
              <h3 className="font-medium">Post Ideas</h3>
              <div className="grid gap-2">
                {aiResponse.postIdeas.map((idea, index) => (
                  <Button
                    key={index}
                    variant={selectedPostIndex === index ? "default" : "outline"}
                    className={`justify-start text-left h-auto py-3 ${selectedPostIndex === index ? "bg-primary text-white" : ""}`}
                    onClick={() => setSelectedPostIndex(index)}
                  >
                    {idea}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Platform Selection */}
            {selectedPostIndex !== null && (
              <div className="space-y-4">
                <h3 className="font-medium">Select Platform</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(aiResponse.captions).map((platform) => (
                    <Button
                      key={platform}
                      variant={selectedPlatform === platform ? "default" : "outline"}
                      className={selectedPlatform === platform ? "bg-primary text-white" : ""}
                      onClick={() => setSelectedPlatform(platform)}
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Content Preview */}
            {selectedPostIndex !== null && selectedPlatform !== null && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Caption Preview</h3>
                  <div className="mt-2 border rounded-lg p-4 bg-gray-50">
                    <p>{aiResponse.captions[selectedPlatform as keyof typeof aiResponse.captions]}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium">Suggested Hashtags</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {aiResponse.hashtags.map((hashtag) => (
                      <span key={hashtag} className="bg-primary-light text-primary px-2 py-1 rounded text-sm">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveDraft} 
                  className="bg-accent hover:bg-accent-dark"
                >
                  Save to Drafts
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreateContent;
