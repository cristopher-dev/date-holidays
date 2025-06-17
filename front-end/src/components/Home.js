import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 text-center">
          <div className="mb-4">
            <i className="bi bi-calendar-heart text-primary" style={{fontSize: '4rem'}}></i>
          </div>
          <h1 className="display-4 fw-bold text-dark mb-3">
            Holiday Lookup
          </h1>
          <p className="lead text-muted mb-4">
            Discover the official holidays of any country in the world
            to better plan your vacations and celebrations for 2025.
          </p>
        </div>
      </div>

      {/* Country Cards */}
      <div className="row justify-content-center g-4">
        <div className="col-md-8 col-lg-6">
          <div className="card h-100 shadow-sm border-0 country-card">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <i className="bi bi-globe-americas text-primary" style={{fontSize: '4rem'}}></i>
              </div>
              <h3 className="card-title h4 fw-bold text-dark mb-3">Any Country</h3>
              <p className="card-text text-muted mb-4">
                Look up holidays for any country in the world.
                Select the country and year of your interest.
              </p>
              <Link 
                to='/holidays' 
                className='btn btn-info btn-lg px-4 py-2 shadow-sm'
              >
                <i className="bi bi-search me-2"></i>
                Search
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="row mt-5 pt-4">
        <div className="col-12">
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="feature-icon mb-3">
                <i className="bi bi-calendar-date text-primary" style={{fontSize: '2.5rem'}}></i>
              </div>
              <h5 className="fw-bold">Updated Information</h5>
              <p className="text-muted small">
                Official and up-to-date holiday data for 2025.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-icon mb-3">
                <i className="bi bi-globe text-success" style={{fontSize: '2.5rem'}}></i>
              </div>
              <h5 className="fw-bold">Multiple Countries</h5>
              <p className="text-muted small">
                Look up holidays for over 100 countries worldwide.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-icon mb-3">
                <i className="bi bi-phone text-info" style={{fontSize: '2.5rem'}}></i>
              </div>
              <h5 className="fw-bold">Responsive</h5>
              <p className="text-muted small">
                Adaptable design for any device and screen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
