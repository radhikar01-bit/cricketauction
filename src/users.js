export const USERS = {
    "admin@gmail.com": {
        pin: "9999",
        role: "ADMIN",
        name: "ADMIN",
        teamId: null // Admin doesn't own a team
    },
    "sagar@gmail.com": {
        pin: "1111",
        role: "OWNER",
        name: "Aura Sapphire",
        teamId: "team_1" // Must match the ID in your teams array
    },
    "radhika@gmail.com": {
        pin: "2222",
        role: "OWNER",
        name: "Mighty Maidens",
        teamId: "team_2"
    },
    // ... add the other 3 owners here
};

export default USERS;