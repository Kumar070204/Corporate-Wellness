import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Save, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PixelAvatar } from "@/components/PixelAvatar";

export default function AvatarCreation() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [wellnessScore] = useState(85); // Mock wellness score
  const navigate = useNavigate();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setGeneratedAvatarUrl(null); // Reset generated avatar when new file is selected
    }
  };

  const handleGenerateAvatar = async () => {
    if (!selectedFile) {
      alert("Please select an image to generate an avatar.");
      return;
    }

    setGenerating(true);

    try {
      // Upload to backend proxy
      console.log("Uploading to backend proxy at", new Date().toISOString());
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("http://localhost:3000/upload-image", {
        method: "POST",
        body: formData,
      });

      console.log("Backend Proxy Response Status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend Proxy Error Response:", errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText || "No response body"}`);
      }

      const result = await response.json();
      console.log("Backend Proxy Response:", result);
      const imageUrl = result.avatarUrl;

      // The rest of the process (LightX API and polling) is handled by the backend
      setGeneratedAvatarUrl(imageUrl); // For now, assume the backend returns the final avatarUrl
    } catch (error) {
      console.error("Avatar generation error:", error);
      alert(`Failed to generate avatar. Please try again. Error: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveAndContinue = () => {
    if (generatedAvatarUrl) {
      // Here you would typically save the avatar URL to the user's profile (e.g., via API or local storage)
      console.log("Saving avatar URL:", generatedAvatarUrl);
      navigate("/dashboard");
    } else {
      alert("Please generate an avatar before saving.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-pixel text-primary text-shadow-glow mb-2"> 🎨 AVATAR CREATOR </h1>
          <p className="font-retro text-muted-foreground text-lg"> Create your pixel-perfect gaming persona </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Avatar Preview */}
          <Card className="pixel-card neon-border-pink">
            <CardHeader className="text-center">
              <CardTitle className="font-pixel text-neon-pink text-lg">
                👾 YOUR AVATAR
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="flex justify-center">
                {generating ? (
                  <div className="w-32 h-32 border-2 border-primary rounded-sm flex items-center justify-center animate-pulse">
                    <div className="text-center">
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="font-retro text-xs">Generating...</div>
                    </div>
                  </div>
                ) : generatedAvatarUrl ? (
                  <PixelAvatar 
                    src={generatedAvatarUrl} 
                    size="xl"
                    className="w-32 h-32"
                    animated
                  />
                ) : previewUrl ? (
                  <PixelAvatar 
                    src={previewUrl} 
                    size="xl"
                    className="w-32 h-32"
                    animated
                  />
                ) : (
                  <div className="w-32 h-32 border-2 border-primary rounded-sm flex items-center justify-center bg-muted/20">
                    <span className="text-4xl">👤</span>
                  </div>
                )}
              </div>

              {/* Wellness Score */}
              <div className="space-y-2">
                <div className="font-pixel text-sm text-accent">WELLNESS SCORE</div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-accent-glow transition-all duration-1000 animate-glow"
                      style={{ width: `${wellnessScore}%` }}
                    ></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-pixel text-xs text-foreground">{wellnessScore}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleGenerateAvatar}
                  disabled={generating || !selectedFile}
                  className="w-full pixel-button bg-neon-yellow text-background"
                >
                  <Save className="w-4 h-4 mr-2" />
                  GENERATE AVATAR
                </Button>
                
                <Button 
                  onClick={handleSaveAndContinue}
                  disabled={!generatedAvatarUrl}
                  className="w-full pixel-button bg-accent text-accent-foreground"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  SAVE & CONTINUE
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card className="pixel-card neon-border-cyan">
            <CardHeader className="text-center">
              <CardTitle className="font-pixel text-primary text-lg">
                📸 UPLOAD PHOTO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-primary/30 rounded-sm p-8 text-center hover:border-primary/60 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="avatar-upload"
                />
                <label 
                  htmlFor="avatar-upload"
                  className="cursor-pointer space-y-4 block"
                >
                  <Upload className="w-12 h-12 mx-auto text-primary" />
                  <div>
                    <div className="font-retro text-sm text-foreground mb-2">
                      Click to upload a photo
                    </div>
                    <div className="font-retro text-xs text-muted-foreground">
                      JPG, PNG or GIF up to 10MB
                    </div>
                  </div>
                </label>
              </div>

              {selectedFile && (
                <div className="pixel-card bg-muted/20 p-4">
                  <div className="font-retro text-sm text-foreground mb-2">Selected File:</div>
                  <div className="font-retro text-xs text-muted-foreground">{selectedFile.name}</div>
                </div>
              )}

              {/* Info */}
              <div className="space-y-3">
                <div className="pixel-card bg-accent/10 p-3">
                  <div className="font-pixel text-xs text-accent mb-2">✨ AI MAGIC</div>
                  <div className="font-retro text-xs text-muted-foreground">
                    Upload your photo and our AI will create a pixel-perfect cartoon avatar with a random themed background!
                  </div>
                </div>

                <div className="pixel-card bg-primary/10 p-3">
                  <div className="font-pixel text-xs text-primary mb-2">🎭 THEMES</div>
                  <div className="font-retro text-xs text-muted-foreground">
                    Jungle • City • Office • Fantasy • Space • Retro
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            onClick={handleSaveAndContinue}
            className="neon-border-yellow text-neon-yellow hover:bg-neon-yellow/10"
          >
            Skip for now - Use default avatar
          </Button>
        </div>
      </div>
    </div>
  );
}