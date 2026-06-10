import mongoose, { Mongoose } from 'mongoose'
import priceSchema from './price.schema.js'

const cartScehma = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    items:[
        {
            products:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product',
                required:true
            },varient:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product.varient'
            },quantity:{
                type:Number,
                default:1
            },
            price:{
                type:priceSchema,
                required:true
            }
        }
    ]
})

const cartModel = mongoose.model('cart',cartScehma)

export default cartModel