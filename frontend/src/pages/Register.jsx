import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await registerUser(form);
            alert('Registered successfully! Please login.');
            navigate('/login');
        } catch (err) {
    console.log('Error response:', err.response?.data);
    
    // Handle both string and object responses
    const errorMsg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || 'Registration failed. Please try again.';
    
    setError(errorMsg);
}  finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>🏥 Healthcare Assistant</h2>
                <h3 style={styles.subtitle}>Register</h3>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        style={styles.input}
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email} 
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p style={styles.link}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh',
        backgroundColor: '#f0f4f8'
    },
    card: {
        backgroundColor: 'white', padding: '40px',
        borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%', maxWidth: '400px'
    },
    title: { textAlign: 'center', color: '#2d7dd2', marginBottom: '5px' },
    subtitle: { textAlign: 'center', color: '#555', marginBottom: '20px' },
    input: {
        width: '100%', padding: '12px', marginBottom: '15px',
        borderRadius: '8px', border: '1px solid #ddd',
        fontSize: '14px', boxSizing: 'border-box'
    },
    button: {
        width: '100%', padding: '12px', backgroundColor: '#2d7dd2',
        color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '16px', cursor: 'pointer'
    },
    error: { color: 'red', textAlign: 'center', marginBottom: '10px' },
    link: { textAlign: 'center', marginTop: '15px', fontSize: '14px' }
};