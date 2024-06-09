const express = require('express');
const AuthorModel = require('../models/author');

 const router = express.Router();

 //Get all authors
 router.get('/', async (req, res) =>{
    try{
        const authors = await AuthorModel.find();
        res.json(authors);
    } catch (err) {
        res.status(500).json({message: err.message});        
    } 
});

//get a single authro
router.get('/:id', getAuthor,(req, res)=>{
    res.json(res.author);
});

//create an author
router.post('/', async(req,res)=>{
    try{
        //validate request body
        if (!req.body.recipe || !req.body.ingredients) {
            return res.status(400).json({message: 'Recipe and Ingredients are required'});
        }

        //check if the author's name already exists
        const existingAuthor = await AuthorModel.findOne({ recipe: req.body.recipe});
        if (existingAuthor) {
            return res.status(400).json({message: 'Recipe already exists'});            
        }
        const author = new AuthorModel(req.body);
        const newAuthor = await author.save();
        res
        .status(201)
        .json({message:'Recipe added successfully, author: newAuthor'});
    }catch (err){
        res.status(400).json({message: err.message});
    }
});

//Update an author
router.patch('/:id',getAuthor, async(req, res) =>{
    try{
        if (req.body.recipe != null){
            res.author.recipe = req.body.recipe;
        }
        const updatedAuthor = await res.author.save();
        res.json(updateAuthor);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
});

router.put('/:id', getAuthor, async (req, res) => {
    try{
        const updateAuthor = await AuthorModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: True }
        );
        res.json(updateAuthor);
    }catch (err){
        res.status(400).json({ message: err.message });
    }
});

//Delete an author
router.delete('/:id', getAuthor, async(req, res)=>{
    try{
        await AuthorModel.findByIdAndDelete(req.params.id);
        res.json({message: 'Recipe deleted'});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

//Middleware function to get a single author by ID
async function getAuthor(req, res, next){
    try {
        const author = await AuthorModel.findById(req.params.id);
        if (!author){
            return res.status(404).json({message: 'Recipe not found'});
        }
        res.author = author;
        next();
    }catch (err){
        res.status(500).json({message: err.message});
    }
}

module.exports = router;