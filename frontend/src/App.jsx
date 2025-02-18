import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [number, setNumber] = useState(null);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [rangeMessage, setRangeMessage] = useState('');

  // Poll the backend for a new random number every second
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://127.0.0.1:5000/random-number')
        .then(response => response.json())
        .then(data => {
          console.log('Fetched data:', data);
          setNumber(data.number);
        })
        .catch(error => console.error('Error fetching number:', error));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle setting a new range
  const handleSetRange = () => {
    const parsedMin = parseFloat(min);
    const parsedMax = parseFloat(max);

    if (isNaN(parsedMin) || isNaN(parsedMax)) {
      setRangeMessage('Please enter valid numbers.');
      return;
    }

    fetch('http://127.0.0.1:5000/set-range', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ min: parsedMin, max: parsedMax })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setRangeMessage(data.error);
        } else {
          setRangeMessage(`Range updated to: ${data.min} - ${data.max}`);
        }
      })
      .catch(error => {
        console.error('Error setting range:', error);
        setRangeMessage('Error setting range.');
      });
  };

  return (
    <div className="App">
      <h1>API</h1>
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
