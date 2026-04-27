import { useState, useEffect } from "react";
import { User, UserPlus, Camera, Trophy, Target, Zap, Save } from "lucide-react";
import { PixelAvatar } from "@/components/PixelAvatar";

// Simulated StatCard component
function StatCard({ title, value, subtitle, icon: Icon, color }: { title: string; value: string | number; subtitle: string; icon: React.ElementType; color: string }) {
  return (
    <div className={`pixel-card neon-border-${color} p-4 text-center`}>
      <div className={`text-xs font-pixel text-${color}-500 mb-2`}>{title}</div>
      <div className={`text-2xl font-pixel text-${color}-700 mb-1`}>{value}</div>
      <div className="text-xs font-retro text-muted-foreground">{subtitle}</div>
      <div className="mt-2"><Icon className={`w-6 h-6 text-${color}-500`} /></div>
    </div>
  );
}

interface PlayerStats {
  totalPoints: number;
  challengesWon: number;
  rank: number;
  department: string;
}

interface HealthStats {
  steps: number;
  calories: number;
  heartRate: number;
  weight: number;
  bloodPressure: string;
  sleep: number;
  bmr: number | string;
}

export default function Profile() {
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    email: "",
    department: "",
    externalId: ""
  });

  const [userStats] = useState<PlayerStats>({
    totalPoints: 2500,
    challengesWon: 12,
    rank: 3,
    department: "Engineering"
  });

  const [healthStats, setHealthStats] = useState<HealthStats>({
    steps: 0,
    calories: 0,
    heartRate: 0,
    weight: 0,
    bloodPressure: "",
    sleep: 0,
    bmr: "Loading..."
  });

  // Fetch health data from wearables.py server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/health-data");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setHealthStats(data);
      } catch (error) {
        console.error("Error fetching health data:", error);
        setHealthStats({
          steps: 0,
          calories: 0,
          heartRate: 0,
          weight: 0,
          bloodPressure: "N/A",
          sleep: 0,
          bmr: "Error loading data"
        });
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding new player:", newPlayer);
    setNewPlayer({ name: "", email: "", department: "", externalId: "" });
  };

  const handleRegenerateAvatar = () => {
    console.log("Regenerating avatar...");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-pixel text-primary text-shadow-glow mb-2">
          👤 Profile Hub
        </h1>
        <p className="text-muted-foreground font-retro text-lg">
          Manage your profile and add new team members
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Profile Section */}
        <div className="pixel-card neon-border-cyan">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-pixel text-sm text-primary">My Profile</h3>
          </div>

          <div className="text-center mb-6">
            <PixelAvatar 
              size="xl" 
              rank={userStats.rank}
              className="mx-auto mb-4"
              animated
            />
            <button 
              onClick={handleRegenerateAvatar}
              className="pixel-button bg-accent text-accent-foreground mb-4"
            >
              <Camera className="w-4 h-4 mr-2" />
              Regenerate Avatar
            </button>
            <div className="font-pixel text-lg text-primary">Sona</div>
            <div className="font-retro text-sm text-muted-foreground">{userStats.department}</div>
          </div>

          {/* Personal Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Total Points"
              value={userStats.totalPoints.toLocaleString()}
              subtitle="pts"
              icon={Trophy}
              color="yellow"
            />
            <StatCard
              title="Challenges Won"
              value={userStats.challengesWon}
              subtitle="wins"
              icon={Target}
              color="green"
            />
            <StatCard
              title="Current Rank"
              value={`#${userStats.rank}`}
              subtitle="rank"
              icon={Zap}
              color="pink"
            />
          </div>

          {/* Health Stats */}
          <div className="border-t border-primary/20 pt-4">
            <h4 className="font-pixel text-xs text-primary mb-3">Health Summary (Today)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard
                title="Steps"
                value={healthStats.steps}
                subtitle=""
                icon={User}
                color="cyan"
              />
              <StatCard
                title="Calories Burned"
                value={healthStats.calories}
                subtitle="kcal"
                icon={Zap}
                color="yellow"
              />
              <StatCard
                title="Heart Rate"
                value={healthStats.heartRate}
                subtitle="bpm"
                icon={Target}
                color="red"
              />
              <StatCard
                title="Weight"
                value={healthStats.weight}
                subtitle="kg"
                icon={UserPlus}
                color="green"
              />
              <StatCard
                title="Blood Pressure"
                value={healthStats.bloodPressure}
                subtitle="mmHg"
                icon={Camera}
                color="blue"
              />
              <StatCard
                title="Sleep Duration"
                value={healthStats.sleep}
                subtitle="min"
                icon={Save}
                color="purple"
              />
              <StatCard
                title="BMR"
                value={healthStats.bmr}
                subtitle="kcal/day"
                icon={Trophy}
                color="orange"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="border-t border-primary/20 pt-4 mt-6">
            <h4 className="font-pixel text-xs text-primary mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {[
                "Completed Fitness Challenge (+100 pts)",
                "Won Team Battle vs Marketing (+200 pts)",
                "Purchased Jungle Shelter (-150 pts)"
              ].map((activity, index) => (
                <div key={index} className="text-sm font-retro text-muted-foreground">
                  • {activity}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Player Section */}
        <div className="pixel-card neon-border-green">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="w-5 h-5 text-accent" />
            <h3 className="pixel-input w-full bg-gray-800 text-white border-none">Add New Player</h3>
          </div>

          <form onSubmit={handleAddPlayer} className="space-y-4">
            <div>
              <label className="block font-pixel text-xs text-primary mb-2">
                PLAYER NAME
              </label>
              <input
                type="text"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                className="pixel-input w-full bg-gray-800 text-white border-none"
                placeholder="Enter player name..."
                required
              />
            </div>

            <div>
              <label className="block font-pixel text-xs text-primary mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={newPlayer.email}
                onChange={(e) => setNewPlayer(prev => ({ ...prev, email: e.target.value }))}
                className="pixel-input w-full bg-gray-800 text-white border-none"
                placeholder="player@company.com"
                required
              />
            </div>

            <div>
              <label className="block font-pixel text-xs text-primary mb-2">
                DEPARTMENT
              </label>
              <select
                value={newPlayer.department}
                onChange={(e) => setNewPlayer(prev => ({ ...prev, department: e.target.value }))}
                className="pixel-input w-full bg-gray-800 text-white border-none"
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div>
              <label className="block font-pixel text-xs text-primary mb-2">
                EXTERNAL ID
              </label>
              <input
                type="text"
                value={newPlayer.externalId}
                onChange={(e) => setNewPlayer(prev => ({ ...prev, externalId: e.target.value }))}
                className="pixel-input w-full bg-gray-800 text-white border-none"
                placeholder="EMP001"
                required
              />
            </div>

            <button
              type="submit"
              className="pixel-button bg-accent text-accent-foreground w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Add Player to Game
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
