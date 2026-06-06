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
    try{
        const response = await fetch ("/api/new-image");
        const data = await response.json();

        if (data.url) {
            // const img = document.querySelector(".img");

            // img.setAttribute("crossOrigin", "anonymous");
            // img.src = data.url; 

// using colorThief library to change background colors with flexibility 


        img.onload = () => {
            const colorThief = new colorThief();
            
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


matchWithInstagram();


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



// ======================== Zapier Google Drive  ==========================

function convertGoogleDriveUrl(url) {
    if (!url) {
        return "images/474.png"
    }

    if (url.includes("drive.google.com") || url.includes ("drive.usercontent.google.com")) {
        const fileId= url.match(/id=([^&]+)/)?.[1] || url.match(/\/d\/([^/]+)/)?.[1];
    
        if(fileId) {
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
 
}
return url;
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
    imgElement.crossOrigin = "Anonymous";

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
    
        imgElement.src = convertGoogleDriveUrl(currentQuote.url);
    };
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


