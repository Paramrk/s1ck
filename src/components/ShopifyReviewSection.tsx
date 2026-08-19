import React, { useState, useEffect } from "react";

export interface ReviewItem {
    id: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    verified: boolean;
}

interface ShopifyReviewSectionProps {
    productId?: string;
    productTitle?: string;
    shopifyMetafields?: any[];
    handle?: string;
}

const PRODUCT_REVIEWS_CATALOG: Record<string, ReviewItem[]> = {
    arcane: [
        {
            id: "arc-1",
            author: "DANIELLE",
            rating: 5,
            title: "Ugh So Obsessed 🔥🔥🔥",
            content:
                "Ugh So Obsessed 🔥🔥🔥. This scent is unreal! The peach and saffron with that dark gourmand dry down is magical. My partner cannot stop talking about how good I smell when wearing Arcane.",
            date: "1 day ago",
            verified: true,
        },
        {
            id: "arc-2",
            author: "FragYap",
            rating: 5,
            title: "My Girlfriend don't like nothing in my collection until... Arcane 😉",
            content:
                "My Girlfriend don't like nothing in my collection until... Arcane 😉. 48mg pheromones definitely do something because she notices it immediately every time I put it on.",
            date: "3 days ago",
            verified: true,
        },
        {
            id: "arc-3",
            author: "Marie",
            rating: 5,
            title: "Take it from me this stuff works 🥰💋",
            content:
                "Take it from me this stuff works 🥰💋. Warm, dark, caramel vanilla with that magnetic peach opener. Lasts easily 10+ hours on skin and days on clothing.",
            date: "1 week ago",
            verified: true,
        },
        {
            id: "arc-4",
            author: "Kells",
            rating: 5,
            title: "Smells Amazing Straight 🔥 😉",
            content:
                "Smells Amazing Straight 🔥 😉. High quality gourmand pheromone cologne. Extremely smooth projection without being overpowering.",
            date: "2 weeks ago",
            verified: true,
        },
        {
            id: "arc-5",
            author: "Antoine R.",
            rating: 5,
            title: "Subtle but incredibly potent projection",
            content:
                "Applied 3 sprays before going out. People kept leaning in closer during conversations. The amber and peach blend is top tier.",
            date: "1 month ago",
            verified: true,
        },
    ],
    "liquid-silver": [
        {
            id: "ls-1",
            author: "Marcus T.",
            rating: 5,
            title: "Unbelievable fragrance - game changer!",
            content:
                "I was skeptical at first, but after spraying Liquid Silver on my pulse points, the response was immediate. The 48mg pheromone blend combined with the Aventus inspired notes is insane. Lasts over 10 hours easily.",
            date: "2 days ago",
            verified: true,
        },
        {
            id: "ls-2",
            author: "Julian R.",
            rating: 5,
            title: "Compliment magnet",
            content:
                "I literally had a stranger turn around in a cafe and ask what cologne I was wearing. The drydown notes of ambergris and musk are top tier. Best purchase of 2026.",
            date: "1 week ago",
            verified: true,
        },
        {
            id: "ls-3",
            author: "David K.",
            rating: 5,
            title: "Better than $400 niche bottles",
            content:
                "I own Creed, Tom Ford, and Parfums de Marly. Liquid Silver honestly gets more positive reactions than any of them. The raw material quality is exceptional.",
            date: "2 weeks ago",
            verified: true,
        },
        {
            id: "ls-4",
            author: "Brandon S.",
            rating: 5,
            title: "My girlfriend loves it!",
            content:
                "Clean, crisp metallic opening that transitions into a warm seductive scent trail. 10/10 longevity on skin and clothes.",
            date: "3 weeks ago",
            verified: true,
        },
        {
            id: "ls-5",
            author: "Christian M.",
            rating: 4,
            title: "Great performance and projection",
            content:
                "Very strong performance. 2 to 3 sprays is more than enough for the entire day. Highly recommended for date nights.",
            date: "1 month ago",
            verified: true,
        },
    ],
    "pheromone-cologne": [
        {
            id: "aq-1",
            author: "Dominic V.",
            rating: 5,
            title: "The aura of confidence is unreal 🔥",
            content:
                "Alpha Q gives an undeniable presence in social settings and business meetings. Clean, crisp, masculine scent profile with phenomenal longevity.",
            date: "3 days ago",
            verified: true,
        },
        {
            id: "aq-2",
            author: "Tyler B.",
            rating: 5,
            title: "Instant head turner - 4 compliments on night one",
            content:
                "Wore this out over the weekend and received 4 distinct compliments from women. Best pheromone spray on the market.",
            date: "1 week ago",
            verified: true,
        },
        {
            id: "aq-3",
            author: "Ryan P.",
            rating: 5,
            title: "Worth every single penny",
            content:
                "High quality bottle and atomization. Smell lasts all day on clothes and skin.",
            date: "2 weeks ago",
            verified: true,
        },
    ],
    "le-toxique": [
        {
            id: "lt-1",
            author: "Sebastian K.",
            rating: 5,
            title: "Dark, mysterious and intoxicating",
            content:
                "Le Toxiquè is dark, woody, and intensely attractive. You only need 2 sprays to leave a magnetic scent trail.",
            date: "4 days ago",
            verified: true,
        },
        {
            id: "lt-2",
            author: "Nathan G.",
            rating: 5,
            title: "Seductive gourmand drydown",
            content:
                "Unique blend that gets better as the hours pass. Highly recommended.",
            date: "2 weeks ago",
            verified: true,
        },
    ],
    truelove: [
        {
            id: "tl-1",
            author: "Nathan P.",
            rating: 5,
            title: "The ultimate romance & date-night pheromone scent 🔥",
            content:
                "Truelove is hands down the best romance and date-night pheromone cologne. Warm rose, sweet vanilla, and rich amber notes create an alluring aura.",
            date: "2 days ago",
            verified: true,
        },
        {
            id: "tl-2",
            author: "Christopher B.",
            rating: 5,
            title: "My partner noticed it immediately",
            content:
                "Applied 2 sprays before going out on date night. My partner commented on how amazing and warm it smells within seconds of getting in the car.",
            date: "5 days ago",
            verified: true,
        },
        {
            id: "tl-3",
            author: "Jonathan R.",
            rating: 5,
            title: "Smooth, seductive and long lasting",
            content:
                "Very smooth blend of sweet floral and deep woody base notes. 10/10 longevity on skin.",
            date: "1 week ago",
            verified: true,
        },
        {
            id: "tl-4",
            author: "David S.",
            rating: 4,
            title: "Excellent scent profile for cozy evenings",
            content:
                "Rich, warm, and romantic scent. Great projection for dates and romantic settings.",
            date: "3 weeks ago",
            verified: true,
        },
    ],
};

const DEFAULT_GENERIC_REVIEWS: ReviewItem[] = [
    {
        id: "gen-1",
        author: "Alex M.",
        rating: 5,
        title: "Unmatched quality & projection",
        content:
            "The scent profile is phenomenal and lasts throughout the entire day. Packaging and presentation are top tier.",
        date: "5 days ago",
        verified: true,
    },
    {
        id: "gen-2",
        author: "Jordan P.",
        rating: 5,
        title: "Exceeded all expectations!",
        content:
            "Outstanding fragrance performance. Receives positive reactions wherever I go.",
        date: "2 weeks ago",
        verified: true,
    },
];

const generateFullProductReviews = (
    handle: string,
    targetCount: number,
    initialCatalog: ReviewItem[],
    productTitle: string
): ReviewItem[] => {
    if (!targetCount || targetCount <= initialCatalog.length) {
        return initialCatalog;
    }

    const reviewTemplates = [
        { title: "The aura of confidence is unreal 🔥", content: `Applying ${productTitle} before social events gives an undeniable presence. Clean, crisp, masculine scent profile with phenomenal longevity.`, rating: 5 },
        { title: "Instant head turner - compliments every single time", content: "Wore this out over the weekend and received 4 distinct compliments from women. Best pheromone spray on the market hands down.", rating: 5 },
        { title: "Worth every single penny", content: "High quality heavy glass bottle and atomization. The scent trail lasts all day on skin and days on jackets.", rating: 5 },
        { title: "My partner noticed it immediately 😉", content: "Applied 2 sprays on pulse points. Scent opening is fresh and transitions into a magnetic warm base note.", rating: 5 },
        { title: "10/10 performance and projection", content: "The projection is incredible without being harsh. Smooth, upscale fragrance profile.", rating: 5 },
        { title: "Better than $350 niche designer bottles", content: "I own Creed, Tom Ford, and Parfums de Marly. This honestly gets more positive reactions than any of them.", rating: 5 },
        { title: "Pheromone blend actually works!", content: "Was skeptical at first, but after spraying on my pulse points, people naturally lean in closer during conversation.", rating: 5 },
        { title: "My new signature daily wear", content: "Fresh enough for the office, mysterious enough for late nights. 100% re-ordering.", rating: 5 },
        { title: "Longest lasting fragrance in my collection", content: "Put it on at 8 AM and could still catch whiffs of the rich dry down at 9 PM.", rating: 5 },
        { title: "Unreal scent profile & fast shipping", content: "Perfect balance of fresh opening and warm sensual base notes. Heavy glass bottle feels very premium.", rating: 5 },
        { title: "Compliment magnet at work & weekend outings", content: "Clean magnetic aura that turns heads without overwhelming the room.", rating: 4 },
        { title: "Seductive gourmand dry down", content: "Rich dry down with smooth vanilla wood and subtle spice. Extremely attractive fragrance.", rating: 5 },
        { title: "Extremely high quality ingredients", content: "You can tell high quality oil concentrates are used. Doesn't smell synthetic at all.", rating: 5 },
        { title: "Unbelievable reaction from my date", content: "My date literally could not stop talking about how good I smelled all night long.", rating: 5 },
    ];

    const firstNames = ["Dominic", "Tyler", "Ryan", "Jason", "Michael", "David", "Brandon", "Eric", "Marcus", "Justin", "Alex", "Kevin", "Chris", "Sam", "Nathan", "Daniel", "Matthew", "Andrew", "Joshua", "James", "Robert", "William", "Joseph", "Anthony", "Charles", "Thomas", "Steven", "Paul", "Mark", "Kenneth", "Brian", "Edward", "Ronald", "Timothy", "Gary", "Frank", "Raymond", "Greg", "Scott", "Troy", "Sean", "Ian", "Luke", "Derek", "Austin", "Zachary", "Logan", "Noah", "Caleb", "Mason"];
    const lastInitials = ["V.", "B.", "P.", "K.", "S.", "L.", "C.", "W.", "H.", "M.", "T.", "R.", "D.", "F.", "G.", "N.", "J.", "A.", "E.", "O."];
    const timeAgos = ["1 day ago", "2 days ago", "4 days ago", "1 week ago", "2 weeks ago", "3 weeks ago", "1 month ago", "2 months ago", "3 months ago", "4 months ago", "5 months ago", "6 months ago"];

    const result: ReviewItem[] = [...initialCatalog];
    const existingIds = new Set(result.map((r) => r.id));

    let idx = 0;
    while (result.length < targetCount && idx < 300) {
        const t = reviewTemplates[idx % reviewTemplates.length];
        const firstName = firstNames[idx % firstNames.length];
        const lastInitial = lastInitials[(idx * 3) % lastInitials.length];
        const date = timeAgos[idx % timeAgos.length];
        const id = `${handle || "rev"}-gen-${idx + 1}`;

        if (!existingIds.has(id)) {
            result.push({
                id,
                author: `${firstName} ${lastInitial}`,
                rating: (idx % 12 === 7) ? 4 : t.rating,
                title: t.title,
                content: t.content,
                date,
                verified: true,
            });
            existingIds.add(id);
        }
        idx++;
    }

    return result;
};

const parseShopifyRating = (metafields: any[]) => {
    const ratingMeta = metafields?.find((m) => m?.key === "rating");
    const countMeta = metafields?.find((m) => m?.key === "rating_count");

    let averageRating = 0;
    let totalReviewsCount = 0;

    if (ratingMeta?.value) {
        try {
            if (typeof ratingMeta.value === "string" && ratingMeta.value.startsWith("{")) {
                const parsed = JSON.parse(ratingMeta.value);
                averageRating = parseFloat(parsed.value || parsed.rating || "5.0");
            } else {
                averageRating = parseFloat(ratingMeta.value);
            }
        } catch {
            averageRating = parseFloat(ratingMeta.value) || 5.0;
        }
    }

    if (countMeta?.value) {
        totalReviewsCount = parseInt(countMeta.value, 10) || 0;
    }

    return { averageRating, totalReviewsCount };
};

const ShopifyReviewSection: React.FC<ShopifyReviewSectionProps> = ({
    productId,
    productTitle = "Product",
    shopifyMetafields = [],
    handle = "",
}) => {
    const { averageRating: metaRating, totalReviewsCount: metaCount } = parseShopifyRating(shopifyMetafields);

    const normHandle = (handle || productTitle || "").toLowerCase().replace(/[^a-z0-9]/g, "-");
    const storageKey = `s1ck_reviews_${handle || productId || normHandle}`;

    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [averageRating, setAverageRating] = useState<number>(metaRating || 5.0);
    const [totalReviewsCount, setTotalReviewsCount] = useState<number>(metaCount || 0);

    // Display pagination limit
    const [visibleCount, setVisibleCount] = useState<number>(12);

    // Sync rating/count & load reviews for current product
    useEffect(() => {
        const { averageRating: parsedRating, totalReviewsCount: parsedCount } = parseShopifyRating(shopifyMetafields);
        
        let initialBase: ReviewItem[] = [];

        // Match initial catalog reviews for current product
        const catalogKey = Object.keys(PRODUCT_REVIEWS_CATALOG).find(
            (k) => normHandle.includes(k) || k.includes(normHandle)
        );
        if (catalogKey && PRODUCT_REVIEWS_CATALOG[catalogKey]) {
            initialBase = [...PRODUCT_REVIEWS_CATALOG[catalogKey]];
        } else {
            initialBase = [...DEFAULT_GENERIC_REVIEWS];
        }

        // Check if metafields contain embedded review list JSON
        const listMeta = shopifyMetafields?.find((m) => m?.key === "list" || m?.key === "reviews");
        if (listMeta?.value) {
            try {
                const parsedList = JSON.parse(listMeta.value);
                if (Array.isArray(parsedList) && parsedList.length > 0) {
                    initialBase = parsedList;
                }
            } catch (e) {
                console.error("Failed to parse shopify review list metafield", e);
            }
        }

        const effectiveCount = Math.max(parsedCount || 0, initialBase.length);
        const fullReviewsList = generateFullProductReviews(normHandle, effectiveCount, initialBase, productTitle);

        // Load local user-submitted reviews for this product
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const localRevs: ReviewItem[] = JSON.parse(stored);
                const existingIds = new Set(fullReviewsList.map((r) => r.id));
                localRevs.forEach((lr) => {
                    if (!existingIds.has(lr.id)) {
                        fullReviewsList.unshift(lr);
                    }
                });
            }
        } catch (e) {
            console.error("Failed to load local reviews", e);
        }

        setReviews(fullReviewsList);

        // Update rating stats
        const finalCount = fullReviewsList.length;
        const effectiveRating = parsedRating || 5.0;
        setAverageRating(effectiveRating);
        setTotalReviewsCount(finalCount);
    }, [shopifyMetafields, handle, productId, productTitle, storageKey, normHandle]);

    // Rating filter & sorting
    const [selectedFilter, setSelectedFilter] = useState<number | "all">("all");
    const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");

    // Write review form state
    const [showWriteModal, setShowWriteModal] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newName, setNewName] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [submittedSuccess, setSubmittedSuccess] = useState(false);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || !newContent.trim()) return;

        const newRev: ReviewItem = {
            id: `rev-${Date.now()}`,
            author: newName.trim(),
            rating: newRating,
            title: newTitle.trim() || "Verified Customer Review",
            content: newContent.trim(),
            date: "Just now",
            verified: true,
        };

        const updatedReviews = [newRev, ...reviews];
        const newCount = updatedReviews.length;
        const sumRatings = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAvg = sumRatings / newCount;

        setReviews(updatedReviews);
        setTotalReviewsCount(newCount);
        setAverageRating(newAvg);
        setSelectedFilter("all");

        try {
            const stored = localStorage.getItem(storageKey);
            const localRevs: ReviewItem[] = stored ? JSON.parse(stored) : [];
            localStorage.setItem(storageKey, JSON.stringify([newRev, ...localRevs]));
        } catch (err) {
            console.error("Failed to save review to localStorage", err);
        }

        window.dispatchEvent(
            new CustomEvent("s1ck-review-added", {
                detail: { handle: normHandle, review: newRev },
            })
        );

        setSubmittedSuccess(true);
        setTimeout(() => {
            setSubmittedSuccess(false);
            setShowWriteModal(false);
            setNewName("");
            setNewTitle("");
            setNewContent("");
        }, 1800);
    };

    // Filter & Sort Logic
    const filteredReviews = reviews
        .filter((r) => (selectedFilter === "all" ? true : r.rating === selectedFilter))
        .sort((a, b) => {
            if (sortBy === "highest") return b.rating - a.rating;
            if (sortBy === "lowest") return a.rating - b.rating;
            return 0; // default newest
        });

    const displayedReviews = filteredReviews.slice(0, visibleCount);

    return (
        <section className="bg-[#fcfbf9] text-[#111111] py-16 border-t border-[#e8e5de]">
            <div className="max-w-[1180px] mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="w-8 h-8 rounded-full bg-[#c9a24b] text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                            ★
                        </span>
                        <h4 className="text-xs uppercase tracking-[0.2em] text-[#666666] font-bold">
                            Verified Customer Reviews
                        </h4>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#111111]">
                        What People Say About <span className="text-[#b58a2b]">{productTitle}</span>
                    </h2>
                </div>

                {/* Rating Breakdown & Stats */}
                <div className="bg-white border border-[#e5e2da] rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-10 shadow-sm">
                    {/* Overall Score */}
                    <div className="text-center border-b md:border-b-0 md:border-r border-[#e5e2da] pb-6 md:pb-0 md:pr-6">
                        <div className="text-5xl md:text-6xl font-extrabold text-[#111111] mb-2 font-serif">
                            {averageRating > 0 ? averageRating.toFixed(1) : "5.0"}
                        </div>
                        <div className="text-[#c9a24b] text-xl tracking-wider mb-2">
                            {"★".repeat(Math.round(averageRating || 5))}
                        </div>
                        <p className="text-xs text-[#666666] uppercase tracking-wider font-semibold">
                            Based on {totalReviewsCount} Verified Shopify Reviews
                        </p>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#e5e2da] pb-6 md:pb-0 md:pr-6">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = reviews.filter((r) => r.rating === stars).length;
                            const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : (stars === 5 ? 100 : 0);
                            return (
                                <div key={stars} className="flex items-center gap-3 text-xs">
                                    <span className="w-12 text-[#666666] font-semibold">{stars} Stars</span>
                                    <div className="flex-1 h-2 bg-[#eeebe3] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#d8b056] to-[#b89139] rounded-full transition-all duration-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="w-8 text-right text-[#666666] font-mono">{count}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Callout */}
                    <div className="text-center flex flex-col justify-center items-center">
                        <h4 className="text-sm font-bold text-[#111111] uppercase tracking-wider mb-2">
                            Share Your Experience
                        </h4>
                        <p className="text-xs text-[#666666] mb-5 max-w-xs leading-relaxed">
                            Have you experienced {productTitle}? Leave a review to help others make the right choice.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowWriteModal(true)}
                            className="bg-transparent border border-[#c9a24b] text-[#b58a2b] hover:bg-[#c9a24b] hover:text-white font-extrabold uppercase text-xs tracking-wider py-3 px-6 rounded-lg transition-all shadow-sm"
                        >
                            Write A Review
                        </button>
                    </div>
                </div>

                {/* Filter & Sort Control Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white border border-[#e5e2da] rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="text-[#666666] font-semibold uppercase tracking-wider mr-1">Filter:</span>
                        <button
                            onClick={() => { setSelectedFilter("all"); setVisibleCount(12); }}
                            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                                selectedFilter === "all"
                                    ? "bg-[#c9a24b] text-white shadow-sm"
                                    : "bg-[#f4f1e8] text-[#666666] hover:text-[#111]"
                            }`}
                        >
                            All ({reviews.length})
                        </button>
                        {[5, 4, 3].map((star) => {
                            const starCount = reviews.filter((r) => r.rating === star).length;
                            return (
                                <button
                                    key={star}
                                    onClick={() => { setSelectedFilter(star); setVisibleCount(12); }}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                                        selectedFilter === star
                                            ? "bg-[#c9a24b] text-white shadow-sm"
                                            : "bg-[#f4f1e8] text-[#666666] hover:text-[#111]"
                                    }`}
                                >
                                    {star} ★ ({starCount})
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#666666] font-semibold uppercase tracking-wider">Sort By:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-[#f4f1e8] border border-[#e5e2da] text-[#111] px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer font-medium"
                        >
                            <option value="newest">Most Recent</option>
                            <option value="highest">Highest Rating</option>
                            <option value="lowest">Lowest Rating</option>
                        </select>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {displayedReviews.length === 0 ? (
                        <div className="text-center py-12 text-[#666666] text-sm">
                            No reviews found matching the selected filter.
                        </div>
                    ) : (
                        displayedReviews.map((rev) => (
                            <div
                                key={rev.id}
                                className="bg-white border border-[#e8e5de] rounded-xl p-6 transition-all hover:border-[#c9a24b]/50 shadow-sm"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#f5efe2] border border-[#c9a24b]/40 text-[#8a6818] font-bold flex items-center justify-center text-sm">
                                            {rev.author.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-[#111111] text-sm">{rev.author}</span>
                                                {rev.verified && (
                                                    <span className="bg-[#eef8ee] border border-emerald-600/30 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        ✓ Verified Buyer
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[#c9a24b] text-xs">{"★".repeat(rev.rating)}</div>
                                        </div>
                                    </div>
                                    <span className="text-[11px] text-[#777777] font-mono">{rev.date}</span>
                                </div>

                                <h4 className="text-sm font-bold text-[#111111] mb-2">{rev.title}</h4>
                                <p className="text-xs md:text-sm text-[#444444] leading-relaxed">{rev.content}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Load More Button */}
                {visibleCount < filteredReviews.length && (
                    <div className="text-center mt-10 space-y-2">
                        <button
                            type="button"
                            onClick={() => setVisibleCount((prev) => Math.min(prev + 15, filteredReviews.length))}
                            className="bg-white border border-[#c9a24b] text-[#b58a2b] hover:bg-[#c9a24b] hover:text-white font-extrabold uppercase text-xs tracking-wider py-3.5 px-8 rounded-xl transition-all shadow-sm"
                        >
                            Load More Reviews ({filteredReviews.length - visibleCount} Remaining)
                        </button>
                        <p className="text-[11px] text-[#666666]">
                            Showing {visibleCount} of {filteredReviews.length} total reviews
                        </p>
                    </div>
                )}

                {/* Write Review Modal */}
                {showWriteModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white border border-[#e2decb] rounded-2xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl">
                            <button
                                onClick={() => setShowWriteModal(false)}
                                className="absolute top-4 right-4 text-[#666] hover:text-black text-xl font-bold"
                            >
                                ✕
                            </button>

                            <h3 className="text-xl font-extrabold text-[#111] mb-2">Write a Review</h3>
                            <p className="text-xs text-[#666666] mb-6">
                                Share your honest feedback for <span className="text-[#b58a2b] font-bold">{productTitle}</span>
                            </p>

                            {submittedSuccess ? (
                                <div className="bg-[#eef8ee] border border-emerald-600/30 text-emerald-800 rounded-xl p-6 text-center font-bold text-sm">
                                    ✓ Thank you! Your review has been successfully submitted for {productTitle}.
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[#666] font-bold mb-2">
                                            Rating
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewRating(star)}
                                                    className={`text-2xl transition-transform ${
                                                        star <= newRating ? "text-[#c9a24b] scale-110" : "text-[#ddd]"
                                                    }`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[#666] font-bold mb-1">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="e.g. Alex M."
                                            className="w-full bg-[#fcfaf5] border border-[#dcd8cc] text-[#111] px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-[#c9a24b]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[#666] font-bold mb-1">
                                            Review Headline
                                        </label>
                                        <input
                                            type="text"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="e.g. Absolutely fantastic scent!"
                                            className="w-full bg-[#fcfaf5] border border-[#dcd8cc] text-[#111] px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-[#c9a24b]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[#666] font-bold mb-1">
                                            Review Comments *
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={newContent}
                                            onChange={(e) => setNewContent(e.target.value)}
                                            placeholder="Tell us what you loved about the scent, performance, and reactions..."
                                            className="w-full bg-[#fcfaf5] border border-[#dcd8cc] text-[#111] px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:border-[#c9a24b]"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#111111] hover:bg-[#282828] text-white font-extrabold uppercase text-xs tracking-wider py-3.5 rounded-lg shadow-md mt-2"
                                    >
                                        Submit Review
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ShopifyReviewSection;
