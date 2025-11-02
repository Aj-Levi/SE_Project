


export function SidebarContent({ selectedCountry, events, onEventClick }) {
    if (!events || events.length === 0) {
        return (
            <div className="sidebar-content-container">
                <h2 className="sidebar-title">{selectedCountry}</h2>
                <p className="event-description">No historical events found for this day.</p>
            </div>
        );
    }

    return (
        <div className="sidebar-content-container">
            <h2 className="sidebar-title">{selectedCountry}</h2>
            <ul className="event-list">
                {events.map((event, index) => (
                    <li key={index} className="event-item">
                        {/* The onClick handler is passed up to the parent */}
                        <div className="event-link" onClick={() => onEventClick(event)}>
                            <h3 className="event-title">{event.eventName}</h3>
                            <div className="event-dates">
                                {event.startingDate} – {event.endingDate}
                            </div>
                            <p className="event-description">{event.eventDescription}</p>
                            <div className="event-tags">
                                {event.eventTags.map((tag, tagIndex) => (
                                    <span key={tagIndex} className="event-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
