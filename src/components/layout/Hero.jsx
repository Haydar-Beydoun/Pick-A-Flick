import React from 'react';
import Search from "./Search.jsx";

function Hero() {
    return (
        <header>
            <img draggable="false" src="/logo.png" alt="Hero Banner"/>
            <h1>Enjoy <span className="text-gradient">Great Movies</span> Without the Guesswork</h1>

        </header>
    );
}

export default Hero;