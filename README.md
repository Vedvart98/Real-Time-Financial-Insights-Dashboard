# Real-Time Financial Insights Dashboard

A comprehensive financial dashboard application that provides real-time stock market data, portfolio management, price alerts, and AI-powered market predictions.

## 🚀 Features

- **Real-time Portfolio Tracking** - Track your investments with live market data
- **Stock Price Alerts** - Get notified when stocks hit your target prices
- **Market Predictions** - AI-powered forecasting using time-series analysis
- **User Authentication** - Secure login with Google/GitHub OAuth
- **Interactive Dashboard** - Modern UI with charts and insights
- **Market News & Insights** - Stay updated with market trends

## 🛠️ Technologies Used

### Frontend
- **React.js** - User interface framework
- **Vite** - Build tool and development server
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **CSS3** - Modern styling with flexbox/grid

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Database for user data and portfolios
- **JWT** - Authentication tokens
- **Passport.js** - OAuth authentication (Google/GitHub)
- **Bcrypt** - Password hashing

### APIs & Services
- **Alpha Vantage API** - Real-time stock market data
- **Time-series Forecasting** - Custom prediction algorithms
- **Nodemailer** - Email notifications

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Alpha Vantage API key (free at alphavantage.co)
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Real-Time Financial Insights Dashboard"
```

### 2. Database Setup
```sql
-- Create PostgreSQL database
CREATE DATABASE financialdb;

-- Create required tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portfolio (
    p_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    ticker VARCHAR(10) NOT NULL,
    quantity DECIMAL NOT NULL,
    buy_price DECIMAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerts (
    alert_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    ticker VARCHAR(10) NOT NULL,
    comparator VARCHAR(5) NOT NULL,
    threshold DECIMAL NOT NULL,
    notification_type VARCHAR(20) DEFAULT 'in-app',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
DATABASE_URL=postgres://username:password@localhost:5432/financialdb
JWT_SECRET=your_jwt_secret_key
PORT=3001

# API Keys
ALPHA_VANTAGE_KEY=your_alpha_vantage_api_key
OPENAI_API_KEY=your_openai_key (optional)
PERPLEXITY_API_KEY=your_perplexity_key (optional)

# OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Start the Application

**Backend (Terminal 1):**
```bash
cd backend
npm start
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📱 Usage

### 1. User Registration/Login
- Sign up with email/password or use Google/GitHub OAuth
- Secure authentication with JWT tokens

### 2. Portfolio Management
- Add stocks to your portfolio with ticker, quantity, and buy price
- View real-time current prices and profit/loss calculations
- See portfolio allocation percentages

### 3. Price Alerts
- Set price alerts for any stock ticker
- Choose comparison operators (<, >, =)
- Receive real-time notifications when conditions are met

### 4. Market Insights
- View AI-powered price predictions for your portfolio assets
- See bullish/bearish trend analysis
- Get confidence scores for predictions

### 5. Dashboard Overview
- Interactive charts and market data
- Real-time stock cards with price movements
- Comprehensive portfolio summary

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Portfolio
- `GET /api/portfolio/` - Get user portfolio
- `POST /api/portfolio/add` - Add new asset
- `DELETE /api/portfolio/:id` - Delete asset

### Alerts
- `GET /api/alerts/user/:userId` - Get user alerts
- `POST /api/alerts/add` - Create new alert
- `DELETE /api/alerts/:id` - Delete alert
- `GET /api/alerts/check/:userId` - Check triggered alerts

### Market Data
- `GET /api/market/:symbol` - Get stock chart data
- `GET /api/market/quote/:symbol` - Get current stock price

### Insights
- `GET /api/insights/:userId` - Get portfolio predictions and insights

## 🚨 Environment Variables

Make sure to set up all required environment variables in `backend/.env`:

- `ALPHA_VANTAGE_KEY` - **Required** for real market data
- `DATABASE_URL` - **Required** for PostgreSQL connection
- `JWT_SECRET` - **Required** for authentication
- OAuth credentials - Optional for social login
- Email credentials - Optional for email alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env file

2. **API Rate Limits**
   - Alpha Vantage free tier: 5 calls/minute, 500/day
   - Consider upgrading for higher limits

3. **OAuth Issues**
   - Verify redirect URLs in OAuth app settings
   - Check client ID/secret in .env

4. **Port Conflicts**
   - Backend default: 3001
   - Frontend default: 5173

## Support

For support and questions, please open an issue in the repository.# Real-Time-Financial-Insights-Dashboard
