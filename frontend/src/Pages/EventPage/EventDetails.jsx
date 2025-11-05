import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "../../Components/ui/card";
import { Separator } from "../../Components/ui/separator";
import { CalendarDays, MapPin, Tag } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventDetails.css";
import { ChatPanel } from "./ChatPanel";

const EventDetails = () => {
  const { id: idParam } = useParams(); // now expecting id
  const navigate = useNavigate();
    console.log("hi")
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(Boolean(idParam));
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchEventById = async (id) => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        console.log("1");
        const resp = await fetch(`http://localhost:5000/api/events/id/${id}`);
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || "Failed to fetch event");
        }
        const data = await resp.json();
        console.log(data);
        setEvent(data);
      } catch (err) {
        console.error("Fetch event error:", err);
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEventById(idParam);
  }, [idParam]);

  const goBack = () => navigate(-1);

  if (loading) {
    return (
      <div className="event-details-page">
        <div className="event-header">
          <h1>Loading event...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-details-page">
        <div className="event-header">
          <h1>Error</h1>
          <p className="summary">{error}</p>
          <button onClick={goBack} className="event-action-btn">Go back</button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-page">
        <div className="event-header">
          <h1>No event found</h1>
          <p className="summary">No event data is available for this id.</p>
          <button onClick={goBack} className="event-action-btn">Go back</button>
        </div>
      </div>
    );
  }

  // --- render same schema-aware UI as before ---
  const {
    title = "Untitled Event",
    subtitle = "",
    summary = "",
    coreInfo = {},
    historicalContext = "",
    prelude = "",
    keyPlayers = {},
    mainNarrative = {},
    impactAndConsequences = {},
    analysisAndInterpretation = {},
  } = event || {};

  const {
    eventName = "",
    startingDate = "",
    endDate = "",
    country = "",
    locations = [],
    eventTags = [],
  } = coreInfo || {};

  const { individuals = [], groups = [] } = keyPlayers || {};
  const {
    introduction = "",
    phases = [],
    chronologicalTimeline = [],
  } = mainNarrative || {};

  const {
    immediateAftermath = "",
    longTermConsequences = "",
    casualtiesAndLosses = {},
  } = impactAndConsequences || {};

  const {
    rootCauses = "",
    historicalSignificance = "",
    controversiesAndDebates = "",
    legacy = {},
    sourcesAndReading = {},
  } = analysisAndInterpretation || {};

  const { commemoration = "", inPopularCulture = "" } = legacy || {};
  const {
    primarySources = [],
    furtherReading = [],
    bibliography = "",
  } = sourcesAndReading || {};

  return (
    <div className="event-details-page">
      {/* HEADER */}
      <div className="event-header">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {summary && <p className="summary">{summary}</p>}

        <div style={{ marginTop: 12 }}>
          <button onClick={goBack} className="event-action-btn">Back</button>
        </div>
      </div>

      {/* CORE INFO */}
      <Card className="event-card">
        <CardHeader><h2>Core Information</h2></CardHeader>
        <CardContent className="event-card-content">
          {eventName && <p><strong>Event Name:</strong> {eventName}</p>}
          {startingDate && (
            <p><CalendarDays size={16}/> <strong>Start:</strong> {new Date(startingDate).toDateString()}</p>
          )}
          {endDate && (
            <p><CalendarDays size={16}/> <strong>End:</strong> {new Date(endDate).toDateString()}</p>
          )}
          {country && <p><MapPin size={16}/> <strong>Country:</strong> {country}</p>}
          {locations.length > 0 && <p><strong>Locations:</strong> {locations.join(", ")}</p>}
          {eventTags.length > 0 && (
            <p><Tag size={16}/> <strong>Tags:</strong> {eventTags.join(", ")}</p>
          )}
        </CardContent>
      </Card>

      {/* BACKGROUND */}
      {(historicalContext || prelude) && (
        <Card className="event-card">
          <CardHeader><h2>Background</h2></CardHeader>
          <CardContent className="event-card-content">
            {historicalContext && <p><strong>Historical Context:</strong> {historicalContext}</p>}
            {prelude && (
              <>
                {historicalContext && <Separator className="my-2" />}
                <p><strong>Prelude:</strong> {prelude}</p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* KEY PLAYERS */}
      {(individuals.length > 0 || groups.length > 0) && (
        <Card className="event-card">
          <CardHeader><h2>Key Players</h2></CardHeader>
          <CardContent className="event-card-content">
            {individuals.length > 0 && (
              <>
                <h3>Individuals</h3>
                <ul>{individuals.map((p, i) => <li key={i}>{p.name} — {p.role}</li>)}</ul>
              </>
            )}
            {groups.length > 0 && (
              <>
                <h3>Groups</h3>
                <ul>{groups.map((g, i) => <li key={i}>{g.name}</li>)}</ul>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* MAIN NARRATIVE */}
      {(introduction || phases.length > 0 || chronologicalTimeline.length > 0) && (
        <Card className="event-card">
          <CardHeader><h2>Main Narrative</h2></CardHeader>
          <CardContent className="event-card-content">
            {introduction && <p><strong>Introduction:</strong> {introduction}</p>}
            {phases.length > 0 && (
              <>
                <Separator className="my-3" />
                <h3>Phases</h3>
                <ul>
                  {phases.map((phase, i) => (
                    <li key={i}>
                      <strong>{phase.title || "Untitled Phase"}:</strong> {phase.description}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {chronologicalTimeline.length > 0 && (
              <>
                <Separator className="my-3" />
                <h3>Chronological Timeline</h3>
                <div className="timeline">
                  {chronologicalTimeline.map((item, i) => (
                    <div key={i} className="timeline-item">
                      <p className="font-semibold">{item.title}</p>
                      <p>{item.date ? new Date(item.date).toDateString() : ""}</p>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* IMPACT AND CONSEQUENCES */}
      {(immediateAftermath || longTermConsequences || Object.keys(casualtiesAndLosses).length > 0) && (
        <Card className="event-card">
          <CardHeader><h2>Impact & Consequences</h2></CardHeader>
          <CardContent className="event-card-content">
            {immediateAftermath && <p><strong>Immediate Aftermath:</strong> {immediateAftermath}</p>}
            {longTermConsequences && <p><strong>Long-term Consequences:</strong> {longTermConsequences}</p>}
            {casualtiesAndLosses && casualtiesAndLosses.description && (
              <p><strong>Casualties:</strong> {casualtiesAndLosses.description}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ANALYSIS AND INTERPRETATION */}
      {(rootCauses || historicalSignificance || controversiesAndDebates || commemoration || inPopularCulture || bibliography) && (
        <Card className="event-card">
          <CardHeader><h2>Analysis & Interpretation</h2></CardHeader>
          <CardContent className="event-card-content">
            {rootCauses && <p><strong>Root Causes:</strong> {rootCauses}</p>}
            {historicalSignificance && <p><strong>Significance:</strong> {historicalSignificance}</p>}
            {controversiesAndDebates && <p><strong>Controversies:</strong> {controversiesAndDebates}</p>}
            {commemoration && <p><strong>Commemoration:</strong> {commemoration}</p>}
            {inPopularCulture && <p><strong>In Popular Culture:</strong> {inPopularCulture}</p>}

            {(primarySources.length > 0 || furtherReading.length > 0 || bibliography) && (
              <>
                <Separator className="my-3" />
                <h3>Sources & Reading</h3>
                {primarySources.length > 0 && (
                  <>
                    <h4>Primary Sources</h4>
                    <ul>{primarySources.map((src, i) => <li key={i}>{src.title || JSON.stringify(src)}</li>)}</ul>
                  </>
                )}
                {furtherReading.length > 0 && (
                  <>
                    <h4>Further Reading</h4>
                    <ul>{furtherReading.map((r, i) => <li key={i}>{r.title} — {r.author}</li>)}</ul>
                  </>
                )}
                {bibliography && <p><strong>Bibliography:</strong> {bibliography}</p>}
              </>
            )}
          </CardContent>
        </Card>
      )}

    {/* Chatbot toggle button */}
        <button className="chatbot-button" onClick={() => setIsChatOpen(true)}>
            💬
        </button>
      
    {/* Chat side panel */}
    {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
    </div>
  );

};

export default EventDetails;
