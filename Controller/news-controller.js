const newsModel = require("../Model/news")

const createNews = async (req, res) =>{
    const {title, content, author} = req.body
    try{
        const newNews = new newsModel({title, content, author})
        const savedNews = await newNews.save()
        return res.status(201).json({msg: "New news created"})
    } catch (error){
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}

const getAllNews = async (req, res) =>{
    try{
        const getNews = await newsModel.find()
        res.json(getNews)
    } catch (error){
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}

const singleNews = async (req,res) =>{
    try{
        const newsId = req.params.newsId;
        const news = await newsModel.findOne(newsId)
        if(!news){
            return res.status(404).json({error: "News not found"})
        }
        res.json(news);
    } catch (error){
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}

const updateNews = async (req, res)=>{
    try{
        const newsId = req.params["id"]
        const {title, content, author} = req.body;
        const updatedNews = await newsModel.findOneAndUpdate({_id:newsId}, req.body,
            {new:true, runValidators:true});
        if(!updatedNews){
            return res.status(404).json({error: "News not found"})
        }
        res.json(updatedNews)
    } catch (error){
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}

const deleteNews = async (req,res)=>{
    const _id = req.params["id"];
    const sameId = await newsModel.findById({_id});
    if(sameId){
        await newsModel.findOneAndDelete({_id});
        return res.json({msg: "News deleted successfully"})
    }
    res.json({error: "No News found"})
}

module.exports = {
    createNews,
    getAllNews,
    singleNews,
    updateNews,
    deleteNews
}