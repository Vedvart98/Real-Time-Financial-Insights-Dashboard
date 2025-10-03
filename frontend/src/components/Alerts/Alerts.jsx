import axios from 'axios';
import './Alerts.css';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:3001/api/alerts';

const AlertsPopup = () => {
    const [alerts, setAlerts] = useState([]);
    const [ticker, setTicker] = useState('');
    const [comparator, setComparator] = useState('<');
    const [threshold, setThreshold] = useState('');
    const [loading, setLoading] = useState(false);
    const [popupNotifications, setPopupNotifications] = useState([]);
    const { token, user } = useContext(AuthContext); // user info from context

    // Fetch + check alerts
    useEffect(() => {
        if (!user) return;

        fetchAlerts();
        const alertInterval = setInterval(() => {
            checkAlerts();
        }, 30000);

        return () => clearInterval(alertInterval);
    }, [user]);

    const fetchAlerts = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/user/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlerts(res.data.alerts);
        } catch (err) {
            console.error('Error fetching alerts:', err);
        }
    };

    const checkAlerts = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/check/${user.id}`);
            if (res.data.triggered) {
                showPopup(res.data.message, 'warning');
                fetchAlerts(); // Refresh alerts after one triggers
            }
        } catch (err) {
            console.error('Error checking alerts:', err);
        }
    };

    const showPopup = (message, type = 'info') => {
        const notification = { id: Date.now(), message, type };
        setPopupNotifications(prev => [...prev, notification]);
        setTimeout(() => {
            setPopupNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
    };

    const removePopup = (id) => {
        setPopupNotifications(prev => prev.filter(n => n.id !== id));
    };

    const addAlert = async () => {
        if (!ticker || !comparator || !threshold) return showPopup('Please fill all fields', 'error');
        if (!user) return showPopup('Please log in first', 'error');

        setLoading(true);
        try {
            const body = {
                userId: user.id,
                ticker,
                comparator,
                threshold,
                notification_type: "in-app"
            };
            const res = await axios.post(`${API_BASE_URL}/add`, body, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlerts(prev => [res.data.alert, ...prev]);
            setTicker('');
            setThreshold('');
            setComparator('<');
            showPopup('Alert added successfully!', 'success');
        } catch (err) {
            console.error(err);
            showPopup('Error adding alert', 'error');
        } finally {
            setLoading(false);
        }
    };

    const deleteAlert = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlerts(prev => prev.filter(a => a.alert_id !== id));
            showPopup('Alert deleted successfully!', 'success');
        } catch (err) {
            console.error(err);
            showPopup('Error deleting alert', 'error');
        }
    };

    const toggleAlert = async (id) => {
        try {
            const res = await axios.patch(`${API_BASE_URL}/${id}/toggle`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlerts(prev => prev.map(a => a.alert_id === id ? res.data.alert : a));
            showPopup('Alert toggled successfully!', 'success');
        } catch (err) {
            console.error(err);
            showPopup('Error toggling alert', 'error');
        }
    };

    return (
        <div className='alert'>
            {/* Popup Notifications */}
            <div className="popup-notifications">
                {popupNotifications.map(notification => (
                    <div key={notification.id} className={`popup-notification ${notification.type}`}>
                        <span>{notification.message}</span>
                        <button onClick={() => removePopup(notification.id)}>×</button>
                    </div>
                ))}
            </div>

            <h2>Manage Alerts</h2>
            <div className="add-alert">
                <input 
                    type="text" 
                    value={ticker} 
                    placeholder="Ticker (e.g., BTC)" 
                    onChange={(e) => setTicker(e.target.value)} 
                />
                <select value={comparator} onChange={(e) => setComparator(e.target.value)}>
                    <option value="<">&lt;</option>
                    <option value="<=">&le;</option>
                    <option value="=">=</option>
                    <option value=">">&gt;</option>
                    <option value=">=">&ge;</option>
                </select>
                <input 
                    type="text" 
                    value={threshold} 
                    onChange={(e) => setThreshold(e.target.value)} 
                    placeholder="Threshold (number)" 
                />
                <button onClick={addAlert} disabled={loading} className="bg-blue-500 text-white px-3 py-2 rounded">
                    {loading ? "Adding..." : "Add Alert"}
                </button>
            </div>

            <div className="alerts-list">
                <h3>Your Alerts</h3>
                {alerts.length === 0 && <p>No alerts set</p>}
                <ul>
                    {alerts.map(a => (
                        <li key={a.alert_id}>
                            <div>
                                <div>{a.ticker} <span>({a.comparator} {a.threshold})</span></div>
                                <div>Type: In-app • Active: {a.is_active ? "Yes" : "No"}</div>
                            </div>
                            <div className='btns'>
                                <button onClick={() => toggleAlert(a.alert_id)}>
                                    {a.is_active ? "Disable" : "Enable"}
                                </button>
                                <button onClick={() => deleteAlert(a.alert_id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AlertsPopup;
