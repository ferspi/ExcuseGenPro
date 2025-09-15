import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarX, Users, Lightbulb, Clock, Wand2, Dice6 } from "lucide-react";
import { ExcuseRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ExcuseFormProps {
  apiKey: string;
  model: string;
  onGenerateRequest: (request: ExcuseRequest) => void;
  isLoading?: boolean;
}

export function ExcuseForm({ apiKey, model, onGenerateRequest, isLoading = false }: ExcuseFormProps) {
  const [situation, setSituation] = useState("");
  const [audience, setAudience] = useState<string>("");
  const [creativity, setCreativity] = useState([5]);
  const [urgency, setUrgency] = useState<string>("");
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey) {
      toast({
        title: "Clave API Requerida",
        description: "Por favor ingresa tu clave API para generar excusas.",
        variant: "destructive",
      });
      return;
    }

    if (!situation || !audience || !urgency) {
      toast({
        title: "Formulario Incompleto",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    const request: ExcuseRequest = {
      situation,
      audience: audience as any,
      creativity: creativity[0],
      urgency: urgency as any,
      apiKey,
      model,
    };

    onGenerateRequest(request);
  };

  const handleSurpriseMe = () => {
    const situations = [
      "Reunión semanal de equipo en el trabajo",
      "Sesión de laboratorio de química",
      "Cena familiar el domingo",
      "Fiesta de cumpleaños de un amigo",
      "Cita con el dentista",
      "Clase universitaria",
      "Ceremonia de boda",
      "Entrevista de trabajo",
    ];
    
    const audiences = ["professor", "boss", "parents", "partner", "friends"];
    
    setSituation(situations[Math.floor(Math.random() * situations.length)]);
    setAudience(audiences[Math.floor(Math.random() * audiences.length)]);
    setCreativity([Math.floor(Math.random() * 10) + 1]);
    setUrgency(Math.random() > 0.5 ? "last-minute" : "planned");
    
    toast({
      title: "¡Formulario Completado!",
      description: "Se han llenado valores aleatorios en el formulario.",
    });
  };

  return (
    <section className="mb-12">
      <Card className="glass-effect neon-border">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text" data-testid="text-generate-title">Genera tu Excusa</h2>
            <Button
              type="button"
              onClick={handleSurpriseMe}
              variant="outline"
              className="bg-gradient-to-r from-neon-purple to-neon-blue border-0 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              data-testid="button-surprise-me"
            >
              <Dice6 className="mr-2 h-4 w-4" />
              Sorpréndeme
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Situation Input */}
            <div>
              <Label className="block text-sm font-medium mb-3">
                <CalendarX className="text-neon-coral mr-2 h-4 w-4 inline" />
                ¿A qué evento/compromiso no puedes asistir?
              </Label>
              <Textarea
                placeholder="ej. sesión de laboratorio de química, cena familiar, reunión de equipo..."
                rows={3}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                className="w-full bg-input border border-border rounded-lg resize-none"
                data-testid="textarea-situation"
              />
            </div>

            {/* Audience Type */}
            <div>
              <Label className="block text-sm font-medium mb-3">
                <Users className="text-neon-blue mr-2 h-4 w-4 inline" />
                ¿A quién le darás esta excusa?
              </Label>
              <Select value={audience} onValueChange={setAudience} data-testid="select-audience">
                <SelectTrigger className="w-full bg-input border border-border rounded-lg">
                  <SelectValue placeholder="Selecciona la audiencia..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professor">Profesor</SelectItem>
                  <SelectItem value="boss">Jefe/Gerente</SelectItem>
                  <SelectItem value="parents">Padres</SelectItem>
                  <SelectItem value="partner">Pareja Romántica</SelectItem>
                  <SelectItem value="friends">Amigos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Creativity Slider */}
            <div>
              <Label className="block text-sm font-medium mb-3">
                <Lightbulb className="text-neon-purple mr-2 h-4 w-4 inline" />
                Nivel de Creatividad: <span className="text-neon-purple font-bold" data-testid="text-creativity-value">{creativity[0]}</span>/10
              </Label>
              <div className="relative">
                <Slider
                  value={creativity}
                  onValueChange={setCreativity}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full slider-track"
                  data-testid="slider-creativity"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Creíble y Simple</span>
                  <span>Muy Creativo</span>
                </div>
              </div>
            </div>

            {/* Urgency */}
            <div>
              <Label className="block text-sm font-medium mb-3">
                <Clock className="text-neon-green mr-2 h-4 w-4 inline" />
                Momento
              </Label>
              <RadioGroup value={urgency} onValueChange={setUrgency} className="grid grid-cols-2 gap-4" data-testid="radio-urgency">
                <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg border border-border cursor-pointer hover:bg-muted/70 transition-colors">
                  <RadioGroupItem value="last-minute" id="last-minute" />
                  <Label htmlFor="last-minute" className="cursor-pointer flex-1">
                    <div className="font-medium">Último Momento</div>
                    <div className="text-sm text-muted-foreground">Excusa de emergencia necesaria ahora</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg border border-border cursor-pointer hover:bg-muted/70 transition-colors">
                  <RadioGroupItem value="planned" id="planned" />
                  <Label htmlFor="planned" className="cursor-pointer flex-1">
                    <div className="font-medium">Planificada</div>
                    <div className="text-sm text-muted-foreground">Excusa con aviso previo</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Generate Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-bold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed border-0"
              data-testid="button-generate"
            >
              <Wand2 className="mr-2 h-5 w-5" />
              {isLoading ? "Generando..." : "Generar Excusas"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
