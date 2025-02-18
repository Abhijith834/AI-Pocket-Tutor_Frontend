import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [number, setNumber] = useState(null);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [rangeMessage, setRangeMessage] = useState('');

  // Replace with your actual ngrok URL
  const backendUrl = 'https://a5de-147-197-250-43.ngrok-free.app';

  useEffect(() => {
    // Function to fetch the random number
    const fetchRandomNumber = async () => {
      try {
        const response = await fetch(`${backendUrl}/random-number`, {
          cache: "no-store",
          headers: {
            'ngrok-skip-browser-warning': 'true', // This is the crucial part
          }
        });
        console.log('Response from /random-number:', response);
        if (!response.ok) {
          console.error('Response not OK:', response.status);
          return;
        }
        const data = await response.json();
        console.log('Data received:', data);
        if (data && typeof data.number === 'number') {
          setNumber(data.number);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching random number:', error);
      }
    };

    // Initial fetch + interval
    fetchRandomNumber();
    const interval = setInterval(fetchRandomNumber, 1000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  // Handle setting a new range
  const handleSetRange = async () => {
    const parsedMin = parseFloat(min);
    const parsedMax = parseFloat(max);

    if (isNaN(parsedMin) || isNaN(parsedMax)) {
      setRangeMessage('Please enter valid numbers.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/set-range`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // Include it here too
        },
        body: JSON.stringify({ min: parsedMin, max: parsedMax }),
      });
      console.log('Response from /set-range:', response.status);
      if (!response.ok) {
        setRangeMessage(`Error: ${response.status}`);
        return;
      }
      const data = await response.json();
      console.log('Data from /set-range:', data);
      if (data.error) {
        setRangeMessage(data.error);
      } else {
        setRangeMessage(`Range updated to: ${data.min} - ${data.max}`);
      }
    } catch (error) {
      console.error('Error setting range:', error);
      setRangeMessage('Error setting range.');
    }
  };

  return (
    <div className="App">
      <h1>Random Number API</h1>
      <div className="number">
        {number !== null ? number : 'Loading...'}
      </div>
      <div className="range-inputs">
        <input
          type="number"
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
        <button onClick={handleSetRange}>Set Range</button>
      </div>
      <div className="range-message">{rangeMessage}</div>
    </div>
  );
}

export default App;
