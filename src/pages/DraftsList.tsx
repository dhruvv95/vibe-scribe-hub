
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDraft } from "@/contexts/DraftContext";
import { Search, Edit, Trash, MoreHorizontal } from "lucide-react";

const DraftsList: React.FC = () => {
  const { drafts, deleteDraft } = useDraft();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredDrafts = drafts.filter(
    (draft) =>
      draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      draft.caption.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      await deleteDraft(id);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Drafts</h1>
        <Link to="/create">
          <Button className="bg-primary hover:bg-primary-dark">Create New</Button>
        </Link>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search drafts..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="space-y-4">
        {filteredDrafts.length > 0 ? (
          filteredDrafts.map((draft) => (
            <Card key={draft.id} className="hover:border-primary transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Link to={`/drafts/${draft.id}`} className="block">
                      <h3 className="font-medium hover:text-primary">{draft.title}</h3>
                      <p className="text-sm text-muted-foreground truncate max-w-2xl mt-1">
                        {draft.caption.substring(0, 120)}...
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {draft.hashtags.slice(0, 3).map((tag) => (
                          <span key={tag} className="bg-primary-light text-primary px-2 py-0.5 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {draft.hashtags.length > 3 && (
                          <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs">
                            +{draft.hashtags.length - 3} more
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      {new Date(draft.updatedAt).toLocaleDateString()}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/drafts/${draft.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(draft.id)}>
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-gray-50 border border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No drafts match your search" : "No drafts yet"}
              </p>
              {!searchTerm && (
                <Link to="/create">
                  <Button className="bg-primary hover:bg-primary-dark">Create your first draft</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DraftsList;
