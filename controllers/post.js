const {File, Category, Post} = require("../models");

const addPost = async(req, res, next) => {
    try {
        const {title, desc, file, category} = req.body;
        const {_id} = req.user;

        if(file){
            const isFileExists = await File.findById(file);
            if(!isFileExists){
                res.code = 404;
                throw new Error("file not found");
            }
        }

        const isCategoryExists = await Category.findById(category);
        if(!isCategoryExists){
            res.code = 404;
            throw new Error("Category not found");
        }

        const newPost = new Post({
            title, desc, file, category, updatedBy: _id
        });

        await newPost.save();
        res.status(201).json({code: 201, status: true, message: "Post created succesfully"});

    }catch(error){
        next(error);
    }
}


const updatePost = async (req, res, next) => {
    try{
        const {title, desc, file, category} = req.body;
        const {id} = req.params;
        const {_id} = req.user;

        if (file){
            const ifFileExist = await File.findById(file);
            if (!ifFileExist){
                res.code = 404;
                throw new Error("File not found");
            }
        }

        if (category){
            const isCategoryExists = await Category.findById(category);
            if(!isCategoryExists){
                res.code = 404;
                throw new Error("Category not found");
            }
        }

        const post = await Post.findById(id);
        if(!post){
            res.code = 404;
            throw new Error("post not found");
        }

        post.title = title ? title : post.title;
        post.desc = desc;
        post.file = file;
        post.category = category ? category : post.category;
        post.updatedBy = _id;

        await post.save();

        res.status(200).json({code: 200, status: true, message: "Post updated succsfully", data: {post}});
    }catch(error){
        next(error);  
    }
}

const deletePost = async (req, res, next) => {
    try{

        const {id} = req.params;

        const post = await Post.findById(id);
        if(!post)
        {
            res.code = 404;
            throw new Error("post not found");
        }

        await  Post.findByIdAndDelete(id);

        res.status(200).json({code: 200, status: true, message: "Post deleted succsfully"});
    }catch(error){
        next(error);
    }
}

const getPosts = async (req, res, next) => {
    try{
        const {page, size, q, category} = req.query;

        const pageNumber = parseInt(page) || 1;
        const sizenumber = parseInt(size) || 10;

        let query = {};

        if (q){
            const search = new RegExp(q, "i");
            query = {
                $or: [{title: search}]
            }
        }
        if (category){
            query = {
                ...query, category
            }
        }

        const total = await Post.countDocuments(query);
        const pages = Math.ceil(total/ sizenumber)
        const posts = await Post.find(query).populate("file").populate("category").populate("updatedBy", "-password, -verificationCode -forgetPasswordCode").sort({updatedBy: -1}).skip((pageNumber - 1) * sizenumber).limit(sizenumber);
        res.status(200).json({code: 200, status: true, message: "get post limit succsfully", data: {posts, total, pages}});
    }catch (error){

    }
}

const getPost = async (req, res, next) => {
    try{
        const {id} = req.params;

        const post = await Post.findById(id).populate("file").populate("category").populate("updatedBy", "-password, -verificationCode -forgetPasswordCode");
        if (!post){
            res.code = 404;
            throw new Error("post not found");
        }
        res.status(200).json({code: 200, status: true, message: "get post succsfully", data: {post}});
    }catch(error){
        next(error);
    }
}
    
module.exports = {addPost, updatePost, deletePost, getPosts, getPost}