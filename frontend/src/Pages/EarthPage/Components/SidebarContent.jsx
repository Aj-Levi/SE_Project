// src/Pages/EarthPage/Components/SidebarContent.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export function SidebarContent({ selectedCountry, date }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedCountry || !date) return;

    const fetchCountryEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const isoDate = new Date(date).toISOString();

        const response = await fetch(
          `
          ${baseURL}/api/events/by-date?country=${encodeURIComponent(
            selectedCountry
          )}&date=${encodeURIComponent(isoDate)}`
        );

        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();

        const formatted = data.map((event) => ({
          id: event._id, // <-- include the DB id
          eventName: event.coreInfo?.eventName || event.title || "Untitled Event",
          startingDate: event.coreInfo?.startingDate
            ? new Date(event.coreInfo.startingDate).toLocaleDateString("en-GB")
            : "N/A",
          endingDate: event.coreInfo?.endDate
            ? new Date(event.coreInfo.endDate).toLocaleDateString("en-GB")
            : "N/A",
          eventDescription:
            event.summary?.length > 150
              ? event.summary.slice(0, 150) + "..."
              : event.summary || "No summary available.",
          eventTags: event.coreInfo?.eventTags || [],
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryEvents();
  }, [selectedCountry, date]);

  const handleEventClick = (event) => {
    navigate(`/event/${encodeURIComponent(event.id)}`);
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="sidebar-content-container">
      <h2 className="sidebar-title">{selectedCountry}</h2>
      {!events.length ? (
        <p>No events found on this date for {selectedCountry}.</p>
      ) : (
        <ul className="event-list">
          {events.map((event, index) => (
            <li key={event.id || index} className="event-item">
              <div className="event-link" onClick={() => handleEventClick(event)} role="button" tabIndex={0}>
                <h3 className="event-title">{event.eventName}</h3>
                <div className="event-dates">
                  {event.startingDate} – {event.endingDate}
                </div>
                <p className="event-description">{event.eventDescription}</p>
                <div className="event-tags">
                  {event.eventTags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="event-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
