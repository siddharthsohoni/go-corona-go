import storyImage from "../assets/images/story.png";
import actionImage from "../assets/images/action.png";
import rewardImage from "../assets/images/reward.png";
import penaltyImage from "../assets/images/penalty.png";
import chanceImage from "../assets/images/chance.png";
import winnerImage from "../assets/images/winner.png"; // Import the winner tile image

interface TileProps {
  index: number;
  tile: {
    type: string;
    message: string;
  } | null;
  players: { name: string; avatar: string }[];
  movingPlayer: { name: string; avatar: string } | null; // Track the moving player
  isActive: boolean; // New prop to indicate if the tile is active
}

function Tile({ index, tile, players, movingPlayer, isActive }: TileProps) {
  const colorMap: Record<string, string> = {
    story: "#f7841b", // Lighter blue
    action: "#53b1ac", // Lighter orange
    reward: "#e7b42b", // Lighter green
    penalty: "#93232b", // Lighter red
    chance: "#b4bc43", // Lighter purple
  };

  const backgroundMap: Record<string, string> = {
    story: `url(${storyImage})`,
    action: `url(${actionImage})`,
    reward: `url(${rewardImage})`,
    penalty: `url(${penaltyImage})`,
    chance: `url(${chanceImage})`,
  };

  // Use a special background for the last tile
  const tileBackground =
    index === 24
      ? `url(${winnerImage})`
      : tile
      ? backgroundMap[tile.type]
      : "none";

  const tileColor = tile ? colorMap[tile.type] : "bg-gray-100";

  const tileStyle =
    index === 24
      ? {
          backgroundImage: tileBackground,
          backgroundSize: "cover", // Cover the entire tile
          backgroundPosition: "center", // Center the image
          backgroundRepeat: "no-repeat", // Prevent repeating
        }
      : {
          backgroundImage: tileBackground,
          backgroundSize: "60%", // Scale the image to 60%
          backgroundPosition: "top left", // Position the image in the top-left corner
          backgroundRepeat: "no-repeat", // Prevent repeating
          backgroundColor: tile ? colorMap[tile.type] : "#f0f0f0", // Fallback color
        };

  return (
    <div
      id={`tile-${index}`} // Ensure this ID matches the player's position
      className={`aspect-square w-full sm:w-[100px] md:w-[120px] lg:w-[140px] xl:w-[160px] rounded shadow text-sm text-center flex flex-col justify-center items-center transition-transform transform hover:scale-105 hover:shadow-lg ${
        isActive ? "ring-4 ring-blue-500 animate-glow" : ""
      }`}
      style={tileStyle}
    >
      {/* Tile Number */}
      <div
        className="absolute bottom-1 left-1 font-bold text-sm bg-white bg-opacity-70 px-2 py-1 rounded"
        style={{ zIndex: 2 }}
      >
        #{index + 1}
      </div>

      {/* Player Icons */}
      {players.length > 0 && (
        <div
          className="absolute bottom-1 right-1 flex gap-1 items-center"
          style={{ zIndex: 2 }}
        >
          {players.map((player, i) => (
            <img
              key={i}
              src={player.avatar}
              alt={player.name}
              title={player.name}
              className={`w-10 h-10 rounded-full transition-transform duration-500 ${
                movingPlayer?.name === player.name ? "animate-bounce" : ""
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Tile;
