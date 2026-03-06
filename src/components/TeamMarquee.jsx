import React from 'react';

const TeamMarquee = () => {
    const teams = [
        { name: 'Mumbai Indians', logo: '/logos/1.png' },
        { name: 'CSK', logo: '/logos/2.jpg' },
       
    ];

    // Triple the array to ensure no gaps at high speed
    const scrollingLogos = [...teams, ...teams, ...teams];

    return (
        <div className="bg-slate-900 border-b border-white/5 py-4 overflow-hidden relative flex items-center">
            {/* Tighter Fade Masks */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

            <div className="flex animate-infinite-scroll whitespace-nowrap items-center">
                {scrollingLogos.map((team, idx) => (
                    <div key={idx} className="flex items-center justify-center mx-4 md:mx-8 shrink-0">
                        <img
                            src={team.logo}
                            alt={team.name}
                            className="h-10 md:h-16 w-auto object-contain opacity-70 hover:opacity-100 transition-all duration-300 brightness-110 grayscale hover:grayscale-0"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamMarquee;