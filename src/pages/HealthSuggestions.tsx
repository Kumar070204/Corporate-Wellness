import { useState } from "react";
import { Heart, RefreshCw, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const mockSuggestions = [
  {
    id: 1,
    action: "Take a 15-minute walk",
    support: "Improves cardiovascular health and mental clarity",
    impact: "Moderate",
    icon: "🚶‍♂️",
    category: "Physical",
    duration: "15 min",
    difficulty: "Easy",
    completed: false
  },
  {
    id: 2, 
    action: "Practice deep breathing",
    support: "Reduces stress and lowers blood pressure",
    impact: "High",
    category: "Mental",
    duration: "5 min",
    difficulty: "Easy",
    completed: false,
    icon: "🧘‍♀️"
  },
  {
    id: 3,
    action: "Drink 2 glasses of water",
    support: "Maintains hydration for optimal body function",
    impact: "High", 
    category: "Nutrition",
    duration: "2 min",
    difficulty: "Easy",
    completed: true,
    icon: "💧"
  }
];

const motivationalBadges = [
  { label: "🔥 On Track", condition: "streak", color: "text-accent" },
  { label: "⚡ Needs Boost", condition: "low", color: "text-neon-yellow" },
  { label: "💪 Strong", condition: "high", color: "text-primary" },
  { label: "🎯 Focused", condition: "consistent", color: "text-neon-pink" }
];

export default function HealthSuggestions() {
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [wellnessScore] = useState(78);

  const refreshSuggestions = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const shuffled = [...mockSuggestions].sort(() => Math.random() - 0.5);
      setSuggestions(shuffled);
      setIsRefreshing(false);
    }, 2000);
  };

  const markCompleted = (id: number) => {
    setSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === id 
          ? { ...suggestion, completed: !suggestion.completed }
          : suggestion
      )
    );
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "text-accent";
      case "Moderate": return "text-neon-yellow";
      case "Low": return "text-neon-pink";
      default: return "text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Physical": return "neon-border-cyan";
      case "Mental": return "neon-border-pink";
      case "Nutrition": return "neon-border-green";
      default: return "neon-border-yellow";
    }
  };

  const completedCount = suggestions.filter(s => s.completed).length;
  const completionRate = (completedCount / suggestions.length) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-pixel text-primary text-shadow-glow mb-2">
          💖 Health Suggestions
        </h1>
        <p className="text-muted-foreground font-retro text-lg">
          Personalized wellness recommendations for your daily routine
        </p>
      </div>

      {/* Wellness Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="pixel-card neon-border-cyan">
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 mx-auto text-primary mb-2" />
            <div className="font-pixel text-2xl text-primary">{wellnessScore}%</div>
            <div className="font-retro text-xs text-muted-foreground">Wellness Score</div>
          </CardContent>
        </Card>
        
        <Card className="pixel-card neon-border-green">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto text-accent mb-2" />
            <div className="font-pixel text-2xl text-accent">{completedCount}/{suggestions.length}</div>
            <div className="font-retro text-xs text-muted-foreground">Today's Progress</div>
          </CardContent>
        </Card>

        <Card className="pixel-card neon-border-pink">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto text-neon-pink mb-2" />
            <div className="font-pixel text-2xl text-neon-pink">{Math.round(completionRate)}%</div>
            <div className="font-retro text-xs text-muted-foreground">Completion Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="pixel-card neon-border-yellow">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-pixel text-sm text-neon-yellow">Daily Goal Progress</span>
            <span className="font-retro text-xs text-muted-foreground">{completedCount}/{suggestions.length} completed</span>
          </div>
          <Progress value={completionRate} className="h-3" />
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button 
          onClick={refreshSuggestions}
          disabled={isRefreshing}
          className="pixel-button bg-accent text-accent-foreground"
        >
          {isRefreshing ? (
            <>
              <div className="animate-spin mr-2">🔄</div>
              GENERATING...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              NEW SUGGESTIONS
            </>
          )}
        </Button>
      </div>

      {/* Health Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {suggestions.map((suggestion, index) => (
          <Card 
            key={suggestion.id}
            className={`pixel-card ${getCategoryColor(suggestion.category)} ${
              suggestion.completed ? 'bg-accent/10' : ''
            } hover:scale-105 transition-all duration-300`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="text-3xl">{suggestion.icon}</div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-sm text-xs font-retro ${
                    suggestion.category === "Physical" ? "bg-primary/20 text-primary" :
                    suggestion.category === "Mental" ? "bg-neon-pink/20 text-neon-pink" :
                    "bg-accent/20 text-accent"
                  }`}>
                    {suggestion.category}
                  </span>
                </div>
              </div>
              <CardTitle className="font-pixel text-sm">{suggestion.action}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Support Info */}
              <div className="pixel-card bg-muted/20 p-3">
                <div className="font-pixel text-xs text-accent mb-1">SUPPORT</div>
                <p className="font-retro text-xs text-muted-foreground">{suggestion.support}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <div className="font-pixel text-xs">{suggestion.duration}</div>
                </div>
                <div>
                  <div className={`font-pixel text-xs ${getImpactColor(suggestion.impact)}`}>
                    {suggestion.impact}
                  </div>
                  <div className="font-retro text-xs text-muted-foreground">Impact</div>
                </div>
                <div>
                  <div className="font-pixel text-xs text-accent">{suggestion.difficulty}</div>
                  <div className="font-retro text-xs text-muted-foreground">Level</div>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => markCompleted(suggestion.id)}
                className={`w-full ${
                  suggestion.completed 
                    ? 'pixel-button bg-accent text-accent-foreground' 
                    : 'pixel-button bg-primary text-primary-foreground'
                }`}
              >
                {suggestion.completed ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    COMPLETED
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    MARK DONE
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Motivational Badges */}
      <Card className="pixel-card neon-border-green">
        <CardHeader>
          <CardTitle className="font-pixel text-accent text-lg">
            🏆 YOUR WELLNESS BADGES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {motivationalBadges.map((badge, index) => (
              <div key={index} className={`text-center p-3 rounded-sm border border-border hover:bg-muted/20 transition-colors ${badge.color}`}>
                <div className="font-pixel text-sm mb-1">{badge.label}</div>
                <div className="font-retro text-xs text-muted-foreground">Active</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="pixel-card bg-primary/10 neon-border-cyan">
          <div className="font-pixel text-xs text-primary mb-2">💡 TIP</div>
          <p className="font-retro text-xs text-muted-foreground">
            Complete at least 2 health suggestions daily to maintain your wellness streak and earn bonus points!
          </p>
        </div>
        <div className="pixel-card bg-neon-pink/10 neon-border-pink">
          <div className="font-pixel text-xs text-neon-pink mb-2">⚡ BONUS</div>
          <p className="font-retro text-xs text-muted-foreground">
            Share your completed activities with teammates to inspire others and unlock team challenges.
          </p>
        </div>
      </div>
    </div>
  );
}