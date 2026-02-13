// Module Videos Data - Using YouTube Videos
// Videos organized by era and lesson

// YouTube video IDs for each era
const youtubeVideoIds = {
    'early-spanish': ['hLspaJjHaEg', 'K2YA9R4t--E', 'tQqHyg6yLx4', 'xQDCuPv7YaE', '8I19LdyLh7g'],
    'late-spanish': ['sDnkdohFqxI', 'PJrORylNH44', 'RZUlFVyp_iQ', 'o0RMVvKXGmE', 'xkstubsSxNk'],
    'american-colonial': ['7yPzvcvqcAc', '3qAj22TkKZs', 'ryOQlPPFgS0'],
    'ww2': ['U9Wma2WTHZU', 'Dno157dkuZ8', 'siOnwaBZbs0', 'VXyXQNuqzjs', '7Y_laH_t7rw']
};

const moduleVideos = {
    'early-spanish': {
        lessons: [
            { lessonId: 1, title: 'Pre-Colonial Philippines', youtubeId: 'hLspaJjHaEg', youtubeIdTl: 'rwBBLJ8lNVA' },
            { lessonId: 2, title: "Magellan's Arrival (1521)", youtubeId: 'K2YA9R4t--E', youtubeIdTl: 'b4UNDV9sY68' },
            { lessonId: 3, title: 'Lapu-Lapu: The Hero', youtubeId: 'tQqHyg6yLx4', youtubeIdTl: 'qJG2qXuz6mA' },
            { lessonId: 4, title: 'Battle of Mactan', youtubeId: 'xQDCuPv7YaE', youtubeIdTl: 'IGdV2dk2aNU' },
            { lessonId: 5, title: 'Aftermath & Legacy', youtubeId: '8I19LdyLh7g', youtubeIdTl: '8p7cEWmFJYs' }
        ]
    },
    'late-spanish': {
        lessons: [
            { lessonId: 1, title: 'Jose Rizal', youtubeId: 'sDnkdohFqxI', youtubeIdTl: 'AEAT_FTPyMY' },
            { lessonId: 2, title: 'Andres Bonifacio', youtubeId: 'PJrORylNH44', youtubeIdTl: '5qX_OhZhw80' },
            { lessonId: 3, title: 'Emilio Aguinaldo', youtubeId: 'RZUlFVyp_iQ', youtubeIdTl: '42gsN3TfBm4' },
            { lessonId: 4, title: 'Apolinario Mabini', youtubeId: 'o0RMVvKXGmE', youtubeIdTl: '059SX0bFOEE' },
            { lessonId: 5, title: 'Treaty of Paris', youtubeId: 'xkstubsSxNk', youtubeIdTl: 'yjQU864aVSw' }
        ]
    },
    'american-colonial': {
        lessons: [
            { lessonId: 1, title: 'The Transition', youtubeId: '7yPzvcvqcAc', youtubeIdTl: 'ambEpp0fyZs' },
            { lessonId: 2, title: 'Philippine-American War', youtubeId: '3qAj22TkKZs', youtubeIdTl: 'oifJh02kmCg' },
            { lessonId: 3, title: 'Benevolent Assimilation', youtubeId: 'ryOQlPPFgS0', youtubeIdTl: 'D57JTtl8c2c' }
        ]
    },
    'ww2': {
        lessons: [
            { lessonId: 1, title: 'Japanese Invasion', youtubeId: 'U9Wma2WTHZU', youtubeIdTl: '-GTm2kZB-8M' },
            { lessonId: 2, title: 'Bataan Death March', youtubeId: 'Dno157dkuZ8', youtubeIdTl: '6_S2IukL4sI' },
            { lessonId: 3, title: 'Filipino Resistance', youtubeId: 'siOnwaBZbs0', youtubeIdTl: 'gHVdUMrGHO4' },
            { lessonId: 4, title: 'Liberation', youtubeId: 'VXyXQNuqzjs', youtubeIdTl: 'mP1MFbqbu9E' },
            { lessonId: 5, title: 'Independence', youtubeId: '7Y_laH_t7rw', youtubeIdTl: 'z3l6tL48AKY' }
        ]
    }
};

// Function to get video data for a specific lesson
function getVideoForLesson(eraKey, lessonId) {
    const eraVideos = moduleVideos[eraKey];
    if (!eraVideos) return null;

    const lessonVideo = eraVideos.lessons.find(l => l.lessonId === lessonId);
    return lessonVideo || null;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { moduleVideos, getVideoForLesson };
}
