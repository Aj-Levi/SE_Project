import { useEffect, useState, useMemo, useRef } from "react";
import "./SearchPage.css";
import { useSearchParams } from 'react-router-dom';
import { FilterPanel } from "./FilterPanel";



const SearchPageContent = ({ searchResults, onResultClick }) => {

  const [searchParams, setSearchParams] = useSearchParams();

  const allAvailableTags = ["Independence", "Political", "Protest", "War", "Uprising", "Colonial", "Revolution", "Geopolitical", "Legal", "Government", "Restoration", "Social"];
  const allAvailableCountries = ["India", "France", "Japan", "USA", "UK", "Germany", "China", "Russia", "Brazil", "South Africa"];

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [localQuery, setLocalQuery] = useState("");
  const [localCountries, setLocalCountries] = useState([]);
  const [localTags, setLocalTags] = useState([]);
  const [localStartDate, setLocalStartDate] = useState("");
  const [localEndDate, setLocalEndDate] = useState("");

  const parsedParams = useMemo(() => {
    // Get raw values
    const query = searchParams.get('query') || '';
    const countriesStr = searchParams.get('countries') || '';
    const tagsStr = searchParams.get('tags') || '';
    const startingDate = searchParams.get('startingDate') || '';
    const endingDate = searchParams.get('endingDate') || '';


    setLocalQuery(query);
    setLocalStartDate(startingDate);
    setLocalEndDate(endingDate);
    setLocalCountries(countriesStr ? countriesStr.split(',') : []);
    setLocalTags(tagsStr ? tagsStr.split(',') : []);
    // Return parsed values
    return {
      query,
      countries: countriesStr ? countriesStr.split(',') : [],
      tags: tagsStr ? tagsStr.split(',') : [],
      startingDate,
      endingDate,
    };
  }, [searchParams]);


  // We use useMemo to create a "parsed" version of the search params.
  // This object will be our "single source of truth" from the URL.



  const handleSearchSubmit = (e) => {

    e.preventDefault();

    const newParams = {};

    if (localQuery) {
      newParams.query = localQuery;
    }
    if (localCountries.length > 0) {
      newParams.countries = localCountries.join(',');
    }
    if (localTags.length > 0) {
      newParams.tags = localTags.join(',');
    }
    if (localStartDate) {
      newParams.startingDate = localStartDate;
    }
    if (localEndDate) {
      newParams.endingDate = localEndDate;
    }

    setSearchParams(newParams);
  };


  const handleFilterToggle = (forceState) => {
    console.log(typeof true)
    if (typeof forceState === 'boolean') {
      setIsFilterOpen(forceState);
    } else {
      setIsFilterOpen(!isFilterOpen);
    }
  };

  return (
    <main className="search-page-main">
      <h1 className="search-header">Search results</h1>

      {/* Search Form */}
      <form className="search-form-container" onSubmit={handleSearchSubmit}>
        <input
          type="search"
          className="search-input"
          placeholder="Search TimeVault..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
        <button type="button" className="filter-button" onClick={handleFilterToggle}>
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
            onClose={() => handleFilterToggle(false)} // Pass a function to close
            allAvailableTags={allAvailableTags} // Pass down
            allAvailableCountries={allAvailableCountries} // Pass down
          />
        )}
      </form>

      {/* Results List */}
      <ul className="search-results-list">
        {searchResults.map((event, index) => (
          <li key={index} className="search-result-item">
            <div className="result-link" onClick={() => onResultClick(event)}>
              <h2 className="result-title">{event.eventName}</h2>
              <div className="result-meta">
                <span className="result-meta-country">{event.country}</span> | {event.startingDate} – {event.endingDate}
              </div>
              <p className="result-description">{event.eventDescription}</p>
              <div className="result-tags">
                {event.eventTags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="result-tag">{tag}</span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

/**
 * This is the main App component for demonstration.
 * You can remove this and export SearchPageContent as the default.
 */
export function SearchPage() {
  // Temporary state for demonstration
  const [results] = useState([
    {
      eventName: "Quit India Movement Launch",
      startingDate: "8 Aug 1942",
      endingDate: "8 Aug 1942",
      eventDescription: "Mahatma Gandhi launched the Quit India Movement at the Bombay session of the All-India Congress Committee, demanding an end to British rule.",
      country: "India",
      eventTags: ["Independence", "Political", "Protest"]
    },
    {
      eventName: "Storming of the Bastille",
      startingDate: "14 Jul 1789",
      endingDate: "14 Jul 1789",
      eventDescription: "A pivotal event in the French Revolution, the medieval fortress, armory, and political prison known as the Bastille was stormed by a crowd.",
      country: "France",
      eventTags: ["Revolution", "War", "Geopolitical"]
    },
    {
      eventName: "Meiji Restoration",
      startingDate: "3 Jan 1868",
      endingDate: "27 Jul 1912",
      eventDescription: "A political event that restored practical imperial rule to Japan in 1868 under Emperor Meiji, leading to enormous changes in Japan's political and social structure.",
      country: "Japan",
      eventTags: ["Political", "Restoration", "Government"]
    }
  ]);

  // Dummy functions for the handlers
  const handleResultClick = (event) => {
    console.log("Loading event page for:", event.eventName);
    // You would navigate to the event page here
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // You would trigger your database search here
  };


  return (
    <>
      <SearchPageContent
        searchResults={results}
        onResultClick={handleResultClick}
      />
    </>
  );
}
