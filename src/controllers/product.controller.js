import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/responseHandler.js";
import logger from "../config/logger.js";

export const createProduct = asyncHandler(async (req,res) => {

    const product = await Product.create(req.body);
    return successResponse(res,product, "Product created successfully",201);

})

export const updateProduct = asyncHandler(async (req,res) => {

    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id,req.body,{new:true});
    return successResponse(res,product, "Product updated successfully",200);
    
})

export const deleteProduct = asyncHandler(async (req,res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    return successResponse(res,product, "Product deleted successfully",200);
    
})

export const getProduct = asyncHandler(async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    return successResponse(res,product, "Product fetched successfully",200);
    
})

export const getProducts = asyncHandler(async (req,res) => {
    const products = await Product.find();
    logger.info(`Fetched ${products.length} products`);
    return successResponse(res,products, "Products fetched successfully",200);
    
})