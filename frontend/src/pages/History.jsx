import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChatHistory } from '../services/api';

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await getChatHistory(userId);
                setHistory(res.data);
            } catch (err) {
                console.error('Failed to fetch history');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString();
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h2 style={styles.headerTitle}>🏥 Chat History</h2>
                <button onClick={() => navigate('/chat')} style={styles.backBtn}>
                    Back to Chat
                </button>
            </div>

            {/* History List */}
            <div style={styles.content}>
                {loading ? (
                    <p style={styles.center}>Loading...</p>
                ) : history.length === 0 ? (
                    <p style={styles.center}>No chat history found.</p>
                ) : (
                    history.map((chat, index) => (
                        <div key={index} style={styles.card}>
                            <div style={styles.userMessage}>
                                <span style={styles.label}>You</span>
                                <p style={styles.messageText}>{chat.userMessage}</p>
                            </div>
                            <div style={styles.botMessage}>
                                <span style={styles.label}>Assistant</span>
                                <p style={styles.messageText}>{chat.botResponse}</p>
                            </div>
                            <p style={styles.date}>{formatDate(chat.createdAt)}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh', backgroundColor: '#f0f4f8',
        fontFamily: 'sans-serif'
    },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '15px 20px',
        backgroundColor: '#2d7dd2', color: 'white'
    },
    headerTitle: { margin: 0, fontSize: '20px' },
    backBtn: {
        padding: '8px 15px', backgroundColor: 'white',
        color: '#2d7dd2', border: 'none',
        borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
    },
    content: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
    card: {
        backgroundColor: 'white', borderRadius: '12px',
        padding: '20px', marginBottom: '15px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    userMessage: { marginBottom: '10px' },
    botMessage: {
        backgroundColor: '#f0f4f8', padding: '12px',
        borderRadius: '8px'
    },
    label: { fontSize: '12px', fontWeight: 'bold', color: '#2d7dd2' },
    messageText: { margin: '5px 0', fontSize: '14px', color: '#333' },
    date: { fontSize: '11px', color: '#999', textAlign: 'right', marginTop: '10px' },
    center: { textAlign: 'center', color: '#888', marginTop: '50px' }
};