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
            { lessonId: 1, title: 'Pre-Colonial Philippines', youtubeId: 'hLspaJjHaEg' },
            { lessonId: 2, title: "Magellan's Arrival (1521)", youtubeId: 'K2YA9R4t--E' },
            { lessonId: 3, title: 'Lapu-Lapu: The Hero', youtubeId: 'tQqHyg6yLx4' },
            { lessonId: 4, title: 'Battle of Mactan', youtubeId: 'xQDCuPv7YaE' },
            { lessonId: 5, title: 'Aftermath & Legacy', youtubeId: '8I19LdyLh7g' }
        ]
    },
    'late-spanish': {
        lessons: [
            { lessonId: 1, title: 'Jose Rizal', youtubeId: 'sDnkdohFqxI' },
            { lessonId: 2, title: 'Andres Bonifacio', youtubeId: 'PJrORylNH44' },
            { lessonId: 3, title: 'Emilio Aguinaldo', youtubeId: 'RZUlFVyp_iQ' },
            { lessonId: 4, title: 'Apolinario Mabini', youtubeId: 'o0RMVvKXGmE' },
            { lessonId: 5, title: 'Treaty of Paris', youtubeId: 'xkstubsSxNk' }
        ]
    },
    'american-colonial': {
        lessons: [
            { lessonId: 1, title: 'The Transition', youtubeId: '7yPzvcvqcAc' },
            { lessonId: 2, title: 'Philippine-American War', youtubeId: '3qAj22TkKZs' },
            { lessonId: 3, title: 'Benevolent Assimilation', youtubeId: 'ryOQlPPFgS0' }
        ]
    },
    'ww2': {
        lessons: [
            { lessonId: 1, title: 'Japanese Invasion', youtubeId: 'U9Wma2WTHZU' },
            { lessonId: 2, title: 'Bataan Death March', youtubeId: 'Dno157dkuZ8' },
            { lessonId: 3, title: 'Filipino Resistance', youtubeId: 'siOnwaBZbs0' },
            { lessonId: 4, title: 'Liberation', youtubeId: 'VXyXQNuqzjs' },
            { lessonId: 5, title: 'Independence', youtubeId: '7Y_laH_t7rw' }
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
