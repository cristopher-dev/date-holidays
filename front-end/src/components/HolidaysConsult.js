import React, { useState, useEffect } from 'react';
import holidaysService from '../services/holidaysService';

const HolidaysConsult = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [countries, setCountries] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Load countries and check backend status on mount
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Check backend health
        const healthStatus = await holidaysService.checkHealth();
        setBackendStatus(healthStatus.status === 'OK' ? 'online' : 'offline');

        // Load country list
        const countriesData = await holidaysService.getCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Error initializing component:', error);
        setBackendStatus('offline');
        // Use default countries if it fails
        setCountries(holidaysService.getDefaultCountries());
      }
    };

    initializeComponent();
  }, []);

  // Generate available years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear - 2 + i);

  const fetchHolidays = async (countryCode, year) => {
    if (!countryCode) return;

    setLoading(true);
    setError(null);

    try {
      const data = await holidaysService.getHolidaysWithFallback(countryCode, year);
      setHolidays(data);
    } catch (err) {
      setError('Error loading holidays. Try another country or year.');
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCountry) {
      fetchHolidays(selectedCountry, selectedYear);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMonthName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'long' });
  };

  // Group holidays by month
  const holidaysByMonth = holidays.reduce((acc, holiday) => {
    const month = getMonthName(holiday.date);
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(holiday);
    return acc;
  }, {});

  const selectedCountryInfo = countries.find((country) => country.code === selectedCountry);

  return (
    <div className='container py-4'>
      {/* Header */}
      <div className='row justify-content-center mb-5'>
        <div className='col-lg-8 text-center'>
          <div className='mb-4'>
            <i className='bi bi-globe-americas text-primary' style={{ fontSize: '4rem' }}></i>
          </div>
          <h1 className='display-5 fw-bold text-dark mb-3'>Worldwide Holiday Inquiry</h1>
          <p className='lead text-muted'>
            Select any country and year to check its official holidays
          </p>
        </div>
      </div>

      {/* Form */}
      <div className='row justify-content-center mb-4'>
        <div className='col-lg-8'>
          <div className='card shadow-sm border-0'>
            <div className='card-body p-4'>
              <form onSubmit={handleSubmit}>
                <div className='row g-3'>
                  <div className='col-md-6'>
                    <label htmlFor='country' className='form-label fw-semibold'>
                      <i className='bi bi-geo-alt-fill me-2 text-primary'></i>
                      Select a Country
                    </label>
                    <select
                      id='country'
                      className='form-select form-select-lg'
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      required
                    >
                      <option value=''>-- Select a country --</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='col-md-4'>
                    <label htmlFor='year' className='form-label fw-semibold'>
                      <i className='bi bi-calendar3 me-2 text-primary'></i>
                      Year
                    </label>
                    <select
                      id='year'
                      className='form-select form-select-lg'
                      value={selectedYear}
                      onChange={handleYearChange}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='col-md-2 d-flex align-items-end'>
                    <button
                      type='submit'
                      className='btn btn-primary btn-lg w-100'
                      disabled={!selectedCountry || loading}
                    >
                      {loading ? (
                        <div className='spinner-border spinner-border-sm' role='status'>
                          <span className='visually-hidden'>Loading...</span>
                        </div>
                      ) : (
                        <i className='bi bi-search'></i>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {selectedCountryInfo && holidays.length > 0 && (
        <div className='row justify-content-center'>
          <div className='col-lg-10'>
            <div className='card shadow-sm border-0'>
              <div className='card-header bg-primary text-white p-4'>
                <div className='d-flex align-items-center justify-content-between'>
                  <div>
                    <h3 className='mb-1'>
                      <span className='me-3' style={{ fontSize: '2rem' }}>
                        {selectedCountryInfo.flag}
                      </span>
                      Holidays in {selectedCountryInfo.name}
                    </h3>
                    <p className='mb-0 opacity-75'>
                      Year {selectedYear} • {holidays.length} holidays
                    </p>
                  </div>
                  <div className='text-end'>
                    <span className='badge bg-light text-primary fs-6 px-3 py-2'>
                      {holidays.length} holidays
                    </span>
                  </div>
                </div>
              </div>
              <div className='card-body p-0'>
                {Object.entries(holidaysByMonth).map(([month, monthHolidays]) => (
                  <div key={month} className='border-bottom'>
                    <div className='bg-light px-4 py-2'>
                      <h5 className='mb-0 text-capitalize fw-bold text-primary'>
                        <i className='bi bi-calendar-month me-2'></i>
                        {month}
                      </h5>
                    </div>
                    <div className='p-4'>
                      <div className='row g-3'>
                        {monthHolidays.map((holiday, index) => (
                          <div key={index} className='col-md-6'>
                            <div className='d-flex align-items-start'>
                              <div className='flex-shrink-0 me-3'>
                                <div
                                  className='bg-primary text-white rounded-circle d-flex align-items-center justify-content-center'
                                  style={{ width: '40px', height: '40px' }}
                                >
                                  <i className='bi bi-calendar-heart'></i>
                                </div>
                              </div>
                              <div className='flex-grow-1'>
                                <h6 className='mb-1 fw-bold'>{holiday.name}</h6>
                                <p className='mb-1 text-muted small'>{formatDate(holiday.date)}</p>
                                {holiday.global && (
                                  <span className='badge bg-success rounded-pill'>
                                    <i className='bi bi-globe me-1'></i>
                                    National
                                  </span>
                                )}
                                {holiday.counties && (
                                  <span className='badge bg-info rounded-pill ms-1'>
                                    <i className='bi bi-geo me-1'></i>
                                    Regional
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className='row justify-content-center'>
          <div className='col-lg-8'>
            <div className='alert alert-danger d-flex align-items-center' role='alert'>
              <i className='bi bi-exclamation-triangle-fill me-2'></i>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedCountry && !loading && holidays.length === 0 && !error && (
        <div className='row justify-content-center'>
          <div className='col-lg-8 text-center'>
            <div className='py-5'>
              <i className='bi bi-calendar-x text-muted mb-3' style={{ fontSize: '4rem' }}></i>
              <h4 className='text-muted'>No holidays found</h4>
              <p className='text-muted'>
                No information available for {selectedCountryInfo?.name} in the year{' '}
                {selectedYear}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidaysConsult;
