
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useDraft } from "@/contexts/DraftContext";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { drafts } = useDraft();

  // Take only the 5 most recent drafts
  const recentDrafts = drafts.slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome back, {user?.email?.split('@')[0]}</h1>
        <Link to="/create">
          <Button className="bg-accent hover:bg-accent-dark">
            <Plus className="mr-2 h-4 w-4" />
            Create Content
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Drafts</CardTitle>
            <CardDescription>You have {drafts.length} saved drafts</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/drafts">
              <Button variant="outline" className="w-full">View all drafts</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Create</CardTitle>
            <CardDescription>Generate new content with AI</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/create">
              <Button className="w-full bg-primary hover:bg-primary-dark">New AI content</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/settings">
              <Button variant="outline" className="w-full">Update settings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Drafts</h2>
        {recentDrafts.length > 0 ? (
          <div className="space-y-4">
            {recentDrafts.map((draft) => (
              <Card key={draft.id} className="hover:border-primary cursor-pointer transition-colors">
                <Link to={`/drafts/${draft.id}`}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{draft.title}</h3>
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {draft.caption.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(draft.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50 border border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="mb-4 text-muted-foreground">No drafts yet</p>
              <Link to="/create">
                <Button className="bg-primary hover:bg-primary-dark">
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first draft
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
