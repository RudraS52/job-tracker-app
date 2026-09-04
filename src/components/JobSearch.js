import React, { useState, useEffect } from 'react';
import './JobSearch.css';

const JobSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [remoteFilter, setRemoteFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('recent');

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteJobs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          'https://api.jobopportunitiesapi.org/public/jobs?country=IN&limit=50'
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        const jobs = Array.isArray(data.data)
          ? data.data
          : [];

        setAllJobs(jobs);
        setResults(jobs);

        const uniqueLocations = new Set();

        jobs.forEach((job) => {
          if (job.location) {
            uniqueLocations.add(job.location.trim());
          }
        });

        setLocations(
          Array.from(uniqueLocations).sort()
        );

      } catch (error) {
        console.error('Error fetching jobs:', error);
        setAllJobs([]);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearchJobs = () => {
    const searchWords = query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    let filtered = [...allJobs];

    // LOCATION FILTER
    if (selectedLocation) {
      filtered = filtered.filter((job) =>
        (job.location || '')
          .toLowerCase()
          .includes(selectedLocation.toLowerCase())
      );
    }

    // WORK MODE FILTER
    if (remoteFilter === 'remote') {
      filtered = filtered.filter(
        (job) => job.remote?.toLowerCase() === 'remote'
      );
    }

    if (remoteFilter === 'onsite') {
      filtered = filtered.filter(
        (job) => job.remote?.toLowerCase() === 'on_site'
      );
    }

    if (remoteFilter === 'hybrid') {
      filtered = filtered.filter(
        (job) => job.remote?.toLowerCase() === 'hybrid'
      );
    }

    // TITLE / COMPANY SEARCH
    if (searchWords.length > 0) {
      filtered = filtered.filter((job) => {

        const title = (job.title || '').toLowerCase();
        const company = (job.company || '').toLowerCase();

        return searchWords.some((word) =>
          title.includes(word) ||
          company.includes(word)
        );
      });
    }

    // SORTING
    filtered.sort((a, b) => {
      const dateA = new Date(a.posted_at).getTime();
      const dateB = new Date(b.posted_at).getTime();

      return sortOrder === 'recent'
        ? dateB - dateA
        : dateA - dateB;
    });

    setResults(filtered);
  };

  const toggleFavorite = (job) => {
    const isFav = favorites.some(
      (favorite) => favorite.id === job.id
    );

    const updated = isFav
      ? favorites.filter(
          (favorite) => favorite.id !== job.id
        )
      : [...favorites, job];

    setFavorites(updated);

    localStorage.setItem(
      'favoriteJobs',
      JSON.stringify(updated)
    );
  };

  return (
    <div className="job-search">

      <h2>Live India Job Search</h2>

      <div className="filters">

        <select
          id="location-select"
          name="location"
          value={selectedLocation}
          onChange={(e) =>
            setSelectedLocation(e.target.value)
          }
        >
          <option value="">All Locations</option>

          {locations.map((location, index) => (
            <option
              key={index}
              value={location}
            >
              {location}
            </option>
          ))}
        </select>

        <select
          id="work-mode-select"
          name="work-mode"
          value={remoteFilter}
          onChange={(e) =>
            setRemoteFilter(e.target.value)
          }
        >
          <option value="">All Work Modes</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">Onsite</option>
        </select>

        <select
          id="sort-order-select"
          name="sort-order"
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value)
          }
        >
          <option value="recent">
            Newest First
          </option>

          <option value="oldest">
            Oldest First
          </option>
        </select>

      </div>

      <div className="search-bar">

        <input
          id="job-search"
          name="job-search"
          type="text"
          placeholder="Search jobs by title or company..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
        />

        <button onClick={handleSearchJobs}>
          Search
        </button>

      </div>

      {loading && (
        <p>Loading Indian jobs...</p>
      )}

      <div className="job-results">

        {!loading && results.length === 0 ? (
          <p>
            No jobs found. Try another search!
          </p>
        ) : (

          results.map((job) => (

            <div
              key={job.id}
              className="job-card"
            >

              <h3>
                {job.title || 'Untitled Job'}
              </h3>

              <p>
                <strong>Company:</strong>{' '}
                {job.company || 'N/A'}
              </p>

              <p>
                <strong>Location:</strong>{' '}
                {job.location || 'N/A'}
              </p>

              <p>
                <strong>Work Mode:</strong>{' '}
                {job.remote || 'N/A'}
              </p>

              <a
                href={job.apply_url}
                target="_blank"
                rel="noreferrer"
              >
                View Job
              </a>

              <button
                onClick={() =>
                  toggleFavorite(job)
                }
                className="save-button"
              >
                {favorites.some(
                  (favorite) =>
                    favorite.id === job.id
                )
                  ? '★ Saved'
                  : '☆ Save'}
              </button>

            </div>

          ))
        )}

      </div>

    </div>
  );
};

export default JobSearch;