function ChevronIcon({isExpanded}) {
    return (
        <svg
            className={`w-4 h-4 transition-transform duration-300 ${
                !isExpanded ? 'rotate-180' : 'rotate-0'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
        >
            <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2"
                  d="M9 5 5 1 1 5"/>
        </svg>
    );
}

export default ChevronIcon;