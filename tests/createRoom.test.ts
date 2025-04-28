import { render, screen, fireEvent } from '@testing-library/react';
import CreateRoomPage from '@/app/create-room/page';

describe('CreateRoomPage', () => {
  it('should create a room successfully', async () => {
    render(<CreateRoomPage />);

    // Fill in player name
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: 'Player1' },
    });

    // Select number of players
    fireEvent.click(screen.getByLabelText('4 Players'));

    // Click the create room button
    fireEvent.click(screen.getByText('Create Game Room'));

    // Check if the room code is displayed
    expect(await screen.findByText(/Room Code:/)).toBeInTheDocument();
  });
});
