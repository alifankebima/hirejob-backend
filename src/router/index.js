// Import express and router
const express = require("express");
const router = express.Router();

// Import route
const recipeRouter = require("./recipe");
const likedRecipeRouter = require("./likedRecipe");
const savedRecipeRouter = require("./savedRecipe");
const userRouter = require("./user");

// Use route
router.use("/v1/recipe", recipeRouter);
router.use("/v1/liked-recipe", likedRecipeRouter);
router.use("/v1/saved-recipe", savedRecipeRouter);
router.use("/v1/user", userRouter);

// Export router
module.exports = router;