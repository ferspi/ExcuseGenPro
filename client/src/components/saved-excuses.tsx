import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ChevronDown, Check, Trash2, Wand2 } from "lucide-react";
import { SavedExcuse } from "@shared/schema";
import { ExcuseStorageService } from "@/lib/excuse-storage";
import { useToast } from "@/hooks/use-toast";

interface SavedExcusesProps {
  onGenerateFirst: () => void;
}

export function SavedExcuses({ onGenerateFirst }: SavedExcusesProps) {
  const [savedExcuses, setSavedExcuses] = useState<SavedExcuse[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedExcuses();
  }, []);

  const loadSavedExcuses = () => {
    const excuses = ExcuseStorageService.getSavedExcuses();
    setSavedExcuses(excuses);
  };

  const handleMarkAsUsed = (id: string) => {
    try {
      ExcuseStorageService.markExcuseAsUsed(id);
      loadSavedExcuses();
      toast({
        title: "Marked as Used",
        description: "The excuse has been marked as used.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark excuse as used.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExcuse = (id: string) => {
    try {
      ExcuseStorageService.deleteExcuse(id);
      loadSavedExcuses();
      toast({
        title: "Deleted",
        description: "The excuse has been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete excuse.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const activeExcuses = savedExcuses.filter(excuse => !excuse.isUsed);
  const usedExcuses = savedExcuses.filter(excuse => excuse.isUsed);

  return (
    <section className="mb-8">
      <Card className="glass-effect border border-border overflow-hidden">
        <button
          className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
          data-testid="button-toggle-saved-excuses"
        >
          <div className="flex items-center">
            <Bookmark className="text-neon-green mr-3 h-5 w-5" />
            <h2 className="text-xl font-bold" data-testid="text-saved-excuses-title">My Saved Excuses</h2>
            <Badge className="ml-3 bg-neon-green/20 text-neon-green" data-testid="badge-saved-count">
              {savedExcuses.length}
            </Badge>
          </div>
          <ChevronDown 
            className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            data-testid="icon-chevron"
          />
        </button>
        
        {isExpanded && (
          <div className="border-t border-border">
            <div className="p-6">
              {savedExcuses.length === 0 ? (
                <div className="text-center">
                  <p className="text-muted-foreground text-sm mb-4" data-testid="text-no-excuses">
                    No saved excuses yet. Generate some excuses above to get started!
                  </p>
                  <Button
                    onClick={onGenerateFirst}
                    className="bg-gradient-to-r from-neon-blue to-neon-purple border-0 text-white font-medium hover:shadow-lg transition-all duration-300"
                    data-testid="button-generate-first"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate My First Excuse
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Active Excuses */}
                  {activeExcuses.map((excuse) => (
                    <div
                      key={excuse.id}
                      className="bg-muted/30 rounded-lg p-4 border border-border"
                      data-testid={`card-saved-excuse-${excuse.id}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-foreground font-medium mb-1" data-testid={`text-saved-excuse-${excuse.id}`}>
                            {excuse.text.length > 100 
                              ? `${excuse.text.substring(0, 100)}...` 
                              : excuse.text
                            }
                          </p>
                          <div className="text-sm text-muted-foreground" data-testid={`text-situation-${excuse.id}`}>
                            Used for: {excuse.situation}
                          </div>
                          <div className="text-xs text-muted-foreground" data-testid={`text-saved-date-${excuse.id}`}>
                            Saved: {formatDate(excuse.savedDate)}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            onClick={() => handleMarkAsUsed(excuse.id)}
                            variant="outline"
                            size="sm"
                            className="bg-neon-coral/20 text-neon-coral border-neon-coral/50 hover:bg-neon-coral/30"
                            data-testid={`button-mark-used-${excuse.id}`}
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Used
                          </Button>
                          <Button
                            onClick={() => handleDeleteExcuse(excuse.id)}
                            variant="outline"
                            size="sm"
                            className="bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70"
                            data-testid={`button-delete-${excuse.id}`}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Used Excuses */}
                  {usedExcuses.map((excuse) => (
                    <div
                      key={excuse.id}
                      className="bg-muted/30 rounded-lg p-4 border border-border opacity-60"
                      data-testid={`card-used-excuse-${excuse.id}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-foreground font-medium mb-1 line-through" data-testid={`text-used-excuse-${excuse.id}`}>
                            {excuse.text.length > 100 
                              ? `${excuse.text.substring(0, 100)}...` 
                              : excuse.text
                            }
                          </p>
                          <div className="text-sm text-muted-foreground" data-testid={`text-used-situation-${excuse.id}`}>
                            Used for: {excuse.situation}
                          </div>
                          <div className="text-xs text-muted-foreground" data-testid={`text-used-date-${excuse.id}`}>
                            Used: {excuse.usedDate ? formatDate(excuse.usedDate) : "N/A"}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Badge className="bg-green-500/20 text-green-500" data-testid={`badge-used-${excuse.id}`}>
                            <Check className="mr-1 h-3 w-3" />
                            Used
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
