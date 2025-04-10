import Tile from "./Tile";
import { TileEvent } from "../data/tilesData";

interface Player {
  name: string;
  position: number;
  immunity: number;
  skip: number;
  avatar: string;
}

interface BoardProps {
  players: Player[];
  tiles: TileEvent[];
  movingPlayer: { name: string; avatar: string } | null; // Track the moving player
  activeTile: number | null; // Track the active tile
  currentPlayer: number; // Track the current player
}

export default function Board({
  players,
  tiles,
  movingPlayer,
  activeTile,
  currentPlayer,
}: BoardProps) {
  const getPlayersOnTile = (
    index: number
  ): { name: string; avatar: string }[] => {
    return players
      .filter((player) => player.position === index)
      .map((player) => ({ name: player.name, avatar: player.avatar }));
  };

  return (
    <div className="w-full flex flex-row gap-4 h-full">
      {/* Player Status Section */}
      <div className="w-1/4 p-4 bg-gray-100 rounded shadow flex flex-col overflow-y-auto h-full">
        <h2 className="text-lg font-bold mb-2">Player Status</h2>
        <div className="grid grid-cols-1 gap-4">
          {players.map((player, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-2 border rounded bg-white shadow ${
                index === currentPlayer ? "border-red-500 bg-red-50 border-4" : ""
              }`}
            >
              <img
                src={player.avatar}
                alt={player.name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <p className="font-bold">{player.name}</p>
              <p className="text-sm">Immunity: {player.immunity}</p>
              <p className="text-sm">
                Skip Turn: {player.skip > 0 ? "Yes" : "No"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Board Section */}
      <div className="grid grid-cols-5 gap-2 w-full max-w-4xl h-full">
        {Array.from({ length: 25 }).map((_, index) => {
          const tileData = tiles[index];
          const playersOnThisTile = getPlayersOnTile(index);

          return (
            <Tile
              key={index}
              index={index}
              tile={tileData}
              players={playersOnThisTile}
              movingPlayer={movingPlayer} // Pass the moving player
              isActive={activeTile === index} // Highlight the active tile
            />
          );
        })}
      </div>
    </div>
  );
}
