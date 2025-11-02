import React, { useState } from 'react';
import { SidebarContent } from './SidebarContent';
import "./Sidebar.css"
// --- Sample JSON data ---
// This simulates the dynamic data you'll eventually fetch.


// --- CSS Styles ---
// Using vanilla CSS directly within the component file for simplicity.

// --- Sidebar Component ---
export function Sidebar ({ events, handleEventClick,isOpen, onClose,  selectedCountry }) {






  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      ></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <SidebarContent events={events} handleEventClick={handleEventClick} selectedCountry={selectedCountry} />
      </aside>
    </>
  );
};

// --- Main App Component ---
