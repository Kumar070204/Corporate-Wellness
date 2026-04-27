import { useState, useEffect } from "react";
import { RefreshCw, UtensilsCrossed, Star, Clock, Flame, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Papa from "papaparse";

interface Food {
  Dish_Name: string;
  Calories: number;
  Carbohydrates: number;
  Protein: number;
  Fats: number;
  Detailed_Category: string;
  Broad_Category: string;
}

interface CartItem {
  Dish_Name: string;
  Calories: number;
  Carbohydrates: number;
  Protein: number;
  Fats: number;
  Points: number;
}

export default function FoodRecommendations() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [recommendations, setRecommendations] = useState<Food[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const targetCalories = 2500;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/Indian_Food_Nutrition_Categorized_Broad.csv");
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        complete: (result) => {
          const parsedFoods: Food[] = result.data
            .map((row: any) => ({
              Dish_Name: row["Dish Name"],
              Calories: parseFloat(row["Calories (kcal)"]) || 0,
              Carbohydrates: parseFloat(row["Carbohydrates (g)"]) || 0,
              Protein: parseFloat(row["Protein (g)"]) || 0,
              Fats: parseFloat(row["Fats (g)"]) || 0,
              Detailed_Category: row["Detailed_Category"],
              Broad_Category: row["Broad_Category"],
            }))
            .filter((food: Food) => food.Dish_Name && food.Calories > 0);
          setFoods(parsedFoods);
          refreshRecommendations(parsedFoods);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    };

    fetchData();
  }, []);

  const refreshRecommendations = (allFoods: Food[]) => {
    setIsRefreshing(true);
    setTimeout(() => {
      let totalCalories = 0;
      const selectedFoods: Food[] = [];
      const shuffledFoods = [...allFoods].sort(() => Math.random() - 0.5);
      for (const food of shuffledFoods) {
        if (totalCalories + food.Calories <= targetCalories) {
          selectedFoods.push(food);
          totalCalories += food.Calories;
        }
        if (totalCalories >= targetCalories * 0.9) break;
      }
      setRecommendations(selectedFoods);
      setIsRefreshing(false);
    }, 2000);
  };

  const calculatePoints = (food: Food) => {
    const proteinWeight = 0.5;
    const fatPenalty = 0.2;
    const caloriePenalty = 0.1;
    const basePoints = 100;
    const proteinScore = food.Protein * proteinWeight;
    const fatPenaltyScore = food.Fats * fatPenalty;
    const caloriePenaltyScore = (food.Calories / 100) * caloriePenalty;
    return Math.round(basePoints + proteinScore - fatPenaltyScore - caloriePenaltyScore);
  };

  const addToCart = (food: Food) => {
    const points = calculatePoints(food);
    const cartItem: CartItem = { ...food, Points: points };
    setCart([...cart, cartItem]);
  };

  const removeFromCart = (dishName: string) => {
    setCart(cart.filter(item => item.Dish_Name !== dishName));
  };

  const handleBuy = () => {
    const totalCalories = cart.reduce((sum, item) => sum + item.Calories, 0);
    if (totalCalories <= targetCalories) {
      console.log("Successfully ordered!");
      console.log("Great choice! You're within your caloric limit and eating healthily.");
    } else {
      console.log("Successfully ordered!");
      console.log("Oops! You've exceeded 2500 calories. Consider a lighter meal next time.");
    }
    // Show popup message and clear cart
    alert("Order Placed!");
    setCart([]);
  };

  const totalCalories = cart.reduce((sum, item) => sum + item.Calories, 0);
  const totalCarbs = cart.reduce((sum, item) => sum + item.Carbohydrates, 0);
  const totalProtein = cart.reduce((sum, item) => sum + item.Protein, 0);
  const totalFats = cart.reduce((sum, item) => sum + item.Fats, 0);
  const totalPoints = cart.reduce((sum, item) => sum + item.Points, 0);

  const categoryColors = {
    "Main Dish": "neon-border-cyan text-primary",
    "Side Dish": "neon-border-green text-accent",
    "Drink": "neon-border-pink text-neon-pink",
    "Other Food Categories": "neon-border-yellow text-neon-yellow",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-pixel text-primary text-shadow-glow mb-2">
          🍽️ Food Recommendations
        </h1>
        <p className="text-muted-foreground font-retro text-lg">
          Personalized healthy meal suggestions powered by AI
        </p>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => refreshRecommendations(foods)}
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
              REFRESH RECOMMENDATIONS
            </>
          )}
        </Button>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((food, index) => (
          <Card
            key={food.Dish_Name}
            className={`pixel-card ${categoryColors[food.Broad_Category as keyof typeof categoryColors] || "neon-border-cyan text-primary"} hover:scale-105 transition-all duration-300`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="text-center pb-3">
              <div className="text-4xl mb-2">🍲</div>
              <CardTitle className="font-pixel text-sm">{food.Dish_Name}</CardTitle>
              <div className="flex justify-center gap-2">
                <span className={`px-2 py-1 rounded-sm text-xs font-retro ${
                  food.Broad_Category === "Main Dish" ? "bg-primary/20 text-primary" :
                  food.Broad_Category === "Side Dish" ? "bg-accent/20 text-accent" :
                  food.Broad_Category === "Drink" ? "bg-neon-pink/20 text-neon-pink" :
                  "bg-neon-yellow/20 text-neon-yellow"
                }`}>
                  {food.Broad_Category}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                  <Flame className="w-4 h-4 mx-auto text-orange-500" />
                  <div className="font-pixel text-xs">{food.Calories.toFixed(1)}</div>
                  <div className="font-retro text-xs text-muted-foreground">cal</div>
                </div>
                <div className="space-y-1">
                  <Star className="w-4 h-4 mx-auto text-neon-yellow" />
                  <div className="font-pixel text-xs">4.5</div>
                  <div className="font-retro text-xs text-muted-foreground">rating</div>
                </div>
                <div className="space-y-1">
                  <Clock className="w-4 h-4 mx-auto text-accent" />
                  <div className="font-pixel text-xs">15 min</div>
                  <div className="font-retro text-xs text-muted-foreground">prep</div>
                </div>
              </div>

              {/* Reason */}
              <div className="pixel-card bg-muted/20 p-3">
                <div className="font-pixel text-xs text-accent mb-1">WHY THIS?</div>
                <p className="font-retro text-xs text-muted-foreground">
                  Balanced nutrition with {food.Protein.toFixed(1)}g protein and {food.Calories.toFixed(1)} calories.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 pixel-button bg-neon-pink text-background text-xs" onClick={() => addToCart(food)}>
                  🍽️ ORDER
                </Button>
                <Button size="sm" variant="outline" className="flex-1 neon-border-green text-accent hover:bg-accent/10 text-xs" disabled>
                  ⭐ {calculatePoints(food)} PTS
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cart */}
      {cart.length > 0 && (
        <Card className="pixel-card neon-border-cyan">
          <CardHeader>
            <CardTitle className="font-pixel text-primary text-lg flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              CART
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between mb-2 p-2 bg-muted/20 rounded-sm">
                <span className="font-retro text-sm">{item.Dish_Name}</span>
                <div className="flex gap-2">
                  <span className="font-pixel text-xs">{item.Calories} cal</span>
                  <span className="font-pixel text-xs">{item.Protein.toFixed(1)}g pro</span>
                  <span className="font-pixel text-xs">{item.Carbohydrates.toFixed(1)}g carb</span>
                  <span className="font-pixel text-xs">{item.Fats.toFixed(1)}g fat</span>
                  <span className="font-pixel text-xs">{item.Points} pts</span>
                  <Button size="sm" variant="outline" onClick={() => removeFromCart(item.Dish_Name)} className="neon-border-red text-red-500 hover:bg-red-500/10">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-4 text-center">
              <p className="font-pixel text-sm text-primary">Total: {totalCalories} cal, {totalProtein.toFixed(1)}g pro, {totalCarbs.toFixed(1)}g carb, {totalFats.toFixed(1)}g fat, {totalPoints} pts</p>
              {totalCalories > targetCalories && (
                <p className="font-retro text-xs text-red-500">This might be too much food for your goal!</p>
              )}
            </div>
            <div className="flex justify-center mt-4 gap-2">
              <Button className="pixel-button bg-accent text-accent-foreground" onClick={handleBuy}>
                BUY
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nutrition Summary */}
      <Card className="pixel-card neon-border-cyan">
        <CardHeader>
          <CardTitle className="font-pixel text-primary text-lg flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5" />
            DAILY NUTRITION SUMMARY
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="font-pixel text-2xl text-primary">
                {recommendations.reduce((sum, food) => sum + food.Calories, 0).toFixed(1)}
              </div>
              <div className="font-retro text-xs text-muted-foreground">Total Calories</div>
            </div>
            <div className="text-center">
              <div className="font-pixel text-2xl text-accent">{recommendations.length}</div>
              <div className="font-retro text-xs text-muted-foreground">Meals Planned</div>
            </div>
            <div className="text-center">
              <div className="font-pixel text-2xl text-neon-pink">4.5</div>
              <div className="font-retro text-xs text-muted-foreground">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="font-pixel text-2xl text-neon-yellow">85%</div>
              <div className="font-retro text-xs text-muted-foreground">Health Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="pixel-card bg-accent/10 neon-border-green">
          <div className="font-pixel text-xs text-accent mb-2">💡 MEAL PREP TIP</div>
          <p className="font-retro text-xs text-muted-foreground">
            Prepare ingredients in advance on Sundays to make weekday cooking faster and easier.
          </p>
        </div>
        <div className="pixel-card bg-primary/10 neon-border-cyan">
          <div className="font-pixel text-xs text-primary mb-2">🎯 HYDRATION</div>
          <p className="font-retro text-xs text-muted-foreground">
            Don't forget to drink 8 glasses of water daily! Track your intake for bonus points.
          </p>
        </div>
      </div>
    </div>
  );
}