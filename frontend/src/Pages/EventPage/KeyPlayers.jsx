
/**
 * A component to display the "Key Players" of a historical event,
 * separated into Individuals and Groups.
 *
 * @param {object} props
 * @param {object} props.data - The keyPlayers data object.
 * @param {Array<object>} [props.data.individuals]
 * @param {Array<object>} [props.data.groups]
 */
export const KeyPlayers = ({ data }) => {
  // Don't render if data is missing or both arrays are empty
  if (!data || (!data.individuals?.length && !data.groups?.length)) {
    return null;
  }

  const hasIndividuals = data.individuals && data.individuals.length > 0;
  const hasGroups = data.groups && data.groups.length > 0;

  // Simple image name extractor for placeholder
  /*
  REMOVED:
  const getInitials = (name = "") => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  }
  */

  return (
    <section className="article-section">
      <h2 className="section-heading">Key Players</h2>

      {/* --- Individuals Sub-section --- */}
      {hasIndividuals && (
        <div className="subsection">
          <h3 className="subsection-heading">Individuals</h3>
          <div className="individuals-list">
            {data.individuals.map((person, index) => (
              <div key={index} className="individual-card">
                {/* Image REMOVED */}
                {/*
                REMOVED:
                <img
                  src={person.imageUrl}
                  alt={`Portrait of ${person.name}`}
                  className="individual-image"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/90x90/e0e0e0/777?text=${getInitials(person.name)}`;
                  }}
                />
                */}
                {/* Info */}
                <div className="individual-info">
                  <span className="individual-name">{person.name}</span>
                  <span className="individual-role">{person.role}</span>
                  <p className="individual-significance">{person.significance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Groups Sub-section --- */}
      {hasGroups && (
        <div className="subsection">
          <h3 className="subsection-heading">Groups</h3>
          <div className="groups-list">
            {data.groups.map((group, index) => (
              <div key={index} className="group-card">
                <div className="group-header">
                  <span className="group-name">{group.name}</span>
                  {/* Conditionally render side if it exists */}
                  {group.side && (
                    <span className="group-side">({group.side})</span>
                  )}
                </div>
                <p className="group-role">{group.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
