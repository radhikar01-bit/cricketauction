// auctionData.js

export const INITIAL_TEAMS = [
    { id: 1, name: "Mumbai Indians", budget: 100000, players: [], color: "bg-blue-600" },
    { id: 2, name: "Royal Challengers Bengaluru", budget: 100000, players: [], color: "bg-red-700" },
    { id: 3, name: "Delhi Capitals", budget: 100000, players: [], color: "bg-blue-800" },
    { id: 4, name: "UP Warriorz", budget: 100000, players: [], color: "bg-purple-800" },
    { id: 5, name: "Gujarat Giants", budget: 100000, players: [], color: "bg-orange-500" },
];
export const PLAYER_POOL = [
    // --- TOP PERFORMERS (The 2026 "Heavy Hitters") ---
    { id: 1, name: "Smriti Mandhana", role: "Batter", country: "India", basePrice: 5000 }, // Orange Cap Winner
    { id: 2, name: "Harmanpreet Kaur", role: "Batter", country: "India", basePrice: 5000 },
    { id: 3, name: "Nat Sciver-Brunt", role: "All-Rounder", country: "England", basePrice: 5000 },
    { id: 4, name: "Sophie Devine", role: "All-Rounder", country: "NZ", basePrice: 5000 }, // Purple Cap Winner
    { id: 5, name: "Deepti Sharma", role: "All-Rounder", country: "India", basePrice: 5000 },
    { id: 6, name: "Amelia Kerr", role: "All-Rounder", country: "NZ", basePrice: 5000 },
    { id: 7, name: "Marizanne Kapp", role: "All-Rounder", country: "South Africa", basePrice: 5000 },
    { id: 8, name: "Richa Ghosh", role: "WK-Batter", country: "India", basePrice: 5000 },
    { id: 9, name: "Jemimah Rodrigues", role: "Batter", country: "India", basePrice: 5000 },
    { id: 10, name: "Ashleigh Gardner", role: "All-Rounder", country: "Australia", basePrice: 5000 },

    // --- KEY OVERSEAS STARS ---
    { id: 11, name: "Lizelle Lee", role: "Batter", country: "South Africa", basePrice: 5000 },
    { id: 12, name: "Laura Wolvaardt", role: "Batter", country: "South Africa", basePrice: 5000 },
    { id: 13, name: "Beth Mooney", role: "WK-Batter", country: "Australia", basePrice: 5000 },
    { id: 14, name: "Meg Lanning", role: "Batter", country: "Australia", basePrice: 5000 },
    { id: 15, name: "Sophie Ecclestone", role: "Bowler", country: "England", basePrice: 5000 },
    { id: 16, name: "Nadine de Klerk", role: "All-Rounder", country: "South Africa", basePrice: 5000 },
    { id: 17, name: "Georgia Wareham", role: "Bowler", country: "Australia", basePrice: 5000 },
    { id: 18, name: "Lauren Bell", role: "Bowler", country: "England", basePrice: 5000 },
    { id: 19, name: "Grace Harris", role: "All-Rounder", country: "Australia", basePrice: 5000 },
    { id: 20, name: "Chinelle Henry", role: "All-Rounder", country: "West Indies", basePrice: 5000 },
    { id: 21, name: "Hayley Matthews", role: "All-Rounder", country: "West Indies", basePrice: 5000 },
    { id: 22, name: "Danni Wyatt-Hodge", role: "Batter", country: "England", basePrice: 5000 },
    { id: 23, name: "Shabnim Ismail", role: "Bowler", country: "South Africa", basePrice: 5000 },
    { id: 24, name: "Alice Capsey", role: "All-Rounder", country: "England", basePrice: 5000 },
    { id: 25, name: "Chloe Tryon", role: "All-Rounder", country: "South Africa", basePrice: 5000 },

    // --- INDIAN CAPPED & UNCAPPED ---
    { id: 26, name: "Shafali Verma", role: "Batter", country: "India", basePrice: 5000 },
    { id: 27, name: "Shreyanka Patil", role: "All-Rounder", country: "India", basePrice: 5000 },
    { id: 28, name: "Radha Yadav", role: "Bowler", country: "India", basePrice: 5000 },
    { id: 29, name: "Pooja Vastrakar", role: "All-Rounder", country: "India", basePrice: 5000 },
    { id: 30, name: "Renuka Singh Thakur", role: "Bowler", country: "India", basePrice: 5000 },
    { id: 31, name: "Yastika Bhatia", role: "WK-Batter", country: "India", basePrice: 5000 },
    { id: 32, name: "Shikha Pandey", role: "Bowler", country: "India", basePrice: 5000 },
    { id: 33, name: "Asha Sobhana", role: "Bowler", country: "India", basePrice: 5000 },
    { id: 34, name: "Kiran Navgire", role: "Batter", country: "India", basePrice: 5000 },
    { id: 35, name: "Saika Ishaque", role: "Bowler", country: "India", basePrice: 5000 },
    { id: 36, name: "Sajeevan Sajana", role: "All-Rounder", country: "India", basePrice: 5000 },
    { id: 37, name: "Titas Sadhu", role: "Bowler", country: "India", basePrice: 5000 },
    { id: 38, name: "Sneh Rana", role: "All-Rounder", country: "India", basePrice: 5000 },
    { id: 39, name: "Arundhati Reddy", role: "Bowler", country: "India", basePrice: 5000 },
    { id: 40, name: "Dayalan Hemalatha", role: "Batter", country: "India", basePrice: 5000 },

    // --- REPLACEMENTS & EMERGING ---
    { id: 41, name: "Sayali Satghare", role: "All-Rounder", country: "India", basePrice: 5000 }, // Replaced Perry
    { id: 42, name: "Alana King", role: "Bowler", country: "Australia", basePrice: 5000 }, // Replacement player
    { id: 43, name: "Charli Knott", role: "All-Rounder", country: "Australia", basePrice: 5000 }, // Replacement player
    { id: 44, name: "Nandni Sharma", role: "All-Rounder", country: "India", basePrice: 5000 },
    { id: 45, name: "Gongadi Trisha", role: "Batter", country: "India", basePrice: 5000 },
];

export const IPL_TEAMS = [
    { id: 1, name: "Kolkata Knight Riders", budget: 120000, players: [], color: "bg-purple-900" },
    { id: 2, name: "Chennai Super Kings", budget: 120000, players: [], color: "bg-yellow-500" },
    { id: 3, name: "Mumbai Indians", budget: 120000, players: [], color: "bg-blue-700" },
    { id: 4, name: "RCB Bengaluru", budget: 120000, players: [], color: "bg-red-600" },
    { id: 5, name: "Gujarat Titans", budget: 120000, players: [], color: "bg-slate-800" },
    { id: 6, name: "Rajasthan Royals", budget: 120000, players: [], color: "bg-pink-600" },
    { id: 7, name: "Delhi Capitals", budget: 120000, players: [], color: "bg-blue-800" },
    { id: 8, name: "Sunrisers Hyderabad", budget: 120000, players: [], color: "bg-orange-600" },
    { id: 9, name: "Lucknow Super Giants", budget: 120000, players: [], color: "bg-cyan-600" },
];

export const IPL_PLAYERS = [
    // SET 1: ELITE MARQUEE
    { id: 101, name: "Rishabh Pant", role: "WK-Batter", country: "India", basePrice: 20000, isOverseas: false },
    { id: 102, name: "Virat Kohli", role: "Batter", country: "India", basePrice: 20000, isOverseas: false },
    { id: 103, name: "Pat Cummins", role: "All-Rounder", country: "Australia", basePrice: 20000, isOverseas: true },
    { id: 104, name: "Jasprit Bumrah", role: "Bowler", country: "India", basePrice: 20000, isOverseas: false },
    { id: 105, name: "Travis Head", role: "Batter", country: "Australia", basePrice: 20000, isOverseas: true },
    { id: 106, name: "Hardik Pandya", role: "All-Rounder", country: "India", basePrice: 20000, isOverseas: false },
    { id: 107, name: "Heinrich Klaasen", role: "WK-Batter", country: "South Africa", basePrice: 20000, isOverseas: true },
    { id: 108, name: "Rashid Khan", role: "Bowler", country: "Afghanistan", basePrice: 20000, isOverseas: true },
    { id: 109, name: "Shubman Gill", role: "Batter", country: "India", basePrice: 20000, isOverseas: false },

    // SET 2: POWER ALL-ROUNDERS
    { id: 110, name: "Glenn Maxwell", role: "All-Rounder", country: "Australia", basePrice: 15000, isOverseas: true },
    { id: 111, name: "Ravindra Jadeja", role: "All-Rounder", country: "India", basePrice: 15000, isOverseas: false },
    { id: 112, name: "Andre Russell", role: "All-Rounder", country: "West Indies", basePrice: 15000, isOverseas: true },
    { id: 113, name: "Axar Patel", role: "All-Rounder", country: "India", basePrice: 15000, isOverseas: false },
    { id: 114, name: "Cameron Green", role: "All-Rounder", country: "Australia", basePrice: 15000, isOverseas: true },
    { id: 115, name: "Mitchell Marsh", role: "All-Rounder", country: "Australia", basePrice: 15000, isOverseas: true },
    { id: 116, name: "Liam Livingstone", role: "All-Rounder", country: "England", basePrice: 10000, isOverseas: true },
    { id: 117, name: "Rinku Singh", role: "Batter", country: "India", basePrice: 10000, isOverseas: false },
    { id: 118, name: "Sam Curran", role: "All-Rounder", country: "England", basePrice: 15000, isOverseas: true },

    // SET 3: TOP ORDER BATSMEN
    { id: 119, name: "Yashasvi Jaiswal", role: "Batter", country: "India", basePrice: 15000, isOverseas: false },
    { id: 120, name: "Jos Buttler", role: "WK-Batter", country: "England", basePrice: 15000, isOverseas: true },
    { id: 121, name: "Suryakumar Yadav", role: "Batter", country: "India", basePrice: 20000, isOverseas: false },
    { id: 122, name: "Phil Salt", role: "WK-Batter", country: "England", basePrice: 10000, isOverseas: true },
    { id: 123, name: "Ruturaj Gaikwad", role: "Batter", country: "India", basePrice: 15000, isOverseas: false },
    { id: 124, name: "Quinton de Kock", role: "WK-Batter", country: "South Africa", basePrice: 10000, isOverseas: true },
    { id: 125, name: "Sai Sudharsan", role: "Batter", country: "India", basePrice: 10000, isOverseas: false },
    { id: 126, name: "Abhishek Sharma", role: "All-Rounder", country: "India", basePrice: 10000, isOverseas: false },
    { id: 127, name: "Rachin Ravindra", role: "All-Rounder", country: "NZ", basePrice: 10000, isOverseas: true },

    // SET 4: PACE ATTACK
    { id: 128, name: "Mitchell Starc", role: "Bowler", country: "Australia", basePrice: 20000, isOverseas: true },
    { id: 129, name: "Mohammed Siraj", role: "Bowler", country: "India", basePrice: 10000, isOverseas: false },
    { id: 130, name: "Matheesha Pathirana", role: "Bowler", country: "Sri Lanka", basePrice: 10000, isOverseas: true },
    { id: 131, name: "Trent Boult", role: "Bowler", country: "NZ", basePrice: 15000, isOverseas: true },
    { id: 132, name: "Arshdeep Singh", role: "Bowler", country: "India", basePrice: 10000, isOverseas: false },
    { id: 133, name: "Kagiso Rabada", role: "Bowler", country: "South Africa", basePrice: 15000, isOverseas: true },
    { id: 134, name: "Anrich Nortje", role: "Bowler", country: "South Africa", basePrice: 10000, isOverseas: true },
    { id: 135, name: "Mayank Yadav", role: "Bowler", country: "India", basePrice: 5000, isOverseas: false },
    { id: 136, name: "Jofra Archer", role: "Bowler", country: "England", basePrice: 15000, isOverseas: true },

    // SET 5: SPIN KINGS
    { id: 137, name: "Kuldeep Yadav", role: "Bowler", country: "India", basePrice: 10000, isOverseas: false },
    { id: 138, name: "Yuzvendra Chahal", role: "Bowler", country: "India", basePrice: 10000, isOverseas: false },
    { id: 139, name: "Sunil Narine", role: "All-Rounder", country: "West Indies", basePrice: 15000, isOverseas: true },
    { id: 140, name: "Ravi Bishnoi", role: "Bowler", country: "India", basePrice: 5000, isOverseas: false },
    { id: 141, name: "Adam Zampa", role: "Bowler", country: "Australia", basePrice: 10000, isOverseas: true },
    { id: 142, name: "Varun Chakaravarthy", role: "Bowler", country: "India", basePrice: 5000, isOverseas: false },
    { id: 143, name: "Wanindu Hasaranga", role: "All-Rounder", country: "Sri Lanka", basePrice: 10000, isOverseas: true },
    { id: 144, name: "Noor Ahmad", role: "Bowler", country: "Afghanistan", basePrice: 5000, isOverseas: true },
    { id: 145, name: "Maheesh Theekshana", role: "Bowler", country: "Sri Lanka", basePrice: 5000, isOverseas: true },

    // SET 6: MIDDLE ORDER ANCHORS
    { id: 146, name: "KL Rahul", role: "WK-Batter", country: "India", basePrice: 15000, isOverseas: false },
    { id: 147, name: "Nicholas Pooran", role: "WK-Batter", country: "West Indies", basePrice: 15000, isOverseas: true },
    { id: 148, name: "Shreyas Iyer", role: "Batter", country: "India", basePrice: 15000, isOverseas: false },
    { id: 149, name: "Tilak Varma", role: "Batter", country: "India", basePrice: 10000, isOverseas: false },
    { id: 150, name: "Tristan Stubbs", role: "Batter", country: "South Africa", basePrice: 5000, isOverseas: true },
    { id: 151, name: "Shivam Dube", role: "All-Rounder", country: "India", basePrice: 10000, isOverseas: false },
    { id: 152, name: "Harry Brook", role: "Batter", country: "England", basePrice: 10000, isOverseas: true },
    { id: 153, name: "Sanju Samson", role: "WK-Batter", country: "India", basePrice: 15000, isOverseas: false },
    { id: 154, name: "David Miller", role: "Batter", country: "South Africa", basePrice: 5000, isOverseas: true },

    // SET 7: EMERGING INDIAN STARS
    { id: 155, name: "Nitish Reddy", role: "All-Rounder", country: "India", basePrice: 2000, isOverseas: false },
    { id: 156, name: "Harshit Rana", role: "Bowler", country: "India", basePrice: 2000, isOverseas: false },
    { id: 157, name: "Dhruv Jurel", role: "WK-Batter", country: "India", basePrice: 2000, isOverseas: false },
    { id: 158, name: "Angkrish Raghuvanshi", role: "Batter", country: "India", basePrice: 1000, isOverseas: false },
    { id: 159, name: "Prabhsimran Singh", role: "WK-Batter", country: "India", basePrice: 1000, isOverseas: false },
    { id: 160, name: "Mohit Sharma", role: "Bowler", country: "India", basePrice: 5000, isOverseas: false },
    { id: 161, name: "Sanddep Sharma", role: "Bowler", country: "India", basePrice: 5000, isOverseas: false },
    { id: 162, name: "Rahul Tewatia", role: "All-Rounder", country: "India", basePrice: 5000, isOverseas: false },
    { id: 163, name: "Shahrukh Khan", role: "All-Rounder", country: "India", basePrice: 5000, isOverseas: false },

    // SET 8: OVERSEAS X-FACTOR
    { id: 164, name: "Jake Fraser-McGurk", role: "Batter", country: "Australia", basePrice: 5000, isOverseas: true },
    { id: 165, name: "Will Jacks", role: "All-Rounder", country: "England", basePrice: 5000, isOverseas: true },
    { id: 166, name: "Gerald Coetzee", role: "Bowler", country: "South Africa", basePrice: 5000, isOverseas: true },
    { id: 167, name: "Marco Jansen", role: "All-Rounder", country: "South Africa", basePrice: 5000, isOverseas: true },
    { id: 168, name: "Tim David", role: "Batter", country: "Australia", basePrice: 5000, isOverseas: true },
    { id: 169, name: "Naveen-ul-Haq", role: "Bowler", country: "Afghanistan", basePrice: 2000, isOverseas: true },
    { id: 170, name: "Nuwan Thushara", role: "Bowler", country: "Sri Lanka", basePrice: 2000, isOverseas: true },
    { id: 171, name: "Spencer Johnson", role: "Bowler", country: "Australia", basePrice: 2000, isOverseas: true },
    { id: 172, name: "Fazalhaq Farooqi", role: "Bowler", country: "Afghanistan", basePrice: 2000, isOverseas: true },

    // SET 9: FINISHERS & VETERANS
    { id: 173, name: "MS Dhoni", role: "WK-Batter", country: "India", basePrice: 5000, isOverseas: false },
    { id: 174, name: "Faf du Plessis", role: "Batter", country: "South Africa", basePrice: 5000, isOverseas: true },
    { id: 175, name: "Dinesh Karthik", role: "WK-Batter", country: "India", basePrice: 2000, isOverseas: false },
    { id: 176, name: "Trent Boult", role: "Bowler", country: "NZ", basePrice: 5000, isOverseas: true },
    { id: 177, name: "David Warner", role: "Batter", country: "Australia", basePrice: 5000, isOverseas: true },
    { id: 178, name: "Bhuvneshwar Kumar", role: "Bowler", country: "India", basePrice: 5000, isOverseas: false },
    { id: 179, name: "Ishant Sharma", role: "Bowler", country: "India", basePrice: 2000, isOverseas: false },
    { id: 180, name: "Ajinkya Rahane", role: "Batter", country: "India", basePrice: 2000, isOverseas: false },
    { id: 181, name: "Umesh Yadav", role: "Bowler", country: "India", basePrice: 2000, isOverseas: false },
];