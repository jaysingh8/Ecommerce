import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import { useProduct } from '../hook/useProduct';

// ── Design tokens ────────────────────────────────────────────────────────────
const GOLD      = '#b8973a';
const GOLD_DARK = '#8a6e22';
const GOLD_LIGHT = '#fdf9ef';

const STYLES = `
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

  @keyframes variantHighlight {
    0%   { box-shadow: 0 0 0 0 rgba(184,151,58,0.55); }
    60%  { box-shadow: 0 0 0 7px rgba(184,151,58,0); }
    100% { box-shadow: 0 0 0 0 rgba(184,151,58,0); }
  }
  .variant-highlight { animation: variantHighlight 0.6s ease-out forwards; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatINR = (amount, currency) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount ?? ''} ${currency || ''}`;
  }
};

const attrsToLabel = (attributes = {}) =>
  Object.entries(attributes).map(([k, v]) => `${k}: ${v}`).join(', ');

// ── Static icon components ────────────────────────────────────────────────────
const Icon = ({ size = 16, stroke = 'currentColor', sw = 2, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);

const StarIcon    = ({ filled }) => (
  <Icon size={14} stroke={filled ? GOLD : '#d1d5db'} fill={filled ? GOLD : 'none'} sw={1.5}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </Icon>
);
const ChevronLeft  = () => <Icon><polyline points="15 18 9 12 15 6"/></Icon>;
const ChevronRight = () => <Icon><polyline points="9 18 15 12 9 6"/></Icon>;
const CartIcon     = () => (
  <Icon>
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </Icon>
);
const BoltIcon     = () => <Icon><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>;
const TruckIcon    = () => (
  <Icon size={14} stroke={GOLD} sw={1.5}>
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </Icon>
);
const ShieldIcon   = () => (
  <Icon size={14} stroke={GOLD} sw={1.5}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </Icon>
);
const ReturnIcon   = () => (
  <Icon size={14} stroke={GOLD} sw={1.5}>
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
  </Icon>
);

// ── Sub-components ────────────────────────────────────────────────────────────
const Loader = () => (
  <>
    <style>{STYLES}</style>
    <div className="font-body min-h-screen bg-[#f7f6f3] flex items-center justify-center gap-2">
      {['dot-1','dot-2','dot-3'].map(c => (
        <div key={c} className={`${c} w-2 h-2 rounded-full bg-gold`} />
      ))}
    </div>
  </>
);

const MetaRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-[#f0ede6] pb-2.5">
    <span className="text-gray-400">{label}</span>
    <span className="font-medium text-gray-700">{value}</span>
  </div>
);

const PerkCard = ({ icon, label, sub }) => (
  <div className="flex flex-col items-center text-center gap-1.5 bg-[#faf9f7] border border-[#f0ede6] rounded-xl py-3 px-2">
    {icon}
    <span className="text-[12px] font-semibold text-gray-700">{label}</span>
    <span className="text-[11px] text-gray-400">{sub}</span>
  </div>
);

const PERKS = [
  { icon: <TruckIcon />, label: 'Free shipping', sub: 'Over ₹1,999' },
  { icon: <ShieldIcon />, label: 'Secure pay',   sub: 'Encrypted'  },
  { icon: <ReturnIcon />, label: 'Easy returns', sub: '7-day policy' },
];

const TAGLINES = [
  'Crafted with precision.',
  'Designed with intention.',
  'Made to be worn, remembered, and loved.',
];

// ── VariantCard (memoised) ────────────────────────────────────────────────────
const VariantCard = React.memo(({ variant, product, active, highlighted, onClick, refCb }) => {
  const label        = useMemo(() => attrsToLabel(variant.attributes), [variant.attributes]);
  const variantPrice = variant.price || product.price;
  const priceStr     = formatINR(variantPrice.amount, variantPrice.currency);
  const baseStr      = variantPrice.amount !== product.price.amount
    ? formatINR(product.price.amount, product.price.currency)
    : null;

  return (
    <button
      ref={refCb}
      type="button"
      onClick={onClick}
      className={[
        'group rounded-3xl overflow-hidden border transition-shadow duration-200 text-left',
        active
          ? 'border-gold shadow-[0_10px_40px_rgba(184,151,58,0.18)]'
          : 'border-[#e8e5de] hover:border-gold hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
        highlighted ? 'variant-highlight' : '',
      ].filter(Boolean).join(' ')}
    >
      <div className="h-44 overflow-hidden bg-[#f7f6f3]">
        <img
          src={variant.images?.[0]?.url || product.images?.[0]?.url}
          alt={label || product.title}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold text-gray-700 mb-1 truncate">{label || 'Variant'}</div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-black">{priceStr}</span>
          {baseStr && <span className="text-[12px] text-gray-400 line-through">{baseStr}</span>}
        </div>
      </div>
    </button>
  );
});

// ── Main component ────────────────────────────────────────────────────────────
const ProductDetailed = () => {
  const { productId }              = useParams();
  const { handleGetProductById }   = useProduct();

  const [product,             setProduct]             = useState(null);
  const [currentIndex,        setCurrentIndex]        = useState(0);
  const [mainImage,           setMainImage]           = useState(null);
  const [selectedAttributes,  setSelectedAttributes]  = useState({});
  const [selectedVariantId,   setSelectedVariantId]   = useState(null);
  const [highlightedVariantId,setHighlightedVariantId]= useState(null);

  const variantRefs   = useRef({});
  const highlightTimer = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await handleGetProductById(productId);
      if (cancelled) return;
      setProduct(data);
      setSelectedVariantId(null);
      setSelectedAttributes({});
      setHighlightedVariantId(null);
      if (data?.images?.[0]) { setCurrentIndex(0); setMainImage(data.images[0].url); }
    })();
    return () => { cancelled = true; };
  }, [productId]);

  // ── Derived values (memoised) ──────────────────────────────────────────────
  const allAttributes = useMemo(() => {
    const raw = product?.variants?.reduce((acc, v) => {
      Object.entries(v.attributes || {}).forEach(([k, val]) => {
        (acc[k] = acc[k] || new Set()).add(String(val));
      });
      return acc;
    }, {}) || {};
    return Object.fromEntries(Object.entries(raw).map(([k, s]) => [k, Array.from(s)]));
  }, [product?.variants]);

  const selectedVariant = useMemo(
    () => product?.variants?.find(v => v._id === selectedVariantId) ?? null,
    [product?.variants, selectedVariantId]
  );

  const displayedPrice  = selectedVariant?.price  || product?.price  || { amount: '', currency: '' };
  const displayedImages = (selectedVariant?.images?.length ? selectedVariant.images : product?.images) || [];
  const displayedStock  = selectedVariant?.stock  ?? product?.stock  ?? 0;
  const priceFormatted  = formatINR(displayedPrice?.amount, displayedPrice?.currency);

  // Sync gallery when variant/images change
  useEffect(() => {
    if (!displayedImages.length) return;
    setCurrentIndex(0);
    setMainImage(displayedImages[0].url);
  }, [selectedVariantId]);                 // keyed on ID, not array reference

  // ── Gallery nav ────────────────────────────────────────────────────────────
  const navigate = useCallback((dir) => {
    if (!displayedImages.length) return;
    setCurrentIndex(prev => {
      const n = (prev + dir + displayedImages.length) % displayedImages.length;
      setMainImage(displayedImages[n].url);
      return n;
    });
  }, [displayedImages]);

  // ── Scroll + highlight ─────────────────────────────────────────────────────
  const scrollToVariant = useCallback((id) => {
    clearTimeout(highlightTimer.current);
    setTimeout(() => variantRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    setHighlightedVariantId(id);
    highlightTimer.current = setTimeout(() => setHighlightedVariantId(null), 700);
  }, []);

  useEffect(() => () => clearTimeout(highlightTimer.current), []);

  // ── Variant selection ──────────────────────────────────────────────────────
  const applyVariant = useCallback((variant) => {
    setSelectedVariantId(variant._id);
    setSelectedAttributes(variant.attributes || {});
    setMainImage(variant.images?.[0]?.url || product?.images?.[0]?.url || mainImage);
    setCurrentIndex(0);
  }, [product, mainImage]);

  const handleSelectAttribute = useCallback((key, value) => {
    const next = { ...selectedAttributes, [key]: value };
    const match = product?.variants?.find(v =>
      Object.entries(next).every(([k, val]) => String(v.attributes?.[k]) === String(val))
    );
    if (match) { applyVariant(match); scrollToVariant(match._id); }
    else       { setSelectedVariantId(null); setSelectedAttributes(next); setMainImage(product?.images?.[0]?.url || mainImage); setCurrentIndex(0); }
  }, [selectedAttributes, product, applyVariant, scrollToVariant, mainImage]);

  const handleSelectVariant = useCallback((variant) => applyVariant(variant), [applyVariant]);

  const handleResetVariant = useCallback(() => {
    setSelectedVariantId(null);
    setSelectedAttributes({});
    setHighlightedVariantId(null);
    setMainImage(product?.images?.[0]?.url || mainImage);
    setCurrentIndex(0);
  }, [product, mainImage]);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!product) return <Loader />;

  const rating   = product.rating || 0;
  const hasImgs  = displayedImages.length > 1;
  const inStock  = displayedStock > 0;
  const metaRows = [
    { label: 'SKU',      value: <span className="font-semibold font-mono text-[12px] text-gray-700">{String(product._id).slice(-6).toUpperCase()}</span> },
    { label: 'Listed',   value: new Date(product.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
    { label: 'Category', value: product.category || 'Fashion' },
    { label: 'Stock',    value: inStock ? displayedStock : 'Out of stock' },
    { label: 'Currency', value: displayedPrice?.currency },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="font-body min-h-screen bg-[#f7f6f3] flex items-start justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full max-w-6xl bg-white rounded-3xl border border-[#e8e5de] shadow-[0_30px_80px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* Brand strip */}
          <div className="border-b border-[#f0ede6] px-8 py-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold">Premium Fashion House · Clothy</span>
            <span className="text-[11px] text-gray-400 tracking-wide">Estimated delivery: 3–5 business days</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* ── Gallery ── */}
            <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-[#f0ede6] fade-up">
              <div className="flex gap-4">

                {/* Thumbnails */}
                {hasImgs && (
                  <div className="flex flex-col gap-2.5 pt-1">
                    {displayedImages.map((img, idx) => (
                      <button
                        key={img._id || idx}
                        onClick={() => { setCurrentIndex(idx); setMainImage(img.url); }}
                        className={`thumb-btn w-13 h-16.5 rounded-xl overflow-hidden border-2 shrink-0 ${idx === currentIndex ? 'border-gold' : 'border-[#e8e5de] hover:border-[#c5b89a]'}`}
                      >
                        <img src={img.url} alt={`${product.title}-${idx}`} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main image */}
                <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#f0ede6]" style={{ aspectRatio: '4/5' }}>
                  <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />

                  {hasImgs && (
                    <>
                      {[{ dir: -1, Ico: ChevronLeft, side: 'left-3' }, { dir: 1, Ico: ChevronRight, side: 'right-3' }].map(({ dir, Ico, side }) => (
                        <button key={side} onClick={() => navigate(dir)}
                          className={`absolute ${side} top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 shadow-sm transition-all hover:scale-105`}
                          aria-label={dir === -1 ? 'Previous' : 'Next'}>
                          <Ico />
                        </button>
                      ))}
                      <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                        {currentIndex + 1} / {displayedImages.length}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── Product info ── */}
            <div className="p-6 lg:p-10 flex flex-col justify-between">
              <div>

                {/* Title */}
                <div className="fade-up-2">
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] leading-tight font-normal text-black mb-1">
                    {product.title}
                  </h1>
                  <div className="w-12 h-0.5 bg-gold mt-3 mb-5 rounded-full" />
                </div>

                {/* Stars */}
                <div className="fade-up-2 flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => <StarIcon key={i} filled={i < Math.round(rating)} />)}
                  </div>
                  {rating > 0 && <span className="text-[13px] text-gray-400 font-medium">{rating.toFixed(1)} / 5</span>}
                </div>

                {/* Price */}
                <div className="fade-up-3 flex items-baseline gap-3 mb-5">
                  <span className="text-3xl font-semibold tracking-tight text-black">{priceFormatted}</span>
                  <span className="text-[13px] text-gray-400">incl. taxes</span>
                </div>

                {/* Description */}
                <p className="fade-up-3 text-[15px] leading-relaxed text-gray-500 mb-6 max-w-md">
                  {product.description}
                </p>

                {/* Variant selectors */}
                {Object.keys(allAttributes).length > 0 && (
                  <div className="fade-up-3 mb-6">

                    {/* Attribute pills */}
                    <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-[0.18em] mb-3">Choose variant</h2>
                    <div className="space-y-4 mb-4">
                      {Object.entries(allAttributes).map(([attrKey, values]) => (
                        <div key={attrKey}>
                          <div className="text-[13px] font-semibold text-gray-700 mb-2">{attrKey}</div>
                          <div className="flex flex-wrap gap-2">
                            {values.map(val => {
                              const active = String(selectedAttributes[attrKey]) === String(val);
                              return (
                                <button key={`${attrKey}-${val}`} type="button"
                                  onClick={() => handleSelectAttribute(attrKey, val)}
                                  className={`px-3 py-2 rounded-full border text-sm font-medium transition ${active ? 'bg-gold text-white border-gold' : 'bg-white text-gray-700 border-[#e6e2da] hover:border-gold'}`}>
                                  {val}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Variant cards */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="text-[13px] font-semibold text-gray-700">All variants</div>
                      <button type="button" onClick={handleResetVariant}
                        className={`px-3 py-2 rounded-full border text-sm font-medium transition ${selectedVariantId === null ? 'bg-gold text-white border-gold' : 'bg-white text-gray-700 border-[#e6e2da] hover:border-gold'}`}>
                        Reset selection
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {product.variants?.map(variant => (
                        <VariantCard
                          key={variant._id}
                          variant={variant}
                          product={product}
                          active={variant._id === selectedVariantId}
                          highlighted={variant._id === highlightedVariantId}
                          onClick={() => handleSelectVariant(variant)}
                          refCb={(el) => (variantRefs.current[variant._id] = el)}
                        />
                      ))}
                    </div>

                    <div className="text-[13px] text-gray-500">
                      {selectedVariant
                        ? <>Selected variant: {attrsToLabel(selectedVariant.attributes)}</>
                        : <>Selected combination not available. Showing default product details.</>}
                    </div>
                  </div>
                )}

                {/* Meta */}
                <div className="fade-up-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[13px] mb-6">
                  {metaRows.map(({ label, value }) => <MetaRow key={label} label={label} value={value} />)}
                </div>

                {/* Perks */}
                <div className="fade-up-4 grid grid-cols-3 gap-3 mb-6">
                  {PERKS.map(p => <PerkCard key={p.label} {...p} />)}
                </div>
              </div>

              {/* CTAs */}
              <div className="fade-up-4 flex flex-col sm:flex-row gap-3">
                {[
                  { icon: <CartIcon />, label: 'Add to Cart', filled: true },
                  { icon: <BoltIcon />, label: 'Buy Now',     filled: false },
                ].map(({ icon, label, filled }) => (
                  <button key={label} type="button" disabled={!inStock}
                    className={[
                      'flex-1 h-13 flex items-center justify-center gap-2.5 rounded-2xl font-semibold text-[14px] tracking-wide transition-all duration-200 py-4',
                      !inStock
                        ? (filled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'border-2 border-gray-200 text-gray-500 cursor-not-allowed')
                        : filled
                          ? 'bg-gold text-white hover:bg-gold-dark active:scale-95'
                          : 'border-2 border-gold text-gold hover:bg-gold-tint active:scale-95',
                    ].join(' ')}>
                    {icon} {label}
                  </button>
                ))}
              </div>

              {/* Taglines */}
              <div className="fade-up-4 mt-5 pt-5 border-t border-[#f0ede6] flex flex-col gap-1">
                {TAGLINES.map(t => <p key={t} className="text-[12px] text-gray-400">{t}</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailed;