// =========== NeatGradient specifications =================================

import { NeatGradient } from "https://esm.run/@firecms/neat";

const config = {
    colors: [
        {
            color: '#000000',
            enabled: true,
        },
        {
            color: '#000000',
            enabled: true,
        },
        {
            color: '#000000',
            enabled: true,
        },
        {
            color: '#D86D19',
            enabled: true,
        },
        {
            color: '#c81d25',
            enabled: true,
        },
        {
            color: '#E0771A',
            enabled: false,
        },
    ],
    speed: 4,
    horizontalPressure: 4,
    verticalPressure: 3,
    waveFrequencyX: 0,
    waveFrequencyY: 0,
    waveAmplitude: 0,
    shadows: 2,
    highlights: 7,
    colorBrightness: 1,
    colorSaturation: 8,
    wireframe: false,
    colorBlending: 5,
    backgroundColor: '#FF0000',
    backgroundAlpha: 1,
    grainScale: 0,
    grainSparsity: 0,
    grainIntensity: 0,
    grainSpeed: 0,
    resolution: 0.5,
    yOffset: 0,
    yOffsetWaveMultiplier: 1.5,
    yOffsetColorMultiplier: 1.8,
    yOffsetFlowMultiplier: 2,
    flowDistortionA: 5,
    flowDistortionB: 7.7,
    flowScale: 2.6,
    flowEase: 0.36,
    flowEnabled: false,
    enableProceduralTexture: false,
    textureVoidLikelihood: 0.22,
    textureVoidWidthMin: 120,
    textureVoidWidthMax: 150,
    textureBandDensity: 1.9,
    textureColorBlending: 0.12,
    textureSeed: 333,
    textureEase: 0.75,
    proceduralBackgroundColor: '#D0DBFB',
    textureShapeTriangles: 20,
    textureShapeCircles: 15,
    textureShapeBars: 15,
    textureShapeSquiggles: 10,
    domainWarpEnabled: false,
    domainWarpIntensity: 0,
    domainWarpScale: 3,
    vignetteIntensity: 0,
    vignetteRadius: 0.8,
    fresnelEnabled: false,
    fresnelPower: 2,
    fresnelIntensity: 0.5,
    fresnelColor: '#FFFFFF',
    iridescenceEnabled: false,
    iridescenceIntensity: 0.5,
    iridescenceSpeed: 1,
    bloomIntensity: 0,
    bloomThreshold: 0.7,
    chromaticAberration: 0,
};

const gradient = new NeatGradient({
    ref: document.getElementById("gradient"),
    ...config
});

console.log(gradient);

// ============. colors to sync with Instagram post colors ================================


async function matchWithInstagram() {
    try {
        const response = await fetch ("/api/new-image");
        const data = await response.json();

        if (data.url) {
            img.onload = () => {
                const colorThief = new ColorThief();
                const palette = colorThief.getPalette(img, 5);
                const newColorObjects = palette.map( c => ({
                    color: `rgb (${c[0]}, ${c[1]}, ${c[2]})` , 
                    enabled: true
                }));
                config.colors = newColorObjects;
                gradient.updateConfig(config);
            };
        }
    } catch (error) {
        console.error("Sorry! The connection here has failed." , error);
    }
}


window.addEventListener("scroll", () => {
    gradient.yOffset = window.scrollY;
});

window.addEventListener("resize" , () => {
    const canvas = document.getElementById("gradient");
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
});





// ========================  Date + Time for Dashboard Greeting ==========================

function updateDashboardTime () {

    const now = new Date();

//formatting dashboard time
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ?'PM' : 'AM';


    hours = hours % 12;
    hours = hours ? hours : 12;


    const timeString= `${hours}:${minutes} ${ampm}`;


// Time of day Greeting options
    const currentHour = now.getHours();
    let greetingString = "Good Evening, Melissa.";

    if(currentHour < 12) {
        greetingString = "Good Morning, Melissa.";
    }else if (currentHour <18) {
        greetingString = "Good Afternoon, Melissa."
    }


    const dateOptions = {weekday: "long", month: "long" , day: "numeric"};
    const dateString = now.toLocaleDateString("en-US" , dateOptions);




    // outputs to HMTL
    document.getElementById("dash-clock").innerText = timeString;
    document.getElementById("dash-greeting").innerText = greetingString;
    document.getElementById("dash-date").innerText = dateString;


}


updateDashboardTime();

setInterval(updateDashboardTime, 1000);


// ======================== Youtube Affirmation Videos  ==========================

const affirmationPlaylist = [
    {id: "zsVjTpQlZc4" , title: "Affirmations for God's Guidance and Wisdom"},
    {id: "LrmbfMtCx2I" , title: "Affirmations for Walking by Faith, Not by Sight"},
    {id: "koYErjpLQGk" , title: "Daily Affirmations for Self-Love and Confidence"},
     {id: "HRQS7Gszbbs" , title: "Best Daily Affirmations for Miracles"}

];

let youtubePlayer;





// ======================== Zapier Google Drive  ==========================


function convertGoogleDriveUrl(url) {
    if(!url) return "images/474.png";
    if(Array.isArray(url)) url= url[0];
    if (typeof url !== "string") return "images/474.png";


    url = url.trim();

if (!url.includes("drive.google.com") && !url.includes("drive.usercontent.google.com") && !url.includes(googleapis.com)) {
    return url;
}

if (url.includes("googleapis.com/drive")) {
    const apiIdMatch = url.match(/\/files\/([a-zA-Z0-9-_]{20,100})/);
    const apiFileId = apiIdMatch ? apiIdMatch[1] : null;

    if(apiFileId) {
        return `https://drive.google.com/thumbnail?id=${apiFileId}&sz=w1000`;
    }
}

const fileIdMatch = url.match(/(?:\/d\/|id=)([a-zA-Z0-9-_]{20,100})/);
const standardFileId = fileIdMatch ? fileIdMatch[1] : null;

if (standardFileId) {
    return `https://drive.google.com/thumbnail?id=${standardFileId}&sz=w1000`;
}
return "images/474.png";
}



// ======================== History of quote images, to sync with navigation buttons + NEAT Gradient  ==========================

let timelineQuote  = [];
let activeIndex = 0;


//DOM Elements for left panel quote functionality of dashboard
const imgElement = document.querySelector(".quote-image");
const rightArrow = document.querySelector(".fa-angle-right");
const leftArrow = document.querySelector(".fa-angle-left");


async function showQuoteAndMatchColors(index) {
    if (!timelineQuote || timelineQuote.length === 0 || !timelineQuote[index]) {
        console.log("Timeline is currently empty");
        imgElement.crossOrigin = "Anonymous";
        imgElement.src = "images/474.png";
        return;
    }


    const currentQuote = timelineQuote[index];
    imgElement.crossOrigin = "anonymous";

    imgElement.onload = function() {
        try {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(imgElement, 3);

        if (!palette || palette.length < 3) {
            console.error("You don't have enough colors to extract" , palette);
            return;
        }

        const rgbToHex = (rgbArray) => {
            return "#" + rgbArray.map (x => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex:hex;
            }).join("");
        };


        const hexColors = palette.filter(Boolean).map(rgbToHex);
        console.log("Hex colors extracted" , hexColors);

        const newColorObjects = hexColors.map(hex => ({
            color: hex,
            enabled: true
        }));

        gradient.colors = newColorObjects;

        if (typeof gradient.requestRender === "function") {
            gradient.requestRender();
        }else if (typeof gradient.render === "function"){
            gradient.render();
        }
        }catch(error) {
            console.error("Color Thief extraction was not successful" , error);
        };
      
    };

  const convertedDriveUrl = convertGoogleDriveUrl(currentQuote.url);
  imgElement.src = `/api/proxy-image?url=${encodeURIComponent(convertedDriveUrl)}`;
};

//Right arrow functionality (forward to view newer quotes)

    rightArrow.addEventListener("click", () => {
        if (activeIndex > 0) {
            activeIndex --; 
            showQuoteAndMatchColors(activeIndex);
        } else {
            console.log("Your're up-to-date with the latest quotes!");
        }
    });


//Left arrow functionality (view previous day quotes)

    leftArrow.addEventListener("click", () => {
        if (activeIndex < timelineQuote.length - 1) {
            activeIndex ++; 
            showQuoteAndMatchColors(activeIndex);
        } else {
            console.log("No more previous quotes to view");
        }
    });

async function loadDashboardQuoteTimeline() {
    try {
        const response = await fetch ("/api/get-all-quotes");
        timelineQuote = await response.json();

        activeIndex = 0;

        showQuoteAndMatchColors(activeIndex);


    }catch(error) {
        console.error("There was an error loading the history of quotes.");
    }
}

loadDashboardQuoteTimeline();



// ======================== Youtube API   ==========================
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


window.onYouTubeIframeAPIReady = function() {
    youtubePlayer = new YT.Player ('audio-player' , {
        height: '0',
        width: '0',
        videoId: affirmationPlaylist[0].id,
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'disablekb': 1
        },
        events: {
            'onReady': window.onPlayerReady
        }
    });
}


window.onPlayerReady = function(event) {
    console.log("Affirmation streaming is prepared.");
    renderAffirmationsList();
}

// ======================== Audio Interface for Left Panel   ==========================

function renderAffirmationsList() {
    const listContainer = document.getElementById("affirmations-list");

    if (!listContainer) return;

    listContainer.innerHTML = "";

    affirmationPlaylist.forEach((track, index) => {
        const trackRow = document.createElement("div");
        trackRow.className = "track-row";
        trackRow.style.display = "flex";
        trackRow.style.alignItems = "center";
        trackRow.style.margin = "10px 0";


        const playButton = document.createElement("button");
        playButton.innerHTML = "Play";
        playButton.style.marginRight = "12px";


        playButton.addEventListener ("click" , () => {
            handleTrackPlayback(track.id, playButton);
        });


        const trackTitle = document.createElement("span");
        trackTitle.innerText = track.title;


        trackRow.appendChild(playButton);
        trackRow.appendChild(trackTitle);
        listContainer.appendChild(trackRow);

    });


}
 // Playback workflow


 let currentPlayingButton = null;

 function handleTrackPlayback (videoId, clickedButton) {
    if (!youtubePlayer || typeof youtubePlayer.getPlayerState !== "function") return;


    const playerState = youtubePlayer.getPlayerState();
    const currentVideoUrl = youtubePlayer.getVideoUrl();


    if (currentVideoUrl && currentVideoUrl.includes(videoId)) {
        if (playerState === YT.PlayerState. PLAYING) {
            youtubePlayer.pauseVideo();
            clickedButton.innerHTML = "Play";
        }else {
            youtubePlayer.playVideo();
            clickedButton.innerHTML = "Pause";
        }
    }else {
        if (currentPlayingButton) {
            currentPlayingButton.innerHTML = "Play";

        }

        youtubePlayer.loadVideoById(videoId);
        youtubePlayer.playVideo();
        clickedButton.innerHTML = "Pause";
        currentPlayingButton = clickedButton;
    }
 }



// ======================== Discover Soundscapes Functionality ==========================

let audioContext;
let audioBuffer = null;
let currentBufferSource = null;
let soundscapePlaying = false;
let playbackDirection = 1;
let startTime = 0;
let pausedAt = 0;


const soundscapePlaylist = [
    {file: "Flute Music with Rain Ambiance by WR-Sound-Library.mp3" , title:"Flute Music with Rain"},
    {file: "Lo-Fi Chill by leberch.mp3" , title:"Lo-Fi Chill"},
     {file: "Soft Sounds of Rain by EchoGateStudios.mp3" , title:"Soft Sounds of Rain"},
      {file: "Soundscape Ambient by leberch.mp3" , title:"Soundscape Ambient"},
];

let currentTrackIndex = 0;




async function loadSoundscapeTracks(index) {
    try {
        stopSoundscapeTracks();
        soundscapePlaying = false;
        pausedAt = 0;


        const track = soundscapePlaylist[index];
        console.log(`Loading track: ${track.title}`);

        const response = await fetch(`/audio/${encodeURIComponent(track.file)}`);

        const arrayBuffer = await response.arrayBuffer();


        if(!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        console.log(`${track.title} has loaded and ready to play.`);

        document.querySelector(".soundscape-title").innerText = track.title;
    
}catch (error) {
    console.error("Soundscape audio file could not be loaded." , error);
}

}

//play + resume tracks

function playSoundscape() {
    if (!audioBuffer || !audioContext) return;

    stopSoundscapeTracks();


    currentBufferSource = audioContext.createBufferSource();
    currentBufferSource.buffer = audioBuffer;
    currentBufferSource.loop = true;
    currentBufferSource.connect(audioContext.destination);


    startTime = audioContext.currentTime - pausedAt;
    currentBufferSource.start(0, pausedAt);

    soundscapePlaying = true;


}

function pauseSoundscape() {
        if (!soundscapePlaying || !currentBufferSource) return;

        pausedAt = audioContext.currentTime - startTime;

        stopSoundscapeTracks();
        soundscapePlaying = false;
    }

function stopSoundscapeTracks() {
    if (currentBufferSource) {
        try { 
            currentBufferSource.stop();
        }catch(error) {}
        currentBufferSource.disconnect();
        currentBufferSource = null;

    }


}

//Event listeners for buttons

function initSoundscapeEventListeners() {
    const playButton = document.getElementById("button-soundscape-toggle");

    const prevButton = document.getElementById("button-soundscape-rewind");

    const nextButton = document.getElementById("button-soundscape-forward");

if (!playButton || !prevButton || !nextButton) return;



playButton.addEventListener("click" , () =>{
    if(soundscapePlaying) {
        pauseSoundscape();
        playButton.innerHTML = "Play";
    }else {
        playSoundscape();
        playButton.innerHTML = "Pause";
    }
});


prevButton.addEventListener("click" , async () => {
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
        currentTrackIndex = soundscapePlaylist.length-1;
    }

    playButton.innerHTML = "Track loading...";
    await loadSoundscapeTracks(currentTrackIndex);
    playSoundscape();
    playButton.innerHTML = "Pause";
});

nextButton.addEventListener("click" , async () =>{
    currentTrackIndex++;
    if(currentTrackIndex >= soundscapePlaylist.length) {
        currentTrackIndex = 0;
    }

    playButton.innerHTML = "Tracks loading...";
    await loadSoundscapeTracks(currentTrackIndex);
    playSoundscape();
    playButton.innerHTML = "Pause";
});

}

async function startSoundscapeTracks() {
    initSoundscapeEventListeners();
    await loadSoundscapeTracks(currentTrackIndex);
}


startSoundscapeTracks();


// ========================  Connections and Tools Functionality ==========================

let todoList = JSON.parse(localStorage.getItem('yss_todos')) || [];
let moodLogs = JSON.parse(localStorage.getItem('yss_moods')) || [];
let journalLogs = JSON.parse(localStorage.getItem('yss_journals')) || [];


const dailyPrompts = [
    "What areas of my life am I growing in, even if progress fells slow?",
     "Write down three small victories you achieved today, no matter how minor",
     "How have you successfully prioritized boundary setting in your schedule this week?",
     "What is a personal development challenge you feel ready to step into tomorrow?",
     "Describe a piece of creative art or music that recently grounded your thoughts",
     "What moment today helped you feel most focused and present?",
    "Describe a conversation that gave you a new perspective or insight.",
    "What is one decision you made today that aligned with your long-term goals?",
    "How did you create space for rest, reflection, or recovery today?",
    "What challenge did you navigate with more confidence than you would have a year ago?",
    "Which part of your daily routine feels most supportive of your well-being right now?",
    "What is something you noticed today that you might have overlooked in the past?",
    "Reflect on a recent accomplishment that deserves more recognition than you've given it.",
    "What personal value guided your actions most strongly today?",
    "How did you demonstrate patience, kindness, or understanding toward yourself or others?",
    "What task or responsibility brought you an unexpected sense of satisfaction today?",
    "Describe a moment when you felt energized, inspired, or fully engaged.",
    "What limiting belief or assumption are you beginning to question?",
    "How have your priorities evolved over the past month, and what prompted that change?",
    "What is one area of your life where small, consistent effort is beginning to show results?",
    "What environment, activity, or person helped you feel grounded today?",
    "What opportunity for growth emerged from a setback or inconvenience this week?",
    "If today had a central lesson, what would it be and why?", 
    "What intention would you like to carry into tomorrow's decisions and interactions?",
    "Looking back on today, what are you most proud of becoming, not just accomplishing?"

];

const dayOfYear = new Date().getDate();
const currentDailyPrompt = dailyPrompts[dayOfYear % dailyPrompts.length];






// ========================  Check-in for connection (health endpoint) ==========================

async function testingConnection() {
    try{
        const response = await fetch ('/api/health');

        if (!response.ok) {
            throw new Error (`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Connection is successful!");
        console.log("Server Response Data:" , data);

    } catch (error) {
        console.error("Connection has failed.");
        console.error("Error Details:" , error.message);
    }
}

testingConnection();
