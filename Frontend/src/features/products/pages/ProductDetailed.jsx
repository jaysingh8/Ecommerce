import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useProduct } from '../hook/useProduct';

const ProductDetailed = () => {
    const { productId } = useParams();

    const [product, setProduct] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [mainImage, setMainImage] = useState(null)

    const { handleGetProductById } = useProduct()

    async function fetchProduct() {
        const data = await handleGetProductById(productId)
        setProduct(data)
        if (data && data.images && data.images.length) {
            setCurrentIndex(0)
            setMainImage(data.images[0].url)
        }
    }

    useEffect(() => {
        fetchProduct()
    }, [productId])

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F6F1]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="text-gray-500">Loading product...</div>
            </div>
        )
    }

    const priceFormatted = (() => {
        try {
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: product.price.currency }).format(product.price.amount)
        } catch (e) {
            return `${product.price.amount} ${product.price.currency || ''}`
        }
    })()

    return (
        <div className="min-h-screen bg-[#F8F6F1] flex items-start justify-center p-4 sm:p-6 lg:p-12" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="w-full max-w-6xl bg-white rounded-3xl border border-[#EEE7D8] shadow-[0_25px_80px_rgba(0,0,0,0.05)] p-4 sm:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                {/* LEFT: Vertical thumbnails (left) and main image (right) */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex items-start">
                        <div className="flex flex-row lg:flex-col gap-3 lg:gap-4 order-1 lg:order-0">
                            {product.images && product.images.map((img, idx) => (
                                <button
                                    key={img._id}
                                    onClick={() => {
                                        setCurrentIndex(idx)
                                        setMainImage(img.url)
                                    }}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border ${idx === currentIndex ? 'border-[#B79A4A]' : 'border-[#E7E1D2]'} bg-white flex-shrink-0`}
                                >
                                    <img src={img.url} alt={`${product.title}-${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>


                    <div className="flex-1">
                        <div className="relative rounded-2xl overflow-hidden flex items-center justify-center" style={{ aspectRatio: '4 / 5' }}>
                            <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />

                            {/* Prev / Next buttons to swipe images */}
                            <button
                                onClick={() => {
                                    if (!product.images || !product.images.length) return
                                    const next = (currentIndex - 1 + product.images.length) % product.images.length
                                    setCurrentIndex(next)
                                    setMainImage(product.images[next].url)
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow"
                                aria-label="Previous image"
                            >
                                ‹
                            </button>

                            <button
                                onClick={() => {
                                    if (!product.images || !product.images.length) return
                                    const next = (currentIndex + 1) % product.images.length
                                    setCurrentIndex(next)
                                    setMainImage(product.images[next].url)
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow"
                                aria-label="Next image"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>

                {/* DETAILS */}
                <div className="flex flex-col justify-between">
                    <div>
                        <p className="uppercase tracking-[0.25em] text-xs text-[#B79A4A] font-medium mb-2">Premium Fashion House</p>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#18181B]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{product.title}</h1>

                        <p className="mt-3 text-xl sm:text-2xl text-[#18181B] font-semibold">{priceFormatted}</p>

                        <div className="mt-4 text-sm sm:text-[15px] leading-6 text-[#6B7280]">
                            {product.description}
                        </div>

                        <div className="mt-4 text-sm text-[#8A8A8A] flex flex-col gap-2">
                            <div>SKU: <span className="text-[#444] font-medium">{String(product._id).slice(-6)}</span></div>
                            <div>Added: <span className="text-[#444] font-medium">{new Date(product.createdAt).toLocaleDateString()}</span></div>
                            <div className="flex items-center gap-4">
                                {/* Render stars: filled if rating > 0, otherwise blank stars */}
                                <div className="text-lg">
                                    {(() => {
                                        const r = product.rating || 0
                                        const filled = Math.round(r)
                                        return Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} className={i < filled ? 'text-[#B79A4A]' : 'text-[#D1D5DB]'}>{i < filled ? '★' : '☆'}</span>
                                        ))
                                    })()}
                                </div>
                                <div className="text-[13px] text-[#6B7280]">{product.rating ? `${product.rating.toFixed(1)} / 5` : ''}</div>
                            </div>

                            {/* Small promotional lines for Clothy */}
                            <div className="mt-3 text-sm text-[#6B7280]">
                                <p>Crafted with precision. Designed with intention.</p>
                                <p>Timeless pieces built to last.</p>
                                <p>Free shipping on orders over ₹1999.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="text-sm text-[#6B7280] mb-4">Estimated delivery: 3-5 days</div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button className="w-full sm:w-auto flex-1 h-12 sm:h-14 rounded-2xl bg-[#B79A4A] text-white font-medium tracking-wide hover:bg-[#A48A42] transition-all duration-200">Add to Cart</button>
                            <button className="w-full sm:w-auto flex-1 h-12 sm:h-14 rounded-2xl border border-[#B79A4A] text-[#B79A4A] font-medium hover:bg-[#B79A4A]/10 transition-all duration-200">Buy Now</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProductDetailed