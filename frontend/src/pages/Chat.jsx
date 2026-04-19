import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendMessage } from '../services/api';

export default function Chat() {
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            content: `Hello ${localStorage.getItem('name')}! 👋 I am your healthcare assistant. How can I help you today?`
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');

    // Auto scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message to chat
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const res = await sendMessage({ userId, message: userMessage });
            setMessages(prev => [...prev, { role: 'bot', content: res.data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: 'Sorry something went wrong. Please try again.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h2 style={styles.headerTitle}>🏥 Healthcare Assistant</h2>
                <div style={styles.headerButtons}>
                    <Link to="/history" style={styles.historyBtn}>
                        Chat History
                    </Link>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div style={styles.chatBox}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.message,
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.role === 'user' ? '#2d7dd2' : '#f0f4f8',
                            color: msg.role === 'user' ? 'white' : '#333'
                        }}
                    >
                        {msg.content}
                    </div>
                ))}

                {loading && (
                    <div style={{ ...styles.message, alignSelf: 'flex-start', backgroundColor: '#f0f4f8' }}>
                        Typing...
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={styles.inputArea}>
                <textarea
                    style={styles.textarea}
                    placeholder="Ask a health question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                />
                <button
                    style={styles.sendBtn}
                    onClick={handleSend}
                    disabled={loading}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex', flexDirection: 'column',
        height: '100vh', maxWidth: '800px',
        margin: '0 auto', fontFamily: 'sans-serif'
    },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '15px 20px',
        backgroundColor: '#2d7dd2', color: 'white'
    },
    headerTitle: { margin: 0, fontSize: '20px' },
    headerButtons: { display: 'flex', gap: '10px' },
    historyBtn: {
        padding: '8px 15px', backgroundColor: 'white',
        color: '#2d7dd2', borderRadius: '6px',
        textDecoration: 'none', fontSize: '14px'
    },
    logoutBtn: {
        padding: '8px 15px', backgroundColor: 'transparent',
        color: 'white', border: '1px solid white',
        borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
    },
    chatBox: {
        flex: 1, overflowY: 'auto', padding: '20px',
        display: 'flex', flexDirection: 'column', gap: '10px',
        backgroundColor: '#fff'
    },
    message: {
        padding: '12px 16px', borderRadius: '12px',
        maxWidth: '70%', fontSize: '14px', lineHeight: '1.5'
    },
    inputArea: {
        display: 'flex', padding: '15px',
        borderTop: '1px solid #eee', gap: '10px',
        backgroundColor: 'white'
    },
    textarea: {
        flex: 1, padding: '12px', borderRadius: '8px',
        border: '1px solid #ddd', fontSize: '14px',
        resize: 'none', outline: 'none'
    },
    sendBtn: {
        padding: '12px 24px', backgroundColor: '#2d7dd2',
        color: 'white', border: 'none', borderRadius: '8px',
        cursor: 'pointer', fontSize: '14px'
    }
};