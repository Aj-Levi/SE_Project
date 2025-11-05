import { useRef, useState, useEffect } from "react";

export const FilterPanel = ({
    localStartDate, setLocalStartDate,
    localEndDate, setLocalEndDate,
    localTags, setLocalTags,
    localCountries, setLocalCountries,
    onClose,
    allAvailableTags,
    allAvailableCountries
}) => {
    const panelRef = useRef(null);
    const [tagInput, setTagInput] = useState("");
    const [countryInput, setCountryInput] = useState("");
    const [filteredTags, setFilteredTags] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                const filterButton = document.querySelector('.filter-button');
                if (filterButton && !filterButton.contains(event.target)) onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') e.preventDefault();
    };

    const handleTagInputChange = (e) => {
        const value = e.target.value;
        setTagInput(value);
        setFilteredTags(
            value.trim().length > 0
                ? allAvailableTags.filter(tag =>
                    tag.toLowerCase().includes(value.toLowerCase()) && !localTags.includes(tag)
                )
                : []
        );
    };

    const handleCountryInputChange = (e) => {
        const value = e.target.value;
        setCountryInput(value);
        setFilteredCountries(
            value.trim().length > 0
                ? allAvailableCountries.filter(country =>
                    country.toLowerCase().includes(value.toLowerCase()) && !localCountries.includes(country)
                )
                : []
        );
    };

    const handleTagSelect = (tag) => {
        if (!localTags.includes(tag)) setLocalTags([...localTags, tag]);
        setTagInput("");
        setFilteredTags([]);
    };

    const handleCountrySelect = (country) => {
        if (!localCountries.includes(country)) setLocalCountries([...localCountries, country]);
        setCountryInput("");
        setFilteredCountries([]);
    };

    const removeItem = (item, type) => {
        if (type === 'tag') setLocalTags(localTags.filter(t => t !== item));
        if (type === 'country') setLocalCountries(localCountries.filter(c => c !== item));
    };

    return (
        <div className="filter-panel-container" ref={panelRef}>
            <div className="filter-panel-header">
                <h2 className="filter-panel-title">Filter Options</h2>
                <button className="filter-close-btn" onClick={onClose}>&times;</button>
            </div>

            {/* Date Range Section */}
            <div className="filter-section">
                <h3>Date Range</h3>
                <div className="filter-date-inputs">
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Start Date (DD-MM-YYYY)"
                        value={localStartDate}
                        onChange={(e) => setLocalStartDate(e.target.value)}
                    />
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="End Date (DD-MM-YYYY)"
                        value={localEndDate}
                        onChange={(e) => setLocalEndDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Tags */}
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
                                <li key={tag} className="suggestion-item" onClick={() => handleTagSelect(tag)}>
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
                            <button className="remove-item-btn" onClick={() => removeItem(tag, 'tag')}>&times;</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Countries */}
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
                                <li key={country} className="suggestion-item" onClick={() => handleCountrySelect(country)}>
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
                            <button className="remove-item-btn" onClick={() => removeItem(country, 'country')}>&times;</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
