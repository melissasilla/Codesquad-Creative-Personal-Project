


const express = require("express");
const path = require("path");
const app =  express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "public", "home.html"));
});

app.listen(PORT, () => {
    console.log(`Sever is running at http://localhost:${PORT}`);
});