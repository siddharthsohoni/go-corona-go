import { useState } from "react";
import Board from "./components/Board";
import { TILE_EVENTS, TILE_TYPES, TileEvent } from "./data/tilesData";
import { useWindowSize } from "react-use";
import ReactConfetti from "react-confetti";
import avatar1 from "./assets/avatars/avatar1.png";
import avatar2 from "./assets/avatars/avatar2.png";
import avatar3 from "./assets/avatars/avatar3.png";
import avatar4 from "./assets/avatars/avatar4.png";
import avatar5 from "./assets/avatars/avatar5.png";
import avatar6 from "./assets/avatars/avatar6.png";
import avatar7 from "./assets/avatars/avatar7.png";
import avatar8 from "./assets/avatars/avatar8.png";
import avatar9 from "./assets/avatars/avatar9.png";
import avatar10 from "./assets/avatars/avatar10.png";
import avatar11 from "./assets/avatars/avatar11.png";
import avatar12 from "./assets/avatars/avatar12.png";
import avatar13 from "./assets/avatars/avatar13.png";
import avatar14 from "./assets/avatars/avatar14.png";
import avatar15 from "./assets/avatars/avatar15.png";
import bannerImage from './assets/images/bannerBoardGame.png';

const AVATARS = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
  avatar12,
  avatar13,
  avatar14,
  avatar15,
];

interface Player {
  name: string;
  position: number;
  immunity: number;
  skip: number;
  avatar: string; // Added avatar property
}

interface MovingPlayer {
  name: string;
  avatar: string;
}

const FUNNY_NAMES = [
  "Dr. Sanitizer",
  "Masky McMaskface",
  "Soapy Sue",
  "Captain Handwash",
  "Mr. Elbow Cough",
  "Miss Glovey",
  "The Wipe Avenger",
  "Sir Scrub-a-Lot",
  "Queen Quarantine",
  "The Soapinator",

  "Pajama Pro",
  "Zoom Zombie",
  "Mute Button",
  "Buffer Boss",
  "Breakout Bouncer",
  "No-Pants Champ",
  "Keyboard Warrior",
  "Frozen Face",
  "Lag Lord",
  "Slacktivator",

  "Snack Attack",
  "Binge Bandit",
  "Netflix Ninja",
  "Banana Bread King",
  "Couch Commander",
  "Quarantine Chef",
  "Delivery Diva",
  "Doorbell Dancer",
  "Microwave Master",
  "Fridge Raider",

  "Toilet Paper Tycoon",
  "Masked Avocado",
  "Sir Coughsalot",
  "Sanitized Unicorn",
  "Lockdown Larry",
  "404 Haircut Not Found",
  "Social Distancer Supreme",
  "Curry-in-a-Hurry",
  "Maskara The Dancer",
  "Ms. Muted",

  "Zoom Rager",
  "Houseparty Healer",
  "Trivia Tyrant",
  "Karaoke Contagion",
  "Meme Streamer",
  "Quaranteen Queen",
  "Group Chat Ghost",
  "Birthday on Zoom",
  "Screenshot Slayer",
  "Masked DJ",

  "Vitamin D Deficiency",
  "Captain Covfefe",
  "Quaran-Teen Wolf",
  "Flatten That Curve",
  "Inside-Only Stan",
  "Immunity Idol",
  "Face Shield Pharoah",
  "The Great Indoorsman",
  "Homebody Hulk",
  "Masked & Fabulous",
];

export default function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);

  // Helper function to shuffle an array
  const shuffleTiles = <T,>(array: T[]): T[] => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const generateBoard = () => {
    // Helper function to shuffle and select a specific number of tiles
    const getRandomTiles = (tiles: TileEvent[], count: number): TileEvent[] => {
      const shuffled = shuffleTiles(tiles);
      return shuffled.slice(0, count);
    };

    // Filter and randomly select tiles for each type
    const storyTiles = getRandomTiles(
      TILE_EVENTS.filter((tile) => tile.type === TILE_TYPES.STORY),
      6
    );
    const actionTiles = getRandomTiles(
      TILE_EVENTS.filter((tile) => tile.type === TILE_TYPES.ACTION),
      5
    );
    const rewardTiles = getRandomTiles(
      TILE_EVENTS.filter((tile) => tile.type === TILE_TYPES.REWARD),
      6
    );
    const penaltyTiles = getRandomTiles(
      TILE_EVENTS.filter((tile) => tile.type === TILE_TYPES.PENALTY),
      6
    );
    const chanceTiles = getRandomTiles(
      TILE_EVENTS.filter((tile) => tile.type === TILE_TYPES.CHANCE),
      2
    );

    // Combine and shuffle the tiles
    const boardTiles = [
      ...storyTiles,
      ...actionTiles,
      ...rewardTiles,
      ...penaltyTiles,
      ...chanceTiles,
    ];
    return shuffleTiles(boardTiles);
  };

  const [tiles, setTiles] = useState(generateBoard());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [movingPlayer, setMovingPlayer] = useState<MovingPlayer | null>(null);
  const { width, height } = useWindowSize(); // For confetti dimensions
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [currentTileMessage, setCurrentTileMessage] = useState<string | null>(
    null
  );
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentActionMessage, setCurrentActionMessage] = useState<
    string | null
  >(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [currentRewardMessage, setCurrentRewardMessage] = useState<
    string | null
  >(null);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [currentPenaltyMessage, setCurrentPenaltyMessage] = useState<
    string | null
  >(null);
  const [showChanceModal, setShowChanceModal] = useState(false);
  const [currentChanceMessage, setCurrentChanceMessage] = useState<
    string | null
  >(null);
  const [isChanceRollPending, setIsChanceRollPending] = useState(false); // Track if the dice roll is pending for a CHANCE tile

  const resetGame = () => {
    setFadeOut(true);
    setShowWinnerModal(false);
    setWinner(null);

    setTimeout(() => {
      setTiles(shuffleTiles(TILE_EVENTS)); // Reset tiles
      setPlayers([]); // Clear players
      setPlayerNames([]); // Clear player names
      setNumPlayers(2); // Reset to default number of players
      setCurrentPlayer(0); // Reset current player
      setDiceRoll(null); // Clear dice roll
      setMovingPlayer(null); // Clear moving player
      setSetupComplete(false); // Go back to setup screen
      setFadeOut(false); // Reset fade-out effect
    }, 400); // Matches your fade duration
  };

  const rollDice = () => {
    // Handle pending CHANCE roll
    if (isChanceRollPending) {
      const chanceRoll = Math.floor(Math.random() * 6) + 1; // Roll a dice for chance
      setPlayers((prev) => {
        const updated = [...prev];
        const player = { ...updated[currentPlayer] };

        if (chanceRoll <= 3) {
          player.skip += 1; // Skip the next turn
          setCurrentChanceMessage("Bad luck! You must skip your next turn.");
        } else {
          player.immunity += 1; // Gain immunity
          setCurrentChanceMessage("Good luck! You gained +1 Immunity.");
        }

        updated[currentPlayer] = player;
        return updated;
      });

      setIsChanceRollPending(false); // Reset pending state
      return;
    }

    // Regular dice roll logic
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);

    setPlayers((prev) => {
      const updated = [...prev];
      const player = { ...updated[currentPlayer] };
      player.position = Math.min(player.position + roll, 24);

      // Highlight the tile where the player lands
      setActiveTile(player.position);

      // Check if the player has won
      if (player.position === 24) {
        setWinner(player);
        setShowWinnerModal(true);
      } else {
        // Handle tile event
        const tile = tiles[player.position];
        if (tile.type === TILE_TYPES.STORY) {
          setCurrentTileMessage(tile.message);
          setShowStoryModal(true);
        } else if (tile.type === TILE_TYPES.ACTION) {
          setCurrentActionMessage(tile.message);
          setShowActionModal(true);
        } else if (tile.type === TILE_TYPES.REWARD) {
          if (tile.reward?.immunityPoints) {
            player.immunity += tile.reward.immunityPoints;
            setCurrentRewardMessage(
              `You gained +${tile.reward.immunityPoints} Immunity!`
            );
          }
          if (tile.reward?.moveAhead) {
            player.position = Math.min(
              player.position + tile.reward.moveAhead,
              24
            );
            setCurrentRewardMessage(
              `You moved ahead by ${tile.reward.moveAhead} tiles!`
            );
          }
          setShowRewardModal(true);
        } else if (tile.type === TILE_TYPES.PENALTY) {
          if (tile.penalty?.skipTurns) {
            if (player.immunity > 0) {
              player.immunity -= 1; // Reduce immunity
              setCurrentPenaltyMessage(
                "You used immunity to avoid skipping your turn!"
              );
            } else {
              player.skip = tile.penalty.skipTurns; // Set the skip count
              setCurrentPenaltyMessage(
                `You must skip your next ${tile.penalty.skipTurns} turn(s)!`
              );
            }
          }
          if (tile.penalty?.loseImmunity) {
            player.immunity = Math.max(
              player.immunity - tile.penalty.loseImmunity,
              0
            ); // Reduce immunity
            setCurrentPenaltyMessage(
              `You lost ${tile.penalty.loseImmunity} immunity point(s)!`
            );
          }
          if (tile.penalty?.moveBack) {
            player.position = Math.max(
              player.position - tile.penalty.moveBack,
              0
            ); // Move back tiles
            setCurrentPenaltyMessage(
              `You moved back ${tile.penalty.moveBack} tile(s)!`
            );
          }
          setShowPenaltyModal(true);
        } else if (tile.type === TILE_TYPES.CHANCE) {
          setCurrentChanceMessage(tile.message);
          setShowChanceModal(true);
          setIsChanceRollPending(true); // Wait for the user to roll the dice
        }
      }

      updated[currentPlayer] = player;
      return updated;
    });
  };

  const closeStoryModal = () => {
    setShowStoryModal(false);
    setCurrentTileMessage(null);
    advanceTurn(); // Advance the turn when the modal is closed
  };

  const closeActionModal = () => {
    setShowActionModal(false);
    setCurrentActionMessage(null);
    advanceTurn(); // Advance the turn when the modal is closed
  };

  const closeRewardModal = () => {
    setShowRewardModal(false);
    setCurrentRewardMessage(null);
    advanceTurn(); // Advance the turn when the modal is closed
  };

  const closePenaltyModal = () => {
    setShowPenaltyModal(false);
    setCurrentPenaltyMessage(null);
    advanceTurn(); // Advance the turn when the modal is closed
  };

  const closeChanceModal = () => {
    setShowChanceModal(false);
    setCurrentChanceMessage(null);
    advanceTurn(); // Advance the turn when the modal is closed
  };

  const advanceTurn = () => {
    setCurrentPlayer((prev) => (prev + 1) % players.length); // Move to the next player
    setActiveTile(null); // Clear the active tile highlight
  };

  // Helper function to shuffle an array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const handleSetupComplete = () => {
    const shuffledAvatars = shuffleArray(AVATARS); // Shuffle avatars
    const names = playerNames.length
      ? playerNames
      : Array.from(
          { length: numPlayers },
          (_, i) => FUNNY_NAMES[i % FUNNY_NAMES.length]
        );

    setPlayers(
      names.map((name, index) => ({
        name,
        avatar: shuffledAvatars[index % shuffledAvatars.length], // Assign avatars
        position: -1,
        immunity: 0,
        skip: 0,
      }))
    );
    setSetupComplete(true);
  };

  if (!setupComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-purple-100 p-4">
        <img
          src={bannerImage} // Replace with the actual path to your image
          alt="Go Corona Go"
          className="w-80 h-auto mb-4"
        />
        <div className="mb-4 flex flex-row items-center">
          <label className="block text-4xl font-medium mb-2">
            Number of Players:
          </label>
          <select
            value={numPlayers}
            onChange={(e) => setNumPlayers(Number(e.target.value))}
            className="border rounded px-4 py-2"
          >
            {Array.from({ length: 5 }, (_, i) => i + 2).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Player Names (optional):
          </label>
          <div className="flex flex-col gap-2">
            {Array.from({ length: numPlayers }).map((_, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Player ${i + 1}`}
                value={playerNames[i] || ""}
                onChange={(e) => {
                  const newNames = [...playerNames];
                  newNames[i] = e.target.value;
                  setPlayerNames(newNames);
                }}
                className="border rounded px-4 py-2 mb-2 w-64" // Fixed width of 16rem
              />
            ))}
          </div>
        </div>
        <button
          onClick={handleSetupComplete}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-yellow-50 to-purple-100 p-4">
      {/* Top Section */}
      <div className="relative w-full mb-6">
        {/* Top-Left Banner */}
        <img
          src={bannerImage} // Replace with the actual path to your image
          alt="Go Corona Go"
          className="absolute top-0 left-0 w-48 h-auto w-16 h-16 rounded-full mx-auto mb-4" // Positioned to the top-left
        />

        {/* Centered Buttons */}
        <div className="flex flex-col items-center">
          <div className="flex gap-4 mb-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={rollDice}
            >
              Roll Dice
            </button>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              New Game
            </button>
          </div>

          {/* Below Buttons: You Rolled and Current Turn */}
          <div className="text-center">
            <p className="mb-2 text-lg">
              You rolled: <span className="font-bold">{diceRoll}</span>
            </p>
            <p className="text-lg">
              Current Turn:{" "}
              <img
                src={players[currentPlayer].avatar}
                alt={players[currentPlayer].name}
                className="w-12 h-12 rounded-full inline-block"
              />
              <span className="font-bold ml-2">
                {players[currentPlayer].name}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Board Section */}
      <div
        className={`transition-opacity duration-500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="board-container">
          <Board
            players={players}
            tiles={tiles}
            movingPlayer={movingPlayer}
            activeTile={activeTile}
            currentPlayer={currentPlayer}
          />
        </div>
      </div>
      {/* New Game */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center w-[90%] max-w-sm">
            <p className="mb-4 text-lg font-medium">Start a new game?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  resetGame();
                  setShowConfirmModal(false);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confetti Animation */}
      {showWinnerModal && <ReactConfetti width={width} height={height} />}

      {/* Winner Modal */}
      {showWinnerModal && winner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center w-[90%] max-w-md">
            <h2 className="text-2xl font-bold mb-4">🎉 Congratulations! 🎉</h2>
            <p className="text-lg mb-4">
              <img
                src={winner.avatar}
                alt={winner.name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <span className="font-bold">{winner.name}</span> has won the game!
            </p>
            <button
              onClick={resetGame}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Start New Game
            </button>
          </div>
        </div>
      )}

      {/* Story Modal */}
      {showStoryModal && currentTileMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded shadow-lg text-center w-[90%] max-w-md"
            style={{
              transform: "translate(-50%, -50%) scale(0)", // Start small
              animation: "modal-appear 1s forwards", // Animate to full size
            }}
          >
            <h2 className="text-xl font-bold mb-4">Story Tile</h2>
            <p className="text-lg mb-4">{currentTileMessage}</p>
            <button
              onClick={closeStoryModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && currentActionMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded shadow-lg text-center w-[90%] max-w-md transition-transform duration-500 ease-out"
            style={{
              transform: "scale(0)", // Start small
              animation: "modal-appear 1s forwards", // Animate to full size
            }}
          >
            <h2 className="text-xl font-bold mb-4">Action Tile</h2>
            <p className="text-lg mb-4">{currentActionMessage}</p>
            <button
              onClick={closeActionModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Reward Modal */}
      {showRewardModal && currentRewardMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded shadow-lg text-center w-[90%] max-w-md transition-transform duration-500 ease-out"
            style={{
              transform: "scale(0)", // Start small
              animation: "modal-appear 1s forwards", // Animate to full size
            }}
          >
            <h2 className="text-xl font-bold mb-4">Reward Tile</h2>
            <p className="text-lg mb-4">{currentRewardMessage}</p>
            <button
              onClick={closeRewardModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Penalty Modal */}
      {showPenaltyModal && currentPenaltyMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded shadow-lg text-center w-[90%] max-w-md transition-transform duration-500 ease-out"
            style={{
              transform: "scale(0)", // Start small
              animation: "modal-appear 1s forwards", // Animate to full size
            }}
          >
            <h2 className="text-xl font-bold mb-4">Penalty Tile</h2>
            <p className="text-lg mb-4">{currentPenaltyMessage}</p>
            <button
              onClick={closePenaltyModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Chance Modal */}
      {showChanceModal && currentChanceMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded shadow-lg text-center w-[90%] max-w-md transition-transform duration-500 ease-out"
            style={{
              transform: "scale(0)", // Start small
              animation: "modal-appear 1s forwards", // Animate to full size
            }}
          >
            <h2 className="text-xl font-bold mb-4">Chance Tile</h2>
            <p className="text-lg mb-4">{currentChanceMessage}</p>
            {isChanceRollPending ? (
              <button
                onClick={rollDice}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Roll Dice
              </button>
            ) : (
              <button
                onClick={closeChanceModal}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}

      <footer className="mt-auto text-center text-sm text-gray-600">
        <p>
          Made with ❤️ by Siddharth Sohoni for my source of inspiration Shami
          Gokhale
        </p>
      </footer>
    </div>
  );
}
