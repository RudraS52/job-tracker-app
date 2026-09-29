// src/components/JobSearch.js
import React, { useState, useEffect } from 'react';
import './JobSearch.css';

const JobSearch = ({ addJob }) => { 
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [remoteFilter, setRemoteFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');

  const [trackedJobIds, setTrackedJobIds] = useState([]);
  const [trackingLoadingIds, setTrackingLoadingIds] = useState([]);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteJobs');
    return saved ? JSON.parse(saved) : [];
  });

  // =======================================================================
  // 🌐 FETCH ENGINE: Pulls live listings through an unblocked CORS proxy
  // =======================================================================
  useEffect(() => {
    const fetchDirectLiveJobs = async () => {
      setLoading(true);
      try {
        const targetUrl = 'https://allorigins.win' + encodeURIComponent('https://arbeitnow.com');
        const response = await fetch(targetUrl);

        if (!response.ok) {
          throw new Error(`Server status: ${response.status}`);
        }

        const wrapperData = await response.json();
        const actualData = JSON.parse(wrapperData.contents);
        const rawWebJobs = Array.isArray(actualData.data) ? actualData.data : [];
        
        const mappedLiveDataset = rawWebJobs.map(webJob => ({
          id: webJob.slug || Math.random().toString(),
          title: webJob.title || 'Software Engineer',
          company: webJob.company_name || 'Tech Corporation',
          location: webJob.location || 'Remote (Global)',
          remote: webJob.remote ? 'remote' : 'on_site',
          apply_url: webJob.url || 'https://arbeitnow.com',
          posted_at: webJob.created_at ? new Date(webJob.created_at * 1000).toISOString() : new Date().toISOString()
        }));

        initializeJobDataset(mappedLiveDataset);

      } catch (error) {
        console.warn('Network handshake interrupted. Launching fallback dataset baseline...', error);
        
        const premiumIndianFallbackJobs = [
          { id: 'fb-1', title: 'React Frontend Developer', company: 'Tata Consultancy Services (TCS)', location: 'Mumbai', remote: 'hybrid', apply_url: 'https://tcs.com', posted_at: new Date().toISOString() },
          { id: 'fb-2', title: 'Software Engineer - UI', company: 'Infosys', location: 'Bengaluru', remote: 'remote', apply_url: 'https://infosys.com', posted_at: new Date().toISOString() },
          { id: 'fb-3', title: 'Full Stack Engineer (React/Node)', company: 'Wipro', location: 'Hyderabad', remote: 'on_site', apply_url: 'https://wipro.com', posted_at: new Date(Date.now() - 86400000).toISOString() },
          { id: 'fb-4', title: 'MERN Stack Developer', company: 'HCLTech', location: 'Delhi NCR', remote: 'remote', apply_url: 'https://hcltech.com', posted_at: new Date(Date.now() - 172800000).toISOString() }
        ];
        initializeJobDataset(premiumIndianFallbackJobs);
      } finally {
        setLoading(false);
      }
    };

    const initializeJobDataset = (jobsArray) => {
      setAllJobs(jobsArray);
      setResults(jobsArray);

      const uniqueLocations = new Set();
      jobsArray.forEach((job) => {
        if (job.location) {
          uniqueLocations.add(job.location.trim());
        }
      });
      setLocations(Array.from(uniqueLocations).sort());
    };

    fetchDirectLiveJobs();
  }, []);

  const handleSearchJobs = () => {
    const searchWords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let filtered = [...allJobs];

    if (selectedLocation) {
      filtered = filtered.filter((job) =>
        (job.location || '').toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (remoteFilter === 'remote') {
      filtered = filtered.filter((job) => job.remote?.toLowerCase() === 'remote');
    }
    if (remoteFilter === 'onsite') {
      filtered = filtered.filter((job) => job.remote?.toLowerCase() === 'on_site' || job.remote?.toLowerCase() === 'onsite');
    }
    if (remoteFilter === 'hybrid') {
      filtered = filtered.filter((job) => job.remote?.toLowerCase() === 'hybrid');
    }

    if (searchWords.length > 0) {
      filtered = filtered.filter((job) => {
        const title = (job.title || '').toLowerCase();
        const company = (job.company || '').toLowerCase();
        return searchWords.some((word) => title.includes(word) || company.includes(word));
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.posted_at).getTime();
      const dateB = new Date(b.posted_at).getTime();
      return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });

    setResults(filtered);
  };

  const toggleFavorite = (job) => {
    const isFav = favorites.some((favorite) => favorite.id === job.id);
    const updated = isFav
      ? favorites.filter((favorite) => favorite.id !== job.id)
      : [...favorites, job];

    setFavorites(updated);
    localStorage.setItem('favoriteJobs', JSON.stringify(updated));
  };

  const handleOneClickTrack = async (job) => {
    if (trackingLoadingIds.includes(job.id) || trackedJobIds.includes(job.id)) return;
    setTrackingLoadingIds((prev) => [...prev, job.id]);

    try {
      const jobDataPayload = {
        company: job.company || 'Unknown Company',
        position: job.title || 'Software Engineer',
        status: 'Wishlist',
        notes: `Discovered via Live Job Search. Not yet applied. Link: ${job.apply_url || 'N/A'}`
      };

      await addJob(jobDataPayload);
      setTrackedJobIds((prev) => [...prev, job.id]);
    } catch (error) {
      console.error("1-Click save aborted:", error);
    } finally {
      setTrackingLoadingIds((prev) => prev.filter((id) => id !== job.id));
    }
  };
  
  return (
    <div className="job-search">
      <h2>Live Job Search</h2>

      <div className="filters">
        <select id="location-select" name="location" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          <option value="">All Locations</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>{location}</option>
          ))}
        </select>

        <select id="work-mode-select" name="work-mode" value={remoteFilter} onChange={(e) => setRemoteFilter(e.target.value)}>
          <option value="">All Work Modes</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">Onsite</option>
        </select>

        <select id="sort-order-select" name="sort-order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="recent">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="search-bar">
        <input
          id="job-search-input"
          name="job-search"
          type="text"
          placeholder="Search jobs by title or company..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearchJobs}>Search</button>
      </div>

      {loading && <p className="search-loading">Loading live opportunities...</p>}

      <div className="job-results">
        {!loading && results.length === 0 ? (
          <p className="no-results">No jobs found. Try adjusting your query parameters!</p>
        ) : (
          results.map((job) => {
            const isTracked = trackedJobIds.includes(job.id);
            const isTrackingLoading = trackingLoadingIds.includes(job.id);

            return (
              <div key={job.id} className="job-card">
                <h3>{job.title || 'Untitled Job'}</h3>
                <p><strong>Company:</strong> {job.company || 'N/A'}</p>
                <p><strong>Location:</strong> {job.location || 'N/A'}</p>
                
                {/* ⚡ FIXED: Properly wrapped template query string brackets */}
                <p>
                  <strong>Work Mode:</strong>{' '}
                  {job.remote 
                    ? job.remote.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
                    : 'Not specified'}
                </p>

                <div className="search-card-actions">
                  <a href={job.apply_url} target="_blank" rel="noreferrer" className="view-job-link">
                    View Job
                  </a>

                  <button
                    onClick={() => handleOneClickTrack(job)}
                    disabled={isTracked || isTrackingLoading}
                    className={`track-action-btn ${isTracked ? 'is-tracked' : ''} ${isTrackingLoading ? 'is-loading' : ''}`}
                  >
                    {isTrackingLoading ? 'Saving...' : isTracked ? '✓ Tracked' : '+ Track Job'}
                  </button>

                  <button onClick={() => toggleFavorite(job)} className="save-button">
                    {favorites.some((favorite) => favorite.id === job.id) ? '★ Saved' : '☆ Save'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobSearch;
