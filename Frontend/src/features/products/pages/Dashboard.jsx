import React, { useEffect } from 'react'
import { Link } from 'react-router'
import { useProduct } from '../hook/useProduct'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'


const Dashboard = () => {
    const { handleGetSellerProduct } = useProduct()
    const sellerProducts = useSelector(state => state.product.sellerProducts)

    const navigate = useNavigate()

    useEffect(() => {
        handleGetSellerProduct()
    }, [])

    const totalProducts = sellerProducts?.length || 0
    const totalValue = sellerProducts.reduce((sum, product) => {
        const amount = Number(product.price.amount || product.price || 0)
        return sum + (Number.isNaN(amount) ? 0 : amount)
    }, 0)

    const getProductImage = (product) => {
        if (!product) return null
        if (typeof product.images?.[0] === 'string') return product.images[0]
        if (product.images?.[0]?.url) return product.images[0].url
        return null
    }
    console.log(sellerProducts);
    

    return (
        <div className="min-h-screen bg-[#F8F6F1] px-4 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 rounded-[34px] bg-white border border-[#EEE7D8] shadow-[0_25px_80px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="bg-linear-to-r from-[#FBF4E8] via-[#F8F6F1] to-[#F8F6F1] p-8 lg:p-12">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <p className="uppercase tracking-[0.35em] text-xs text-[#B79A4A] font-medium mb-4">
                                    Seller Dashboard
                                </p>
                                <h1 className="text-4xl lg:text-5xl text-[#18181B] leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                                    Manage Your Collection
                                </h1>
                                <p className="mt-4 text-[#6B7280] text-base lg:text-lg">
                                    View your listed products, keep stock visible, and quickly add new items with a sleek seller panel.
                                </p>
                            </div>

                            <Link
                                to="/seller/create-product"
                                className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#B79A4A] px-8 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(183,154,74,0.25)] transition duration-300 hover:bg-[#A48A42]"
                            >
                                Create Product
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-6 px-6 pb-10 pt-6 lg:grid-cols-3 lg:px-12">
                        <div className="rounded-3xl border border-[#E7E1D2] bg-white p-6">
                            <p className="text-sm text-[#71717A] uppercase tracking-[0.2em] mb-3">Total Products</p>
                            <p className="text-4xl font-semibold text-[#18181B]">{totalProducts}</p>
                        </div>
                        <div className="rounded-3xl border border-[#E7E1D2] bg-white p-6">
                            <p className="text-sm text-[#71717A] uppercase tracking-[0.2em] mb-3">Estimated Value</p>
                            <p className="text-4xl font-semibold text-[#18181B]">₹{totalValue.toFixed(2)}</p>
                        </div>
                        <div className="rounded-3xl border border-[#E7E1D2] bg-white p-6">
                            <p className="text-sm text-[#71717A] uppercase tracking-[0.2em] mb-3">Active Listings</p>
                            <p className="text-4xl font-semibold text-[#18181B]">{totalProducts}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {sellerProducts?.length > 0 ? (
                        sellerProducts.map((product) => {
                            const imageUrl = getProductImage(product)
                            return (
                                <div 
                                onClick={()=>navigate(`/seller/product/${product._id}`)}
                                key={product._id || product.id || product.title} className="rounded-[30px] border border-[#E7E1D2] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
                                    <div className="h-56 bg-[#F8F6F1] overflow-hidden">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-[#B79A4A] text-3xl">
                                                {product.title?.charAt(0)?.toUpperCase() || 'P'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <h2 className="text-xl font-semibold text-[#18181B]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                                                {product.title || product.name || 'Untitled Product'}
                                            </h2>
                                            <span className="rounded-full bg-[#F8F6F1] px-3 py-1 text-xs font-medium text-[#6B7280]">
                                                {product.price.currency || 'INR'}
                                            </span>
                                        </div>

                                        <p className="text-sm leading-6 text-[#6B7280] mb-5 max-h-18 overflow-hidden">
                                            {product.description || 'No description available.'}
                                        </p>

                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.25em] text-[#B79A4A] mb-1">Price</p>
                                                <p className="text-lg font-semibold text-[#18181B]">₹{Number(product.price.amount || product.price || 0).toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs uppercase tracking-[0.25em] text-[#71717A] mb-1">Status</p>
                                                <span className="inline-flex rounded-full bg-[#FEF3C7] px-3 py-1 text-sm font-medium text-[#B79A4A]">
                                                    Active
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="lg:col-span-3 rounded-[30px] border border-[#E7E1D2] bg-white p-12 text-center">
                            <p className="text-xl font-semibold text-[#18181B] mb-3">No seller products found</p>
                            <p className="text-[#6B7280] mb-8">Create a product listing to start showcasing your collection.</p>
                            <Link
                                to="/seller/create-product"
                                className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#B79A4A] px-8 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(183,154,74,0.25)] transition duration-300 hover:bg-[#A48A42]"
                            >
                                Add Your First Product
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard