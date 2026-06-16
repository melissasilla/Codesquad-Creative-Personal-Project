
const express = require("express");
const path = require("path");
const { google } = require("googleapis");
const axios = require ("axios");
const app =  express();
const PORT = 3000;




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
    return response.status(400).json({ error: "error: no link provided. Expected postLink or image_url. "});

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




app.listen(PORT, () => {
    console.log(`Sever is running at http://localhost:${PORT}`);
});



