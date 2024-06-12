const express = require("express");

const favoriteMoviesControllers = require("../controllers/favoriteMovies");
const favoriteArticlesControllers = require("../controllers/favoriteArticles")
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router
	.route('/movie')
	.get(isAuth, favoriteMoviesControllers.getAll)
	.post(isAuth, favoriteMoviesControllers.create)
	.delete(isAuth, favoriteMoviesControllers.delete)

router
	.route('/article')
	.get(isAuth, favoriteArticlesControllers.getAll)
	.post(isAuth, favoriteArticlesControllers.create)
	.delete(isAuth, favoriteArticlesControllers.delete)

module.exports = router;
