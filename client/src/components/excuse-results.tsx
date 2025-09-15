import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Bookmark, Copy, Lightbulb, Loader2, Brain } from "lucide-react";
import { GeneratedExcuse, SavedExcuse } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { ExcuseStorageService } from "@/lib/excuse-storage";

interface ExcuseResultsProps {
  excuses: GeneratedExcuse[];
  situation: string;
  audience: string;
  isLoading?: boolean;
}

export function ExcuseResults({ excuses, situation, audience, isLoading = false }: ExcuseResultsProps) {
  const [sortBy, setSortBy] = useState("totalScore");
  const { toast } = useToast();

  // Show loading state
  if (isLoading) {
    return (
      <section id="results-section" className="mb-12 animate-slide-up">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-center space-y-4">
            <div className="relative">
              <Brain className="h-16 w-16 text-neon-blue mx-auto animate-pulse" />
              <Loader2 className="absolute top-0 left-1/2 transform -translate-x-1/2 h-16 w-16 text-neon-purple animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold gradient-text" data-testid="text-generating-title">
                Generando excusas creativas...
              </h3>
              <p className="text-muted-foreground text-sm" data-testid="text-generating-subtitle">
                La IA está procesando tu situación y creando excusas personalizadas
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (!excuses.length) return null;

  const sortedExcuses = [...excuses].sort((a, b) => {
    switch (sortBy) {
      case "credibilityScore":
        return b.credibilityScore - a.credibilityScore;
      case "originalityScore":
        return b.originalityScore - a.originalityScore;
      case "riskLevel":
        const riskOrder = { low: 3, medium: 2, high: 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      default:
        return b.totalScore - a.totalScore;
    }
  });

  const handleSaveExcuse = (excuse: GeneratedExcuse) => {
    try {
      const savedExcuse: SavedExcuse = {
        ...excuse,
        situation,
        audience,
        savedDate: new Date().toISOString(),
        isUsed: false,
      };
      
      ExcuseStorageService.saveExcuse(savedExcuse);
      
      toast({
        title: "¡Excusa Guardada!",
        description: "La excusa ha sido añadida a tu colección.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar la excusa. Por favor inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleCopyExcuse = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "¡Copiado!",
        description: "El texto de la excusa ha sido copiado al portapapeles.",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Error al copiar al portapapeles.",
        variant: "destructive",
      });
    }
  };

  const renderStars = (score: number, color: string = "text-neon-green") => {
    return Array.from({ length: 10 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < score ? `${color} fill-current` : "text-muted-foreground"}`}
      />
    ));
  };

  const getRiskBadgeProps = (risk: string) => {
    switch (risk) {
      case "low":
        return { className: "bg-neon-green/20 text-neon-green", children: "Riesgo Bajo" };
      case "medium":
        return { className: "bg-yellow-500/20 text-yellow-500", children: "Riesgo Medio" };
      case "high":
        return { className: "bg-neon-coral/20 text-neon-coral", children: "Riesgo Alto" };
      default:
        return { className: "bg-muted/20 text-muted-foreground", children: "Riesgo Desconocido" };
    }
  };

  return (
    <section id="results-section" className="mb-12 animate-slide-up">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text" data-testid="text-results-title">Excusas Generadas</h2>
        <div className="ml-auto flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Ordenar por:</span>
          <Select value={sortBy} onValueChange={setSortBy} data-testid="select-sort-by">
            <SelectTrigger className="bg-input border border-border rounded-lg w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="totalScore">Puntuación Total</SelectItem>
              <SelectItem value="credibilityScore">Credibilidad</SelectItem>
              <SelectItem value="originalityScore">Originalidad</SelectItem>
              <SelectItem value="riskLevel">Nivel de Riesgo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {sortedExcuses.map((excuse, index) => (
          <Card
            key={excuse.id}
            className="glass-effect border border-border hover:border-neon-blue/50 transition-all duration-300 animate-slide-up"
            data-testid={`card-excuse-${excuse.id}`}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge {...getRiskBadgeProps(excuse.riskLevel)} data-testid={`badge-risk-${excuse.id}`} />
                    <span className="text-xs text-muted-foreground" data-testid={`text-rank-${excuse.id}`}>#{index + 1}</span>
                  </div>
                  <p className="text-foreground mb-3" data-testid={`text-excuse-${excuse.id}`}>
                    {excuse.text}
                  </p>
                  <div className="text-sm text-muted-foreground mb-4" data-testid={`text-tip-${excuse.id}`}>
                    <Lightbulb className="text-neon-purple mr-1 h-4 w-4 inline" />
                    <strong>Consejo de entrega:</strong> {excuse.deliveryTip}
                  </div>
                </div>
              </div>
              
              {/* Scoring */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Credibilidad</div>
                  <div className="flex items-center">
                    <div className="flex space-x-1 mr-2" data-testid={`stars-credibility-${excuse.id}`}>
                      {renderStars(excuse.credibilityScore, "text-neon-green")}
                    </div>
                    <span className="text-sm font-medium" data-testid={`score-credibility-${excuse.id}`}>
                      {excuse.credibilityScore}/10
                    </span>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Originalidad</div>
                  <div className="flex items-center">
                    <div className="flex space-x-1 mr-2" data-testid={`stars-originality-${excuse.id}`}>
                      {renderStars(excuse.originalityScore, "text-neon-purple")}
                    </div>
                    <span className="text-sm font-medium" data-testid={`score-originality-${excuse.id}`}>
                      {excuse.originalityScore}/10
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold gradient-text" data-testid={`text-total-score-${excuse.id}`}>
                  Puntuación Total: {excuse.totalScore}/20
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleSaveExcuse(excuse)}
                    variant="outline"
                    size="sm"
                    className="bg-neon-green/20 text-neon-green border-neon-green/50 hover:bg-neon-green/30"
                    data-testid={`button-save-${excuse.id}`}
                  >
                    <Bookmark className="mr-1 h-4 w-4" />
                    Guardar
                  </Button>
                  <Button
                    onClick={() => handleCopyExcuse(excuse.text)}
                    variant="outline"
                    size="sm"
                    className="bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70"
                    data-testid={`button-copy-${excuse.id}`}
                  >
                    <Copy className="mr-1 h-4 w-4" />
                    Copiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
