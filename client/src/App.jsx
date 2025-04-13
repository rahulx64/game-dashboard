import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !score) return;
    socket.emit("submitScore", { name, score: parseInt(score) });
    setName("");
    setScore("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("leaderboard", (data) => {
      console.log("Updated leaderboard:", data);
      setLeaderboard(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <h1>React Multiplayer Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
        />
        <button type="submit">Submit Score</button>
      </form>

      <h2>Leaderboard</h2>
      <ol>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.name} - {entry.score}
          </li>
        ))}
      </ol>
    </>
  );
}

export default App;
