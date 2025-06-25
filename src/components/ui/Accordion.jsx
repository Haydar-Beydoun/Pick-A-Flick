import React, {useState} from 'react';
import ChevronIcon from "./ChevronIcon.jsx";

function Accordion({children, title}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const handleClick = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className="w-full">
            <button onClick={handleClick}
                    className="rounded-none mx-0 bg-transparent border-b-2 border-blue-950 flex items-center justify-between py-3 px-2">
                <h3 className="text-xl text-left pr-8">{title}</h3>
                <ChevronIcon isExpanded={isExpanded}/>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {children}
            </div>

        </div>
    );
}

export default Accordion;