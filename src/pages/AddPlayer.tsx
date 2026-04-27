import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Save, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function AddPlayer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    extId: "",
    department: "",
    initialPoints: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const departments = [
    "Engineering", "Design", "Marketing", "Sales", "HR", "Finance", "Operations", "Customer Support"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "🎉 Player Added!",
        description: `${formData.name} has been successfully added to the game.`,
      });
      
      // Animated coin drop effect
      setTimeout(() => {
        navigate("/players");
      }, 1000);
    }, 2000);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      extId: "",
      department: "",
      initialPoints: 0,
    });
  };

  const generateRandomId = () => {
    const prefix = formData.department ? formData.department.slice(0, 3).toUpperCase() : "PLY";
    const randomNum = Math.floor(Math.random() * 999) + 1;
    setFormData(prev => ({ ...prev, extId: `${prefix}${randomNum.toString().padStart(3, '0')}` }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-pixel text-primary text-shadow-glow mb-2">
          ➕ Add Player
        </h1>
        <p className="text-muted-foreground font-retro text-lg">
          Register a new player in the gamification system
        </p>
      </div>

      {/* Form */}
      <Card className="pixel-card neon-border-green">
        <CardHeader className="text-center">
          <CardTitle className="font-pixel text-accent text-lg flex items-center justify-center gap-2">
            <UserPlus className="w-5 h-5" />
            PLAYER REGISTRATION TERMINAL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="font-retro text-sm text-accent">
                  Player Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter player name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="arcade-input"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-retro text-sm text-accent">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="arcade-input"
                  required
                />
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department" className="font-retro text-sm text-accent">
                  Department *
                </Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                  required
                >
                  <SelectTrigger className="arcade-input">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* External ID */}
              <div className="space-y-2">
                <Label htmlFor="extId" className="font-retro text-sm text-accent">
                  External ID *
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="extId"
                    type="text"
                    placeholder="e.g., ENG001"
                    value={formData.extId}
                    onChange={(e) => setFormData(prev => ({ ...prev, extId: e.target.value }))}
                    className="arcade-input flex-1"
                    required
                  />
                  <Button 
                    type="button"
                    onClick={generateRandomId}
                    className="pixel-button bg-neon-yellow text-background px-3"
                  >
                    🎲
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground font-retro">
                  Unique identifier for external systems
                </p>
              </div>

              {/* Initial Points */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="initialPoints" className="font-retro text-sm text-accent">
                  Initial Points
                </Label>
                <Input
                  id="initialPoints"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.initialPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, initialPoints: parseInt(e.target.value) || 0 }))}
                  className="arcade-input"
                />
                <p className="text-xs text-muted-foreground font-retro">
                  Starting points for the new player (optional)
                </p>
              </div>
            </div>

            {/* Preview */}
            {formData.name && (
              <div className="pixel-card bg-primary/10 neon-border-cyan">
                <div className="font-pixel text-xs text-primary mb-2">👀 PREVIEW</div>
                <div className="space-y-1 font-retro text-sm">
                  <div><span className="text-muted-foreground">Name:</span> {formData.name}</div>
                  <div><span className="text-muted-foreground">Email:</span> {formData.email}</div>
                  <div><span className="text-muted-foreground">Department:</span> {formData.department}</div>
                  <div><span className="text-muted-foreground">ID:</span> {formData.extId}</div>
                  <div><span className="text-muted-foreground">Points:</span> {formData.initialPoints}</div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button 
                type="button"
                onClick={handleReset}
                variant="outline"
                className="flex-1 neon-border-yellow text-neon-yellow hover:bg-neon-yellow/10"
                disabled={isSubmitting}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                RESET
              </Button>
              <Button 
                type="submit"
                className="flex-1 pixel-button bg-accent text-accent-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2">⚡</div>
                    ADDING...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    ADD PLAYER
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="pixel-card bg-neon-pink/10 neon-border-pink">
          <div className="font-pixel text-xs text-neon-pink mb-2">💡 TIP</div>
          <p className="font-retro text-xs text-muted-foreground">
            Use department prefixes for External IDs (e.g., ENG001, DES001) to keep them organized.
          </p>
        </div>
        <div className="pixel-card bg-accent/10 neon-border-green">
          <div className="font-pixel text-xs text-accent mb-2">🎯 INFO</div>
          <p className="font-retro text-xs text-muted-foreground">
            Players will receive a welcome email with their avatar creation link after registration.
          </p>
        </div>
      </div>
    </div>
  );
}