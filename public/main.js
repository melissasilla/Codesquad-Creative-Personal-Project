// =========== NeatGradient specifications =================================
let currentUser = null;
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
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const colorThief = new ColorThief();
                const palette = colorThief.getPalette(img, 5);

                const newColorObjects = palette.map( c => ({
                    color: `rgb(${c[0]}, ${c[1]}, ${c[2]})` , 
                    enabled: true
                }));
                config.colors = newColorObjects;
                gradient.updateConfig(config);


                const primaryRGB = palette[0];
                const dominantColorString = `rgb(${primaryRGB[0]} , ${primaryRGB[1]}, ${primaryRGB[2]})`;


                const actionButtons = document.querySelectorAll('.soundscape-action-button, .submit-journal-button, .tool-icon, .emoji-button');

                actionButtons.forEach(button => {
                    button.style.backgroundColor = `rgba(${primaryRGB[0]}, ${primaryRGB[1]}, ${primaryRGB[2]}, 0.2)`;
                    button.style.borderColor = dominantColorString;
                });

                const centerHalo = document.querySelectorAll('.pulse-circle, #ai-glow');
                centerHalo.forEach(element => {
                    element.style.boxShadow = `0 0 40px rgba(${primaryRGB[0]}, ${primaryRGB[1]}, ${primaryRGB[2]}, 0.4 )`;
                });
            };

            img.src = `/api/proxy-image?url=${encodeURIComponent(data.url)}`;
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

    const displayName = currentUser ? currentUser.name : "Melissa";

    let greetingString = `Good Evening, ${displayName}.`;

    if(currentHour < 12) {
        greetingString = `Good Morning, ${displayName}.` ;
    }else if (currentHour <18) {
        greetingString = `Good Afternoon, ${displayName}.`
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

const primaryRGB = palette[0];

document.documentElement.style.setProperty('--accent-color-rgb' , `${primaryRGB[0]} , ${primaryRGB[1]} , ${primaryRGB[2]}`);


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
    "What areas of my life am I growing in, even if progress feels slow?",
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

const focusInput = document.getElementById("focus-input");
const modalOverlay = document.getElementById("dashboard-modal") || document.getElementById("modal-overlay");
const modalCloseButton = document.getElementById("modal-close-button") || document.getElementById("modal-close-btn");
const modalBody = document.getElementById("modal-dynamic-body") || document.getElementById("modal-body");



if (focusInput) {
    focusInput.addEventListener("keydown" , (e) =>{
        if (e.key === "Enter" && focusInput.value.trim() !== "") {
            todoList.push ({ text: focusInput.value.trim(), done: false, date: new Date(). toLocaleDateString() });
            localStorage.setItem('yss_todos' , JSON.stringify(todoList));


            focusInput.value = "";
            focusInput.placeholder = "Task has been logged! Please click the To-Do button to view your task!";
            setTimeout(() => { focusInput.placeholder = "Place your focus here." ; }, 3000);
        }
    })
}

function openModal(htmlContent) {
    modalBody.innerHTML = htmlContent;
    modalOverlay.style.display = "flex";
}

if(modalCloseButton) {
    modalCloseButton.addEventListener("click" , () => {modalOverlay.style.display = "none"; });
}

function initTools() {
    const toolButtons = document.querySelectorAll(".tools-row .tool-icon");
    // if (toolButtons.length > 0) {
    //     toolButtons[0].click();
    // };


    toolButtons[0].addEventListener("click" ,() => {
        let todoHTML =`
            <h3 class= "modal-heading">Your Main Focus</h3>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <span style="font-size: 0.85rem; opacity: 0.7;">Manage your focuses</span>
            <button id="clear-todo-trigger" style="background: rgba(255, 75, 75, 0.2); border: 1px solid #ff4b4b; color:#ff8888; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">Clear All</button>
            </div>
            <ul class="todo-list-container">
        `;
        
         
        if(todoList.length ===0) todoHTML += `<li>No focus items logged yet. Please enter a focus item in the main input field above.</li>`;
        todoList.forEach((todo, idx) => {
            todoHTML += `
                <li class="todo-item">
                <input type="checkbox" ${todo.done ? 'checked' : ''} onclick="window.toggleTodoItem(${idx})">
                <span class= "${todo.done ? 'todo-done' : ''}">${todo.text}</span>
                </li>`;
        });
        todoHTML += `</ul>`;
        openModal(todoHTML);



    const clearButton = document.getElementById('clear-todo-trigger');
    if(clearButton) {
        clearButton.addEventListener('click' , () => {
            if(confirm("Ready to clear your focus list?")) {
                todoList = [];
                localStorage.setItem('yss_todos' , JSON.stringify(todoList));
                toolButtons[0].click();
            }
        });
    }


    });



    toolButtons[1].addEventListener("click" , () => {
        window.open("https://app.projecthealthyminds.com/?utm_campaign=mb&utm_medium=newsletter&utm_source=morning_brew" , "_blank");
    });

    toolButtons[2].addEventListener("click" , () => {
        let journalHTML =  `
            <h3 class="modal-heading">Daily Reflection Prompt</h3>
            <p class="journal-prompt">"${currentDailyPrompt}"</p>
            <textarea id="journal-text-entry" class="journal-textarea" placeholder="Express your thoughts!"></textarea>
            <button class="soundscape-action-button submit-journal-button" onclick="window.saveJournalEntry()">Save Reflection</button>

            <div class="log-list">
            <strong class="log-title">Previous Entries:</strong>
            <div id="journal-entries-container">
            ${journalLogs.map((j, idx) => `
                <div class="journal-log-entry"
                data-index="${idx}"
                style="cursor: pointer; padding: 6px; border-bottom: 1px solid rgba(255,255,255,0.1); transition: background 0.2s;">
                <strong>${j.date}:</strong> ${j.text.substring(0,40)}${j.text.length > 40 ? '...' : ''}
                </div>
                
                ` ).join('') || '<div style="opacity: 0.5;"> No previous logs found.</div>'
            }
            </div>
            </div>
            </div>`;

        openModal(journalHTML);


        const logEntries = document.querySelectorAll(".journal-log-entry");
        logEntries.forEach(entry => {
            entry.addEventListener("click" , (e) => {
                const idx = entry.getAttribute("data-index");
                if(window.viewJournalEntry) {
                    window.viewJournalEntry(parseInt(idx, 10));
                }
            });

            entry.addEventListener("mouseenter", () => {
                entry.style.background = "rgba(255, 255, 255, 0.05)";
            });
            entry.addEventListener("mouseleave", () => {
                entry.style.background = "transparent";
        });
    });
});


    toolButtons[3].addEventListener("click" , () => {
        let moodHTML = `
            <h3 class="modal-heading centered-heading">How are you feeling today?</h3>
            <div class="mood-emoji-container">
                <button class="emoji-button" onclick="window.logUserMood('😀' , 'Happy')">😀</button>
                <button class="emoji-button" onclick="window.logUserMood('😞' , 'Sad')">😞</button>
                <button class="emoji-button" onclick="window.logUserMood('☺️' , 'Peaceful')">☺️</button>
                 <button class="emoji-button" onclick="window.logUserMood('🧘‍♀️' , 'Grounded')">🧘‍♀️</button>
                <button class="emoji-button" onclick="window.logUserMood('💤' , 'Tired')">💤</button>
                <button class="emoji-button" onclick="window.logUserMood('🚀' , 'Creative')">🚀</button>
                 <button class="emoji-button" onclick="window.logUserMood('🌱' , 'Reflective')">🌱</button>
            </div>

            <div class="log-list">
                <strong class="log-title">Your Mood Patterns Tracking Log:</strong>
                ${moodLogs.map(m => `<div class="mood-log-entry">${m.date}-${m.emoji} (${m.label})</div>`).join('') || '<div style= "opacity:0.5;">No check-ins captured yet.</div>'}
             </div>`;

             openModal(moodHTML);
    });
}

window.toggleTodoItem = (index) => {
    todoList[index].done = !todoList[index].done;
    localStorage.setItem('yss_todos', JSON.stringify(todoList));

   const toolButtons = document.querySelectorAll(".tools-row .tool-icon");
    if(toolButtons.length > 0) {
    toolButtons[0].click();
    }
};

window.saveJournalEntry = () => {
    const entryElement = document.getElementById("journal-text-entry");
    if(!entryElement) return;

    const txt = entryElement.value.trim();
    if(!txt) return;

    journalLogs.unshift({ date: new Date().toLocaleDateString(), text: txt, prompt: currentDailyPrompt });
    localStorage.setItem('yss_journals', JSON.stringify(journalLogs));

    const toolButtons = document.querySelectorAll(".tools-row .tool-icon");
    if(toolButtons.length >=3) {
    toolButtons[2].click();
    }
   
};
    
    window.viewJournalEntry = (index) => {
        const entry = journalLogs[index];
        if (!entry) return;


        const viewHTML = `
            <h3 class="modal-heading">Review Reflection</h3>
            <span style="font-size: 0.75rem; opacity: 0.6; display: block; margin-bottom: 10px;">Entered on: ${entry.date}</span>

            <p class="journal-prompt" style="border-left: 2px solid rgba(255,255,255,0.3); padding-left: 10px;">
            <strong>Prompt:</strong><br>"${entry.prompt || 'Daily Reflection'}"
            </p>

            <div style="background: rgba(0, 0, 0, 0.2); padding: 15px; border-radius: 8px; font-family: 'Exos' , sans-serif; font-size:0.9rem; line-height: 1.5; max-height: 200px; overflow-y:auto; white-space: pre-wrap; margin-bottom: 20px;">${entry.text}
            </div>

            <button onclick="window.backToJournalPrompt()" class="soundscape-action-button" style="width: 100%; padding: 8px; border-radius: 5px; cursor: pointer;">
            &larr; Back to Journaling</button>
        `;




    if(modalBody) {
         modalBody.innerHTML = viewHTML;
        }
    };

    window.backToJournalPrompt = () => {
    const toolButtons = document.querySelectorAll(".tools-row .tool-icon");
    if(toolButtons.length >=3) {
    toolButtons[2].click();
    }
};

window.logUserMood = (emoji, label) => {
   const timestamp = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  

   moodLogs.unshift({ date: timestamp, emoji, label });
    localStorage.setItem('yss_moods', JSON.stringify(moodLogs));

    const toolButtons = document.querySelectorAll(".tools-row .tool-icon");
    if(toolButtons.length >=4) {
        toolButtons[3].click();
    }


};



// ========================  Google OAuth
// ==========================

function initGoogleAuth() {
    fetch('/api/auth/me')
    .then(response => response.json())
    .then(data => {
        if(data.authenticated) {
            currentUser = data.user;
            updateDashboardTime();
        }else {
            renderGoogleButton();
        }
    });
}

function renderGoogleButton() {
    if (typeof google === "undefined") return;

    google.accounts.id.initialize({
        client_id:"962888758021-tfoiupdvst62ilnp5vrehosc729i9o8r.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline" , size: "large"}
    );
}


function handleCredentialResponse(response) {
    fetch('/api/auth/google' , {
        method: 'POST' , 
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ token: response.credential })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentUser = data.user;
            updateDashboardTime();
            document.getElementById("google-signin-button").style.display = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded" , () => {
    console.log("Dashboard is fully loaded.");
    initTools();
    setTimeout(initGoogleAuth, 1000);
});



// ========================  AI Wellness Dashboard Functionality
// ==========================

async function fetchAIMotivation(mood, emoji) {
    try {
        const response = await fetch('/api/get-ai-quote' , {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mood: mood,
                date: new Date().toLocaleDateString("en-US" , { weekday: 'long' , day: 'numeric' })
            })
        });
        const data = await response.json();

        if (data.quote) {
            const quoteText = document.getElementById("ai-quote-text");
            quoteText.innerText = data.quote;

            const quoteContainer = document.getElementById("ai-quote-container");
            quoteContainer.style.display = "block";        
    }
} catch(error) {
    console.error("Frontend fetch error:" , error);
}

}

window.fetchAIMotivation = fetchAIMotivation;


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
