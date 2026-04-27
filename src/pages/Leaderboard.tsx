import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { PixelAvatar } from "@/components/PixelAvatar";
import Papa from "papaparse";

interface Employee {
  Employee_ID: string;
  Name: string;
  Email_ID: string;
  Wellness_Score: string;
  Team_Name: string;
  Role: string;
  Food_Score: string;
}

interface Individual {
  rank: number;
  Name: string;
  Email_ID: string;
  totalWellnessScore: number;
  Team_Name: string;
  Role: string;
  Employee_ID: string;
}

interface Team {
  rank: number;
  teamName: string;
  avgScore: number;
}

export default function Leaderboard() {
  const [viewMode, setViewMode] = useState<"podium" | "full">("podium");
  const [leaderboardType, setLeaderboardType] = useState<"inter" | "intra">("inter");
  const [individuals, setIndividuals] = useState<Individual[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/employee_data.csv");
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        complete: (result) => {
          const data = result.data as Employee[];
          setEmployees(data.filter(emp => emp.Employee_ID)); // Filter invalid rows

          // Calculate individuals
          const calculatedIndividuals = data
            .map(emp => ({
              ...emp,
              totalWellnessScore: Math.round(
                0.7 * (parseInt(emp.Wellness_Score) || 0) +
                0.3 * (parseFloat(emp.Food_Score) || 0)
              ),
            }))
            .sort((a, b) => b.totalWellnessScore - a.totalWellnessScore)
            .map((emp, index) => ({
              ...emp,
              rank: index + 1,
            }));
          setIndividuals(calculatedIndividuals);

          // Calculate teams
          const teamMap: { [key: string]: { sum: number; count: number } } = {};
          data.forEach(emp => {
            const score = Math.round(
              0.7 * (parseInt(emp.Wellness_Score) || 0) +
              0.3 * (parseFloat(emp.Food_Score) || 0)
            );
            if (!teamMap[emp.Team_Name]) {
              teamMap[emp.Team_Name] = { sum: 0, count: 0 };
            }
            teamMap[emp.Team_Name].sum += score;
            teamMap[emp.Team_Name].count += 1;
          });

          const calculatedTeams = Object.keys(teamMap)
            .map(teamName => ({
              teamName,
              avgScore: Math.round(teamMap[teamName].sum / teamMap[teamName].count),
            }))
            .sort((a, b) => b.avgScore - a.avgScore)
            .map((team, index) => ({
              ...team,
              rank: index + 1,
            }));
          setTeams(calculatedTeams);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    };

    fetchData();
  }, []);

  const isInter = leaderboardType === "inter";
  const data: Team[] | Individual[] = isInter ? teams : individuals;
  const topThree = data.slice(0, 3);
  const restOfData = data.slice(3);

  const getRankCardClass = (rank: number) => {
    if (rank === 1) return "rank-card-gold";
    if (rank === 2) return "rank-card-silver"; 
    if (rank === 3) return "rank-card-bronze";
    return "pixel-card neon-border-cyan";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-pixel text-primary text-shadow-glow mb-2">
          🏆 Leaderboard
        </h1>
        <p className="text-muted-foreground font-retro text-lg">
          Hall of Fame - Top performers ranked by points
        </p>
      </div>

      {/* Leaderboard Type Toggle */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setLeaderboardType("inter")}
          className={`pixel-button ${leaderboardType === "inter" ? "bg-accent" : "bg-muted"}`}
        >
          Inter-Department
        </button>
        <button
          onClick={() => setLeaderboardType("intra")}
          className={`pixel-button ${leaderboardType === "intra" ? "bg-accent" : "bg-muted"}`}
        >
          Intra-Department
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setViewMode("podium")}
          className={`pixel-button ${viewMode === "podium" ? "bg-primary" : "bg-muted"}`}
        >
          Podium View
        </button>
        <button
          onClick={() => setViewMode("full")}
          className={`pixel-button ${viewMode === "full" ? "bg-primary" : "bg-muted"}`}
        >
          Full Rankings
        </button>
      </div>

      {viewMode === "podium" ? (
        <div className="space-y-6">
          {/* Podium View */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topThree.map((item: any) => (
              <div
                key={item.rank}
                className={`${getRankCardClass(item.rank)} p-6 text-center animate-fade-in`}
                style={{ 
                  animationDelay: `${item.rank * 0.2}s`,
                  transform: `translateY(${item.rank === 1 ? '0' : item.rank === 2 ? '10px' : '20px'})`
                }}
              >
                <div className="text-4xl mb-4">{getRankIcon(item.rank)}</div>
                {isInter ? (
                  <div className="flex justify-center mb-4">
                    <Trophy className="w-16 h-16 text-yellow-400" />
                  </div>
                ) : (
                  <PixelAvatar 
                    src="" 
                    alt={item.Name}
                    size="xl"
                    rank={item.rank}
                    className="mx-auto mb-4"
                    animated
                  />
                )}
                <h3 className="font-pixel text-lg mb-2">{isInter ? item.teamName : item.Name}</h3>
                {!isInter && (
                  <p className="font-retro text-sm text-muted-foreground mb-2">{item.Email_ID}</p>
                )}
                <div className="text-2xl font-pixel text-primary">{(isInter ? item.avgScore : item.totalWellnessScore).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground font-retro">POINTS</div>
                <div className="mt-4">
                  <span className={`
                    px-3 py-1 rounded-sm text-xs font-pixel
                    ${item.rank === 1 ? "bg-neon-yellow text-background" : 
                      item.rank === 2 ? "bg-gray-500 text-white" : 
                      "bg-orange-500 text-white"}
                  `}>
                    {item.rank === 1 ? "CHAMPION" : 
                     item.rank === 2 ? "RUNNER-UP" : 
                     "THIRD PLACE"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={() => setViewMode("full")}
              className="pixel-button bg-accent text-accent-foreground"
            >
              View Full Rankings
            </button>
          </div>
        </div>
      ) : (
        /* Full Rankings Table */
        <div className="pixel-card neon-border-cyan">
          <div className="overflow-x-auto">
            {isInter ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/20">
                    <th className="text-left p-3 font-pixel text-xs text-primary">RANK</th>
                    <th className="text-left p-3 font-pixel text-xs text-primary">TEAM</th>
                    <th className="text-right p-3 font-pixel text-xs text-primary">AVG POINTS</th>
                    <th className="text-center p-3 font-pixel text-xs text-primary">MEDAL</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((team) => (
                    <tr 
                      key={team.rank}
                      className="border-b border-border hover:bg-muted/20 transition-colors duration-200"
                    >
                      <td className="p-3">
                        <span className="font-pixel text-sm">{getRankIcon(team.rank)}</span>
                      </td>
                      <td className="p-3">
                        <div className="font-retro text-sm">{team.teamName}</div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="font-pixel text-sm text-primary">{team.avgScore.toLocaleString()}</div>
                      </td>
                      <td className="p-3 text-center">
                        {team.rank <= 3 && (
                          <div className="text-lg">{getRankIcon(team.rank)}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/20">
                    <th className="text-left p-3 font-pixel text-xs text-primary">RANK</th>
                    <th className="text-left p-3 font-pixel text-xs text-primary">AVATAR</th>
                    <th className="text-left p-3 font-pixel text-xs text-primary">PLAYER</th>
                    <th className="text-left p-3 font-pixel text-xs text-primary">TEAM</th>
                    <th className="text-left p-3 font-pixel text-xs text-primary">ROLE</th>
                    <th className="text-left p-3 font-pixel text-xs text-primary">EMAIL</th>
                    <th className="text-right p-3 font-pixel text-xs text-primary">POINTS</th>
                    <th className="text-center p-3 font-pixel text-xs text-primary">MEDAL</th>
                  </tr>
                </thead>
                <tbody>
                  {isInter
                    ? (data as Team[]).map((team) => (
                        <tr 
                          key={team.rank}
                          className="border-b border-border hover:bg-muted/20 transition-colors duration-200"
                        >
                          <td className="p-3">
                            <span className="font-pixel text-sm">{getRankIcon(team.rank)}</span>
                          </td>
                          <td className="p-3">
                            <div className="font-retro text-sm">{team.teamName}</div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="font-pixel text-sm text-primary">{team.avgScore.toLocaleString()}</div>
                          </td>
                          <td className="p-3 text-center">
                            {team.rank <= 3 && (
                              <div className="text-lg">{getRankIcon(team.rank)}</div>
                            )}
                          </td>
                        </tr>
                      ))
                    : (data as Individual[]).map((player) => (
                        <tr 
                          key={player.Employee_ID}
                          className="border-b border-border hover:bg-muted/20 transition-colors duration-200"
                        >
                          <td className="p-3">
                            <span className="font-pixel text-sm">{getRankIcon(player.rank)}</span>
                          </td>
                          <td className="p-3">
                            <PixelAvatar 
                              src=""
                              alt={player.Name}
                              rank={player.rank <= 3 ? player.rank : undefined}
                              size="md"
                            />
                          </td>
                          <td className="p-3">
                            <div className="font-retro text-sm">{player.Name}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-retro text-sm text-muted-foreground">{player.Team_Name}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-retro text-sm text-muted-foreground">{player.Role}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-retro text-sm text-muted-foreground">{player.Email_ID}</div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="font-pixel text-sm text-primary">{player.totalWellnessScore.toLocaleString()}</div>
                          </td>
                          <td className="p-3 text-center">
                            {player.rank <= 3 && (
                              <div className="text-lg">{getRankIcon(player.rank)}</div>
                            )}
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}