
import React from 'react';
import NavBar from '../components/navbar';

const Chat = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Chat</h1>
        <p className="text-muted-foreground">This is a placeholder for the chat page.</p>
      </main>
    </div>
  );
};

export default Chat;
