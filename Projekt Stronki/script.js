const PRINTS = {
    kitty: {
        name: "Hello Kitty",
        empty: "hello_kitty.png",
        full: "hello_kitty_full.png"
    },
    leon: {
        name: "Leon Kennedy",
        empty: "leon_kennedy.png",
        full: "leon_kennedy_full.png"
    }
};

const FLAVORS = [
    "Dobieram odpowiednie proporcję...",
    "Czekaj bo rozlałem troche T-T",
    "ZROBILEM"
];

const DRINK_LABELS = ["Wypij kakao", "Wypij kakao", "Ostatni łyk"];

const screens = {
    welcome: document.getElementById("screen-welcome"),
    choice: document.getElementById("screen-choice"),
    loading: document.getElementById("screen-loading"),
    ready: document.getElementById("screen-ready")
};

const drinkBtn = document.getElementById("drink-btn");
const afterglow = document.getElementById("afterglow");
const readyMug = document.getElementById("ready-mug");
const mugEmpty = document.getElementById("mug-empty");
const mugFull = document.getElementById("mug-full");

let chosenMug = "kitty";
let sips = 0;

function showScreen(id) {
    Object.entries(screens).forEach(([key, screen]) => {
        const on = key === id;
        screen.classList.toggle("active", on);
        if (on) {
            screen.removeAttribute("inert");
        } else {
            screen.setAttribute("inert", "");
        }
    });
}

const sparkleBox = document.getElementById("sparkles");
const sparkleChars = ["✦", "♡", "✧", "♥", "✦", "♡"];

function spawnSparkle() {
    const el = document.createElement("span");
    el.className = "sparkle";
    el.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.top = Math.random() * 100 + "%";
    el.style.fontSize = 0.55 + Math.random() * 1.1 + "rem";
    el.style.animationDuration = 2.2 + Math.random() * 3.2 + "s";
    sparkleBox.appendChild(el);

    el.addEventListener("animationend", () => {
        el.remove();
        spawnSparkle();
    });
}

for (let i = 0; i < 36; i++) {
    setTimeout(spawnSparkle, i * 90);
}

function startMakingCocoa(mug) {
    chosenMug = mug;
    const bar = document.getElementById("loading-bar");
    const flavor = document.getElementById("loading-flavor");
    let flavorIndex = 0;

    bar.classList.remove("is-filling");
    void bar.offsetWidth;
    flavor.textContent = FLAVORS[0];
    flavor.style.opacity = "1";
    showScreen("loading");
    bar.classList.add("is-filling");

    const flavorTimer = setInterval(() => {
        flavorIndex = (flavorIndex + 1) % FLAVORS.length;
        flavor.style.opacity = "0";
        setTimeout(() => {
            flavor.textContent = FLAVORS[flavorIndex];
            flavor.style.opacity = "1";
        }, 220);
    }, 2400);

    flavor.style.transition = "opacity 0.22s ease";

    setTimeout(() => {
        clearInterval(flavorTimer);
        showReady();
    }, 6300);
}

function showReady() {
    const mug = PRINTS[chosenMug];
    sips = 0;
    readyMug.className = `photo-mug is-ready ${chosenMug}`;
    mugEmpty.src = mug.empty;
    mugEmpty.alt = `Pusty kubek ${mug.name}`;
    mugFull.src = mug.full;
    mugFull.alt = `Kakao w kubku ${mug.name}`;
    drinkBtn.hidden = false;
    drinkBtn.textContent = DRINK_LABELS[0];
    afterglow.hidden = true;
    showScreen("ready");
}

function drinkCocoa() {
    sips += 1;
    readyMug.classList.remove("is-sipping");
    void readyMug.offsetWidth;
    readyMug.classList.add("is-sipping", `sip-${sips}`);

    if (sips < 3) {
        drinkBtn.textContent = DRINK_LABELS[sips];
        return;
    }

    drinkBtn.hidden = true;
    afterglow.hidden = false;
}

document.querySelector("[data-go='screen-choice']").addEventListener("click", () => {
    showScreen("choice");
});

document.querySelectorAll("[data-mug]").forEach((card) => {
    card.addEventListener("click", () => startMakingCocoa(card.dataset.mug));
});

drinkBtn.addEventListener("click", drinkCocoa);

document.getElementById("again-btn").addEventListener("click", () => {
    showScreen("choice");
});
