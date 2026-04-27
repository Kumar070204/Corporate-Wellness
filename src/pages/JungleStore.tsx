import { useState } from "react";
import { ShoppingBag, Coins, Zap } from "lucide-react";

interface StoreItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  description: string;
  animation: string;
  benefit: string;
}

const storeItems: StoreItem[] = [
  {
    id: "firewood",
    name: "Firewood",
    emoji: "🔥",
    price: 100,
    description: "Keep your campfire burning bright",
    animation: "animate-pulse",
    benefit: "gains a warm campfire",
  },
  {
    id: "shelter",
    name: "Shelter",
    emoji: "⛺",
    price: 250,
    description: "Protect yourself from the elements",
    animation: "animate-bounce",
    benefit: "gets a sturdy shelter",
  },
  {
    id: "water",
    name: "Fresh Water",
    emoji: "💧",
    price: 75,
    description: "Crystal clear jungle spring water",
    animation: "animate-ping",
    benefit: "stays hydrated with fresh water",
  },
  {
    id: "food",
    name: "Jungle Fruit",
    emoji: "🥭",
    price: 150,
    description: "Delicious tropical mango",
    animation: "animate-spin",
    benefit: "enjoys nutritious jungle fruit",
  },
];

export default function JungleStore() {
  const [userPoints, setUserPoints] = useState(2500);
  const [purchaseAnimation, setPurchaseAnimation] = useState<string | null>(null);
  const [ownedItems, setOwnedItems] = useState<Set<string>>(new Set());

  const handlePurchase = (item: StoreItem) => {
    if (userPoints >= item.price && !ownedItems.has(item.id)) {
      setUserPoints((prev) => prev - item.price);
      setPurchaseAnimation(item.id);
      setOwnedItems((prev) => new Set(prev).add(item.id));

      setTimeout(() => {
        setPurchaseAnimation(null);
      }, 2000);

      console.log(`Purchased ${item.name} for ${item.price} points!`);
    }
  };

  const canAfford = (price: number) => userPoints >= price;

  const getCharacterState = () => {
    const hasFirewood = ownedItems.has("firewood");
    const hasShelter = ownedItems.has("shelter");
    const hasWater = ownedItems.has("water");
    const hasFood = ownedItems.has("food");
    const itemCount = ownedItems.size;

    let condition = "Struggling to survive";
    let characterEmoji = "😰";
    let mood = "desperate";
    let description = "Lost in the jungle with nothing but hope...";

    if (itemCount === 4) {
      condition = "Thriving in Paradise";
      characterEmoji = "🤩";
      mood = "ecstatic";
      description = "Living like a jungle king with all the essentials!";
    } else if (itemCount === 3) {
      condition = "Doing Really Well";
      characterEmoji = "😊";
      mood = "happy";
      description = "Almost got everything needed for a comfortable life!";
    } else if (itemCount === 2) {
      condition = "Making Progress";
      characterEmoji = "🙂";
      mood = "hopeful";
      description = "Things are looking up! Getting the hang of jungle life.";
    } else if (itemCount === 1) {
      condition = "First Steps";
      characterEmoji = "😐";
      mood = "cautious";
      description = "At least I have something to survive with...";
    }

    return { condition, characterEmoji, mood, description, hasFirewood, hasShelter, hasWater, hasFood };
  };

  const { condition, characterEmoji, mood, description, hasFirewood, hasShelter, hasWater, hasFood } = getCharacterState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-pixel text-primary text-shadow-glow mb-2">
            🏪 Jungle Survival Store
          </h1>
          <p className="text-muted-foreground font-retro text-lg">
            Trade your points for survival essentials and watch your character thrive!
          </p>
        </div>

        {/* Points Balance */}
        <div className="pixel-card neon-border-yellow text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="w-6 h-6 text-neon-yellow" />
            <span className="font-pixel text-lg text-neon-yellow">YOUR BALANCE</span>
          </div>
          <div className="text-3xl font-pixel text-primary">{userPoints.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground font-retro">JUNGLE POINTS</div>
        </div>

        {/* Store Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {storeItems.map((item) => {
            const affordable = canAfford(item.price);
            const isPurchasing = purchaseAnimation === item.id;
            const isOwned = ownedItems.has(item.id);

            return (
              <div
                key={item.id}
                className={`
                  pixel-card neon-border-cyan relative overflow-hidden
                  ${!affordable ? "opacity-50" : ""}
                  ${isPurchasing ? "animate-bounce" : ""}
                  ${isOwned ? "border-amber-400 bg-primary/20" : ""}
                `}
              >
                {/* Purchase Animation Overlay */}
                {isPurchasing && (
                  <div className="absolute inset-0 bg-neon-yellow/20 flex items-center justify-center z-10">
                    <div className="text-4xl animate-ping">✨</div>
                  </div>
                )}

                {/* Owned Badge */}
                {isOwned && (
                  <div className="absolute top-2 right-2 bg-neon-yellow text-background text-xs font-pixel px-2 py-1 rounded-full">
                    OWNED
                  </div>
                )}

                <div className="text-center">
                  <div className={`text-6xl mb-4 ${item.animation}`}>
                    {item.emoji}
                  </div>

                  <h3 className="font-pixel text-lg text-primary mb-2">
                    {item.name}
                  </h3>

                  <p className="font-retro text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Coins className="w-4 h-4 text-neon-yellow" />
                    <span className="font-pixel text-lg text-neon-yellow">
                      {item.price}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={!affordable || isPurchasing || isOwned}
                    className={`
                      pixel-button w-full transition-all duration-200
                      ${isOwned
                        ? "bg-muted text-muted-foreground cursor-default"
                        : affordable
                        ? "bg-accent text-accent-foreground hover:scale-105"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      }
                      ${isPurchasing ? "animate-pulse" : ""}
                    `}
                  >
                    {isPurchasing ? (
                      <>
                        <Zap className="w-4 h-4 animate-spin" />
                        Purchasing...
                      </>
                    ) : isOwned ? (
                      "Already Owned"
                    ) : affordable ? (
                      <>
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Buy Now
                      </>
                    ) : (
                      "Insufficient Points"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Character Visualization Section */}
        <div className="pixel-card neon-border-pink mt-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-pixel text-primary mb-2">🌟 Your Jungle Explorer</h2>
            <p className="text-muted-foreground">Watch your character's transformation!</p>
          </div>

          {/* Character Status */}
          <div className="text-center mb-8">
            <div className="text-xl font-pixel text-primary mb-2">{condition}</div>
            <p className="font-retro text-sm text-muted-foreground italic">{description}</p>
          </div>

          {/* Character Scene */}
          <div className="relative pixel-card neon-border-green p-8 min-h-[200px] overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-900/50"></div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute text-primary text-2xl animate-pulse"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 60 + 10}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                >
                  🌿
                </div>
              ))}
            </div>

            {/* Character and Items Scene */}
            <div className="relative flex items-end justify-center h-full">
              {/* Shelter Behind Character */}
              {hasShelter && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce">
                  ⛺
                </div>
              )}

              {/* Firewood Left Side */}
              {hasFirewood && (
                <div className="absolute bottom-8 left-8 text-5xl animate-pulse">
                  🔥
                </div>
              )}

              {/* Main Character */}
              <div
                className={`text-8xl z-10 transition-all duration-1000 ${
                  mood === "ecstatic" ? "animate-bounce" : mood === "happy" ? "animate-pulse" : ""
                }`}
              >
                {characterEmoji}
              </div>

              {/* Water Right Side */}
              {hasWater && (
                <div className="absolute bottom-8 right-8 text-5xl animate-ping">
                  💧
                </div>
              )}

              {/* Food Near Character */}
              {hasFood && (
                <div className="absolute bottom-12 right-1/4 text-4xl animate-spin">
                  🥭
                </div>
              )}
            </div>

            {/* Weather Effects Based on Items */}
            {ownedItems.size >= 3 && (
              <div className="absolute top-2 left-2 text-neon-yellow text-3xl animate-pulse">
                ☀️
              </div>
            )}
            {ownedItems.size < 2 && (
              <div className="absolute top-2 right-2 text-muted-foreground text-3xl animate-pulse">
                ☁️
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Survival Progress</span>
              <span>{ownedItems.size}/4 Items</span>
            </div>
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-1000 flex items-center justify-end pr-2"
                style={{ width: `${(ownedItems.size / 4) * 100}%` }}
              >
                {ownedItems.size > 0 && (
                  <span className="text-background text-xs font-pixel">
                    {Math.round((ownedItems.size / 4) * 100)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Items Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {storeItems.map((item) => (
              <div
                key={item.id}
                className={`text-center p-3 rounded-lg border transition-all duration-300 ${
                  ownedItems.has(item.id)
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-muted bg-muted/20 text-muted-foreground"
                }`}
              >
                <div className={`text-2xl mb-1 ${ownedItems.has(item.id) ? item.animation : "grayscale"}`}>
                  {item.emoji}
                </div>
                <div className="text-xs font-pixel">
                  {ownedItems.has(item.id) ? "OWNED" : "NEEDED"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="pixel-card neon-border-cyan">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h3 className="font-pixel text-sm text-primary">Recent Purchases</h3>
          </div>
          <div className="space-y-2">
            {[
              { item: "Firewood 🔥", cost: 100, time: "2 min ago" },
              { item: "Fresh Water 💧", cost: 75, time: "1 hour ago" },
              { item: "Shelter ⛺", cost: 250, time: "Yesterday" },
            ].map((purchase, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded-sm bg-muted/20">
                <div className="font-retro text-sm">{purchase.item}</div>
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-xs text-muted-foreground">-{purchase.cost} pts</span>
                  <span className="text-xs text-muted-foreground">{purchase.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}