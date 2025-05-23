"use client"

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { User, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { MAX_PLAYERS } from '@/lib/constants';

export default function CreateRoomPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState('Player1'); // Default player name
  const [maxPlayers, setMaxPlayers] = useState<string>('4');
  const [roomCode, setRoomCode] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(); // Initialize socket connection
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Clean up on unmount
    };
  }, []);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      toast({
        title: "Name required!",
        description: "Please enter your name to create a room",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      // Generate a 6-character room code
      const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setRoomCode(generatedCode);

      console.log("Socket status:", socket);
      console.log("Emitting joinRoom event with:", { roomCode: generatedCode, playerName, isHost: true, maxPlayers });

      // Emit the room creation event to the server
      socket.emit('joinRoom', { roomCode: generatedCode, playerName, isHost: true, maxPlayers });

      // Then navigate to the game room with the room code
      router.push(`/game/${generatedCode}?name=${encodeURIComponent(playerName)}&host=true&maxPlayers=${maxPlayers}`);
    } catch (error) {
      toast({
        title: "Error creating room",
        description: "There was a problem creating your game room",
        variant: "destructive"
      });
      setIsCreating(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="comic-header mb-10">CREATE A GAME ROOM</h1>
      
      <div className="max-w-md mx-auto">
        <Card className="comic-panel">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Set Up Your Game</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="playerName">Your Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="playerName"
                  placeholder="Enter your name"
                  className="pl-10"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Number of Players</Label>
              <RadioGroup 
                value={maxPlayers} 
                onValueChange={setMaxPlayers}
                className="flex justify-between"
              >
                {[2, 3, 4].map((num) => (
                  <div key={num} className="flex items-center space-x-2">
                    <RadioGroupItem value={num.toString()} id={`players-${num}`} />
                    <Label htmlFor={`players-${num}`}>{num} Players</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {roomCode && (
              <div className="p-4 bg-muted rounded-md">
                <p className="text-center mb-2">Room Code:</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold">{roomCode}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(roomCode);
                      toast({ title: "Copied to clipboard!" });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={handleCreateRoom} 
              disabled={isCreating || !playerName.trim()} 
              className="w-full comic-button"
            >
              {isCreating ? "Creating Room..." : "Create Game Room"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
