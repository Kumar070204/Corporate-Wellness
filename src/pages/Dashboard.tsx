import { useState, useEffect } from "react";
import { Users, Trophy, Target, Zap } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PixelAvatar } from "@/components/PixelAvatar";
import Papa from "papaparse";

interface Employee {
  Employee_ID: string;
  Name: string;
  Email_ID: string;
  Wellness_Score: string;
  Team_Name: string;
}

const Dashboard = () => {
  const [myTotalPoints, setMyTotalPoints] = useState(0);
  const [teamTotalPoints, setTeamTotalPoints] = useState(0);
  const [totalScore, setTotalScore] = useState({ name: "", points: 0 });
  const [pointsToday, setPointsToday] = useState(0);
  const [topPlayers, setTopPlayers] = useState<{ name: string; points: number; rank: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ player: string; action: string; time: string }[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/employee_data.csv");
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        complete: (result) => {
          const data = result.data as Employee[];
          setEmployees(data);

          // Calculate My Total Points (assuming the first employee is the current user for demo)
          const currentUser = data[0];
          setMyTotalPoints(parseInt(currentUser.Wellness_Score) || 0);

          // Calculate Team Total Points
          const teamPoints = data.reduce((sum, emp) => sum + (parseInt(emp.Wellness_Score) || 0), 0);
          setTeamTotalPoints(teamPoints);

          // Find Total Score (highest Wellness_Score)
          const topScorer = data.reduce((max, emp) => 
            (parseInt(emp.Wellness_Score) || 0) > (parseInt(max.Wellness_Score) || 0) ? emp : max
          );
          setTotalScore({ name: topScorer.Name, points: parseInt(topScorer.Wellness_Score) || 0 });

          // Points Earned Today (simulated as a fraction of Wellness_Score for demo)
          const todayPoints = data.reduce((sum, emp) => sum + ((parseInt(emp.Wellness_Score) || 0) / 10), 0);
          setPointsToday(Math.round(todayPoints));

          // Top Players (top 3 by Wellness_Score)
          const sortedPlayers = [...data]
            .sort((a, b) => (parseInt(b.Wellness_Score) || 0) - (parseInt(a.Wellness_Score) || 0))
            .slice(0, 3)
            .map((emp, index) => ({
              name: emp.Name,
              points: parseInt(emp.Wellness_Score) || 0,
              rank: index + 1,
            }));
          setTopPlayers(sortedPlayers);

          // Recent Activity (simulated based on top players)
          const activity = sortedPlayers.map((player, index) => ({
            player: player.name,
            action: index === 0 ? "reached milestone" : index === 1 ? "earned 50 points" : "completed challenge",
            time: `${index + 2} min ago`,
          }));
          setRecentActivity(activity);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-pixel text-primary text-shadow-glow mb-2">
          🏆 Gamification Hub
        </h1>
        <p className="text-muted-foreground font-retro text-lg">
          Welcome to your pixelated dashboard! Track players, points, and achievements.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Total Points"
          value={myTotalPoints.toLocaleString()}
          subtitle="pts"
          icon={Users}
          color="cyan"
          animated
        />
        <StatCard
          title="Team Total Points"
          value={teamTotalPoints.toLocaleString()}
          subtitle="pts"
          icon={Trophy}
          color="pink"
        />
        <StatCard
          title="Total Score"
          value={totalScore.name}
          subtitle={`${totalScore.points} pts`}
          icon={Target}
          color="green"
        />
        <StatCard
          title="Points Earned Today"
          value={pointsToday}
          subtitle="pts"
          icon={Zap}
          color="yellow"
          animated
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Players Preview */}
        <div className="pixel-card neon-border-cyan">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-primary" />
            <h3 className="font-pixel text-sm text-primary">Top Players</h3>
          </div>
          <div className="space-y-3">
            {topPlayers.map((player) => (
              <div key={player.name} className="flex items-center gap-3 p-2 rounded-sm bg-muted/20">
                <PixelAvatar rank={player.rank} size="sm" />
                <div className="flex-1">
                  <div className="font-retro text-sm">{player.name}</div>
                  <div className="text-xs text-muted-foreground">{player.points} pts</div>
                </div>
                <div className="text-xs font-pixel text-primary">#{player.rank}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="pixel-card neon-border-green">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-accent" />
            <h3 className="font-pixel text-sm text-accent">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-sm bg-muted/20">
                <PixelAvatar size="sm" />
                <div className="flex-1">
                  <div className="font-retro text-sm">
                    <span className="text-primary">{activity.player}</span> {activity.action}
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pixel-card neon-border-pink">
        <h3 className="font-pixel text-sm text-neon-pink mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="pixel-button bg-accent text-accent-foreground" onClick={() => window.location.href = '/avatar-creation'}>
            Avatar Page
          </button>
          <button className="pixel-button bg-neon-pink text-background" onClick={() => window.location.href = '/jungle-store'}>
            Jungle Store 🏪
          </button>
          <button className="pixel-button bg-neon-yellow text-background" onClick={() => window.location.href = '/leaderboard'}>
            View Rankings
          </button>
          <button className="pixel-button bg-primary text-primary-foreground" onClick={() => window.location.href = '/rivals'}>
            Start Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;