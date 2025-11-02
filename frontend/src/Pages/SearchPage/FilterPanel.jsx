import { useRef, useState, useEffect } from "react";

export const FilterPanel = ({
    localStartDate, setLocalStartDate,
    localEndDate, setLocalEndDate,
    localTags, setLocalTags,
    localCountries, setLocalCountries,
    onClose,
    allAvailableTags, // New prop
    allAvailableCountries // New prop
}) => {
    
    const panelRef = useRef(null);
    const [tagInput, setTagInput] = useState("");
    const [countryInput, setCountryInput] = useState("");

    const [filteredTags, setFilteredTags] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);

    // Hook to handle clicks outside the panel
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                // Check if the click target is the filter button itself
                const filterButton = document.querySelector('.filter-button');
                if (filterButton && !filterButton.contains(event.target)) {
                    onClose();
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, panelRef]);

    // [MODIFIED] Helper to add tags/countries on Enter key
    const handleInputKeyDown = (e) => {
        // Prevent submitting form on Enter
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    // [NEW] Handle Tag search input change
    const handleTagInputChange = (e) => {
        const value = e.target.value;
        setTagInput(value);
        if (value.trim().length > 0) {
            setFilteredTags(
                allAvailableTags.filter(tag =>
                    tag.toLowerCase().includes(value.toLowerCase()) && !localTags.includes(tag)
                )
            );
        } else {
            setFilteredTags([]);
        }
    };

    // [NEW] Handle Country search input change
    const handleCountryInputChange = (e) => {
        const value = e.target.value;
        setCountryInput(value);
        if (value.trim().length > 0) {
            setFilteredCountries(
                allAvailableCountries.filter(country =>
                    country.toLowerCase().includes(value.toLowerCase()) && !localCountries.includes(country)
                )
            );
        } else {
            setFilteredCountries([]);
        }
    };

    // [NEW] Handle selecting a tag from suggestions
    const handleTagSelect = (tag) => {
        if (!localTags.includes(tag)) {
            setLocalTags([...localTags, tag]);
        }
        setTagInput("");
        setFilteredTags([]);
    };

    // [NEW] Handle selecting a country from suggestions
    const handleCountrySelect = (country) => {
        if (!localCountries.includes(country)) {
            setLocalCountries([...localCountries, country]);
        }
        setCountryInput("");
        setFilteredCountries([]);
    };

    // Helper to remove tags/countries
    const removeItem = (item, type) => {
        if (type === 'tag') {
            setLocalTags(localTags.filter(t => t !== item));
        } else if (type === 'country') {
            setLocalCountries(localCountries.filter(c => c !== item));
        }
    };

    return (
        <div className="filter-panel-container" ref={panelRef}>
            <div className="filter-panel-header">
                <h2 className="filter-panel-title">Filter Options</h2>
                <button className="filter-close-btn" onClick={onClose} title="Close panel">&times;</button>
            </div>

            {/* Date Range Section */}
            <div className="filter-section">
                <h3>Date Range</h3>
                <div className="filter-date-inputs">
                    <div>
                        <input
                            type="text"
                            className="filter-input"
                            placeholder="Start Date (dd-mm-yyyy)"
                            value={localStartDate}
                            onChange={(e) => setLocalStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            className="filter-input"
                            placeholder="End Date (dd-mm-yyyy)"
                            value={localEndDate}
                            onChange={(e) => setLocalEndDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* [MODIFIED] Tags Section */}
            <div className="filter-section">
                <h3>Tags</h3>
                <div className="searchable-input-wrapper">
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Search and select a tag..."
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={handleInputKeyDown}
                    />
                    {filteredTags.length > 0 && (
                        <ul className="suggestions-list">
                            {filteredTags.map(tag => (
                                <li
                                    key={tag}
                                    className="suggestion-item"
                                    onClick={() => handleTagSelect(tag)}
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <ul className="selected-items-container">
                    {localTags.map(tag => (
                        <li key={tag} className="selected-item-pill">
                            {tag}
                            <button className="remove-item-btn" onClick={() => removeItem(tag, 'tag')} title="Remove tag">&times;</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* [MODIFIED] Countries Section */}
            <div className="filter-section">
                <h3>Countries</h3>
                <div className="searchable-input-wrapper">
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Search and select a country..."
                        value={countryInput}
                        onChange={handleCountryInputChange}
                        onKeyDown={handleInputKeyDown}
                    />
                    {filteredCountries.length > 0 && (
                        <ul className="suggestions-list">
                            {filteredCountries.map(country => (
                                <li
                                    key={country}
                                    className="suggestion-item"
                                    onClick={() => handleCountrySelect(country)}
                                >
                                    {country}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <ul className="selected-items-container">
                    {localCountries.map(country => (
                        <li key={country} className="selected-item-pill">
                            {country}
                            <button className="remove-item-btn" onClick={() => removeItem(country, 'country')} title="Remove country">&times;</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
