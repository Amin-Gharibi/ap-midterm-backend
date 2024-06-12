const path = require("path");
const fs = require("fs")
const express = require("express");
const { setHeaders } = require("./middlewares/headers");
const { errorHandler } = require("./middlewares/errors");


//*routes import
const authRoutes = require("./routes/auth");
const castRoutes = require("./routes/castUser");
const movieRoutes = require("./routes/movies");
const articlesRoutes = require("./routes/articles");
const commentRoutes = require("./routes/comments");
const normalUsersRoutes = require("./routes/normalUser");
const favoritesRoutes = require("./routes/favorites");


const app = express();

//* BodyParser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// create dynamic-content container folder
const uploadDirectories = [path.join("public", 'usersProfilePictures'), path.join("public", "moviesPictures"), path.join("public", "articlesCovers")]
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
app.use("/api/auth", authRoutes)
app.use("/api/cast", castRoutes)
app.use("/api/movie", movieRoutes)
app.use("/api/article", articlesRoutes)
app.use("/api/comment", commentRoutes)
app.use("/api/user", normalUsersRoutes)
app.use("/api/favorite", favoritesRoutes)


//* Error Controller
app.use((req, res) => {
	console.log("this path is not available:", req.path);
	res.status(404).send({message: "Route Not Found...!"})
});
app.use(errorHandler);

module.exports = app;
