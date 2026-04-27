import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center animate-glow">
              <span className="text-2xl">👾</span>
            </div>
            <h1 className="text-2xl font-pixel text-primary text-shadow-glow">PIXEL DASH</h1>
          </div>
          <p className="font-retro text-muted-foreground">Gamification Hub</p>
        </div>

        {/* Sign In Form */}
        <Card className="pixel-card neon-border-cyan">
          <CardHeader className="text-center">
            <CardTitle className="font-pixel text-primary text-lg">
              🏆 PLAYER LOGIN
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-retro text-sm">
                  Email / Username
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="arcade-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-retro text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="arcade-input pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full pixel-button">
                <LogIn className="w-4 h-4 mr-2" />
                LOGIN
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Link 
                  to="/forgot-password" 
                  className="font-retro text-sm text-accent hover:text-accent-glow transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground font-retro">OR</span>
                </div>
              </div>

              <Link to="/signup">
                <Button variant="outline" className="w-full neon-border-green text-accent hover:bg-accent/10">
                  <UserPlus className="w-4 h-4 mr-2" />
                  CREATE ACCOUNT
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-4 text-center">
          <div className="pixel-card bg-muted/20 p-3">
            <p className="font-retro text-xs text-muted-foreground mb-2">Demo Credentials:</p>
            <p className="font-retro text-xs">Email: demo@pixeldash.com</p>
            <p className="font-retro text-xs">Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}