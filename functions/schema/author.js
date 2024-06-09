const mongoose = require('mongoose')
const { Schema } = mongoose;

const authorSchema = new Schema({
    recipe: {
        type: String,
        require: true
    },
    ingredients: {
        type: String,
        require: true
    }
});

authorSchema.pre('save', function (next) {
    const recipe = this.recipe.toLowerCase().replace(/\s/g, '');
    const ingredients = `${this.recipe}${this.ingredients}`;
    next();
});

module.exports =authorSchema;