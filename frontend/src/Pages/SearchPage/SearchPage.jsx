import { useEffect, useState, useMemo } from "react";
import "./SearchPage.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FilterPanel } from "./FilterPanel";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// --- Helpers for DD-MM-YYYY date format ---
function formatToDDMMYYYY(date) {
  if (!date) return "N/A";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function parseDDMMYYYY(str) {
  if (!str || !/^\d{2}-\d{2}-\d{4}$/.test(str)) return null;
  const [day, month, year] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate(); // ✅ navigation hook

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [allAvailableTags, setAllAvailableTags] = useState([]);
  const [allAvailableCountries, setAllAvailableCountries] = useState([]);

  const [localQuery, setLocalQuery] = useState("");
  const [localCountries, setLocalCountries] = useState([]);
  const [localTags, setLocalTags] = useState([]);
  const [localStartDate, setLocalStartDate] = useState("");
  const [localEndDate, setLocalEndDate] = useState("");

  // Fetch tags and countries once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsRes, countriesRes] = await Promise.all([
          fetch(`${baseURL}/api/events/tags`),
          fetch(`${baseURL}/api/events/countries`)
        ]);
        const [tags, countries] = await Promise.all([
          tagsRes.json(),
          countriesRes.json()
        ]);
        setAllAvailableTags(tags);
        setAllAvailableCountries(countries);
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };
    fetchData();
  }, []);

  // Parse URL parameters
  const parsedParams = useMemo(() => {
    const query = searchParams.get("query") || "";
    const countriesStr = searchParams.get("countries") || "";
    const tagsStr = searchParams.get("tags") || "";
    const startingDate = searchParams.get("startingDate") || "";
    const endingDate = searchParams.get("endingDate") || "";

    setLocalQuery(query);
    setLocalCountries(countriesStr ? countriesStr.split(",") : []);
    setLocalTags(tagsStr ? tagsStr.split(",") : []);
    setLocalStartDate(startingDate);
    setLocalEndDate(endingDate);

    return {
      query,
      countries: countriesStr ? countriesStr.split(",") : [],
      tags: tagsStr ? tagsStr.split(",") : [],
      startingDate,
      endingDate
    };
  }, [searchParams]);

  // Fetch events when user searches or filters
  useEffect(() => {
    const hasActiveFilters =
      parsedParams.query ||
      parsedParams.countries.length > 0 ||
      parsedParams.tags.length > 0 ||
      parsedParams.startingDate ||
      parsedParams.endingDate;

    if (!hasActiveFilters) return;

    const fetchEvents = async () => {
      setHasSearched(true);
      const params = new URLSearchParams();

      if (parsedParams.query) params.append("query", parsedParams.query);
      if (parsedParams.countries.length > 0)
        params.append("countries", parsedParams.countries.join(","));
      if (parsedParams.tags.length > 0)
        params.append("tags", parsedParams.tags.join(","));

      const start = parseDDMMYYYY(parsedParams.startingDate);
      const end = parseDDMMYYYY(parsedParams.endingDate);
      if (start && end) {
        params.append("startingDate", start.toISOString());
        params.append("endingDate", end.toISOString());
      }

      try {
        const res = await fetch(
          `${baseURL}/api/events/search?${params.toString()}`
        );
        const data = await res.json();

        const formatted = data.map((e) => ({
          id: e._id, // ✅ keep the MongoDB id
          eventName: e.coreInfo?.eventName || e.title || "Untitled Event",
          startingDate: e.coreInfo?.startingDate
            ? formatToDDMMYYYY(e.coreInfo.startingDate)
            : "N/A",
          endingDate: e.coreInfo?.endDate
            ? formatToDDMMYYYY(e.coreInfo.endDate)
            : "N/A",
          eventDescription:
            e.summary?.length > 100
              ? e.summary.slice(0, 100) + "..."
              : e.summary || "No summary",
          country: e.coreInfo?.country || "",
          eventTags: e.coreInfo?.eventTags || []
        }));

        setResults(formatted);
      } catch (err) {
        console.error("Error fetching events:", err);
        setResults([]);
      }
    };

    fetchEvents();
  }, [parsedParams]);

  // When user presses search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (localQuery) newParams.query = localQuery;
    if (localCountries.length > 0)
      newParams.countries = localCountries.join(",");
    if (localTags.length > 0) newParams.tags = localTags.join(",");
    if (localStartDate) newParams.startingDate = localStartDate;
    if (localEndDate) newParams.endingDate = localEndDate;

    setSearchParams(newParams);
  };

  const handleFilterToggle = (forceState) => {
    if (typeof forceState === "boolean") setIsFilterOpen(forceState);
    else setIsFilterOpen(!isFilterOpen);
  };

  // ✅ Navigate to event details when clicked
  const handleResultClick = (event) => {
    if (!event.id) {
      console.warn("No id found for event:", event);
      return;
    }
    navigate(`/event/${encodeURIComponent(event.id)}`);
  };

  return (
    <main className="search-page-main">
      <h1 className="search-header">Search results</h1>

      {/* Search Bar + Filter */}
      <form className="search-form-container" onSubmit={handleSearchSubmit}>
        <input
          type="search"
          className="search-input"
          placeholder="Search TimeVault..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
        <button
          type="button"
          className="filter-button"
          onClick={handleFilterToggle}
        >
          Filter
        </button>

        {isFilterOpen && (
          <FilterPanel
            localStartDate={localStartDate}
            setLocalStartDate={setLocalStartDate}
            localEndDate={localEndDate}
            setLocalEndDate={setLocalEndDate}
            localTags={localTags}
            setLocalTags={setLocalTags}
            localCountries={localCountries}
            setLocalCountries={setLocalCountries}
            onClose={() => handleFilterToggle(false)}
            allAvailableTags={allAvailableTags}
            allAvailableCountries={allAvailableCountries}
          />
        )}
      </form>

      {/* Conditional Rendering */}
      {!hasSearched ? (
        <p className="no-results-text">
          No data yet. Please search or apply filters.
        </p>
      ) : results.length === 0 ? (
        <p className="no-results-text">No matching events found.</p>
      ) : (
        <ul className="search-results-list">
          {results.map((event) => (
            <li key={event.id} className="search-result-item">
              <div
                className="result-link"
                onClick={() => handleResultClick(event)}
                role="button"
                tabIndex={0}
              >
                <h2 className="result-title">{event.eventName}</h2>
                <div className="result-meta">
                  <span className="result-meta-country">{event.country}</span>{" "}
                  | {event.startingDate} – {event.endingDate}
                </div>
                <p className="result-description">{event.eventDescription}</p>
                <div className="result-tags">
                  {event.eventTags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="result-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
