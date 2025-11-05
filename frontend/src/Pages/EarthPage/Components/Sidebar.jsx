import React from 'react';
import { SidebarContent } from './SidebarContent';
import "./Sidebar.css";

export function Sidebar({ onEventClick, isOpen, onClose, selectedCountry, date }) {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      ></div>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <SidebarContent selectedCountry={selectedCountry} onEventClick={onEventClick} date = {date} />
      </aside>
    </>
  );
}
