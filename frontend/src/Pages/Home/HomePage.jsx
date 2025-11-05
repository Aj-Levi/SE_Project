import "./HomePage.css";
import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Globe } from "./Globe";
import { Link, useNavigate } from "react-router-dom";
import { OrbitControls } from "@react-three/drei";
import { FilterPanel } from "./FilterPanel";
import { ChatPanel } from "./ChatPanel";

function LanguageLink({ language, articles, className }) {
  return (
    <div className={`language-link ${className}`}>
      <strong>{language}</strong>
      <span>{articles}</span>
    </div>
  );
}

export function Home() {
  return (
    <>
      <main>
        <SearchPortal />
      </main>
    </>
  );
}

function SearchPortal() {
  const navigate = useNavigate();
  const [hasRotated, setHasRotated] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const [localCountries, setLocalCountries] = useState([]);
  const [localTags, setLocalTags] = useState([]);
  const [localStartDate, setLocalStartDate] = useState("");
  const [localEndDate, setLocalEndDate] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const allAvailableTags = [
    "Independence",
    "Political",
    "Protest",
    "War",
    "Uprising",
    "Colonial",
    "Revolution",
    "Geopolitical",
    "Legal",
    "Government",
    "Restoration",
    "Social",
  ];
  const allAvailableCountries = [
    "India",
    "France",
    "Japan",
    "USA",
    "UK",
    "Germany",
    "China",
    "Russia",
    "Brazil",
    "South Africa",
  ];

  const languages = [
    { lang: "India", count: "7,000,000+ articles", class: "lang-1" },
    { lang: "日本語", count: "1,475,000+ 記事", class: "lang-2" },
    { lang: "Русский", count: "2,065,000+ статей", class: "lang-3" },
    { lang: "Deutsch", count: "3,050,000+ Artikel", class: "lang-4" },
    { lang: "Français", count: "2,712,000+ articles", class: "lang-5" },
    { lang: "Español", count: "2,065,000+ artículos", class: "lang-6" },
    { lang: "中文", count: "1,503,000+ 條目 / 条目", class: "lang-7" },
    { lang: "Italiano", count: "1,938,000+ voci", class: "lang-8" },
    { lang: "Polski", count: "1,670,000+ haseł", class: "lang-9" },
    { lang: "Português", count: "1,158,000+ artigos", class: "lang-10" },
  ];

  return (
    <div className="portal-container">
      {/* Central area with globe and links */}
      <div className="central-widget">
        <Link to="/" className="globe-container" draggable="false">
          <Canvas>
            <Suspense fallback={null}>
              <Globe hasRotated={hasRotated} />
            </Suspense>
            <OrbitControls
              minDistance={4}
              maxDistance={12}
              enableZoom={false}
              onStart={hasRotated ? null : () => setHasRotated(true)}
            />
            <ambientLight intensity={3} />
          </Canvas>
        </Link>

        {languages.map((lang) => (
          <LanguageLink
            key={lang.lang}
            language={lang.lang}
            articles={lang.count}
            className={lang.class}
          />
        ))}
      </div>

      {/* Search bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
        <button
          className="search-button"
          onClick={() => {
            navigate(
              `/search?query=${localQuery}&tags=${localTags}&countries=${localCountries}`
            );
          }}
        >
          Search
        </button>
      </div>

      <FilterPanel
        localStartDate={localStartDate}
        setLocalStartDate={setLocalStartDate}
        localEndDate={localEndDate}
        setLocalEndDate={setLocalEndDate}
        localTags={localTags}
        setLocalTags={setLocalTags}
        localCountries={localCountries}
        setLocalCountries={setLocalCountries}
        allAvailableTags={allAvailableTags}
        allAvailableCountries={allAvailableCountries}
      />

      {/* Chatbot toggle button */}
      <button className="chatbot-button" onClick={() => setIsChatOpen(true)}>
        💬
      </button>

      {/* Chat side panel */}
      {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
