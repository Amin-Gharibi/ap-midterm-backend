const path = require("path");
const fs = require("fs")
const express = require("express");
const { setHeaders } = require("./middlewares/headers");
const { errorHandler } = require("./middlewares/errors");


//*routes import
///////////////

const app = express();

//* BodyParser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// create dynamic-content container folder
const uploadDirectories = [path.join("public", 'usersPictures'), path.join("public", "moviesPictures"), path.join("public", "articlesCovers")]
uploadDirectories.forEach(dir => {
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir, { recursive: true });
	}
})

//* CORS Policy Definitions
app.use(setHeaders);

//* Static Folder
app.use(express.static(path.join(__dirname, "public")));


//* Routes
////////////

//* Error Controller
app.use((req, res) => {
	console.log("this path is not available:", req.path);
	res.status(404).sendFile(staticPaths[404])
});
app.use(errorHandler);

module.exports = app;
