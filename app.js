
// ==========================================
// EVOLVE3 — ACCOUNT + DASHBOARD SYSTEM
// ==========================================

const API = "/api";
let currentUser = null;

// ==========================================
// AUTHENTICATION SCREEN
// ==========================================

const authStyles = document.createElement("style");

authStyles.textContent = `
#evolveAuth {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(5, 5, 12, .97);
    backdrop-filter: blur(15px);
    font-family: Inter, sans-serif;
}

#evolveAuth .auth-box {
    width: 100%;
    max-width: 420px;
    padding: 35px;
    background: #1a1a24;
    border: 1px solid #6366ff55;
    border-radius: 18px;
    box-shadow: 0 0 60px #6366ff18;
}

#evolveAuth .auth-brand {
    text-align: center;
    margin-bottom: 28px;
}

#evolveAuth .auth-logo {
    width: 55px;
    height: 55px;
    margin: 0 auto 13px;
    display: grid;
    place-items: center;
    border-radius: 15px;
    background: linear-gradient(135deg,#7779ff,#4547d9);
    font-size: 20px;
    font-weight: 800;
}

#evolveAuth h2 {
    color: white;
    font-family: 'Space Grotesk',sans-serif;
    font-size: 23px;
    margin-bottom: 8px;
}

#evolveAuth .auth-brand p,
#evolveAuth .auth-switch {
    color: #9292a6;
    font-size: 12px;
}

#evolveAuth .auth-field {
    margin-bottom: 16px;
}

#evolveAuth label {
    display: block;
    color: #c5c5d5;
    font-size: 11px;
    margin-bottom: 8px;
}

#evolveAuth input {
    width: 100%;
    padding: 13px;
    background: #101017;
    border: 1px solid #ffffff18;
    border-radius: 8px;
    color: white;
    outline: none;
    font-size: 13px;
}

#evolveAuth input:focus {
    border-color: #7779ff;
}

#evolveAuth .auth-submit {
    width: 100%;
    padding: 14px;
    margin-top: 8px;
    background: #6366ff;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
}

#evolveAuth .auth-submit:disabled {
    opacity: .6;
    cursor: wait;
}

#evolveAuth .auth-switch {
    text-align: center;
    margin-top: 20px;
}

#evolveAuth .auth-switch button {
    background: none;
    border: none;
    color: #898bff;
    font-weight: 700;
    cursor: pointer;
}

#evolveAuth .auth-error {
    display: none;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 7px;
    background: #ff45451a;
    color: #ff8585;
    font-size: 12px;
    line-height: 1.5;
}

#evolveAuth .auth-demo-note {
    margin-top: 20px;
    color: #77778d;
    font-size: 10px;
    text-align: center;
    line-height: 1.6;
}

@media(max-width:480px) {
    #evolveAuth .auth-box {
        padding: 25px 20px;
    }
}

/* ==========================================
   EVOLVE3 PROFILE EDITOR
========================================== */

#evolveProfileEditor {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(4, 4, 12, .85);
    backdrop-filter: blur(12px);
    font-family: Inter, sans-serif;
}

#evolveProfileEditor .profile-edit-box {
    width: 100%;
    max-width: 430px;
    padding: 28px;
    background: #191923;
    border: 1px solid #7779ff55;
    border-radius: 17px;
    box-shadow: 0 0 55px #6366ff20;
}

#evolveProfileEditor h2 {
    color: #fff;
    font-size: 22px;
    margin: 0 0 8px;
}

#evolveProfileEditor .profile-edit-subtitle {
    color: #9292a6;
    font-size: 12px;
    margin-bottom: 25px;
}

#evolveProfileEditor label {
    display: block;
    color: #c5c5d5;
    font-size: 11px;
    margin-bottom: 8px;
}

#evolveProfileEditor input,
#evolveProfileEditor textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 13px;
    margin-bottom: 18px;
    background: #101017;
    border: 1px solid #ffffff20;
    border-radius: 8px;
    color: #fff;
    outline: none;
    font: inherit;
    font-size: 13px;
}

#evolveProfileEditor input:focus,
#evolveProfileEditor textarea:focus {
    border-color: #7779ff;
}

#evolveProfileEditor textarea {
    min-height: 85px;
    resize: vertical;
}

#evolveProfileEditor .profile-edit-error {
    display: none;
    color: #ff8585;
    background: #ff45451a;
    padding: 10px;
    border-radius: 7px;
    font-size: 12px;
    margin-bottom: 15px;
}

#evolveProfileEditor .profile-edit-actions {
    display: flex;
    gap: 10px;
    margin-top: 5px;
}

#evolveProfileEditor button {
    flex: 1;
    padding: 12px;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 700;
}

#evolveProfileEditor .profile-save {
    background: #6366ff;
    color: white;
}

#evolveProfileEditor .profile-cancel {
    background: #30303d;
    color: #ddd;
}

#evolveProfileEditor button:disabled {
    opacity: .6;
    cursor: wait;
}
`;

document.head.appendChild(authStyles);

const authScreen = document.createElement("div");
authScreen.id = "evolveAuth";
authScreen.innerHTML = `
    <div class="auth-box">
        <div class="auth-brand">
            <div class="auth-logo">E3</div>
            <h2 id="authHeading">Welcome to EVOLVE3</h2>
            <p id="authSubtitle">Sign in to continue your Web3 journey.</p>
        </div>

        <div class="auth-error" id="authError"></div>

        <form id="authForm">
            <div class="auth-field" id="usernameField" style="display:none">
                <label for="authUsername">USERNAME</label>
                <input id="authUsername" type="text"
                    placeholder="Choose a username"
                    maxlength="30" autocomplete="username">
            </div>

            <div class="auth-field">
                <label for="authEmail">EMAIL ADDRESS</label>
                <input id="authEmail" type="email"
                    placeholder="Enter your email"
                    required autocomplete="email">
            </div>

            <div class="auth-field">
                <label for="authPassword">PASSWORD</label>
                <input id="authPassword" type="password"
                    placeholder="At least 8 characters"
                    required minlength="8"
                    autocomplete="current-password">
            </div>

            <button class="auth-submit" id="authSubmit" type="submit">
                Sign In
            </button>
        </form>

        <div class="auth-switch">
            <span id="authSwitchText">New to EVOLVE3?</span>
            <button type="button" id="authSwitchButton">Create account</button>
        </div>

        <p class="auth-demo-note">
            Your account is stored in this EVOLVE3 installation.
            Demo wallet activities remain simulated.
        </p>
    </div>
`;

document.body.appendChild(authScreen);

// ==========================================
// PROFILE EDITOR SCREEN
// ==========================================

const profileEditor = document.createElement("div");
profileEditor.id = "evolveProfileEditor";

profileEditor.innerHTML = `
    <div class="profile-edit-box">
        <h2>Edit Your Profile</h2>
        <p class="profile-edit-subtitle">
            Update the name displayed across your EVOLVE3 dashboard.
        </p>

        <div class="profile-edit-error" id="profileEditError"></div>

        <form id="profileEditForm">
            <label for="profileDisplayName">DISPLAY NAME</label>
            <input
                id="profileDisplayName"
                type="text"
                maxlength="40"
                minlength="2"
                placeholder="Enter your display name"
                required
            >

            <label for="profileBio">BIO (OPTIONAL)</label>
            <textarea
                id="profileBio"
                maxlength="250"
                placeholder="Tell the community a little about yourself..."
            ></textarea>

            <div class="profile-edit-actions">
                <button type="button" class="profile-cancel" id="profileCancel">
                    Cancel
                </button>
                <button type="submit" class="profile-save" id="profileSave">
                    Save Changes
                </button>
            </div>
        </form>
    </div>
`;

document.body.appendChild(profileEditor);

const profileEditForm = document.getElementById("profileEditForm");
const profileDisplayName = document.getElementById("profileDisplayName");
const profileBio = document.getElementById("profileBio");
const profileEditError = document.getElementById("profileEditError");
const profileSave = document.getElementById("profileSave");

let authMode = "login";

const authForm = document.getElementById("authForm");
const authHeading = document.getElementById("authHeading");
const authSubtitle = document.getElementById("authSubtitle");
const usernameField = document.getElementById("usernameField");
const authSwitchText = document.getElementById("authSwitchText");
const authSwitchButton = document.getElementById("authSwitchButton");
const authSubmit = document.getElementById("authSubmit");
const authError = document.getElementById("authError");

function setAuthMode(mode) {
    authMode = mode;
    authError.style.display = "none";

    if (mode === "register") {
        authHeading.textContent = "Create Your Account";
        authSubtitle.textContent = "Join the EVOLVE3 community.";
        usernameField.style.display = "block";
        authSwitchText.textContent = "Already have an account?";
        authSwitchButton.textContent = "Sign in";
        authSubmit.textContent = "Create Account";
        document.getElementById("authPassword").autocomplete = "new-password";
    } else {
        authHeading.textContent = "Welcome to EVOLVE3";
        authSubtitle.textContent = "Sign in to continue your Web3 journey.";
        usernameField.style.display = "none";
        authSwitchText.textContent = "New to EVOLVE3?";
        authSwitchButton.textContent = "Create account";
        authSubmit.textContent = "Sign In";
        document.getElementById("authPassword").autocomplete = "current-password";
    }
}

authSwitchButton.addEventListener("click", () => {
    setAuthMode(authMode === "login" ? "register" : "login");
});

function showAuthError(message) {
    authError.textContent = message;
    authError.style.display = "block";
}

// ==========================================
// API REQUEST
// ==========================================

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(API + endpoint, {
        credentials: "same-origin",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    const responseText = await response.text();
    let data = {};

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            throw new Error(
                "The server returned an invalid response. Please check that EVOLVE3 is running correctly."
            );
        }
    }

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
    }

    return data;
}

// ==========================================
// LOGIN + REGISTRATION
// ==========================================

authForm.addEventListener("submit", async event => {
    event.preventDefault();

    authError.style.display = "none";
    authSubmit.disabled = true;
    authSubmit.textContent = "Please wait...";

    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;

    try {
        let result;

        if (authMode === "register") {
            const username = document.getElementById("authUsername").value.trim();

            result = await apiRequest("/auth/register", {
                method: "POST",
                body: JSON.stringify({ username, email, password })
            });
        } else {
            result = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });
        }

        currentUser = result.user;
        await enterDashboard(true);

    } catch (error) {
        showAuthError(error.message);
    } finally {
        authSubmit.disabled = false;
        authSubmit.textContent =
            authMode === "register" ? "Create Account" : "Sign In";
    }
});


// ==========================================
// EVOLVE3 CINEMATIC WELCOME INTRO
// ==========================================

function showWelcomeIntro() {
    return new Promise(resolve => {

        const oldIntro = document.getElementById("evolveWelcomeIntro");
        if (oldIntro) oldIntro.remove();

        if (!document.getElementById("evolveIntroStyles")) {
            const style = document.createElement("style");
            style.id = "evolveIntroStyles";

            style.textContent = `
                #evolveWelcomeIntro {
                    position: fixed;
                    inset: 0;
                    z-index: 20000;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background:
                        radial-gradient(ellipse at center, #191044 0%, #09091b 48%, #03040c 100%);
                    color: white;
                    font-family: Inter, sans-serif;
                }

                #evolveWelcomeIntro .e3-stars {
                    position: absolute;
                    inset: 0;
                    background-image:
                        radial-gradient(#a78bfa 1px, transparent 1px),
                        radial-gradient(#6366f1 1px, transparent 1px);
                    background-size: 75px 75px, 110px 110px;
                    opacity: .22;
                    animation: e3StarMove 12s linear infinite;
                }

                #evolveWelcomeIntro .e3-orb {
                    position: absolute;
                    top: -100px;
                    left: 50%;
                    width: 55px;
                    height: 55px;
                    border-radius: 50%;
                    transform: translateX(-50%);
                    background: radial-gradient(circle at 30% 25%, #fff, #a78bfa 30%, #5145e8 70%);
                    box-shadow: 0 0 25px #8b5cf6, 0 0 75px #6366f1;
                    animation: e3OrbFall 1.1s cubic-bezier(.5,0,.8,.5) forwards;
                }

                #evolveWelcomeIntro .e3-impact {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    width: 30px;
                    height: 30px;
                    border: 3px solid #c4b5fd;
                    border-radius: 50%;
                    opacity: 0;
                    transform: translate(-50%,-50%) scale(.1);
                    box-shadow: 0 0 30px #8b5cf6;
                    animation: e3Impact 1.1s ease-out 1s forwards;
                }

                #evolveWelcomeIntro .e3-splash {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    width: 100px;
                    height: 100px;
                    border: 2px solid #8b5cf6;
                    border-radius: 50%;
                    opacity: 0;
                    transform: translate(-50%,-50%) scale(.1);
                    animation: e3Splash 1.2s ease-out 1.05s forwards;
                }

                #evolveWelcomeIntro .e3-content {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    padding: 25px;
                    text-align: center;
                }

                #evolveWelcomeIntro .e3-logo {
                    margin: 0;
                    font-size: clamp(48px, 10vw, 90px);
                    font-weight: 900;
                    letter-spacing: 9px;
                    opacity: 0;
                    transform: scale(.2);
                    background: linear-gradient(110deg, #fff, #a78bfa, #6366f1, #fff);
                    background-size: 200% auto;
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                    filter: drop-shadow(0 0 22px #7770ff);
                    animation: e3LogoBlast .9s cubic-bezier(.16,1.4,.4,1) 1.25s forwards,
                               e3LogoGlow 3s linear 2.2s infinite;
                }

                #evolveWelcomeIntro .e3-line {
                    width: 0;
                    height: 2px;
                    margin: 12px auto 25px;
                    background: linear-gradient(90deg, transparent, #a78bfa, #6366f1, transparent);
                    box-shadow: 0 0 15px #8b5cf6;
                    animation: e3Line 1s ease 1.8s forwards;
                }

                #evolveWelcomeIntro .e3-welcome {
                    margin: 0;
                    font-size: clamp(20px, 4vw, 32px);
                    font-weight: 800;
                    letter-spacing: 3px;
                    opacity: 0;
                    transform: translateY(20px);
                    animation: e3TextReveal .7s ease 2.35s forwards;
                }

                #evolveWelcomeIntro .e3-name {
                    display: block;
                    margin-top: 10px;
                    color: #a78bfa;
                    font-size: clamp(17px, 3vw, 24px);
                    font-weight: 800;
                    letter-spacing: 3px;
                    opacity: 0;
                    animation: e3TextReveal .7s ease 2.65s forwards;
                }

                #evolveWelcomeIntro .e3-about {
                    max-width: 450px;
                    margin: 20px auto 0;
                    color: #b9b8d5;
                    font-size: 13px;
                    line-height: 1.8;
                    opacity: 0;
                    animation: e3TextReveal .7s ease 3.05s forwards;
                }

                #evolveWelcomeIntro .e3-skip {
                    position: absolute;
                    right: 25px;
                    bottom: 25px;
                    z-index: 5;
                    padding: 10px 17px;
                    border: 1px solid #7770ff66;
                    border-radius: 30px;
                    background: #17152d;
                    color: #ddd6fe;
                    font-size: 11px;
                    cursor: pointer;
                }

                #evolveWelcomeIntro.e3-exit {
                    opacity: 0;
                    transition: opacity .45s ease;
                    pointer-events: none;
                }

                @keyframes e3OrbFall {
                    0% { top: -100px; }
                    75% { top: 49%; }
                    88% { top: 46%; }
                    100% { top: 50%; opacity: 0; }
                }

                @keyframes e3Impact {
                    0% { opacity: 1; transform: translate(-50%,-50%) scale(.1); }
                    100% { opacity: 0; transform: translate(-50%,-50%) scale(8); }
                }

                @keyframes e3Splash {
                    0% { opacity: .9; transform: translate(-50%,-50%) scale(.1); }
                    100% { opacity: 0; transform: translate(-50%,-50%) scale(12); }
                }

                @keyframes e3LogoBlast {
                    0% { opacity: 0; transform: scale(.2); }
                    70% { opacity: 1; transform: scale(1.15); }
                    100% { opacity: 1; transform: scale(1); }
                }

                @keyframes e3LogoGlow {
                    to { background-position: 200% center; }
                }

                @keyframes e3Line {
                    to { width: min(300px, 75vw); }
                }

                @keyframes e3TextReveal {
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes e3StarMove {
                    to { background-position: 150px 150px, -110px 110px; }
                }

                @media (prefers-reduced-motion: reduce) {
                    #evolveWelcomeIntro * {
                        animation-duration: .01ms !important;
                    }
                }
            `;

            document.head.appendChild(style);
        }

        const intro = document.createElement("div");
        intro.id = "evolveWelcomeIntro";

        intro.innerHTML = `
            <div class="e3-stars"></div>
            <div class="e3-orb"></div>
            <div class="e3-impact"></div>
            <div class="e3-splash"></div>

            <div class="e3-content">
                <h1 class="e3-logo">EVOLVE3</h1>
                <div class="e3-line"></div>

                <h2 class="e3-welcome">WELCOME TO EVOLVE3</h2>
                <span class="e3-name"></span>

                <p class="e3-about">
                    Where blockchain, innovation and community
                    come together to shape the next evolution.
                </p>
            </div>

            <button class="e3-skip" type="button">SKIP INTRO →</button>
        `;

        intro.querySelector(".e3-name").textContent =
            currentUser?.display_name ||
            currentUser?.username ||
            "EXPLORER";

        document.body.appendChild(intro);

        let finished = false;

        function finish() {
            if (finished) return;
            finished = true;

            clearTimeout(timer);
            intro.classList.add("e3-exit");

            setTimeout(() => {
                intro.remove();
                resolve();
            }, 450);
        }

        intro.querySelector(".e3-skip").addEventListener("click", finish);

        const timer = setTimeout(finish, 5800);
    });
}

// ==========================================
// USER SESSION
// ==========================================

async function checkSession() {
    try {
        const result = await apiRequest("/me");
        currentUser = result.user;
        await enterDashboard();
    } catch {
        authScreen.style.display = "flex";
    }
}

function updateUserDetails() {
    if (!currentUser) return;

    const username = currentUser.display_name ||
        currentUser.username || "Explorer";

    const welcomeHeading = document.querySelector(".welcome h1");

    if (welcomeHeading) {
        welcomeHeading.innerHTML =
            `Welcome, <span id="welcomeUsername"></span> ✦`;

        document.getElementById("welcomeUsername").textContent = username;
    }

    const profileName = document.querySelector(".user-profile strong");
    if (profileName) profileName.textContent = username;

    const avatar = document.querySelector(".avatar");
    const headerAvatar = document.querySelector(".header-avatar");

    const initial = username.charAt(0).toUpperCase();

    if (avatar) avatar.textContent = initial;
    if (headerAvatar) headerAvatar.textContent = initial;
}

async function enterDashboard(showIntro = false) {
    authScreen.style.display = "none";

    updateUserDetails();
    initializeDashboard();

    await loadTribes();

    if (showIntro) {
        await showWelcomeIntro();
    }
}
async function logout() {
    try {
        await apiRequest("/auth/logout", { method: "POST" });
    } catch (error) {
        console.error("Logout error:", error);
    }

    currentUser = null;
    location.reload();
}

// ==========================================
// EDIT PROFILE
// ==========================================

function openProfileEditor() {
    if (!currentUser) return;

    profileDisplayName.value =
        currentUser.display_name || currentUser.username || "";

    profileBio.value = currentUser.bio || "";

    profileEditError.style.display = "none";
    profileSave.disabled = false;
    profileSave.textContent = "Save Changes";

    profileEditor.style.display = "flex";
}

function closeProfileEditor() {
    profileEditor.style.display = "none";
}

document.getElementById("profileCancel").addEventListener(
    "click",
    closeProfileEditor
);

profileEditor.addEventListener("click", event => {
    if (event.target === profileEditor) {
        closeProfileEditor();
    }
});

profileEditForm.addEventListener("submit", async event => {
    event.preventDefault();

    const displayName = profileDisplayName.value.trim();
    const bio = profileBio.value.trim();

    if (displayName.length < 2) {
        profileEditError.textContent =
            "Your display name must contain at least 2 characters.";

        profileEditError.style.display = "block";
        return;
    }

    profileEditError.style.display = "none";
    profileSave.disabled = true;
    profileSave.textContent = "Saving...";

    try {
        await apiRequest("/profile", {
            method: "PUT",
            body: JSON.stringify({
                display_name: displayName,
                bio: bio
            })
        });

       // Update the current account immediately.
currentUser.display_name = displayName;
currentUser.bio = bio;

// Update dashboard name and avatar.
updateUserDetails();

// Automatically complete the profile mission.
await completeMission("complete-profile");
        showModal(
            "Profile Updated!",
            "Your display name has been changed successfully."
        );

    } catch (error) {
        profileEditError.textContent = error.message;
        profileEditError.style.display = "block";
    } finally {
        profileSave.disabled = false;
        profileSave.textContent = "Save Changes";
    }
});

// ==========================================
// MODAL
// ==========================================

const modal = document.getElementById("demoModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalOk = document.getElementById("modalOk");

function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalOk.textContent = "Got it";
    modalOk.onclick = closeModal;
    modal.classList.add("show");
}

function closeModal() {
    modal.classList.remove("show");
}

document.getElementById("modalClose").addEventListener("click", closeModal);
modalOk.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
});

// ==========================================
// ACCOUNT-SPECIFIC LOCAL ACTIVITY
// ==========================================

function getStorageKey() {
    return "evolve3_activity_user_" + currentUser.id;
}

const defaultActivity = {
    completedSteps: [],
    wallet: {
        walletBalance: "Not connected"
    }
};

let activity = null;

function loadActivity() {
    try {
        const saved = JSON.parse(localStorage.getItem(getStorageKey()));

        return saved
            ? {
                ...defaultActivity,
                ...saved,
                wallet: {
                    ...defaultActivity.wallet,
                    ...(saved.wallet || {})
                }
            }
            : structuredClone(defaultActivity);
    } catch {
        return structuredClone(defaultActivity);
    }
}

function saveActivity() {
    localStorage.setItem(getStorageKey(), JSON.stringify(activity));
    updateDashboard();
}

// ==========================================
// ONBOARDING
// ==========================================

function initializeOnboarding() {
    const onboardingCards = document.querySelectorAll(".onboarding-card");

    onboardingCards.forEach((card, index) => {
        const button = card.querySelector(".complete-btn");

        button.addEventListener("click", () => {
            const step = String(index);

            if (activity.completedSteps.includes(step)) {
                activity.completedSteps =
                    activity.completedSteps.filter(item => item !== step);
            } else {
                activity.completedSteps.push(step);
            }

            saveActivity();
        });
    });
}

// ==========================================
// DASHBOARD CALCULATIONS
// ==========================================

function updateDashboard() {
    if (!activity) return;

    const completed = activity.completedSteps.length;
    const stepCounter = document.getElementById("stepCounter");

    if (stepCounter) {
        stepCounter.textContent = `${completed} / 4 COMPLETED`;
    }

    const onboardingCards = document.querySelectorAll(".onboarding-card");

    onboardingCards.forEach((card, index) => {
        const done = activity.completedSteps.includes(String(index));
        const button = card.querySelector(".complete-btn");

        card.classList.toggle("completed", done);

        button.innerHTML = done
            ? 'Completed <i class="fa-solid fa-check"></i>'
            : 'Mark Complete <i class="fa-solid fa-arrow-right"></i>';

        card.querySelector(".mini-progress span").style.width =
            done ? "100%" : "0%";
    });

    const progressCards = document.querySelectorAll(".progress-card");
    const blockchainPercent = Math.round((completed / 4) * 100);

    if (progressCards[0]) {
        progressCards[0].querySelector(".progress-numbers strong").textContent =
            blockchainPercent + "%";

        progressCards[0].querySelector(".progress-numbers span").textContent =
            `${completed} / 4 onboarding tasks`;

        progressCards[0].querySelector(".progress-fill").style.width =
            blockchainPercent + "%";
    }

  const walletBalance = document.querySelectorAll(".wallet-balance");

walletBalance.forEach(element => {
    if (!element.id || element.id !== "walletBalance") {
        element.textContent = "$0.00 (not connected)";
    }
});
}

// ==========================================
// WALLET — SIMULATED ONLY
// ==========================================


function initializeWallet() {
    const connectBtn = document.getElementById("connectWalletBtn");
    const sendBtn = document.getElementById("sendBtn");
    const receiveBtn = document.getElementById("receiveBtn");
    const refreshBtn = document.getElementById("refreshWalletBtn");
    const copyBtn = document.getElementById("copyAddress");

    const balanceEl = document.getElementById("walletBalance");
    balanceEl.textContent = "$0.00 (not connected)";
    const networkEl = document.getElementById("walletNetwork");
    const addressEl = document.getElementById("walletAddress");
    const statusEl = document.getElementById("walletStatus");
    const transactionsEl = document.getElementById("walletTransactions");

    let provider;
    let signer;
    let walletAddress = "";

    const SEPOLIA_ID = 11155111;

    function status(message) {
        statusEl.textContent = message;
    }

    async function refreshBalance() {
        if (!provider || !walletAddress) return;

        const network = await provider.getNetwork();

        if (Number(network.chainId) !== SEPOLIA_ID) {
            balanceEl.textContent = "Wrong network";
            networkEl.textContent = "Please switch to Sepolia Testnet.";
            sendBtn.disabled = true;
            receiveBtn.disabled = true;
            refreshBtn.disabled = true;
            return;
        }

        const balance = await provider.getBalance(walletAddress);

        balanceEl.textContent =
            Number(ethers.formatEther(balance)).toFixed(6) + " ETH";

        networkEl.textContent = "Ethereum Sepolia Testnet";

        sendBtn.disabled = false;
        receiveBtn.disabled = false;
        refreshBtn.disabled = false;
    }

    async function connectWallet() {
        if (!window.ethereum) {
            status("MetaMask not detected. Install MetaMask first.");
            return;
        }

        if (typeof ethers === "undefined") {
            status("Blockchain library failed to load. Refresh the page.");
            return;
        }

        try {
            status("Connecting wallet...");

            provider = new ethers.BrowserProvider(window.ethereum);

            const accounts = await provider.send(
                "eth_requestAccounts", []
            );

            if (!accounts.length) throw new Error("No wallet account found.");

            const network = await provider.getNetwork();

            if (Number(network.chainId) !== SEPOLIA_ID) {
                try {
                    await provider.send("wallet_switchEthereumChain", [
                        { chainId: "0xaa36a7" }
                    ]);
                } catch (switchError) {
                    status("Please switch MetaMask to Sepolia Testnet.");
                    return;
                }

                provider = new ethers.BrowserProvider(window.ethereum);
            }

            signer = await provider.getSigner();
            walletAddress = await signer.getAddress();

            addressEl.textContent =
                walletAddress.slice(0, 8) + "..." +
                walletAddress.slice(-6);

            connectBtn.textContent = "Wallet Connected";
            copyBtn.disabled = false;

            await refreshBalance();
            status("Connected to Ethereum Sepolia.");

        } catch (error) {
            status(error.message || "Wallet connection failed.");
        }
    }

    connectBtn.addEventListener("click", connectWallet);

    refreshBtn.addEventListener("click", async () => {
        try {
            await refreshBalance();
            status("Balance updated from the blockchain.");
        } catch (error) {
            status("Could not refresh balance.");
        }
    });

    receiveBtn.addEventListener("click", () => {
        if (!walletAddress) return;

        status("Share your public wallet address to receive Sepolia test ETH.");
        transactionsEl.textContent = walletAddress;
    });

    copyBtn.addEventListener("click", async () => {
        if (!walletAddress) return;

        await navigator.clipboard.writeText(walletAddress);
        status("Wallet address copied.");
    });

    sendBtn.addEventListener("click", async () => {
        if (!signer) return;

        const recipient = prompt("Enter the recipient's wallet address:");
        if (!recipient) return;

        const amount = prompt("Enter the amount of Sepolia ETH to send:");
        if (!amount) return;

        try {
            if (!ethers.isAddress(recipient)) {
                throw new Error("Invalid wallet address.");
            }

            if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
                throw new Error("Enter a valid positive amount.");
            }

            const confirmed = confirm(
                `Send ${amount} Sepolia ETH to ${recipient}?`
            );

            if (!confirmed) return;

            status("Waiting for MetaMask confirmation...");

            const transaction = await signer.sendTransaction({
                to: recipient,
                value: ethers.parseEther(amount)
            });

            status("Transaction submitted. Waiting for confirmation...");

            transactionsEl.innerHTML =
                `Confirmed transaction: <a target="_blank" rel="noopener" href="https://sepolia.etherscan.io/tx/${transaction.hash}">View on Etherscan</a>`;

            await refreshBalance();
            status("Blockchain transaction confirmed.");

        } catch (error) {
            status(error.reason || error.message || "Transaction failed.");
        }
    });

    if (window.ethereum) {
        window.ethereum.on("accountsChanged", () => {
            window.location.reload();
        });

        window.ethereum.on("chainChanged", () => {
            window.location.reload();
        });
    }
}

// ==========================================
// TRIBES — DATABASE CONNECTED
// ==========================================

const tribeRows = document.querySelectorAll("#tribeTable tr");

const tribeIds = {
    "Builders DAO": "builders-dao",
    "NFT Creators": "nft-creators",
    "DeFi Explorers": "defi-explorers",
    "Governance Guild": "governance-guild"
};

// Read the tribe name without including its icon letter.
function getTribeName(row) {
    const element = row.querySelector(".tribe-name");

    if (!element) return "";

    return Array.from(element.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .join(" ")
        .trim();
}


function openCommunityAccess(tribeName) {
    let communityModal = document.getElementById("communityAccessModal");

    if (!communityModal) {
        communityModal = document.createElement("div");
        communityModal.id = "communityAccessModal";

        communityModal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 10000;
            background: rgba(0,0,0,0.85);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        communityModal.innerHTML = `
            <div style="
                background: #101027;
                border: 1px solid #5145a5;
                border-radius: 20px;
                padding: 28px;
                width: 100%;
                max-width: 430px;
                color: white;
                text-align: center;
                position: relative;
                box-shadow: 0 15px 50px rgba(0,0,0,0.5);
            ">
                <button id="closeCommunityModal" style="
                    position: absolute;
                    top: 15px;
                    right: 18px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 25px;
                    cursor: pointer;
                ">&times;</button>

                <div style="
                    width: 55px;
                    height: 55px;
                    border-radius: 16px;
                    background: rgba(124,58,237,0.2);
                    display: grid;
                    place-items: center;
                    margin: 0 auto 18px;
                    color: #a78bfa;
                    font-size: 23px;
                ">
                    <i class="fa-solid fa-users"></i>
                </div>

                <span style="
                    color: #a78bfa;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 2px;
                ">COMMUNITY ACCESS</span>

                <h2 id="communityTribeName" style="
                    margin: 10px 0;
                    font-size: 23px;
                ">Community</h2>

                <span style="
                    display: inline-block;
                    background: rgba(245,158,11,0.12);
                    color: #fbbf24;
                    padding: 6px 13px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                ">COMING SOON</span>

                <p style="
                    color: #c4c4d8;
                    font-size: 13px;
                    line-height: 1.8;
                    margin: 20px 0;
                ">
                    There is currently no active WhatsApp or Telegram
                    community for this tribe.
                    <br><br>
                    Your request to join the community will be considered
                    once you are an <strong style="color:white;">
                    approved, joined member of EVOLVE3.</strong>
                    <br><br>
                    Please be patient as we work towards creating a safe
                    and engaging community experience.
                </p>

                <button disabled style="
                    width: 100%;
                    padding: 13px;
                    margin-bottom: 10px;
                    border: none;
                    border-radius: 10px;
                    background: #202c27;
                    color: #7ee2a8;
                    font-weight: 600;
                    opacity: 0.7;
                    cursor: not-allowed;
                ">
                    <i class="fa-brands fa-whatsapp"></i>
                    WhatsApp — Coming Soon
                </button>

                <button disabled style="
                    width: 100%;
                    padding: 13px;
                    border: none;
                    border-radius: 10px;
                    background: #202b3d;
                    color: #93c5fd;
                    font-weight: 600;
                    opacity: 0.7;
                    cursor: not-allowed;
                ">
                    <i class="fa-brands fa-telegram"></i>
                    Telegram — Coming Soon
                </button>

                <button id="communityGotIt" style="
                    width: 100%;
                    padding: 12px;
                    margin-top: 18px;
                    border: none;
                    border-radius: 10px;
                    background: linear-gradient(135deg,#7655e8,#5145a5);
                    color: white;
                    font-weight: 700;
                    cursor: pointer;
                ">Got it</button>
            </div>
        `;

        document.body.appendChild(communityModal);

        const closeCommunity = () => {
            communityModal.style.display = "none";
        };

        communityModal.querySelector("#closeCommunityModal")
            .addEventListener("click", closeCommunity);

        communityModal.querySelector("#communityGotIt")
            .addEventListener("click", closeCommunity);

        communityModal.addEventListener("click", event => {
            if (event.target === communityModal) {
                closeCommunity();
            }
        });
    }

    communityModal.querySelector("#communityTribeName").textContent =
        tribeName;

    communityModal.style.display = "flex";
}


async function loadTribes() {
    try {
        const result = await apiRequest("/tribes");

        result.tribes.forEach(tribe => {
            const row = [...tribeRows].find(item =>
                getTribeName(item) === tribe.name
            );

            if (!row) return;

            row.querySelector("td:nth-child(2)").textContent =
                Number(tribe.members).toLocaleString("en-US");

            const button = row.querySelector(".view-btn");

            button.textContent = "View";
            button.dataset.joined = tribe.joined ? "true" : "false";
            button.dataset.members = tribe.members;
            button.dataset.description = tribe.description || 
                "Explore this EVOLVE3 community and connect with other members.";
        });

    } catch (error) {
        console.error("Could not load tribes:", error);
        showModal("Tribes", "We couldn't load the tribe list. Please refresh.");
    }
}


function initializeTribes() {
    // Add the Community Access button to the existing modal.
    let communityButton = document.getElementById("tribeCommunityButton");

    if (!communityButton) {
        communityButton = document.createElement("button");
        communityButton.id = "tribeCommunityButton";
        communityButton.className = "modal-ok";
        communityButton.textContent = "Community Access";

        communityButton.style.marginTop = "10px";

        modalOk.insertAdjacentElement("afterend", communityButton);
    }

    communityButton.onclick = () => {
        openCommunityAccess(communityButton.dataset.tribe || "EVOLVE3");
    };

    tribeRows.forEach(row => {
        const button = row.querySelector(".view-btn");
        const tribeName = getTribeName(row);
        const tribeId = tribeIds[tribeName];

        button.addEventListener("click", () => {
            if (!tribeId) {
                showModal("Tribes", "We couldn't identify this tribe.");
                return;
            }

            const joined = button.dataset.joined === "true";
            const members = Number(button.dataset.members || 0);
            const description = button.dataset.description ||
                "Explore this EVOLVE3 community.";

            modalTitle.textContent = tribeName;

            modalMessage.textContent =
                description + " Members: " +
                members.toLocaleString("en-US") + ".";

            communityButton.dataset.tribe = tribeName;
            communityButton.style.display = "block";

            modalOk.disabled = joined;
            modalOk.textContent = joined ? "Already Joined" : "Join Tribe";

            modalOk.onclick = async () => {
                if (joined) return;

                modalOk.disabled = true;
                modalOk.textContent = "Joining...";

                try {
                    const result = await apiRequest(
                        `/tribes/${tribeId}/join`,
                        { method: "POST" }
                    );

                    closeModal();
                    await loadTribes();

                    await completeMission("join-tribe");

                    showModal("Tribe Update", result.message);

                } catch (error) {
                    closeModal();
                    showModal("Could Not Join", error.message);

                } finally {
                    modalOk.disabled = false;
                    modalOk.textContent = "Got it";
                    modalOk.onclick = closeModal;
                }
            };

            modal.classList.add("show");
        });
    });

    const searchInput = document.getElementById("searchInput");
    const noResults = document.getElementById("noResults");

    searchInput.addEventListener("input", () => {
        const term = searchInput.value.toLowerCase();
        let visible = 0;

        tribeRows.forEach(row => {
            const matches = row.textContent.toLowerCase().includes(term);
            row.style.display = matches ? "" : "none";

            if (matches) visible++;
        });

        noResults.style.display = visible ? "none" : "block";
    });
}


// ==========================================
// NAVIGATION + HEADER
// ==========================================
// ===================================
// EVOLVE3 MISSIONS SYSTEM
// ===================================

async function openMissions() {
    let modal = document.getElementById("missionsModal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "missionsModal";

        modal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(0,0,0,0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        modal.innerHTML = `
            <div style="
                background: #101027;
                border: 1px solid #5145a5;
                border-radius: 18px;
                padding: 25px;
                width: 100%;
                max-width: 600px;
                max-height: 85vh;
                overflow-y: auto;
                color: white;
            ">
                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:20px;
                ">
                    <h2 style="margin:0;">EVOLVE3 Missions</h2>

                    <button id="closeMissions"
                        style="
                            background:none;
                            border:none;
                            color:white;
                            font-size:25px;
                            cursor:pointer;
                        ">×</button>
                </div>

                <p style="color:#aaa;">
                    Complete missions and track your progress.
                </p>

                <div id="missionsList">
                    Loading missions...
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById("closeMissions").onclick = () => {
            modal.remove();
        };
    }

    modal.style.display = "flex";

    await loadMissions();
}


// LOAD MISSIONS FROM DATABASE
async function loadMissions() {
    const list = document.getElementById("missionsList");

    if (!list) return;

    list.textContent = "Loading missions...";

    try {
        const response = await apiRequest("/missions");
        const missions = Array.isArray(response)
            ? response
            : response.missions || [];

        list.innerHTML = "";

        if (!missions.length) {
            list.textContent = "No missions available yet.";
            return;
        }

        missions.forEach(mission => {
            const card = document.createElement("div");

            card.style.cssText = `
                background:#1b1b3a;
                border:1px solid #39356d;
                border-radius:12px;
                padding:17px;
                margin-top:14px;
            `;

            const title = document.createElement("h3");
            title.textContent = mission.title;
            title.style.margin = "0 0 8px";

            const description = document.createElement("p");
            description.textContent = mission.description;
            description.style.color = "#aaa";

            const button = document.createElement("button");

            button.style.cssText = `
                padding:10px 18px;
                border:0;
                border-radius:8px;
                background:#6555e8;
                color:white;
                cursor:pointer;
                font-weight:bold;
            `;

            if (mission.completed) {
                button.textContent = "✓ Completed";
                button.disabled = true;
                button.style.background = "#26734d";
            } else {
                button.textContent = "Complete Mission";

                button.onclick = () => {
                    completeMission(mission.id);
                };
            }

            card.append(title, description, button);
            list.appendChild(card);
        });

    } catch (error) {
        console.error("Missions error:", error);
        list.textContent = "Unable to load missions. Please try again.";
    }
}


// COMPLETE A MISSION
async function completeMission(missionId) {
    try {
        await apiRequest(`/missions/${encodeURIComponent(missionId)}/complete`, {
            method: "POST"
        });

        await loadMissions();

    } catch (error) {
        console.error("Mission completion error:", error);
        alert("Unable to complete this mission. Please try again.");
    }
}
function initializeNavigation() {
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            document.querySelectorAll(".nav-link").forEach(item =>
                item.classList.remove("active")
            );

            link.classList.add("active");

            const page = link.dataset.page;

            if (page === "Profile") {
                openProfileEditor();
                return;
            }

            if (page === "Missions") {
                openMissions();
                return;
            }
        });
    });
}

    document.getElementById("notificationBtn").addEventListener("click", () => {
        showModal("Notifications", "You're all caught up!");
    });

    document.getElementById("settingsBtn").addEventListener("click", () => {
        showModal("Settings", "Your dashboard settings are coming soon.");
    });

    document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("viewAllBtn").addEventListener("click", async () => {
    document.getElementById("explore").scrollIntoView({
        behavior: "smooth"
    });

    // Complete the exploration mission.
    await completeMission("explore-dashboard");
});


// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

let dashboardInitialized = false;

function initializeDashboard() {
    if (dashboardInitialized) return;

    dashboardInitialized = true;

    activity = loadActivity();

    initializeOnboarding();
    initializeWallet();
    initializeTribes();
    initializeNavigation();

    updateDashboard();

    console.log("EVOLVE3 account dashboard loaded.");
}

// ==========================================
// START
// ==========================================

checkSession();
