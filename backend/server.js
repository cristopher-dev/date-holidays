const express = require('express');
const cors = require('cors');
const Holidays = require('date-holidays');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Server health route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Holiday server running correctly',
    timestamp: new Date().toISOString()
  });
});

// Get holidays using date-holidays library
app.get('/api/holidays/:year/:country', async (req, res) => {
  try {
    const { year, country } = req.params;
    
    // Validate parameters
    if (!year || !country) {
      return res.status(400).json({
        error: 'Required parameters: year and country code'
      });
    }

    if (isNaN(year) || year < 2000 || year > 2030) {
      return res.status(400).json({
        error: 'Year must be a number between 2000 and 2030'
      });
    }

    // Create holidays instance for specific country
    const hd = new Holidays(country.toUpperCase());
    
    // Get holidays for the year
    const holidays = hd.getHolidays(parseInt(year));
    
    if (!holidays || holidays.length === 0) {
      return res.status(404).json({
        error: `No holidays found for ${country.toUpperCase()} in ${year}`,
        holidays: []
      });
    }

    // Format response to be compatible with frontend
    const formattedHolidays = holidays.map(holiday => {
      let dateStr;
      if (holiday.date instanceof Date) {
        dateStr = holiday.date.toISOString().split('T')[0];
      } else if (typeof holiday.date === 'string') {
        // If already string, extract only date part
        dateStr = holiday.date.split(' ')[0];
      } else {
        dateStr = new Date(holiday.date).toISOString().split('T')[0];
      }
      
      return {
        date: dateStr, // Format YYYY-MM-DD
        name: holiday.name,
        localName: holiday.name,
        countryCode: country.toUpperCase(),
        global: holiday.type === 'public' || holiday.type === 'bank' || !holiday.type,
        counties: holiday.substitute ? ['substitute'] : null,
        launchYear: null
      };
    });

    res.json(formattedHolidays);

  } catch (error) {
    console.error('Error getting holidays:', error);
    res.status(500).json({
      error: 'Internal server error getting holidays',
      message: error.message
    });
  }
});

// Get list of available countries
app.get('/api/countries', (req, res) => {
  try {
    // List of countries supported by date-holidays
    const supportedCountries = [
      { code: 'AD', name: 'Andorra', flag: '🇦🇩' },
      { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
      { code: 'AT', name: 'Austria', flag: '🇦🇹' },
      { code: 'AU', name: 'Australia', flag: '🇦🇺' },
      { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
      { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
      { code: 'CA', name: 'Canada', flag: '🇨🇦' },
      { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
      { code: 'CL', name: 'Chile', flag: '🇨🇱' },
      { code: 'CN', name: 'China', flag: '🇨🇳' },
      { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
      { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
      { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
      { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
      { code: 'DE', name: 'Germany', flag: '🇩🇪' },
      { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
      { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
      { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
      { code: 'ES', name: 'Spain', flag: '🇪🇸' },
      { code: 'FI', name: 'Finland', flag: '🇫🇮' },
      { code: 'FR', name: 'France', flag: '🇫🇷' },
      { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
      { code: 'GR', name: 'Greece', flag: '🇬🇷' },
      { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
      { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
      { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
      { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
      { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
      { code: 'IN', name: 'India', flag: '🇮🇳' },
      { code: 'IT', name: 'Italy', flag: '🇮🇹' },
      { code: 'JP', name: 'Japan', flag: '🇯🇵' },
      { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
      { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
      { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
      { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
      { code: 'NO', name: 'Norway', flag: '🇳🇴' },
      { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
      { code: 'PA', name: 'Panama', flag: '🇵🇦' },
      { code: 'PE', name: 'Peru', flag: '🇵🇪' },
      { code: 'PL', name: 'Poland', flag: '🇵🇱' },
      { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
      { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
      { code: 'RO', name: 'Romania', flag: '🇷🇴' },
      { code: 'RU', name: 'Russia', flag: '🇷🇺' },
      { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
      { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
      { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
      { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
      { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
      { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
      { code: 'US', name: 'United States', flag: '🇺🇸' },
      { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
      { code: 'VE', name: 'Venezuela', flag: '🇻🇪' }
    ];

    res.json(supportedCountries);
  } catch (error) {
    console.error('Error getting country list:', error);
    res.status(500).json({
      error: 'Internal server error getting countries',
      message: error.message
    });
  }
});

// Middleware for handling not found routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist on this server`
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 API available at: http://localhost:${PORT}/api`);
  console.log(`🔍 Server health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
