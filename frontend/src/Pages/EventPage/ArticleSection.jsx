
export const ArticleSection = ({ title, content }) => {
  // Don't render anything if there's no content
  if (!content || content.trim() === "") {
    return null;
  }

  // Split content by one or more newlines to create paragraphs
  const paragraphs = content.split(/\n+/).filter(p => p.trim() !== '');

  return (
    <section className="article-section">
      <h2 className="section-heading">{title}</h2>
      <div className="section-content">
        {paragraphs.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>
    </section>
  );
};

// --- [NEW] Specific Section Components ---
// These are simple wrappers around the reusable ArticleSection.

/**
 * Displays the "Historical Context" section.
 * @param {object} props
 * @param {string} props.content - The text content.
 */
export const HistoricalContext = ({ content }) => (
  <ArticleSection title="Historical Context" content={content} />
);

/**
 * Displays the "Prelude" section.
 * @param {object} props
 * @param {string} props.content - The text content.
 */
export const Prelude = ({ content }) => (
  <ArticleSection title="Prelude" content={content} />
);
