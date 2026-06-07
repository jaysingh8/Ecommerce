import { createProduct , getAllProducts, getProductById, getSellerProduct } from "../services/product.api.js";

import { useDispatch } from "react-redux";
import { setProducts, setSellerProducts } from "../states/product.slice.js";


export const useProduct = ()=>{


    const dispatch = useDispatch()
    async function handleCreateProduct ( formData){
        const data = await createProduct(formData)
        return data.product
    }


    async function handleGetSellerProduct (){

        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products))
        return data.product
    }

    async function handleGetAllProducts() {
        const data = await getAllProducts()
        dispatch(setProducts(data.products))
    }

    async function handleGetProductById(productId) {
        const data = await getProductById(productId)
        return data.product
        
    }
    return {handleCreateProduct , handleGetSellerProduct , handleGetAllProducts , handleGetProductById}
}