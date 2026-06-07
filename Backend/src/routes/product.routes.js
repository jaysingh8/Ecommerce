import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProduct, getAllProducts, getProductDetail, getSellerProducts } from "../controllers/product.controllers.js";
import multer from 'multer'
import {createProductValidator} from "../validators/products.validator.js"

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024
    }
})

const router = Router()

router.post("/", authenticateSeller, upload.array('images', 7), createProductValidator, createProduct)

router.get("/seller", authenticateSeller, getSellerProducts)

router.get("/",getAllProducts)

router.get("/detail/:id",getProductDetail)



export default router