import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useProduct } from '../hook/useProduct';

const GOLD = '#b8973a';
const GOLD_DARK = '#8a6e22';
const GOLD_LIGHT = '#fdf9ef';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
  .font-display { font-family: 'DM Serif Display', serif; }
  .font-body    { font-family: 'DM Sans', sans-serif; }
  .text-gold    { color: ${GOLD}; }
  .bg-gold      { background-color: ${GOLD}; }
  .border-gold  { border-color: ${GOLD}; }
  .hover\\:bg-gold-dark:hover { background-color: ${GOLD_DARK}; }
  .hover\\:bg-gold-tint:hover { background-color: ${GOLD_LIGHT}; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up   { animation: fadeUp 0.45s ease forwards; }
  .fade-up-2 { animation: fadeUp 0.45s 0.08s ease forwards; opacity: 0; }
  .fade-up-3 { animation: fadeUp 0.45s 0.16s ease forwards; opacity: 0; }
  .fade-up-4 { animation: fadeUp 0.45s 0.24s ease forwards; opacity: 0; }

  @keyframes dotPulse {
    0%,80%,100% { opacity:.3; transform:scale(.8); }
    40%         { opacity:1;  transform:scale(1); }
  }
  .dot-1 { animation: dotPulse 1.2s ease-in-out infinite; }
  .dot-2 { animation: dotPulse 1.2s .2s ease-in-out infinite; }
  .dot-3 { animation: dotPulse 1.2s .4s ease-in-out infinite; }

  .thumb-btn { transition: border-color .15s, transform .15s; }
  .thumb-btn:hover { transform: scale(1.04); }
  .main-img-wrap img { transition: opacity .25s; }
`;

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? GOLD : 'none'} stroke={filled ? GOLD : '#d1d5db'} strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const ReturnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
  </svg>
);

const ProductDetailed = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainImage, setMainImage] = useState(null);
  const { handleGetProductById } = useProduct();

  async function fetchProduct() {
    const data = await handleGetProductById(productId);
    setProduct(data);
    if (data?.images?.length) {
      setCurrentIndex(0);
      setMainImage(data.images[0].url);
    }
  }

  useEffect(() => { fetchProduct(); }, [productId]);

  if (!product) return (
    <>
      <style>{globalStyles}</style>
      <div className="font-body min-h-screen bg-[#f7f6f3] flex items-center justify-center gap-2">
        <div className="dot-1 w-2 h-2 rounded-full bg-gold" />
        <div className="dot-2 w-2 h-2 rounded-full bg-gold" />
        <div className="dot-3 w-2 h-2 rounded-full bg-gold" />
      </div>
    </>
  );

  const priceFormatted = (() => {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: product.price.currency }).format(product.price.amount);
    } catch {
      return `${product.price.amount} ${product.price.currency || ''}`;
    }
  })();

  const prevImg = () => {
    if (!product.images?.length) return;
    const n = (currentIndex - 1 + product.images.length) % product.images.length;
    setCurrentIndex(n); setMainImage(product.images[n].url);
  };
  const nextImg = () => {
    if (!product.images?.length) return;
    const n = (currentIndex + 1) % product.images.length;
    setCurrentIndex(n); setMainImage(product.images[n].url);
  };

  const rating = product.rating || 0;

  return (
    <>
      <style>{globalStyles}</style>
      <div className="font-body min-h-screen bg-[#f7f6f3] flex items-start justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full max-w-6xl bg-white rounded-3xl border border-[#e8e5de] shadow-[0_30px_80px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* Top brand strip */}
          <div className="border-b border-[#f0ede6] px-8 py-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold">Premium Fashion House · Clothy</span>
            <span className="text-[11px] text-gray-400 tracking-wide">Estimated delivery: 3–5 business days</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* ── LEFT: Gallery ─────────────────────────────── */}
            <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-[#f0ede6] fade-up">
              <div className="flex gap-4">

                {/* Vertical thumbs */}
                {product.images?.length > 1 && (
                  <div className="flex flex-col gap-2.5 pt-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={img._id || idx}
                        onClick={() => { setCurrentIndex(idx); setMainImage(img.url); }}
                        className={`thumb-btn w-[52px] h-[66px] rounded-xl overflow-hidden border-2 flex-shrink-0 ${
                          idx === currentIndex ? 'border-gold' : 'border-[#e8e5de] hover:border-[#c5b89a]'
                        }`}
                      >
                        <img src={img.url} alt={`${product.title}-${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main image */}
                <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#f0ede6]" style={{ aspectRatio: '4/5' }}>
                  <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />

                  {/* Nav arrows */}
                  {product.images?.length > 1 && (
                    <>
                      <button
                        onClick={prevImg}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 shadow-sm transition-all hover:scale-105"
                        aria-label="Previous"
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        onClick={nextImg}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 shadow-sm transition-all hover:scale-105"
                        aria-label="Next"
                      >
                        <ChevronRight />
                      </button>
                    </>
                  )}

                  {/* Image counter pill */}
                  {product.images?.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {currentIndex + 1} / {product.images.length}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Product Info ───────────────────────── */}
            <div className="p-6 lg:p-10 flex flex-col justify-between">
              <div>
                {/* Title & price */}
                <div className="fade-up-2">
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] leading-tight font-normal text-black mb-1">
                    {product.title}
                  </h1>
                  <div className="w-12 h-[2px] bg-gold mt-3 mb-5 rounded-full" />
                </div>

                {/* Rating */}
                <div className="fade-up-2 flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} filled={i < Math.round(rating)} />
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-[13px] text-gray-400 font-medium">{rating.toFixed(1)} / 5</span>
                  )}
                </div>

                {/* Price */}
                <div className="fade-up-3 flex items-baseline gap-3 mb-5">
                  <span className="text-3xl font-semibold tracking-tight text-black">{priceFormatted}</span>
                  <span className="text-[13px] text-gray-400">incl. taxes</span>
                </div>

                {/* Description */}
                <div className="fade-up-3">
                  <p className="text-[15px] leading-relaxed text-gray-500 mb-6 max-w-md">
                    {product.description}
                  </p>
                </div>

                {/* Meta */}
                <div className="fade-up-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[13px] mb-6">
                  <div className="flex items-center justify-between border-b border-[#f0ede6] pb-2.5">
                    <span className="text-gray-400">SKU</span>
                    <span className="font-semibold text-gray-700 font-mono text-[12px]">{String(product._id).slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#f0ede6] pb-2.5">
                    <span className="text-gray-400">Listed</span>
                    <span className="font-medium text-gray-700">{new Date(product.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#f0ede6] pb-2.5">
                    <span className="text-gray-400">Category</span>
                    <span className="font-medium text-gray-700">{product.category || 'Fashion'}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#f0ede6] pb-2.5">
                    <span className="text-gray-400">Currency</span>
                    <span className="font-medium text-gray-700">{product.price?.currency}</span>
                  </div>
                </div>

                {/* Perks */}
                <div className="fade-up-4 grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: <TruckIcon />, label: 'Free shipping', sub: 'Over ₹1,999' },
                    { icon: <ShieldIcon />, label: 'Secure pay', sub: 'Encrypted' },
                    { icon: <ReturnIcon />, label: 'Easy returns', sub: '7-day policy' },
                  ].map(({ icon, label, sub }) => (
                    <div key={label} className="flex flex-col items-center text-center gap-1.5 bg-[#faf9f7] border border-[#f0ede6] rounded-xl py-3 px-2">
                      <span>{icon}</span>
                      <span className="text-[12px] font-semibold text-gray-700">{label}</span>
                      <span className="text-[11px] text-gray-400">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="fade-up-4 flex flex-col sm:flex-row gap-3">
                <button className="flex-1 h-13 flex items-center justify-center gap-2.5 rounded-2xl bg-gold text-white font-semibold text-[14px] tracking-wide hover:bg-gold-dark active:scale-95 transition-all duration-200 py-4">
                  <CartIcon /> Add to Cart
                </button>
                <button className="flex-1 h-13 flex items-center justify-center gap-2.5 rounded-2xl border-2 border-gold text-gold font-semibold text-[14px] hover:bg-gold-tint active:scale-95 transition-all duration-200 py-4">
                  <BoltIcon /> Buy Now
                </button>
              </div>

              {/* Taglines */}
              <div className="fade-up-4 mt-5 pt-5 border-t border-[#f0ede6] flex flex-col gap-1">
                {['Crafted with precision.', 'Designed with intention.', 'Made to be worn, remembered, and loved.'].map(t => (
                  <p key={t} className="text-[12px] text-gray-400">{t}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailed;