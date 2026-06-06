
const express = require("express");
const path = require("path");
const app =  express();
const PORT = 3000;



// server.js to read JSON data from Zapier
app.use(express.json());

app.use(express.static("public"));


let dailyInstagramPostLink = "";
let historyOfQuotes = []; 


//Check-in (health endpoint)

app.get('/api/health', (request,response) =>{
    response.json({
        status: "healthy",
        timestamp: new Date(),
        Message: "front-end and backend are in sync!"
    });
});



//For Instagram
app.post("/api/new-post" , (request ,response) => {
    console.log("Data has been received by Zapier!" , request.body);

    dailyInstagramPostLink = request.body.postLink;

    response.status(200).json({message: "Post link has been received! "});
});

app.get("/api/new-image", (request, response) => {
    response.json({url: dailyInstagramPostLink});
});




//Google Drive + Zapier
app.post("/api/new-quote" , (request, response) => {
    console.log("Quote data has been received from Zapier!" , request.body);

    const incomingUrl = request.body.image_url || request.body.url || request.body.file;

    if (incomingUrl) {
        historyOfQuotes.unshift({ url: incomingUrl });
        console.log("New quote has been saved!" , historyOfQuotes);
        response.status(200).json({ message: "Saved successfully", currentTimeline: historyOfQuotes });
    }else {
        console.log("Failure to save, no URL properties found");
        response.status(400).send("No image URL was provided");
    }
});

app.get("/api/get-all-quotes", (request, response) => {
    response.json(historyOfQuotes);
});


app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "public", "home.html"));
});

app.listen(PORT, () => {
    console.log(`Sever is running at http://localhost:${PORT}`);
});



