







const formatEventDate = (startDateStr, endDateStr) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  const formatSingleDate = (dateStr) => {
    if (!dateStr) return "";
    // Split 'dd-mm-yyyy'
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr; // Fallback

    const day = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(monthIndex) || isNaN(year)) return dateStr;

    return `${day} ${months[monthIndex]} ${year}`;
  };

  const formattedStartDate = formatSingleDate(startDateStr);

  // If start and end dates are the same, just show one date
  if (startDateStr === endDateStr) {
    return formattedStartDate;
  }

  // Otherwise, show the range
  const formattedEndDate = formatSingleDate(endDateStr);
  return `${formattedStartDate} to ${formattedEndDate}`;
};

export function ArticleHeader({ eventData }) {
  if (!eventData) {
    return null;
  }

  const {
    eventName,
    startingDate,
    endingDate,
    country,
    eventTags = []
  } = eventData;

  // Get the formatted date string
  const dateDisplay = formatEventDate(startingDate, endingDate);

  return (
    <header className="article-header-container">
      {/* Event Name (Title) */}
      <h1 className="article-event-name">{eventName}</h1>

      {/* Metadata (Country and Date) */}
      <div className="article-metadata">
        <span className="article-country">{country}</span>
        {country && dateDisplay && " | "}
        <span className="article-date">{dateDisplay}</span>
      </div>

      {/* Event Tags */}
      <div className="article-tags">
        {eventTags.map((tag, index) => (
          <span key={index} className="article-tag">
            {tag}
          </span>
        ))}
      </div>
    </header>
  );
};