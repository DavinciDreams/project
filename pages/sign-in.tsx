"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState('');

  const handleSignIn = () => {
    if (!playerName.trim()) {
      toast({
        title: "Name required!",
        description: "Please enter your name to continue",
        variant: "destructive"
      });
      return;
    }

    // Redirect to the create room page with the player's name
    router.push(`/create-room?name=${encodeURIComponent(playerName)}`);
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="comic-header mb-10">SIGN IN</h1>
      
      <div className="max-w-md mx-auto">
        <Card className="comic-panel">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Enter Your Name</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="playerName">Your Name</Label>
              <Input
                id="playerName"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={handleSignIn} 
              className="w-full comic-button"
            >
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
