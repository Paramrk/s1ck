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
    // Optional: manually specify image filenames (in assets/images/)
    // Falls back to `${color}-bg.svg`, `${color}-drink.webp`, `${color}-elements.webp`
    bgImage?: string;
    drinkImage?: string;
    elementsImage?: string;
    textColor?: string;
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
    translation?: string; // optional since some cards don’t have it
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
    },
    {
        name: "Liquid Silver",
        color: "ls-element",
        rotation: "md:rotate-[8deg] rotate-0",
        bgImage: "ls-bg.jpeg",
        drinkImage: "ls.png",
        elementsImage: "ls-elements.png",
        textColor: "text-black",
    },
    {
        name: "Alpha Q",
        color: "blue",
        rotation: "md:rotate-[-8deg] rotate-0",
        bgImage: "aq-bg.jpeg",
        drinkImage: "aq.png",
        elementsImage: "aq-elements.png",
    },
    {
        name: "Avant-Garde",
        color: "orange",
        rotation: "md:rotate-[8deg] rotate-0",
        bgImage: "ag-bg.jpeg",
        drinkImage: "avant-garde.png",
        elementsImage: "ag-elements.png",
    },
    {
        name: "Le-Toxique Oil",
        color: "white",
        rotation: "md:rotate-[-8deg] rotate-0",
        bgImage: "ltoil-bg.jpeg",
        drinkImage: "ltoil.png",
        elementsImage: "ltoil-elements.png",
        textColor: "text-black",
    },
    {
        name: "Arcane",
        color: "black",
        rotation: "md:rotate-[8deg] rotate-0",
        bgImage: "arc-bg.jpeg",
        drinkImage: "arc.png",
        elementsImage: "arc-elements.png",
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