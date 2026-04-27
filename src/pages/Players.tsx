import { useState, useEffect } from "react";
import { Search, UserPlus, Upload, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PixelAvatar } from "@/components/PixelAvatar";
import { Card, CardContent } from "@/components/ui/card";
import Papa from "papaparse";

interface Player {
  id: string;
  name: string;
  email: string;
  points: number;
  department: string;
  avatar: string;
  extId: string;
}

const Players = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/employee_data.csv"); // Adjust the path based on your file location
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        complete: (result) => {
          const parsedPlayers = result.data.map((row: any) => ({
            id: row.Employee_ID,
            name: row.Name,
            email: row.Email_ID,
            points: parseInt(row.Wellness_Score) || 0,
            department: row.Team_Name,
            avatar: "",
            extId: row.Employee_ID,
          })).filter((player: Player) => player.id); // Filter out any invalid rows
          setPlayers(parsedPlayers);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    };

    fetchData();
  }, []);

  const departments = ["all", ...new Set(players.map((player) => player.department))];

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || player.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleGenerateAvatar = (playerId: string) => {
    console.log("Generate avatar for player:", playerId);
    // Mock avatar generation
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-pixel text-primary text-shadow-glow mb-2">
            👥 Players
          </h1>
          <p className="text-muted-foreground font-retro">
            Manage all registered players with pixel avatars
          </p>
        </div>
        <Button 
          className="pixel-button bg-accent text-accent-foreground"
          onClick={() => window.location.href = '/profile'}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          GO TO PROFILE
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="arcade-input pl-10"
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="arcade-input bg-input text-foreground px-3 py-2 rounded-sm w-full sm:w-auto"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept === "all" ? "All Departments" : dept}
            </option>
          ))}
        </select>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlayers.map((player) => (
          <Card 
            key={player.id} 
            className="pixel-card neon-border-cyan hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={() => window.location.href = `/profile/${player.id}`}
          >
            <CardContent className="p-4 text-center space-y-4">
              {/* Avatar */}
              <div className="flex justify-center">
                <PixelAvatar 
                  src={player.avatar}
                  alt={player.name}
                  size="lg"
                  animated
                />
              </div>

              {/* Player Info */}
              <div className="space-y-2">
                <h3 className="font-pixel text-sm text-primary">{player.name}</h3>
                <p className="font-retro text-xs text-muted-foreground">{player.email}</p>
                <div className="flex justify-center gap-2">
                  <span className="px-2 py-1 bg-accent/20 text-accent font-retro text-xs rounded-sm">
                    {player.department}
                  </span>
                  <span className="px-2 py-1 bg-primary/20 text-primary font-retro text-xs rounded-sm">
                    {player.points} pts
                  </span>
                </div>
                <div className="font-retro text-xs text-muted-foreground">
                  ID: {player.extId}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => handleGenerateAvatar(player.id)}
                  className="flex-1 neon-border-pink text-neon-pink hover:bg-neon-pink/10 text-xs font-retro"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Avatar
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  className="flex-1 neon-border-yellow text-neon-yellow hover:bg-neon-yellow/10 text-xs font-retro"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">😢</div>
          <h3 className="font-pixel text-lg text-muted-foreground mb-2">No Players Found</h3>
          <p className="font-retro text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "No players registered yet"}
          </p>
        </div>
      )}

      {/* Stats Footer */}
      <div className="pixel-card neon-border-green bg-accent/5">
        <div className="flex justify-between items-center">
          <div className="font-retro text-sm">
            <span className="text-accent font-pixel">{filteredPlayers.length}</span> players shown
          </div>
          <div className="font-retro text-sm">
            Total Points: <span className="text-primary font-pixel">
              {filteredPlayers.reduce((sum, player) => sum + player.points, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Players;