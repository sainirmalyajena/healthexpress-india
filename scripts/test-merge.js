
const dictEn = {
    nav: { home: "Home", contact: "Contact" },
    cta: { title: "Hero" }
};

const dictHi = {
    nav: { home: "मुख्य", contact: "" }, // empty string
    // cta is missing
};

function deepMerge(target, source) {
    const output = { ...target };
    if (source && typeof source === 'object' && !Array.isArray(source)) {
        Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                if (source[key] !== undefined && source[key] !== '') {
                    output[key] = source[key];
                }
            }
        });
    }
    return output;
}

const merged = deepMerge(dictEn, dictHi);
console.log(JSON.stringify(merged, null, 2));

if (merged.nav.contact === "Contact" && merged.cta.title === "Hero" && merged.nav.home === "मुख्य") {
    console.log("Test Passed!");
} else {
    console.log("Test Failed!");
    process.exit(1);
}
