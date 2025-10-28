const {Category, User} = require("../models");

const addCategory = async(req, res, next) => {
    try{
        const {title, desc} = req.body;
        const {_id} = req.user;

        const isCategoryExists = await Category.findOne({title});

        if (isCategoryExists){
            res.code = 400;
            throw new Error("Category already exists");
        }

        const user = await User.findById(_id);
        if (!user){
            res.code = 400;
            throw new Error("User not found");
        }

        const newCategiry = new Category({title, desc, updatedBy: _id});
        await newCategiry.save();

        res.status(200).json({code: 200, status: true, message: "category succesfully created"});

    }catch(error){
        next(error);
    }
}

const updateCategory = async (req, res, next) => {
    try{
        const {id} = req.params;
        const {_id} = req.user;
        const {title, desc} = req.body;

        const category = await Category.findById(id);
        if (!category){
            res.code = 404;
            throw new Error("Category not found");
        }

        const isCategoryExists = await Category.findOne({title});
        if (isCategoryExists && isCategoryExists.title === title && String(isCategoryExists._id) !== String(category._id)){
            
            res.code = 400;
            throw new Error("Title already exists")
        }

        category.title = title ? title : category.title;
        category.desc = desc;
        category.updatedBy = _id;
        await category.save();

        res.status(200).json({code: 200, status: true, message: "category succesfully updated", data: {category}});
    }catch(error){
        next(error);
    }
}

const deleteCategory = async (req, res, next) => {
    try{
        const {id} = req.params;

        const category = await Category.findById(id);

        if (!category){
            res.code = 404;
            throw new Error("Category not found");
        }

        await Category.findByIdAndDelete(id);
        res.status(200).json({code: 200, status: true, message: "category succesfully deleted"});

    }catch(error){
        next(error);
    }
}


const getCategories = async (req, res, next) => {
    try{
        const {q, size, page} = req.query;
        let query = {};

        const sizeNumber = parseInt(size) || 10;
        const pageNumber = parseInt(page) || 1;


        if (q){
            const search = RegExp(q, "i");
            console.log(search);
            query = {$or: [{title: search}, {desc: search}]};
        }

        const total =  await Category.countDocuments(query);
        const pages = Math.ceil(total / sizeNumber);

        const categories = await Category.find(query).skip((pageNumber - 1) * sizeNumber).limit(sizeNumber).sort({updatedBy : -1});
         res.status(200).json({code: 200, status: true, message: "get categories succesfully", data: {categories, total, pages}});

    }catch(error){
        next(error);
    }
}

const getCategory = async (req, res, next) => {
    try{
        const {id} = req.params;
        const category = await Category.findById(id);
        if (!category){
            res.code = 404;
            throw new Error("category not found");
        }
         res.status(200).json({code: 200, status: true, message: "get category succesfully", data: {category}});

    }catch (error){
        next()
    }
}
module.exports = {addCategory, updateCategory, deleteCategory, getCategories, getCategory}
