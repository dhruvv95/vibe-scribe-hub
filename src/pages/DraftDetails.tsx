
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useDraft } from "@/contexts/DraftContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DraftDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDraft, updateDraft, deleteDraft } = useDraft();
  
  const [draft, setDraft] = useState(getDraft(id || ""));
  const [title, setTitle] = useState(draft?.title || "");
  const [caption, setCaption] = useState(draft?.caption || "");
  const [hashtagsText, setHashtagsText] = useState(draft?.hashtags.join(" ") || "");
  
  useEffect(() => {
    if (!draft) {
      navigate("/drafts");
    }
  }, [draft, navigate]);
  
  if (!draft) {
    return <div>Draft not found</div>;
  }
  
  const handleUpdate = async () => {
    if (draft) {
      // Parse hashtags (split by spaces)
      const hashtags = hashtagsText
        .split(/\s+/)
        .filter(tag => tag.trim() !== "")
        .map(tag => tag.startsWith("#") ? tag : `#${tag}`);
      
      await updateDraft(draft.id, {
        title,
        caption,
        hashtags,
      });
      
      // Refresh draft data
      setDraft(getDraft(draft.id));
    }
  };
  
  const handleDelete = async () => {
    if (draft && confirm("Are you sure you want to delete this draft?")) {
      await deleteDraft(draft.id);
      navigate("/drafts");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Draft</h1>
        <div className="flex gap-2">
          <Button onClick={handleUpdate} className="bg-primary hover:bg-primary-dark">
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleDelete} className="text-red-500 hover:text-red-700 hover:border-red-700">
            Delete Draft
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Draft Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea 
              id="caption"
              rows={6}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <Input 
              id="hashtags"
              value={hashtagsText}
              onChange={(e) => setHashtagsText(e.target.value)}
              placeholder="Enter hashtags separated by spaces"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Content Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="original">Original AI Prompt</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3">{title}</h3>
                <p className="text-gray-700 whitespace-pre-line mb-4">{caption}</p>
                <div className="flex flex-wrap gap-2">
                  {hashtagsText
                    .split(/\s+/)
                    .filter(tag => tag.trim() !== "")
                    .map((tag, index) => (
                      <span key={index} className="bg-primary-light text-primary px-2 py-1 rounded text-sm">
                        {tag.startsWith("#") ? tag : `#${tag}`}
                      </span>
                    ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="original">
              {draft.aiPrompt ? (
                <div className="border rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="font-medium">{draft.aiPrompt.industry}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Tone</p>
                      <p className="font-medium">{draft.aiPrompt.tone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Audience</p>
                      <p className="font-medium">{draft.aiPrompt.audience}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No original AI prompt information available.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraftDetails;
