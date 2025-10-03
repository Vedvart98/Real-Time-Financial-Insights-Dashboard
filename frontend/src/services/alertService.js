import axios from 'axios';

class AlertService {
  constructor() {
    this.toastCallback = null;
    this.isChecking = false;
    this.interval = null;
  }

  setToastCallback(callback) {
    this.toastCallback = callback;
  }

  async startAlertChecking(userId) {
    if (this.isChecking) return;
    
    this.isChecking = true;
    const checkAlerts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/alerts/check/${userId}`);
        if (response.data.triggered && this.toastCallback) {
          this.toastCallback(response.data.message, 'warning');
        }
      } catch (error) {
        console.error('Alert check error:', error);
      }
    };

    checkAlerts();
    
    //check in every 30 seconds
    this.interval = setInterval(checkAlerts, 30000);
  }

  stopAlertChecking() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isChecking = false;
  }

  // Manual trigger for testing
  async triggerTestAlert(userId) {
    try {
      const response = await axios.get(`http://localhost:3001/api/alerts/test-trigger/${userId}`);
      if (response.data.triggered && this.toastCallback) {
        this.toastCallback(response.data.message, 'warning');
      }
      return response.data;
    } catch (error) {
      console.error('Test alert error:', error);
      return { triggered: false, error: error.message };
    }
  }
}

export const alertService = new AlertService();