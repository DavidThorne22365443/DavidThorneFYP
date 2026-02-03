'use client';

import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Interfaces for our Static Data
interface UserData {
    profilePic: string;
    username: string;
    fullName: string;
}

interface ChatMessage {
    id: number;
    sender: string;
    text: string;
}

// 1. Static JSON Data
const userData: UserData = {
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Limerick",
    username: "@limerick_explorer",
    fullName: "John Doe"
};

const chatMessages: ChatMessage[] = [
    { id: 1, sender: "System", text: "Welcome to Limerick City Map." },
    { id: 2, sender: "User", text: "How do I get to King John's Castle?" }
];

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
mapboxgl.accessToken = MAPBOX_TOKEN;

const Map: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const limerickBounds: [number, number, number, number] = [-9.37, 52.27, -8.15, 52.76];

        const mapInstance = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-8.6238, 52.6680],
            zoom: 11,
        });

        mapRef.current = mapInstance;

        mapInstance.on('load', () => {
            // Using explicit options to satisfy the IDE/TypeScript
            const options: mapboxgl.FitBoundsOptions = { padding: 20, animate: false };
            mapInstance.fitBounds(limerickBounds, options);
        });

        return () => {

            if (mapInstance) {
                mapInstance.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Shared styling for the floating cards
    const cardStyle: React.CSSProperties = {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
        zIndex: 10,
        fontFamily: 'sans-serif',
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>

            {/* MAP CONTAINER */}
            <div ref={mapContainerRef} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />

            {/* USER PROFILE (Bottom Left) */}
            <div style={{ ...cardStyle, bottom: '30px', left: '30px', padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
                <img src={userData.profilePic} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #f0f0f0' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{userData.username}</span>
                    <span style={{ fontSize: '13px', color: '#666' }}>{userData.fullName}</span>
                </div>
            </div>

            {/* CHAT WINDOW (Bottom Right) */}
            <div style={{ ...cardStyle, bottom: '30px', right: '30px', width: '300px', height: '400px', display: 'flex', flexDirection: 'column' }}>
                {/* Chat Header */}
                <div style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Chat</div>

                {/* Chat Messages */}
                <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {chatMessages.map((msg) => (
                        <div key={msg.id} style={{ fontSize: '13px' }}>
                            <span style={{ fontWeight: 'bold', display: 'block' }}>{msg.sender}:</span>
                            <div style={{ backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '8px', marginTop: '4px' }}>{msg.text}</div>
                        </div>
                    ))}
                </div>

                {/* Chat Input Placeholder */}
                <div style={{ padding: '10px', borderTop: '1px solid #eee' }}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        disabled
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px' }}
                    />
                </div>
            </div>

        </div>
    );
};

export default Map;