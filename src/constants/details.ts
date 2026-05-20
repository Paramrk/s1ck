//Video Path
import f1 from "../assets/videos/f1.mp4"
import f2 from "../assets/videos/f2.mp4"
import f3 from "../assets/videos/f3.mp4"
import f5 from "../assets/videos/f5.mp4"
import f6 from "../assets/videos/f6.mp4"
import f7 from "../assets/videos/f7.mp4"

// Define types
interface Flavor {
    name: string;
    color: string;
    rotation: string;
    bgImage?: string;
    drinkImage?: string;
    elementsImage?: string;
    textColor?: string;
    // Perfume profile
    tagline: string;
    description: string;
    topNotes: string[];
    midNotes: string[];
    baseNotes: string[];
    tone: string;
    accentColor: string;
    accentGlow: string;
}

interface Nutrient {
    label: string;
    amount: string;
}

interface Card {
    src: any;
    rotation: string;
    name: string;
    img: string;
    translation?: string;
}

// Flavor list (S1CK Scent Collection)
const flavorlists: Flavor[] = [
    {
        name: "Le Toxiquè",
        color: "lt-element",
        rotation: "md:rotate-[-8deg] rotate-0",
        bgImage: "lt-bg.jpeg",
        drinkImage: "lt.png",
        elementsImage: "lt-elements.png",
        tagline: "Dangerously Addictive",
        description: "A dark amber elixir that commands the room. Warm, seductive, and absolutely irresistible.",
        topNotes: ["Bergamot", "Pink Pepper", "Cardamom"],
        midNotes: ["Oud Wood", "Rose Absolute", "Saffron"],
        baseNotes: ["Amber", "Musk", "Vanilla"],
        tone: "Warm & Seductive",
        accentColor: "#E89A3C",
        accentGlow: "rgba(232,154,60,0.35)",
    },
    {
        name: "Liquid Silver",
        color: "ls-element",
        rotation: "md:rotate-[8deg] rotate-0",
        bgImage: "ls-bg.jpeg",
        drinkImage: "ls.png",
        elementsImage: "ls-elements.png",
        textColor: "text-black",
        tagline: "Elegance Refined",
        description: "Cool metallic sophistication meets clean freshness. The scent of quiet confidence.",
        topNotes: ["Silver Birch", "Aldehydes", "Juniper"],
        midNotes: ["Iris", "Violet Leaf", "Metallic Accord"],
        baseNotes: ["White Musk", "Cedarwood", "Ambroxan"],
        tone: "Cool & Sophisticated",
        accentColor: "#B0BCC9",
        accentGlow: "rgba(176,188,201,0.35)",
    },
    {
        name: "Alpha Q",
        color: "blue",
        rotation: "md:rotate-[-8deg] rotate-0",
        bgImage: "aq-bg.jpeg",
        drinkImage: "aq.png",
        elementsImage: "aq-elements.png",
        tagline: "Unmistakably Bold",
        description: "An aquatic powerhouse with electric depth. For those who lead, not follow.",
        topNotes: ["Sea Salt", "Ozone", "Grapefruit"],
        midNotes: ["Blue Lotus", "Geranium", "Marine Accord"],
        baseNotes: ["Driftwood", "Vetiver", "Tonka Bean"],
        tone: "Fresh & Powerful",
        accentColor: "#3D7BFF",
        accentGlow: "rgba(61,123,255,0.35)",
    },
    {
        name: "Avant-Garde",
        color: "orange",
        rotation: "md:rotate-[8deg] rotate-0",
        bgImage: "ag-bg.jpeg",
        drinkImage: "avant-garde.png",
        elementsImage: "ag-elements.png",
        tagline: "Break Every Rule",
        description: "Fiery spice collides with smoky intrigue. Unapologetically different.",
        topNotes: ["Blood Orange", "Cinnamon", "Ginger"],
        midNotes: ["Tobacco Leaf", "Jasmine", "Black Pepper"],
        baseNotes: ["Sandalwood", "Leather", "Patchouli"],
        tone: "Spicy & Rebellious",
        accentColor: "#E85A1F",
        accentGlow: "rgba(232,90,31,0.35)",
    },
    {
        name: "Le-Toxique Oil",
        color: "white",
        rotation: "md:rotate-[-8deg] rotate-0",
        bgImage: "ltoil-bg.jpeg",
        drinkImage: "ltoil.png",
        elementsImage: "ltoil-elements.png",
        textColor: "text-black",
        tagline: "Pure Concentration",
        description: "The purest form of Le Toxiquè. Oil-based for skin-hugging longevity that evolves all day.",
        topNotes: ["Bergamot", "Saffron", "Elemi"],
        midNotes: ["Oud", "Rose de Mai", "Amber"],
        baseNotes: ["Musk", "Benzoin", "Castoreum"],
        tone: "Rich & Intimate",
        accentColor: "#D9C896",
        accentGlow: "rgba(217,200,150,0.35)",
    },
    {
        name: "Arcane",
        color: "black",
        rotation: "md:rotate-[8deg] rotate-0",
        bgImage: "arc-bg.jpeg",
        drinkImage: "arc.png",
        elementsImage: "arc-elements.png",
        tagline: "Into The Darkness",
        description: "Mysterious. Magnetic. Midnight incarnate. A scent that speaks in whispers.",
        topNotes: ["Black Truffle", "Incense", "Absinthe"],
        midNotes: ["Dark Rose", "Labdanum", "Myrrh"],
        baseNotes: ["Black Amber", "Oud Noir", "Suede"],
        tone: "Dark & Mysterious",
        accentColor: "#8B7AE8",
        accentGlow: "rgba(139,122,232,0.35)",
    },
];

// Pheromone compound list
const nutrientLists: Nutrient[] = [
    { label: "Androstenol", amount: "38mg" },
    { label: "Androstenone", amount: "22mg" },
    { label: "Estratetraenol", amount: "15mg" },
    { label: "Androstadienone", amount: "12mg" },
    { label: "Copulins", amount: "8mg" },
];

// Cards list
const cards: Card[] = [
    {
        src: f1,
        rotation: "rotate-z-[-10deg]",
        name: "Madison",
        img: "../assets/images/p1.png",
        translation: "translate-y-[-5%]",
    },
    {
        src: f2,
        rotation: "rotate-z-[4deg]",
        name: "Alexander",
        img: "../assets/images/p2.png",
    },
    {
        src: f3,
        rotation: "rotate-z-[-4deg]",
        name: "Andrew",
        img: "../assets/images/p3.png",
        translation: "translate-y-[-5%]",
    },
    {
        src: f5,
        rotation: "rotate-z-[-10deg]",
        name: "Chris",
        img: "../assets/images/p5.png",
    },
    {
        src: f6,
        rotation: "rotate-z-[4deg]",
        name: "Devante",
        img: "../assets/images/p6.png",
        translation: "translate-y-[5%]",
    },
    {
        src: f7,
        rotation: "rotate-z-[-3deg]",
        name: "Melisa",
        img: "../assets/images/p7.png",
        translation: "translate-y-[10%]",
    },
];

export { flavorlists, nutrientLists, cards };