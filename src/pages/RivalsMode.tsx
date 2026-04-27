import { useState, useEffect } from "react";
import { Swords, Trophy, Users, Zap, Target, Clock, Plus, Star } from "lucide-react";
import { PixelAvatar } from "@/components/PixelAvatar";
import Papa from "papaparse";

const challenges = {
  1: { name: "Run 5km", points: 100, metric: "Step_Count" },
  2: { name: "Drink 2L Water", points: 50, metric: "Calories_Burned" },
  3: { name: "30min Meditation", points: 75, metric: "HRV" },
  4: { name: "Healthy Lunch Choice", points: 30, metric: "BMI" },
  5: { name: "Complete Training Course", points: 200, metric: "Wellness_Score" }
};

export default function RivalsMode() {
  const [selectedTab, setSelectedTab] = useState<"active" | "create" | "challenges">("active");
  const [challengeMode, setChallengeMode] = useState<"team" | "player">("team");
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [rivalries, setRivalries] = useState<any[]>([]);
  const [rivalryResult, setRivalryResult] = useState<string | null>(null);
  const [selectedTeam1, setSelectedTeam1] = useState<string>("");
  const [selectedTeam2, setSelectedTeam2] = useState<string>("");
  const [selectedPlayer1, setSelectedPlayer1] = useState<string>("");
  const [selectedPlayer2, setSelectedPlayer2] = useState<string>("");
  const [pointsAllocation, setPointsAllocation] = useState<number>(500);
  const [challengeDuration, setChallengeDuration] = useState<string>("1 Week");
  const [selectedChallengeId, setSelectedChallengeId] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/employee_data.csv");
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        complete: (result) => {
          const parsedEmployees = result.data.filter((row: any) => row.Employee_ID);
          setEmployees(parsedEmployees);
          const uniqueTeams = [...new Set(parsedEmployees.map((row: any) => row.Team_Name))] as string[];
          setTeams(uniqueTeams);
          const uniquePlayers = parsedEmployees.map((row: any) => row.Name);
          setPlayers(uniquePlayers);

          // Generate mock rivalries using real data
          const mockRivalries = [
            {
              id: 1,
              type: "Team vs Team",
              team1: { name: uniqueTeams[0], score: Math.round(Math.random() * 2000 + 1000), avatar: "⚙️" },
              team2: { name: uniqueTeams[1], score: Math.round(Math.random() * 2000 + 1000), avatar: "📈" },
              status: "active",
              endDate: "2024-01-15",
              pointsWorth: 500
            },
            {
              id: 2,
              type: "Player vs Player",
              team1: { name: uniquePlayers[0], score: Math.round(Math.random() * 2000 + 1000), avatar: "" },
              team2: { name: uniquePlayers[1], score: Math.round(Math.random() * 2000 + 1000), avatar: "" },
              status: "active",
              endDate: "2024-01-12",
              pointsWorth: 300
            }
          ];
          setRivalries(mockRivalries);
        },
      });
    };
    fetchData();
  }, []);

  const aiAgentScore = (entity: string, metric: string, isTeam: boolean, rivalScore?: number) => {
    let baseScore = 0;
    if (isTeam) {
      const teamMembers = employees.filter((emp: any) => emp.Team_Name === entity);
      baseScore = teamMembers.reduce((sum: number, emp: any) => sum + (parseFloat(emp[metric]) || 0), 0) / teamMembers.length;
    } else {
      const row = employees.find((emp: any) => emp.Name === entity);
      baseScore = parseFloat(row[metric]) || 0;
    }

    const intelligenceFactor = Math.random() * 0.2 + 0.9;
    const consistency = 1 + (baseScore / (baseScore + 100)) * (Math.random() * 0.1 - 0.05);
    let score = baseScore * intelligenceFactor * consistency;

    if (rivalScore !== undefined) {
      if (score < rivalScore) {
        score *= Math.random() * 0.06 + 1.02;
      } else if (score > rivalScore) {
        score *= Math.random() * 0.05 + 0.95;
      }
    }

    return score;
  };

  const handleStartSoloChallenge = () => {
    if (selectedChallenge === null) return;
    const challengeObj = challenges[selectedChallenge];
    const metric = challengeObj.metric;
    const currentUser = players[0];
    const score = aiAgentScore(currentUser, metric, false);
    setRivalryResult(`Solo Challenge: ${currentUser} scored ${Math.round(score)} in ${challengeObj.name}`);
  };

  const handleCreateTeamChallenge = () => {
    if (selectedChallenge === null) return;
    const challengeObj = challenges[selectedChallenge];
    const metric = challengeObj.metric;
    const score1 = aiAgentScore(selectedTeam1, metric, true);
    const score2 = aiAgentScore(selectedTeam2, metric, true, score1);
    const isLowerBetter = metric === "BMI";
    let winner = "";
    if (isLowerBetter) {
      winner = score1 < score2 ? selectedTeam1 : (score2 < score1 ? selectedTeam2 : "Tie");
    } else {
      winner = score1 > score2 ? selectedTeam1 : (score2 > score1 ? selectedTeam2 : "Tie");
    }
    setRivalryResult(`Team Challenge: ${selectedTeam1} (${Math.round(score1)}) vs ${selectedTeam2} (${Math.round(score2)}). Winner: ${winner}`);
  };

  const handleLaunchRivalry = () => {
    if (challengeMode === "team" && (!selectedTeam1 || !selectedTeam2)) return;
    if (challengeMode === "player" && (!selectedPlayer1 || !selectedPlayer2)) return;

    const selectedChallengeObj = challenges[selectedChallengeId];
    const metric = selectedChallengeObj.metric;
    const today = new Date();
    const durationMap = { "3 Days": 3, "1 Week": 7, "2 Weeks": 14, "1 Month": 30 };
    const daysToAdd = durationMap[challengeDuration] || 7;
    const endDate = new Date(today.setDate(today.getDate() + daysToAdd)).toISOString().split("T")[0];

    const newRivalry = {
      id: rivalries.length + 1,
      type: `${challengeMode === "team" ? "Team vs Team" : "Player vs Player"}`,
      team1: { name: challengeMode === "team" ? selectedTeam1 : selectedPlayer1, score: 0, avatar: challengeMode === "team" ? "⚙️" : "" },
      team2: { name: challengeMode === "team" ? selectedTeam2 : selectedPlayer2, score: 0, avatar: challengeMode === "team" ? "📈" : "" },
      status: "active",
      endDate: endDate,
      pointsWorth: pointsAllocation,
      challenge: selectedChallengeObj.name
    };

    setRivalries([...rivalries, newRivalry]);

    if (challengeMode === "team") {
      const score1 = aiAgentScore(selectedTeam1, metric, true);
      const score2 = aiAgentScore(selectedTeam2, metric, true, score1);
      const winner = score1 > score2 ? selectedTeam1 : (score2 > score1 ? selectedTeam2 : "Tie");
      setRivalryResult(`Team Rivalry: ${selectedTeam1} (${Math.round(score1)}) vs ${selectedTeam2} (${Math.round(score2)}). Winner: ${winner}`);
    } else {
      const score1 = aiAgentScore(selectedPlayer1, metric, false);
      const score2 = aiAgentScore(selectedPlayer2, metric, false, score1);
      const winner = score1 > score2 ? selectedPlayer1 : (score2 > score1 ? selectedPlayer2 : "Tie");
      setRivalryResult(`Player Rivalry: ${selectedPlayer1} (${Math.round(score1)}) vs ${selectedPlayer2} (${Math.round(score2)}). Winner: ${winner}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-pixel text-primary text-shadow-glow mb-2">
          ⚔️ Rivals Mode
        </h1>
        <p className="text-muted-foreground font-retro text-lg">
          Cross-team challenges and competitive battles
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setSelectedTab("active")}
          className={`pixel-button ${selectedTab === "active" ? "bg-primary" : "bg-muted"}`}
        >
          Active Rivalries
        </button>
        <button
          onClick={() => setSelectedTab("challenges")}
          className={`pixel-button ${selectedTab === "challenges" ? "bg-primary" : "bg-muted"}`}
        >
          Challenge Menu
        </button>
        <button
          onClick={() => setSelectedTab("create")}
          className={`pixel-button ${selectedTab === "create" ? "bg-primary" : "bg-muted"}`}
        >
          Create New
        </button>
      </div>

      {selectedTab === "challenges" ? (
        <div className="space-y-6">
          <div className="pixel-card neon-border-green">
            <h3 className="font-pixel text-sm text-accent mb-4">Available Challenges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(challenges).map(([id, challenge]) => (
                <div
                  key={id}
                  className={`
                    pixel-card neon-border-cyan p-4 cursor-pointer transition-all duration-200
                    ${selectedChallenge === parseInt(id) ? "bg-primary/20 scale-105" : "hover:scale-105"}
                  `}
                  onClick={() => setSelectedChallenge(selectedChallenge === parseInt(id) ? null : parseInt(id))}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏆</div>
                    <h4 className="font-pixel text-sm text-primary mb-2">{challenge.name}</h4>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-neon-yellow" />
                      <span className="font-pixel text-neon-yellow">{challenge.points} pts</span>
                    </div>
                    <div className="text-xs font-retro text-muted-foreground">
                      AVAILABLE
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedChallenge && (
              <div className="mt-6 p-4 border border-primary/20 rounded-sm bg-muted/20">
                <h4 className="font-pixel text-sm text-primary mb-2">Challenge Selected</h4>
                <p className="font-retro text-sm text-muted-foreground mb-4">
                  Ready to start this challenge? Choose your mode:
                </p>
                <div className="flex gap-4">
                  <button className="pixel-button bg-accent text-accent-foreground" onClick={handleStartSoloChallenge}>
                    Start Solo Challenge
                  </button>
                  <button className="pixel-button bg-primary text-primary-foreground" onClick={handleCreateTeamChallenge}>
                    Create Team Challenge
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : selectedTab === "active" ? (
        <div className="space-y-6">
          {rivalries.map((rivalry) => (
            <div key={rivalry.id} className="pixel-card neon-border-cyan">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-primary" />
                  <h3 className="font-pixel text-sm text-primary">{rivalry.type}</h3>
                </div>
                <div className={`px-2 py-1 rounded-sm text-xs font-pixel ${
                  rivalry.status === "active" ? "bg-accent/20 text-accent" : "bg-muted/20 text-muted-foreground"
                }`}>
                  {rivalry.status.toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="pixel-card neon-border-pink text-center p-4">
                  {rivalry.team1.avatar ? (
                    <div className="text-4xl mb-2">{rivalry.team1.avatar}</div>
                  ) : (
                    <PixelAvatar size="lg" className="mx-auto mb-2" />
                  )}
                  <div className="font-pixel text-sm text-primary mb-2">{rivalry.team1.name}</div>
                  <div className="font-pixel text-lg text-neon-pink">{rivalry.team1.score}</div>
                  <div className="text-xs text-muted-foreground font-retro">POINTS</div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-pixel text-neon-yellow animate-glow mb-2">VS</div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground mb-2">
                      Ends: {rivalry.endDate}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="w-3 h-3 text-neon-yellow" />
                      <span className="font-pixel text-xs text-neon-yellow">
                        {rivalry.pointsWorth} pts
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Challenge: {rivalry.challenge}
                    </div>
                  </div>
                </div>

                <div className="pixel-card neon-border-green text-center p-4">
                  {rivalry.team2.avatar ? (
                    <div className="text-4xl mb-2">{rivalry.team2.avatar}</div>
                  ) : (
                    <PixelAvatar size="lg" className="mx-auto mb-2" />
                  )}
                  <div className="font-pixel text-sm text-accent mb-2">{rivalry.team2.name}</div>
                  <div className="font-pixel text-lg text-accent">{rivalry.team2.score}</div>
                  <div className="text-xs text-muted-foreground font-retro">POINTS</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="pixel-card neon-border-pink">
            <h3 className="font-pixel text-sm text-neon-pink mb-4">⚔️ Challenge Mode</h3>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setChallengeMode("team")}
                className={`pixel-button ${challengeMode === "team" ? "bg-accent" : "bg-muted"}`}
              >
                <Users className="w-4 h-4 mr-2" />
                Team Challenge
              </button>
              <button
                onClick={() => setChallengeMode("player")}
                className={`pixel-button ${challengeMode === "player" ? "bg-accent" : "bg-muted"}`}
              >
                <Target className="w-4 h-4 mr-2" />
                Player Challenge
              </button>
            </div>
          </div>

          <div className="pixel-card neon-border-green">
            <h3 className="font-pixel text-sm text-accent mb-4">
              🏆 Create New {challengeMode === "team" ? "Team" : "Player"} Rivalry
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-pixel text-xs text-primary mb-2">
                  POINTS ALLOCATION
                </label>
                <input 
                  className="pixel-input w-full bg-gray-800 text-white border-none" 
                  type="number"
                  value={pointsAllocation}
                  onChange={(e) => setPointsAllocation(parseInt(e.target.value))}
                  placeholder="Enter points worth (e.g., 500)" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-pixel text-xs text-primary mb-2">
                    {challengeMode === "team" ? "TEAM 1" : "CHALLENGER"}
                  </label>
                  <select 
                    className="pixel-input w-full bg-gray-800 text-white border-none"
                    value={challengeMode === "team" ? selectedTeam1 : selectedPlayer1}
                    onChange={(e) => challengeMode === "team" ? setSelectedTeam1(e.target.value) : setSelectedPlayer1(e.target.value)}
                  >
                    <option value="">Select</option>
                    {(challengeMode === "team" ? teams : players).map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-pixel text-xs text-primary mb-2">
                    {challengeMode === "team" ? "TEAM 2" : "OPPONENT"}
                  </label>
                  <select 
                    className="pixel-input w-full bg-gray-800 text-white border-none"
                    value={challengeMode === "team" ? selectedTeam2 : selectedPlayer2}
                    onChange={(e) => challengeMode === "team" ? setSelectedTeam2(e.target.value) : setSelectedPlayer2(e.target.value)}
                  >
                    <option value="">Select</option>
                    {(challengeMode === "team" ? teams : players).map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block font-pixel text-xs text-primary mb-2">
                  CHALLENGE DURATION
                </label>
                <select className="pixel-input w-full bg-gray-800 text-white border-none" value={challengeDuration} onChange={(e) => setChallengeDuration(e.target.value)}>
                  <option>3 Days</option>
                  <option>1 Week</option>
                  <option>2 Weeks</option>
                  <option>1 Month</option>
                </select>
              </div>

              <div>
                <label className="block font-pixel text-xs text-primary mb-2">
                  SELECT CHALLENGE
                </label>
                <select 
                  className="pixel-input w-full bg-gray-800 text-white border-none"
                  value={selectedChallengeId}
                  onChange={(e) => setSelectedChallengeId(parseInt(e.target.value))}
                >
                  {Object.entries(challenges).map(([id, challenge]) => (
                    <option key={id} value={parseInt(id)}>{challenge.name}</option>
                  ))}
                </select>
              </div>
              
              <button className="pixel-button bg-neon-pink text-background w-full" onClick={handleLaunchRivalry}>
                <Swords className="w-4 h-4 mr-2" />
                Launch {challengeMode === "team" ? "Team" : "Player"} Rivalry!
              </button>
            </div>
          </div>
        </div>
      )}

      {rivalryResult && (
        <div className="pixel-card neon-border-yellow p-4">
          <h3 className="font-pixel text-sm text-neon-yellow mb-2">Current Rivalry Result</h3>
          <p className="font-retro text-sm">{rivalryResult}</p>
        </div>
      )}
    </div>
  );
}