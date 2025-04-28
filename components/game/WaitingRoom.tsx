"use client"

import { useGameStore } from '@/lib/gameStore';
import { getSocket } from '@/lib/socket'; // Import getSocket
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function WaitingRoom() {
  const { gameState } = useGameStore();
  const { toast } = useToast();

  const handleStartGame = () => {
    if (gameState.players.length < 2) {
      toast({
        title: "Not enough players!",
        description: "At least 2 players are required to start the game.",
        variant: "destructive"
      });
      return;
    }

    const socket = getSocket(); // Ensure socket connection is available
    socket.emit('startGame', { roomCode: gameState.roomCode });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="comic-header mb-10">WAITING ROOM</h1>
      <div className="max-w-md mx-auto">
        <h2 className="text-center text-2xl mb-4">Players in the Room</h2>
        <ul className="space-y-2">
          {gameState.players.map(player => (
            <li key={player.id} className="text-center">
              {player.name}
            </li>
          ))}
        </ul>
        <Button 
          onClick={handleStartGame} 
          className="w-full comic-button mt-4"
        >
          Start Game
        </Button>
      </div>
    </div>
  );
}
