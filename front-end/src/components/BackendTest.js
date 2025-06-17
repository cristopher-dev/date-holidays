import React, { useState, useEffect } from 'react';
import holidaysService from '../services/holidaysService';

const BackendTest = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [countries, setCountries] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    testBackend();
  }, []);

  const testBackend = async () => {
    try {
      // Test backend health
      const health = await holidaysService.checkHealth();
      setHealthStatus(health);

      // Test fetching countries
      const countriesData = await holidaysService.getCountries();
      setCountries(countriesData);

    } catch (error) {
      console.error('Error testing backend:', error);
    }
  };

  const testHolidays = async () => {
    setLoading(true);
    try {
      const holidaysData = await holidaysService.getHolidaysWithFallback('ES', 2025);
      setHolidays(holidaysData);
    } catch (error) {
      console.error('Error testing holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Backend Test</h2>
      
      {/* Health Status */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Backend Status</h5>
        </div>
        <div className="card-body">
          {healthStatus ? (
            <div className={`alert ${healthStatus.status === 'OK' ? 'alert-success' : 'alert-danger'}`}>
              <strong>Status:</strong> {healthStatus.status}<br/>
              <strong>Message:</strong> {healthStatus.message}<br/>
              <strong>Timestamp:</strong> {healthStatus.timestamp}
            </div>
          ) : (
            <div className="alert alert-warning">Checking backend status...</div>
          )}
        </div>
      </div>

      {/* Countries */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Available Countries ({countries.length})</h5>
        </div>
        <div className="card-body">
          {countries.length > 0 ? (
            <div className="row">
              {countries.slice(0, 10).map(country => (
                <div key={country.code} className="col-md-6 mb-2">
                  <span className="badge bg-primary me-1">{country.flag}</span>
                  {country.name} ({country.code})
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">No countries available</div>
          )}
        </div>
      </div>

      {/* Test Holidays */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Holiday Test</h5>
        </div>
        <div className="card-body">
          <button 
            className="btn btn-primary mb-3" 
            onClick={testHolidays}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Test Spain Holidays 2025'}
          </button>
          
          {holidays.length > 0 && (
            <div>
              <h6>Results ({holidays.length} holidays):</h6>
              <div className="row">
                {holidays.slice(0, 6).map((holiday, index) => (
                  <div key={index} className="col-md-6 mb-2">
                    <div className="card">
                      <div className="card-body py-2">
                        <strong>{holiday.name}</strong><br/>
                        <small className="text-muted">{holiday.date}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackendTest;
