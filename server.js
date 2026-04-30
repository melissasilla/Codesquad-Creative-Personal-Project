
const express = require("express");
const path = require("path");
const app =  express();
const PORT = 3000;

// server.js to read JSON data from Zapier
app.use(express.json());

app.use(express.static("public"));


let dailyInstagramPostLink = "";

app.post("/api/new-post" , (request ,response) => {
    console.log("Data has been received by Zapier!" , request.body);

    dailyInstagramPostLink = request.body.postLink;

    response.status(200).json({message: "Post link has been received! "});
});

app.get("api/get-image", (request, response) => {
    response.json({url: dailyInstagramPostLink});
});


app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "public", "home.html"));
});

app.listen(PORT, () => {
    console.log(`Sever is running at http://localhost:${PORT}`);
});