import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, Zap, Target, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PixelAvatar } from "@/components/PixelAvatar";

const mockPlayers = [
  { extId: "ENG001", name: "Alex Pixel", currentPoints: 2500 },
  { extId: "DES001", name: "Maya Neon", currentPoints: 2100 },
  { extId: "MKT001", name: "Zoe Cyber", currentPoints: 1800 },
  { extId: "ENG002", name: "Tech Wizard", currentPoints: 1650 },
];

const presetRewards = [
  { label: "Daily Login", points: 10, icon: "🎯" },
  { label: "Task Complete", points: 50, icon: "✅" },
  { label: "Weekly Goal", points: 100, icon: "🏆" },
  { label: "Team Challenge", points: 200, icon: "⚡" },
  { label: "Monthly Bonus", points: 500, icon: "💎" },
];

export default function GivePoints() {
  const [formData, setFormData] = useState({
    playerExtId: "",
    points: "",
    reason: "",
  });
  const [selectedPlayer, setSelectedPlayer] = useState<typeof mockPlayers[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePlayerSelect = (extId: string) => {
    const player = mockPlayers.find(p => p.extId === extId);
    setSelectedPlayer(player || null);
    setFormData(prev => ({ ...prev, playerExtId: extId }));
  };

  const handlePresetReward = (preset: typeof presetRewards[0]) => {
    setFormData(prev => ({
      ...prev,
      points: preset.points.toString(),
      reason: preset.label,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    setIsSubmitting(true);

    // Mock API call with coin animation
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "🪙 Points Awarded!",
        description: `${selectedPlayer.name} received ${formData.points} points for ${formData.reason}`,
      });

      // Update selected player points
      if (selectedPlayer) {
        selectedPlayer.currentPoints += parseInt(formData.points);
      }

      // Reset form
      setFormData({ playerExtId: "", points: "", reason: "" });
      setSelectedPlayer(null);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-pixel text-primary text-shadow-glow mb-2">
          🎯 Give Points
        </h1>
        <p className="text-muted-foreground font-retro text-lg">
          Award points to players for achievements and milestones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Award Points Form */}
        <Card className="pixel-card neon-border-green">
          <CardHeader className="text-center">
            <CardTitle className="font-pixel text-accent text-lg flex items-center justify-center gap-2">
              <Coins className="w-5 h-5" />
              POINT DISTRIBUTION TERMINAL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Player Selection */}
              <div className="space-y-2">
                <Label htmlFor="player" className="font-retro text-sm text-accent">
                  Select Player *
                </Label>
                <Select value={formData.playerExtId} onValueChange={handlePlayerSelect} required>
                  <SelectTrigger className="arcade-input">
                    <SelectValue placeholder="Choose a player..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPlayers.map((player) => (
                      <SelectItem key={player.extId} value={player.extId}>
                        {player.name} ({player.extId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Player Preview */}
              {selectedPlayer && (
                <div className="pixel-card bg-primary/10 neon-border-cyan animate-fade-in">
                  <div className="flex items-center gap-3">
                    <PixelAvatar size="md" animated />
                    <div className="flex-1">
                      <div className="font-retro text-sm text-foreground">{selectedPlayer.name}</div>
                      <div className="font-retro text-xs text-muted-foreground">{selectedPlayer.extId}</div>
                      <div className="font-pixel text-xs text-primary">
                        Current: {selectedPlayer.currentPoints} pts
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Points Input */}
              <div className="space-y-2">
                <Label htmlFor="points" className="font-retro text-sm text-accent">
                  Points to Award *
                </Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  placeholder="Enter points amount"
                  value={formData.points}
                  onChange={(e) => setFormData(prev => ({ ...prev, points: e.target.value }))}
                  className="arcade-input"
                  required
                />
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="font-retro text-sm text-accent">
                  Reason *
                </Label>
                <Input
                  id="reason"
                  type="text"
                  placeholder="Why are you awarding these points?"
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  className="arcade-input"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit"
                className="w-full pixel-button bg-accent text-accent-foreground"
                disabled={isSubmitting || !selectedPlayer}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2">🪙</div>
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    AWARD POINTS
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Rewards */}
        <div className="space-y-6">
          <Card className="pixel-card neon-border-pink">
            <CardHeader>
              <CardTitle className="font-pixel text-neon-pink text-lg flex items-center gap-2">
                <Zap className="w-5 h-5" />
                QUICK REWARDS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {presetRewards.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetReward(preset)}
                  className="w-full p-3 rounded-sm border-2 border-transparent hover:border-neon-pink/50 bg-muted/20 hover:bg-neon-pink/10 transition-all duration-200 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{preset.icon}</span>
                      <div>
                        <div className="font-retro text-sm text-foreground">{preset.label}</div>
                        <div className="font-pixel text-xs text-neon-pink">{preset.points} pts</div>
                      </div>
                    </div>
                    <Target className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Awards */}
          <Card className="pixel-card neon-border-yellow">
            <CardHeader>
              <CardTitle className="font-pixel text-neon-yellow text-lg">
                📊 RECENT AWARDS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { player: "Maya Neon", points: 100, reason: "Weekly Goal", time: "2 min ago" },
                { player: "Alex Pixel", points: 50, reason: "Task Complete", time: "5 min ago" },
                { player: "Zoe Cyber", points: 200, reason: "Team Challenge", time: "10 min ago" },
              ].map((award, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-sm bg-muted/20">
                  <PixelAvatar size="sm" />
                  <div className="flex-1">
                    <div className="font-retro text-sm">
                      <span className="text-neon-yellow">{award.player}</span> earned{" "}
                      <span className="text-primary font-pixel text-xs">{award.points} pts</span>
                    </div>
                    <div className="font-retro text-xs text-muted-foreground">
                      {award.reason} • {award.time}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Point Calculation Preview */}
      {selectedPlayer && formData.points && (
        <Card className="pixel-card neon-border-cyan animate-pulse">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="font-pixel text-sm text-primary">CALCULATION PREVIEW</div>
              <div className="font-retro text-lg">
                <span className="text-muted-foreground">{selectedPlayer.currentPoints}</span>
                <span className="text-accent mx-2">+</span>
                <span className="text-accent">{formData.points}</span>
                <span className="text-primary mx-2">=</span>
                <span className="text-primary font-pixel">
                  {selectedPlayer.currentPoints + parseInt(formData.points || "0")} pts
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}