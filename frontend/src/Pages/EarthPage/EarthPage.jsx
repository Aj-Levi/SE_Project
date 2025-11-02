
import { useState, useEffect, Suspense, createContext, useContext, useMemo } from 'react'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';

import { DateSelector } from "./Components/DateSelector"
import { Earth } from './Components/Earth';
import { Sidebar } from './Components/Sidebar';

import { months } from "./Helpers/months";

import "./EarthPage.css";



export const selectedCountryContext = createContext();

export function EarthPage() {


    const [events, setEvents] = useState([
        {
            eventName: "Quit India Movement Launch",
            startingDate: "8 Aug 1942",
            endingDate: "8 Aug 1942",
            eventDescription: "Mahatma Gandhi launched the Quit India Movement at the Bombay session of the All-India Congress Committee, demanding an end to British rule.",
            country: "India",
            eventTags: ["Independence", "Political", "Protest"]
        },
        {
            eventName: "First War of Independence",
            startingDate: "10 May 1857",
            endingDate: "1 Nov 1858",
            eventDescription: "A major, but ultimately unsuccessful, uprising in India against the rule of the British East India Company, which functioned as a sovereign power on behalf of the British Crown.",
            country: "India",
            eventTags: ["War", "Uprising", "Colonial"]
        },
        {
            eventName: "Adoption of the Constitution of India",
            startingDate: "26 Nov 1949",
            endingDate: "26 Nov 1949",
            eventDescription: "The Constituent Assembly of India adopted the Constitution of India, which came into effect on 26 January 1950.",
            country: "India",
            eventTags: ["Geopolitical", "Legal", "Government"]
        }
    ]);

    const [date, setDate] = useState(new Date());
    const [hasRotated, setHasRotated] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const selectedCountryContextValue = useMemo(() => { return { selectedCountry, setSelectedCountry }; }, [selectedCountry]);

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Function to open the sidebar
    const openSidebar = () => {
        setSidebarOpen(true);
    };

    // Function to close the sidebar
    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    function onDateChange(newDate) {
        setDate(newDate);
    }

    function handleRotation() {
        if (!hasRotated) {
            setHasRotated(true);
        }
    }

    const selectedMonth = months[date.getMonth() + 1];

    useEffect(() => {
        if (selectedCountry !== null) {
            openSidebar();
        }
    }, [
        selectedCountry
    ]);

    // this type of preloading is not enough remember to make 12 diff useTexture objects in the memory in Model.jsx also use a useMemo and remove this part here 
    useEffect(() => {
        const textureUrls = Object.values(months).map(month => `./textures/earth-${month}.jpg`);
        useTexture.preload(textureUrls);
    }, []);

    const handleEventClick = (event) => {
        console.log("Loading event page for:", event.eventName);
    };

    return (
        <div className='earth-page-main-container'>
            <DateSelector onDateChange={onDateChange} />

            <Canvas camera={{ position: [0, 0, 10], fov: 75, near: 0.1, far: 1000 }}>

                <ambientLight intensity={2} />
                <directionalLight color="white" position={[5, 5, 5]} intensity={1.5} />

                <Stars
                    radius={100} // Radius of the sphere
                    depth={50}  // Depth of the stars
                    count={1000} // Number of stars
                    factor={4}   // Star size factor
                    saturation={0.9} // Saturation 0 is white
                    fade         // Stars fade out at the edges
                    speed={1}    // Animation speed
                />

                <Suspense fallback={null}>
                    <selectedCountryContext.Provider value={selectedCountryContextValue}>
                        <Earth selectedMonth={selectedMonth} hasRotated={hasRotated} openSidebar={openSidebar} />
                    </selectedCountryContext.Provider>
                </Suspense>
                <OrbitControls minDistance={4} maxDistance={12} onStart={hasRotated ? null : handleRotation} />
            </Canvas>

            <Sidebar
                selectedCountry={selectedCountry}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                events={events}
                onEventClick={handleEventClick}
            />
        </div>
    );
}