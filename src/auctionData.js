// auctionData.js

export const INITIAL_TEAMS = [
    { id: 1, name: "Mumbai Indians", budget: 100000, players: [], color: "bg-blue-600" },
    { id: 2, name: "Chennai Super Kings", budget: 100000, players: [], color: "bg-yellow-500" },
    { id: 3, name: "Royal Challengers", budget: 100000, players: [], color: "bg-red-600" },
    { id: 4, name: "Gujarat Titans", budget: 100000, players: [], color: "bg-slate-700" },
    { id: 5, name: "Lucknow Giants", budget: 100000, players: [], color: "bg-cyan-500" },
    { id: 6, name: "Kolkata Knight Riders", budget: 100000, players: [], color: "bg-purple-700" },
    { id: 7, name: "Rajasthan Royals", budget: 100000, players: [], color: "bg-pink-600" },
    { id: 8, name: "Delhi Capitals", budget: 100000, players: [], color: "bg-blue-800" },
    { id: 9, name: "Punjab Kings", budget: 100000, players: [], color: "bg-red-500" },
    { id: 10, name: "Sunrisers Hyderabad", budget: 100000, players: [], color: "bg-orange-600" },
    { id: 11, name: "Perth Scorchers", budget: 100000, players: [], color: "bg-orange-500" },
    { id: 12, name: "Sydney Sixers", budget: 100000, players: [], color: "bg-pink-500" },
    { id: 13, name: "Surrey Heat", budget: 100000, players: [], color: "bg-emerald-600" },
    { id: 14, name: "Joburg Super Kings", budget: 100000, players: [], color: "bg-yellow-400" },
    { id: 15, name: "Pretoria Capitals", budget: 100000, players: [], color: "bg-sky-600" },
];

export const PLAYER_POOL = [
    // INDIA
    { id: 1, name: "Rohit Sharma", role: "Batter", country: "India", basePrice: 5000 },
    { id: 2, name: "Jasprit Bumrah", role: "Bowler", country: "India", basePrice: 5000 },
    { id: 3, name: "Hardik Pandya", role: "All-Rounder", country: "India", basePrice: 5000 },
    { id: 4, name: "Rishabh Pant", role: "WK-Batter", country: "India", basePrice: 5000 },
    { id: 5, name: "Suryakumar Yadav", role: "Batter", country: "India", basePrice: 5000 },
    { id: 6, name: "Ravindra Jadeja", role: "All-Rounder", country: "India", basePrice: 5000 },
    { id: 7, name: "Mohammed Shami", role: "Bowler", country: "India", basePrice: 5000 },
    { id: 8, name: "Shubman Gill", role: "Batter", country: "India", basePrice: 5000 },
    { id: 9, name: "Kuldeep Yadav", role: "Bowler", country: "India", basePrice: 5000 },
    { id: 10, name: "Yashasvi Jaiswal", role: "Batter", country: "India", basePrice: 5000 },

    // SOUTH AFRICA
    { id: 11, name: "Quinton de Kock", role: "WK-Batter", country: "South Africa", basePrice: 5000 },
    { id: 12, name: "Kagiso Rabada", role: "Bowler", country: "South Africa", basePrice: 5000 },
    { id: 13, name: "Heinrich Klaasen", role: "Batter", country: "South Africa", basePrice: 5000 },
    { id: 14, name: "David Miller", role: "Batter", country: "South Africa", basePrice: 5000 },
    { id: 15, name: "Aiden Markram", role: "All-Rounder", country: "South Africa", basePrice: 5000 },

    // AUSTRALIA
    { id: 21, name: "Travis Head", role: "Batter", country: "Australia", basePrice: 5000 },
    { id: 22, name: "Pat Cummins", role: "Bowler", country: "Australia", basePrice: 5000 },
    { id: 23, name: "Glenn Maxwell", role: "All-Rounder", country: "Australia", basePrice: 5000 },
    { id: 24, name: "Mitchell Starc", role: "Bowler", country: "Australia", basePrice: 5000 },
    { id: 25, name: "Mitchell Marsh", role: "All-Rounder", country: "Australia", basePrice: 5000 },

    // ENGLAND
    { id: 31, name: "Jos Buttler", role: "WK-Batter", country: "England", basePrice: 5000 },
    { id: 32, name: "Liam Livingstone", role: "All-Rounder", country: "England", basePrice: 5000 },
    { id: 33, name: "Jofra Archer", role: "Bowler", country: "England", basePrice: 5000 },
    { id: 34, name: "Phil Salt", role: "Batter", country: "England", basePrice: 5000 },
    { id: 35, name: "Harry Brook", role: "Batter", country: "England", basePrice: 5000 },

    // ... To reach 150, you can copy-paste and change names for testing
];