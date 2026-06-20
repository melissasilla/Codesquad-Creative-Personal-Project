const express = require("express");
const path = require("path");
const { google } = require("googleapis");
const axios = require ("axios");
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');
const session  = require('express-session');
const { OAuth2Client } = require('google-auth-library');



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000

//Google OAuth
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false}
}));


//initializing Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// server.js to read JSON data from Zapier
app.use(express.json());

app.use(express.static("public"));


let dailyInstagramPostLink = "";
let historyOfQuotes = [] ; 


//Google Drive API

const GOOGLE_DRIVE_FOLDER_ID = "1v1BM2bDtP8DD39qMMvBjpXQYZCwJndIv";

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "credentials.json"),
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

async function scanGoogleDriveFolder() {
    try{
        const drive = google.drive({version: "v3" , auth });

        console.log("Starting scan of Google Drive folder....");

        const response = await drive.files.list({
            q:`'${GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false and mimeType contains 'image/'`,
            fields:"files(id, name, webViewLink, createdTime)",
            orderBy:"createdTime desc",
            pageSize: 50
        });

        const files = response.data.files;
        if (!files || files.length ===0){
            console.log("The scan has been completed. Google Drive folder is currently empty");
            return;
        }

        historyOfQuotes = files.map(file => ({
            url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`,
            name: file.name
        }));

        console.log(`Success! ${historyOfQuotes.length} has been automatically uploaded from Google Drive folder memory.`);
    }catch(error){
        console.error("Google Drive API has encountered an issue scanning folder:" , error.message);
    }
}

scanGoogleDriveFolder();



//Check-in (health endpoint)

app.get('/api/health', (request,response) =>{
    response.json({
        status: "healthy",
        timestamp: new Date(),
        Message: "front-end and backend are in sync!"
    });
});



//For Instagram automation functionality
app.post("/api/new-post" , (request ,response) => {
    console.log("Data has been received by Zapier!" , request.body);

    const incomingPost = request.body.postLink || request.body.image_url || request.body.url;

if(incomingPost) {
    dailyInstagramPostLink = incomingPost;

    console.log("Success! Updated dailyInstagramPostLink to: , dailyInstagramPostLink");

    return response.status(200).json({ message: "successfully uploaded daily instagram link." });
}else {
    console.log("Warning: link was targeted, but no recognizable link was found.");
    return response.status(400).json({ error: "error: no link provided. Expected postLink or image_url. "});
}

});

app.get("/api/new-image", (request, response) => {
    response.json({url: dailyInstagramPostLink});
});



//Google Drive + Zapier
app.post("/api/new-quote" , (request, response) => {
    console.log("Quote data has been received from Zapier!" , request.body);

    const incomingUrl = request.body.image_url || request.body.url || request.body.file || request.body.postLink;

    if (incomingUrl) {
        historyOfQuotes.unshift({ url: incomingUrl });
        console.log("New quote has been saved!" , historyOfQuotes);
        response.status(200).json({ message: "Saved successfully", currentTimeline: historyOfQuotes });
    }else {
        console.log("Failure to save, no URL properties found");
        response.status(400).send("No image URL was provided");
    }
});

app.get("/api/get-all-quotes", async (req, res) => {
    try {
        // Your code that returns the historical quotes array...
        res.json(historyOfQuotes); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "public", "home.html"));
});



//For CORS Proxy

app.get("/api/proxy-image", async (request, response) =>{
    try{
        const imageUrl = request.query.url;
        if(!imageUrl){
            return response.status(400).send("Missing image URL");
        }

        const imageResponse = await axios({
            method:"get",
            url:imageUrl,
            responseType:"stream",
            maxRedirects: 10
        });

        response.setHeader("Content-Type" , imageResponse.headers["content-type"]);

        imageResponse.data.pipe(response);
    }catch(error){
        console.error(" Encountered an error when retrieving image:" , error.message);
        response.status(500).send("failure for proxy")
    }
});


// AI Wellness Quote Endpoint

app.post("/api/get-ai-quote" , async (req, res) => {
    const { mood, date } = req.body;

    const systemInstruction =

    "You are an empathetic, grounded AI Wellness Coach. Your goal is to write a short, powerful, " + "one sentence motivational reminder or quote tailored specifically to the user's mood and today's date. " + "Keep it concise so it never cuts off.";

    const userPrompt = 
    `Today's date is ${date || 'today'}. The user is feeling: ${mood || 'Neutral'}. ` +
    `Write a completely unique, inspiring quote for them. Avoid generic platitudes. ` + 
    `Do not wrap it on quotation marks. Do not include any introductory phrases like 'Here is your quote' .`;


    try {
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.85,
                maxOutputTokens: 300,
            }
        });

        console.log(aiResponse);

    let aiQuote = "";
    if (aiResponse.candidates?.[0]?.content?.parts) {
    aiQuote = aiResponse.candidates[0].content.parts
        .map(part => part.text || "")
        .join("")
        .trim();
    }else if (typeof aiResponse.text === "function") {
        aiQuote = aiResponse.text().trim();
    }else {
        aiQuote = aiResponse.text?.trim() || "Take a deep breath and center yourself.";
    }

    res.json({ quote: aiQuote });

    }catch (error) {
        console.error("Gemini API Error:" , error);
        res.status(500).json({ error: "Unable to communicate with Wellness API"});
    }
});



//Google OAuth Endpoint
app.post('/api/auth/google', async (request, response) => {
    const { token } = request.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        request.session.user = {
            id: payload.sub,
            name: payload.given_name || payload.name,
            email: payload.email,
            picture: payload.picture
        };

        response.json({ success: true, user: request.session.user });
    }catch (error) {
        console.error('Google Auth Verification failed:', error);
        response.status(401).json({ error: 'Invalid token' });
    }
});

app.get('/api/auth/me' , (request, response) => {
    if (request.session.user) {
        response.json ({ authenticated: true, user: request.session.user });
    }else {
        response.json ({ authenticated: false });
    }
});

app.post('/api/auth/logout' , (request,response) => {
    request.session.destroy( () => {
        response.json({ success:true });
    });
});







app.listen(PORT, () => {
    console.log(`Sever is running at http://localhost:${PORT}`);
});



