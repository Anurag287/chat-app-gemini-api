import React, { useState, useEffect, useRef } from 'react';

function ChatWindow() {
  const [question, setQuestion] = useState('');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:2000');

    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.response) {
        setResponse(data.response);
        setLoading(false);
      } else if (data.message) {
        setResponse(`Error: ${data.message}`);
        setLoading(false);
      }
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const handleSend = () => {
    if (!question.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setResponse('WebSocket is not connected or question is empty.');
      return;
    }

    setLoading(true);
    setResponse('');

    ws.current.send(
      JSON.stringify({
        text: question,
        model: model,
      })
    );
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Chat.io (WebSocket)</h2>

      <div>
        <textarea
          rows="4"
          cols="50"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ marginBottom: '10px', width: '100%' }}
        />
      </div>

      <div>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
          <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
          <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
        </select>
      </div>

      <div>
        <button onClick={handleSend} style={{ marginTop: '10px' }} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <div
        style={{
          marginTop: '20px',
          textAlign: 'left',
          background: '#f4f4f4',
          padding: '10px',
          minHeight: '50px',
        }}
      >
        <p>
          <strong>Response:</strong>
        </p>
        <p>{loading ? 'Loading...' : response}</p>
      </div>
    </div>
  );
}

export default ChatWindow;
