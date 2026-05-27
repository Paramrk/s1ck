import { flavorlists } from "./details";

/** Products that render in the carousel (must match FlavorSlider panels). */
export const visibleFlavorlists = flavorlists.filter((flavor) => {
    const hasName = flavor.name.trim().length > 0;
    const hasAsset = [flavor.bgImage, flavor.elementsImage, flavor.drinkImage].some(
        (v) => v?.trim().length,
    );
    return hasName && hasAsset;
});
