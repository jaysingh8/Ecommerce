import cartModel from '../models/cart.model.js'
import productModel from '../models/product.model.js'
import { stockOfVariant } from '../dao/product.dao.js'

export const addToCart = async (req,res)=>{

    const {productId, variantId} = req.params

    const {quantity} = req.body

    const product = await productModel.findOne({_id:productId, "variants._id":variantId})

    if(!product){
        return res.status(404).json({message:"Product or variant not found",
            success:false
        })
    }

    const stock = await stockOfVariant(productId, variantId)

    const cart = (await cartModel.findOne({user:req.user._id})) || await cartModel.create({user:req.user._id})

    const isProductAlreadyInCart = cart.items.some(item=>item.product.toString() === productId && item.variant.toString() === variantId)

    if(isProductAlreadyInCart){
      
        const quantityInCart = cart.items.find(item=>item.product.toString() === productId && item.variant.toString() === variantId).quantity

        if( quantityInCart + quantity > stock){
            return res.status(400).json({message:`Only ${stock - quantityInCart} items left in stock and you already have ${quantityInCart} items in your cart`,
                success:false
            })
        }
        await cartModel.findOneAndUpdate({_id:cart._id, "items.product":productId, "items.variant":variantId},{
            $inc:{"items.$.quantity":quantity}
        },{new:true})

    }

    if(quantity > stock){
        return res.status(400).json({message:`Only ${stock} items left in stock`,
            success:false
        })
    }


    cart.items.push({
        product:productId,
        variant:variantId,
        quantity,
        price:product.price
    })

    await cart.save()
    return res.status(200).json({
        message:"Product added to cart",
        success:true,
        cart
    })


}


export const getCart = async (req,res)=>{

    const user = req.user

    const cart = await cartModel.findOne({user :user._id}).populate("items.product").populate("items.variant")
    
    return res.status(200).json({
        message:"Cart fetched successfully",
        success:true,
        cart
    })
}

