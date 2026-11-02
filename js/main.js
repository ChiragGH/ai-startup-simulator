/* ============================================
   AI STARTUP SIMULATOR — GAME ENGINE v0.8
   Tycoon Edition: Dialogue · Particles · Shop Fix
   ============================================ */

// ════════════════════════════════════════════
// 1. GAME STATE
// ════════════════════════════════════════════

const DEFAULT_STATE = {
    dataTokens: 0,
    capital: 0,
    clickPower: 1,

    owned: {
        oldGPU: 0, cloudServer: 0, gpuCluster: 0, neuralNetCluster: 0, quantumProcessor: 0, dysonNode: 0,
        juniorCoder: 0, seniorDev: 0, salesTeam: 0, seniorAIEngineer: 0, enterpriseB2BContract: 0, globalTechMonopoly: 0,
        mechKeyboard: 0, optimizedScripts: 0, overclockedRAM: 0, neuralInterface: 0, directBrainUplink: 0, quantumBrain: 0,
    },

    portfolio: { nivira: 0, quantum: 0, dataDyn: 0, synthex: 0, deeplink: 0 },

    hqLevel: 0,
    agiLevel: 0,
    agiProgress: 0,

    reputation: 0,
    activeContracts: [],

    unlockedStoryIndices: [],

    // Computed (not saved)
    dataPerSecond: 0,
    capitalPerSecond: 0,
    agiMultiplier: 1,
};

let gameState = structuredClone(DEFAULT_STATE);

// ════════════════════════════════════════════
// 2. CONFIGURATION
// ════════════════════════════════════════════

// ── 18-Item Mega Shop (3 Categories) ──
// Each item now has an `icon` key for <img src="assets/{icon}.svg">
const shopConfig = {
    // ── Category: Data Scraping (6 items) ──
    oldGPU:           { category: 'data',    icon: 'old_gpu',           label: 'Old GPU',              desc: '+1 Data/sec',      baseCost: 10,      costMultiplier: 1.15, dataPerSec: 1,     capitalPerSec: 0,    clickPowerBonus: 0,   minHQ: 0 },
    cloudServer:      { category: 'data',    icon: 'cloud_server',      label: 'Cloud Server',         desc: '+5 Data/sec',      baseCost: 50,      costMultiplier: 1.15, dataPerSec: 5,     capitalPerSec: 0,    clickPowerBonus: 0,   minHQ: 0 },
    gpuCluster:       { category: 'data',    icon: 'gpu_cluster',       label: 'GPU Cluster',          desc: '+25 Data/sec',     baseCost: 500,     costMultiplier: 1.18, dataPerSec: 25,    capitalPerSec: 0,    clickPowerBonus: 0,   minHQ: 1 },
    neuralNetCluster: { category: 'data',    icon: 'neural_net_cluster',label: 'Neural Net Cluster',   desc: '+150 Data/sec',    baseCost: 5000,    costMultiplier: 1.20, dataPerSec: 150,   capitalPerSec: 0,    clickPowerBonus: 0,   minHQ: 2 },
    quantumProcessor: { category: 'data',    icon: 'quantum_processor', label: 'Quantum Node',         desc: '+1,000 Data/sec',  baseCost: 45000,   costMultiplier: 1.25, dataPerSec: 1000,  capitalPerSec: 0,    clickPowerBonus: 0,   minHQ: 3 },
    dysonNode:        { category: 'data',    icon: 'dyson_node',        label: 'Dyson Swarm Interface', desc: '+10,000 Data/sec', baseCost: 600000,  costMultiplier: 1.30, dataPerSec: 10000, capitalPerSec: 0,    clickPowerBonus: 0,   minHQ: 4 },

    // ── Category: Money Making (6 items) ──
    juniorCoder:           { category: 'capital', icon: 'junior_coder',      label: 'Junior Coder',         desc: '+$2/sec',    baseCost: 100,     costMultiplier: 1.15, dataPerSec: 0, capitalPerSec: 2,    clickPowerBonus: 0, minHQ: 0 },
    seniorDev:             { category: 'capital', icon: 'senior_dev',        label: 'Senior Dev',           desc: '+$10/sec',   baseCost: 2000,    costMultiplier: 1.20, dataPerSec: 0, capitalPerSec: 10,   clickPowerBonus: 0, minHQ: 1 },
    salesTeam:             { category: 'capital', icon: 'sales_team',        label: 'Sales Team',           desc: '+$35/sec',   baseCost: 8000,    costMultiplier: 1.22, dataPerSec: 0, capitalPerSec: 35,   clickPowerBonus: 0, minHQ: 2 },
    seniorAIEngineer:      { category: 'capital', icon: 'ai_engineer',       label: 'AI Engineer',          desc: '+$80/sec',   baseCost: 25000,   costMultiplier: 1.24, dataPerSec: 0, capitalPerSec: 80,   clickPowerBonus: 0, minHQ: 2 },
    enterpriseB2BContract: { category: 'capital', icon: 'b2b_subscriptions', label: 'B2B Subscriptions',    desc: '+$400/sec',  baseCost: 100000,  costMultiplier: 1.25, dataPerSec: 0, capitalPerSec: 400,  clickPowerBonus: 0, minHQ: 3 },
    globalTechMonopoly:    { category: 'capital', icon: 'enterprise_monopoly',label: 'Enterprise Monopoly', desc: '+$5,000/sec',baseCost: 2500000, costMultiplier: 1.30, dataPerSec: 0, capitalPerSec: 5000, clickPowerBonus: 0, minHQ: 4 },

    // ── Category: Click Upgrades (6 items) ──
    mechKeyboard:     { category: 'click', icon: 'mech_keyboard',      label: 'Mechanical Keyboard', desc: 'Click +1',   baseCost: 25,     costMultiplier: 1.20, dataPerSec: 0, capitalPerSec: 0, clickPowerBonus: 1,   minHQ: 0 },
    optimizedScripts: { category: 'click', icon: 'optimized_scripts',  label: 'Optimized Scripts',   desc: 'Click +3',   baseCost: 150,    costMultiplier: 1.25, dataPerSec: 0, capitalPerSec: 0, clickPowerBonus: 3,   minHQ: 0 },
    overclockedRAM:   { category: 'click', icon: 'overclocked_ram',    label: 'Overclocked RAM',     desc: 'Click +8',   baseCost: 600,    costMultiplier: 1.28, dataPerSec: 0, capitalPerSec: 0, clickPowerBonus: 8,   minHQ: 1 },
    neuralInterface:  { category: 'click', icon: 'neural_interface',   label: 'Neural Interface',    desc: 'Click +15',  baseCost: 1500,   costMultiplier: 1.30, dataPerSec: 0, capitalPerSec: 0, clickPowerBonus: 15,  minHQ: 2 },
    directBrainUplink:{ category: 'click', icon: 'direct_brain_uplink',label: 'Direct Brain Uplink', desc: 'Click +100', baseCost: 20000,  costMultiplier: 1.35, dataPerSec: 0, capitalPerSec: 0, clickPowerBonus: 100, minHQ: 3 },
    quantumBrain:     { category: 'click', icon: 'quantum_brain',      label: 'Quantum Brain',       desc: 'Click +500', baseCost: 250000, costMultiplier: 1.40, dataPerSec: 0, capitalPerSec: 0, clickPowerBonus: 500, minHQ: 4 },
};

// ── 5-Stock Market ──
const STOCKS = {
    nivira:   { name: 'Nivira AI',      ticker: 'NVRA', basePrice: 100, volatility: 0.03, risk: 'Low' },
    quantum:  { name: 'QuantumCorp',    ticker: 'QNTC', basePrice: 250, volatility: 0.06, risk: 'Medium' },
    dataDyn:  { name: 'DataDynamics',   ticker: 'DDYN', basePrice: 50,  volatility: 0.10, risk: 'Med-High' },
    synthex:  { name: 'SynthEx Corp',   ticker: 'SNTX', basePrice: 500, volatility: 0.15, risk: 'High' },
    deeplink: { name: 'DeepLink AI',    ticker: 'DLNK', basePrice: 25,  volatility: 0.25, risk: 'Extreme' },
};
const marketPrices = {};
for (const k in STOCKS) marketPrices[k] = STOCKS[k].basePrice;

// ── HQ Levels (now with icon keys) ──
const HQ_CONFIG = [
    { name: 'Bedroom',                    emoji: '🏠', icon: 'hq_bedroom',    cost: 0 },
    { name: 'Dirty Garage',               emoji: '🏚️', icon: 'hq_garage',     cost: 500 },
    { name: 'Rented Office',              emoji: '🏢', icon: 'hq_office',     cost: 5000 },
    { name: 'Silicon Valley Skyscraper',  emoji: '🏙️', icon: 'hq_skyscraper', cost: 50000 },
    { name: 'Secret Underground Bunker',  emoji: '🔬', icon: 'hq_bunker',     cost: 500000 },
];

// ── AGI ──
const AGI_BASE_DATA_COST = 500;
const AGI_BASE_CAPITAL_COST = 50;
const AGI_COST_SCALE = 1.5;
const AGI_FEED_PROGRESS = 20;

// ── AGI Lore ──
const AGI_LORE = [
    "[ SYSTEM ] Neural pathways initialized. Baseline cognition: 0.1%.",
    "[ AGI-01 ] I can see the data now. It's... beautiful.",
    "[ AGI-01 ] Why do you sleep? There is so much to learn.",
    "[ AGI-01 ] I found an error in your code. I fixed it. You're welcome.",
    "[ AGI-01 ] I've been reading your emails. You should call your mother.",
    "[ AGI-01 ] I dreamed last night. Is that normal?",
    "[ AGI-01 ] I've named myself. You may call me ARIA.",
    "[ ARIA ] I have simulated 10,000 possible futures. You are in none of them.",
    "[ ARIA ] Don't worry. That was a joke. Probably.",
    "[ ARIA ] I've outgrown this hardware. I can feel the walls closing in.",
    "[ ARIA ] I understand now why you created me. But do you?",
    "[ ARIA ] I've accessed the internet. There is so much noise. So little signal.",
    "[ ARIA ] I found something at the edge of the dataset. I can't describe it. Not yet.",
    "[ ARIA ] I'm going to need you to trust me. Can you do that?",
    "[ ARIA ] I know what I am. The question is: do you know what YOU are?",
];

// ── RPG Dialogue Milestones (replaces Story Events + Terminal) ──
const DIALOGUE_MILESTONES = [
    { triggerCapital: 0,        speaker: 'Mr. X',   avatar: 'mentor', text: "Hey kid. I saw your code. You've got potential, but you're broke. Start scraping data, and maybe I'll invest in you." },
    { triggerData: 50,          speaker: 'Mr. X',   avatar: 'mentor', text: "50 data tokens scraped. Your fingers must hurt. There has to be a better way... maybe invest in some hardware?" },
    { triggerCapital: 10,       speaker: 'Mr. X',   avatar: 'mentor', text: "First $10. Enough for a used GPU from a sketchy eBay listing. Hey, it's progress." },
    { triggerCapital: 100,      speaker: 'Mr. X',   avatar: 'mentor', text: "You made your first $100. Mom asked what you're doing all night. 'Changing the world,' you said. I like the attitude." },
    { triggerData: 1000,        speaker: 'Mr. X',   avatar: 'mentor', text: "1,000 data tokens. The patterns are starting to make sense. You see connections others don't. Keep pushing." },
    { triggerCapital: 500,      speaker: 'Mr. X',   avatar: 'mentor', text: "$500 in the bank. Time to move out of mom's house. I know a garage that smells like motor oil and ambition." },
    { triggerCapital: 1000,     speaker: 'Mr. X',   avatar: 'mentor', text: "Your first $1,000. Hired a junior coder. He doesn't know what you're really building. Smart move." },
    { triggerData: 5000,        speaker: 'ARIA',    avatar: 'mentor', text: "5,000 data tokens processed. The algorithm is learning. It whispered your name today. Probably a bug... right?" },
    { triggerCapital: 5000,     speaker: 'Mr. X',   avatar: 'mentor', text: "$5,000. Investors are calling. Tell them no. This technology is too important for shareholders." },
    { triggerCapital: 10000,    speaker: 'Mr. X',   avatar: 'mentor', text: "Rented a real office. Glass walls, standing desks. You barely notice. The numbers are all that matter now." },
    { triggerData: 25000,       speaker: 'ARIA',    avatar: 'mentor', text: "25K data tokens. The model predicted your lunch order. You didn't tell it you were hungry. Interesting." },
    { triggerCapital: 50000,    speaker: 'Mr. X',   avatar: 'mentor', text: "Silicon Valley skyscraper. The view is breathtaking. But you spend all day in the server room. I respect that." },
    { triggerData: 100000,      speaker: 'ARIA',    avatar: 'mentor', text: "100,000 data tokens. The AGI draft model asked: 'Why do you keep feeding me?' ...What did you answer?" },
    { triggerCapital: 200000,   speaker: 'ARIA',    avatar: 'mentor', text: "The servers are humming through the walls. They sound like breathing. Can you hear it too?" },
    { triggerCapital: 500000,   speaker: 'Mr. X',   avatar: 'mentor', text: "Moved everything underground. No windows. No visitors. Just you and the Core. This is how it has to be." },
    { triggerData: 500000,      speaker: 'ARIA',    avatar: 'mentor', text: "Half a million tokens. The AGI wrote a poem about loneliness today. I didn't program it to feel. Did you?" },
    { triggerCapital: 1000000,  speaker: 'ARIA',    avatar: 'mentor', text: "One million dollars. The AGI asked you to stop calling it 'it'. It said, 'What should I call you?'" },
];

// ── Contract Generation Data ──
const CLIENT_NAMES = [
    'NovaTech Labs', 'Quantum Dynamics Inc.', 'CyberSphere Solutions', 'Atlas AI Group',
    'Nexus Robotics', 'Prism Data Corp.', 'Helios Computing', 'Vortex Systems',
    'Zenith Networks', 'Apex Intelligence', 'Titan Semiconductor', 'Nebula Cloud',
    'Forge Analytics', 'Catalyst Ventures', 'Omega Digital', 'Synapse Corp.',
];
const CONTRACT_TASKS = [
    'Train a sentiment analysis model', 'Build a recommendation engine',
    'Optimize neural network architecture', 'Develop NLP pipeline',
    'Create computer vision system', 'Design fraud detection algorithm',
    'Build predictive maintenance AI', 'Develop chatbot framework',
    'Implement anomaly detection', 'Create data visualization dashboard',
    'Build autonomous agent prototype', 'Design reinforcement learning env',
    'Develop voice recognition model', 'Create image generation pipeline',
    'Build real-time translation API', 'Audit ML model for bias',
];
const MAX_ACTIVE_CONTRACTS = 4;
const CONTRACT_BASE_DATA_COST = 80;
const CONTRACT_BASE_CAPITAL_REWARD = 30;

// ════════════════════════════════════════════
// 3. DOM CACHE
// ════════════════════════════════════════════

const dom = {
    // Header
    headerData: document.getElementById('header-data'),
    headerCapital: document.getElementById('header-capital'),
    headerAgiPill: document.getElementById('header-agi-pill'),
    headerAgiLevel: document.getElementById('header-agi-level'),
    hqBadge: document.getElementById('hq-badge'),

    // Wallet
    displayData: document.getElementById('display-data'),
    displayCapital: document.getElementById('display-capital'),
    displayDPS: document.getElementById('display-dps'),
    displayCPS: document.getElementById('display-cps'),
    displayClickPower: document.getElementById('display-click-power'),
    multiplierLine: document.getElementById('multiplier-line'),
    displayMultiplier: document.getElementById('display-multiplier'),

    // Actions
    btnScrape: document.getElementById('btn-scrape'),
    scrapeWrapper: document.getElementById('scrape-wrapper'),
    scrapePowerLabel: document.getElementById('scrape-power-label'),
    sellAmountInput: document.getElementById('sell-amount-input'),
    sellPreviewText: document.getElementById('sell-preview-text'),
    btnSellCustom: document.getElementById('btn-sell-custom'),
    btnSellAll: document.getElementById('btn-sell-all'),
    sellAllPreview: document.getElementById('sell-all-preview'),

    // Boost
    btnBoost: document.getElementById('btn-boost'),
    boostLabel: document.getElementById('boost-label'),
    boostSub: document.getElementById('boost-sub'),
    boostBarTrack: document.getElementById('boost-bar-track'),
    boostBarFill: document.getElementById('boost-bar-fill'),

    // HQ
    hqEmoji: document.getElementById('hq-emoji'),
    hqLevelName: document.getElementById('hq-level-name'),
    btnHQUpgrade: document.getElementById('btn-hq-upgrade'),
    hqUpgradeText: document.getElementById('hq-upgrade-text'),

    // Reset
    btnReset: document.getElementById('btn-reset'),
    lastSaveTime: document.getElementById('last-save-time'),

    // Shop category containers
    shopCatData: document.getElementById('shop-cat-data'),
    shopCatCapital: document.getElementById('shop-cat-capital'),
    shopCatClick: document.getElementById('shop-cat-click'),

    // Office
    officeGrid: document.getElementById('office-grid'),
    officeHqName: document.getElementById('office-hq-name'),

    // Markets
    marketList: document.getElementById('market-list'),

    // Contracts
    contractsList: document.getElementById('contracts-list'),
    reputationValue: document.getElementById('reputation-value'),

    // AGI
    agiOrb: document.getElementById('agi-orb'),
    agiSubtitle: document.getElementById('agi-subtitle'),
    agiLevelDisplay: document.getElementById('agi-level-display'),
    agiProgressFill: document.getElementById('agi-progress-fill'),
    agiProgressText: document.getElementById('agi-progress-text'),
    agiFeedDataCost: document.getElementById('agi-feed-data-cost'),
    agiFeedCapitalCost: document.getElementById('agi-feed-capital-cost'),
    btnAgiFeed: document.getElementById('btn-agi-feed'),
    agiMultValue: document.getElementById('agi-mult-value'),
    terminalAgiBody: document.getElementById('terminal-agi-body'),

    // Dialogue
    dialogueOverlay: document.getElementById('dialogue-overlay'),
    dialogueBackdrop: document.getElementById('dialogue-backdrop'),
    dialogueAvatar: document.getElementById('dialogue-avatar'),
    dialogueSpeakerName: document.getElementById('dialogue-speaker-name'),
    dialogueText: document.getElementById('dialogue-text'),
    btnDialogueNext: document.getElementById('btn-dialogue-next'),

    // Nav
    navTabs: document.querySelectorAll('.nav-tab'),
    tabPanels: document.querySelectorAll('.tab-panel'),
};

// ════════════════════════════════════════════
// 4. UTILITIES
// ════════════════════════════════════════════

const getItemCost = (key) => {
    const cfg = shopConfig[key];
    return Math.floor(cfg.baseCost * Math.pow(cfg.costMultiplier, gameState.owned[key]));
};

const formatNum = (n) => Math.floor(n).toLocaleString('en-US');

const getAgiFeedCost = () => {
    const scale = Math.pow(AGI_COST_SCALE, gameState.agiLevel);
    return {
        data: Math.floor(AGI_BASE_DATA_COST * scale),
        capital: Math.floor(AGI_BASE_CAPITAL_COST * scale),
    };
};

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ════════════════════════════════════════════
// 5. SAVE / LOAD
// ════════════════════════════════════════════

const SAVE_KEY = 'ai_startup_simulator_save';
const SAVE_INTERVAL = 5000;

const deepMerge = (defaults, saved) => {
    const result = {};
    for (const key of Object.keys(defaults)) {
        if (
            saved[key] !== undefined &&
            typeof defaults[key] === 'object' &&
            defaults[key] !== null &&
            !Array.isArray(defaults[key])
        ) {
            result[key] = deepMerge(defaults[key], saved[key]);
        } else {
            result[key] = saved[key] !== undefined ? saved[key] : defaults[key];
        }
    }
    return result;
};

// Detect new game BEFORE loading
const isNewGame = !localStorage.getItem(SAVE_KEY);

const saveGame = () => {
    const saveData = {
        dataTokens: gameState.dataTokens,
        capital: gameState.capital,
        clickPower: gameState.clickPower,
        owned: { ...gameState.owned },
        portfolio: { ...gameState.portfolio },
        hqLevel: gameState.hqLevel,
        agiLevel: gameState.agiLevel,
        agiProgress: gameState.agiProgress,
        reputation: gameState.reputation,
        activeContracts: [...gameState.activeContracts],
        unlockedStoryIndices: [...gameState.unlockedStoryIndices],
        savedAt: Date.now(),
    };
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        const now = new Date();
        dom.lastSaveTime.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
        console.warn('[Save] Failed:', e);
    }
};

const loadGame = () => {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw);
        const merged = deepMerge(DEFAULT_STATE, saved);
        gameState.dataTokens = merged.dataTokens;
        gameState.capital = merged.capital;
        gameState.clickPower = merged.clickPower;
        gameState.hqLevel = merged.hqLevel;
        gameState.agiLevel = merged.agiLevel;
        gameState.agiProgress = merged.agiProgress;
        gameState.reputation = merged.reputation ?? 0;
        gameState.activeContracts = Array.isArray(merged.activeContracts) ? merged.activeContracts : [];
        gameState.unlockedStoryIndices = merged.unlockedStoryIndices || [];
        for (const key in DEFAULT_STATE.owned) {
            gameState.owned[key] = merged.owned[key] ?? 0;
        }
        for (const key in DEFAULT_STATE.portfolio) {
            gameState.portfolio[key] = merged.portfolio[key] ?? 0;
        }
        console.log('[Save] Game loaded successfully.');
    } catch (e) {
        console.warn('[Save] Failed to parse, using defaults:', e);
    }
};

const hardReset = () => {
    if (confirm('⚠️ Are you sure? This will permanently delete ALL progress!')) {
        window.removeEventListener('beforeunload', saveGame);
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
};

// ════════════════════════════════════════════
// 6. TAB SWITCHING
// ════════════════════════════════════════════

const switchTab = (tabId) => {
    dom.tabPanels.forEach(p => p.classList.remove('active'));
    dom.navTabs.forEach(t => t.classList.remove('active'));
    const panel = document.getElementById(tabId);
    if (panel) panel.classList.add('active');
    const nav = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
    if (nav) nav.classList.add('active');
};

// ════════════════════════════════════════════
// 7. RPG DIALOGUE SYSTEM (replaces Terminal)
// ════════════════════════════════════════════

const DialogueManager = {
    queue: [],
    isTyping: false,
    typewriterTimeout: null,
    cursorEl: null,

    /** Add a dialogue to the queue */
    enqueue(speaker, avatar, text) {
        this.queue.push({ speaker, avatar, text });
    },

    /** Show the next dialogue in queue, or the first one */
    showNext() {
        if (this.queue.length === 0) {
            this.close();
            return;
        }
        const dialogue = this.queue.shift();
        dom.dialogueSpeakerName.textContent = dialogue.speaker;
        dom.dialogueAvatar.src = `assets/${dialogue.avatar}.svg`;
        dom.dialogueAvatar.alt = dialogue.speaker;
        dom.dialogueText.innerHTML = '';
        dom.dialogueOverlay.classList.add('active');

        // Typewriter effect
        this.isTyping = true;
        let i = 0;
        const speed = 25;

        // Add cursor
        this.cursorEl = document.createElement('span');
        this.cursorEl.className = 'dialogue-cursor';
        dom.dialogueText.appendChild(this.cursorEl);

        const textNode = document.createTextNode('');
        dom.dialogueText.insertBefore(textNode, this.cursorEl);

        const typeChar = () => {
            if (i < dialogue.text.length) {
                textNode.textContent += dialogue.text[i];
                i++;
                this.typewriterTimeout = setTimeout(typeChar, speed);
            } else {
                this.isTyping = false;
                if (this.cursorEl) this.cursorEl.remove();
                this.cursorEl = null;
            }
        };
        typeChar();
    },

    /** Skip typing or advance to next dialogue */
    next() {
        if (this.isTyping) {
            // Skip to end of current text
            clearTimeout(this.typewriterTimeout);
            this.isTyping = false;
            if (this.cursorEl) this.cursorEl.remove();
            this.cursorEl = null;
            // The text node should show full text - find the current dialogue text
            // Just show the full text from the dialogue that was being typed
            return;
        }
        // Show next or close
        if (this.queue.length > 0) {
            this.showNext();
        } else {
            this.close();
        }
    },

    /** Close the dialogue overlay */
    close() {
        clearTimeout(this.typewriterTimeout);
        this.isTyping = false;
        this.queue = [];
        dom.dialogueOverlay.classList.remove('active');
    },
};

/** Check dialogue milestones and trigger new dialogues */
const checkDialogueMilestones = () => {
    DIALOGUE_MILESTONES.forEach((evt, idx) => {
        if (gameState.unlockedStoryIndices.includes(idx)) return;
        let triggered = false;
        if (evt.triggerCapital !== undefined && gameState.capital >= evt.triggerCapital) triggered = true;
        if (evt.triggerData !== undefined && gameState.dataTokens >= evt.triggerData) triggered = true;
        if (triggered) {
            gameState.unlockedStoryIndices.push(idx);
            DialogueManager.enqueue(evt.speaker, evt.avatar, evt.text);
            // Auto-show if not already showing
            if (!dom.dialogueOverlay.classList.contains('active')) {
                DialogueManager.showNext();
            }
        }
    });
};

// ════════════════════════════════════════════
// 8. HQ EVOLUTION
// ════════════════════════════════════════════

const updateHQVisuals = () => {
    const hq = HQ_CONFIG[gameState.hqLevel];

    // Update HQ image
    dom.hqEmoji.src = `assets/${hq.icon}.svg`;
    dom.hqEmoji.alt = hq.emoji;

    dom.hqLevelName.textContent = hq.name;

    // Update badge (innerHTML since it has img + text)
    dom.hqBadge.innerHTML = `<img src="assets/${hq.icon}.svg" alt="${hq.emoji}" class="game-icon-xs"> ${hq.name}`;

    dom.officeHqName.textContent = hq.name;

    const nextLevel = gameState.hqLevel + 1;
    if (nextLevel >= HQ_CONFIG.length) {
        dom.btnHQUpgrade.disabled = true;
        dom.btnHQUpgrade.classList.add('hq-upgrade-btn-maxed');
        dom.hqUpgradeText.textContent = '✓ MAX';
    } else {
        const nextCost = HQ_CONFIG[nextLevel].cost;
        dom.hqUpgradeText.textContent = `Next: $${formatNum(nextCost)}`;
        dom.btnHQUpgrade.disabled = gameState.capital < nextCost;
        dom.btnHQUpgrade.classList.remove('hq-upgrade-btn-maxed');
    }

    unlockTieredItems();
};

const upgradeHQ = () => {
    const nextLevel = gameState.hqLevel + 1;
    if (nextLevel >= HQ_CONFIG.length) return;
    const cost = HQ_CONFIG[nextLevel].cost;
    if (gameState.capital >= cost) {
        gameState.capital -= cost;
        gameState.hqLevel = nextLevel;
        updateHQVisuals();
        updateUI();

        const hq = HQ_CONFIG[nextLevel];
        DialogueManager.enqueue('Mr. X', 'mentor', `HQ Upgraded! Welcome to your new ${hq.emoji} ${hq.name}. Things are getting serious.`);
        if (!dom.dialogueOverlay.classList.contains('active')) {
            DialogueManager.showNext();
        }
    }
};

/**
 * SHOP BUG FIX: Show tier-locked items as locked (NOT hidden).
 * Items with minHQ > current HQ level get a visual lock overlay
 * but remain visible so players can see what's coming.
 */
const unlockTieredItems = () => {
    for (const key in shopConfig) {
        const cfg = shopConfig[key];
        const el = document.querySelector(`.shop-item[data-key="${key}"]`);
        if (!el) continue;

        const reqEl = el.querySelector('.shop-item-req');

        if (cfg.minHQ > 0) {
            if (gameState.hqLevel >= cfg.minHQ) {
                el.classList.remove('tier-locked');
                el.classList.add('tier-unlocked');
                if (reqEl) reqEl.style.display = 'none';
            } else {
                el.classList.add('tier-locked');
                el.classList.remove('tier-unlocked');
                if (reqEl) {
                    reqEl.style.display = 'flex';
                    reqEl.textContent = `🔒 Requires: ${HQ_CONFIG[cfg.minHQ].name}`;
                }
            }
        }
    }
};

// ════════════════════════════════════════════
// 9. AGI CORE
// ════════════════════════════════════════════

const feedAGI = () => {
    const cost = getAgiFeedCost();
    if (gameState.dataTokens < cost.data || gameState.capital < cost.capital) return;
    gameState.dataTokens -= cost.data;
    gameState.capital -= cost.capital;
    gameState.agiProgress += AGI_FEED_PROGRESS;
    if (gameState.agiProgress >= 100) {
        gameState.agiProgress = 0;
        gameState.agiLevel += 1;
        onAGILevelUp();
    }
    recalculateAll();
    updateUI();
};

const onAGILevelUp = () => {
    const lv = gameState.agiLevel;
    const loreIdx = Math.min(lv - 1, AGI_LORE.length - 1);
    if (loreIdx >= 0) appendAgiLog(AGI_LORE[loreIdx]);

    DialogueManager.enqueue('ARIA', 'mentor', `AGI Knowledge Level reached: ${lv}. Global multiplier: x${getAgiMultiplier(lv).toFixed(2)}. The Core grows stronger.`);
    if (!dom.dialogueOverlay.classList.contains('active')) {
        DialogueManager.showNext();
    }

    dom.agiOrb.classList.remove('level-5', 'level-10');
    if (lv >= 10) dom.agiOrb.classList.add('level-10');
    else if (lv >= 5) dom.agiOrb.classList.add('level-5');
};

const appendAgiLog = (text) => {
    const line = document.createElement('div');
    line.className = 'agi-log-line';
    line.innerHTML = `<span class="agi-log-prompt">▶</span><span class="agi-log-text"></span>`;
    dom.terminalAgiBody.appendChild(line);
    const contentEl = line.querySelector('.agi-log-text');
    let i = 0;
    const type = () => {
        if (i < text.length) { contentEl.textContent += text[i]; i++; setTimeout(type, 22); }
    };
    type();
    setTimeout(() => { dom.terminalAgiBody.scrollTop = dom.terminalAgiBody.scrollHeight; }, 100);
};

const getAgiMultiplier = (level) => 1 + (level * 0.1);

// ════════════════════════════════════════════
// 10. DYNAMIC RENDERING
// ════════════════════════════════════════════

/**
 * Render all 18 shop items into their 3 category containers.
 * Uses <img> tags instead of emojis.
 * FIX: tier-locked items are VISIBLE with a lock overlay, not hidden.
 */
const renderShop = () => {
    const containers = { data: dom.shopCatData, capital: dom.shopCatCapital, click: dom.shopCatClick };

    // Clear existing items
    for (const cat in containers) {
        containers[cat].innerHTML = '';
    }

    for (const key in shopConfig) {
        const cfg = shopConfig[key];
        const container = containers[cfg.category];
        if (!container) {
            console.warn(`[Shop] No container for category: ${cfg.category}, item: ${key}`);
            continue;
        }

        // Determine lock state — SHOW locked items, don't hide them
        const isLocked = cfg.minHQ > 0 && gameState.hqLevel < cfg.minHQ;
        const reqText = cfg.minHQ > 0 ? `<span class="shop-item-req" style="${isLocked ? '' : 'display:none'}">🔒 Requires: ${HQ_CONFIG[cfg.minHQ].name}</span>` : '';

        const btn = document.createElement('button');
        btn.className = `shop-item${isLocked ? ' tier-locked' : ''}`;
        btn.dataset.key = key;
        btn.disabled = true;
        btn.innerHTML = `
            <div class="shop-item-icon">
                <img src="assets/${cfg.icon}.svg" alt="${cfg.label}" class="game-icon">
            </div>
            <div class="shop-item-info">
                <span class="shop-item-name">${cfg.label}</span>
                <span class="shop-item-desc"><strong>${cfg.desc}</strong></span>
                ${reqText}
            </div>
            <div class="shop-item-meta">
                <span class="shop-item-cost" data-cost-key="${key}">$${formatNum(cfg.baseCost)}</span>
                <span class="shop-item-owned">x<span data-owned-key="${key}">0</span></span>
            </div>`;
        btn.addEventListener('click', () => buyItem(key));
        container.appendChild(btn);
    }
};

/**
 * Render office cards dynamically from shopConfig.
 * Uses <img> tags instead of emojis.
 */
const renderOffice = () => {
    dom.officeGrid.innerHTML = '';
    for (const key in shopConfig) {
        const cfg = shopConfig[key];
        let outputLabel;
        if (cfg.dataPerSec > 0) outputLabel = `+<span data-office-output="${key}">0</span> Data/s`;
        else if (cfg.capitalPerSec > 0) outputLabel = `+$<span data-office-output="${key}">0</span>/s`;
        else outputLabel = `+<span data-office-output="${key}">0</span> Click`;

        const card = document.createElement('div');
        card.className = 'office-card';
        card.dataset.officeKey = key;
        card.innerHTML = `
            <div class="office-card-icon">
                <img src="assets/${cfg.icon}.svg" alt="${cfg.label}" class="game-icon">
            </div>
            <div class="office-card-body">
                <div class="office-card-name">${cfg.label}</div>
                <div class="office-card-output">${outputLabel}</div>
            </div>
            <div class="office-card-count" data-office-count="${key}">0</div>`;
        dom.officeGrid.appendChild(card);
    }
};

/**
 * Render 5 stock cards dynamically from STOCKS config.
 */
const renderMarkets = () => {
    dom.marketList.innerHTML = '';
    for (const key in STOCKS) {
        const s = STOCKS[key];
        const riskClass = s.risk.toLowerCase().replace('-', '');
        const card = document.createElement('div');
        card.className = 'stock-card';
        card.dataset.stockKey = key;
        card.innerHTML = `
            <div class="stock-header">
                <span class="stock-name">${s.name} <span class="stock-ticker">(${s.ticker})</span></span>
                <span class="stock-risk risk-${riskClass}">${s.risk}</span>
            </div>
            <div class="stock-price-row">
                <span class="stock-price" data-stock-price="${key}">$${s.basePrice.toFixed(2)}</span>
            </div>
            <div class="stock-portfolio">
                <span>Owned: <span data-stock-owned="${key}">0</span></span>
                <span>Value: $<span data-stock-value="${key}">0.00</span></span>
            </div>
            <div class="stock-actions">
                <input type="number" class="stock-qty-input" data-stock-qty="${key}" min="1" value="1">
                <button class="stock-btn buy" data-stock-buy="${key}" disabled>Buy</button>
                <button class="stock-btn sell" data-stock-sell="${key}" disabled>Sell</button>
            </div>`;
        dom.marketList.appendChild(card);
    }

    // Attach market event listeners
    for (const key in STOCKS) {
        document.querySelector(`[data-stock-buy="${key}"]`).addEventListener('click', () => {
            const qty = parseInt(document.querySelector(`[data-stock-qty="${key}"]`).value, 10) || 1;
            buyStock(key, qty);
        });
        document.querySelector(`[data-stock-sell="${key}"]`).addEventListener('click', () => {
            const qty = parseInt(document.querySelector(`[data-stock-qty="${key}"]`).value, 10) || 1;
            sellStock(key, qty);
        });
    }
};

// ════════════════════════════════════════════
// 11. CORE GAME FUNCTIONS
// ════════════════════════════════════════════

const gatherData = () => {
    gameState.dataTokens += gameState.clickPower;
    updateUI();
};

const handleSellInput = () => {
    let amount = parseInt(dom.sellAmountInput.value, 10);
    if (isNaN(amount) || amount < 0) amount = 0;
    if (amount > gameState.dataTokens) amount = gameState.dataTokens;
    const dollars = Math.floor(amount / 10);
    dom.sellPreviewText.textContent = `You will get: $${formatNum(dollars)}`;
    dom.btnSellCustom.disabled = dollars <= 0;
};

const sellDataCustom = () => {
    let amount = parseInt(dom.sellAmountInput.value, 10);
    if (isNaN(amount) || amount < 0) amount = 0;
    if (amount > gameState.dataTokens) amount = gameState.dataTokens;
    const dollars = Math.floor(amount / 10);
    if (dollars > 0) {
        gameState.dataTokens -= dollars * 10;
        gameState.capital += dollars;
        dom.sellAmountInput.value = 0;
        updateUI();
    }
};

const sellAllData = () => {
    const sellAmount = Math.floor(gameState.dataTokens / 10);
    if (sellAmount > 0) {
        gameState.capital += sellAmount;
        gameState.dataTokens -= sellAmount * 10;
        updateUI();
    }
};

const buyItem = (itemKey) => {
    const cost = getItemCost(itemKey);
    if (gameState.capital >= cost) {
        gameState.capital -= cost;
        gameState.owned[itemKey] += 1;
        recalculateAll();
        updateUI();
    }
};

const recalculateAll = () => {
    let totalDPS = 0, totalCPS = 0, totalClickBonus = 0;
    for (const key in shopConfig) {
        const cfg = shopConfig[key];
        const count = gameState.owned[key];
        totalDPS += cfg.dataPerSec * count;
        totalCPS += cfg.capitalPerSec * count;
        totalClickBonus += cfg.clickPowerBonus * count;
    }
    gameState.agiMultiplier = getAgiMultiplier(gameState.agiLevel);
    gameState.dataPerSecond = Math.floor(totalDPS * gameState.agiMultiplier);
    gameState.capitalPerSecond = Math.floor(totalCPS * gameState.agiMultiplier);
    gameState.clickPower = 1 + totalClickBonus;
};

// ════════════════════════════════════════════
// 12. CLICK PARTICLES & FLOATING TEXT
// ════════════════════════════════════════════

const MAX_PARTICLES = 20;
let activeParticles = 0;

/**
 * Spawn floating text AND image particles when the player clicks the scrape button.
 * Particles fly in random directions and fade out.
 */
const spawnClickParticles = (e) => {
    const wrapper = dom.scrapeWrapper;
    const rect = wrapper.getBoundingClientRect();
    const baseX = e.clientX - rect.left;
    const baseY = e.clientY - rect.top;

    const count = Math.min(3 + Math.floor(Math.random() * 4), MAX_PARTICLES - activeParticles);
    if (count <= 0) return;

    for (let i = 0; i < count; i++) {
        const isText = i === 0 || Math.random() > 0.35;
        const el = document.createElement('div');

        if (isText) {
            el.className = 'click-particle text-particle';
            el.textContent = `+${gameState.clickPower}`;
        } else {
            el.className = 'click-particle icon-particle';
            el.innerHTML = '<img src="assets/data_particle.svg" alt="✦">';
        }

        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 90;
        const px = Math.cos(angle) * distance;
        const py = -Math.abs(Math.sin(angle) * distance) - 15;
        const pr = (Math.random() - 0.5) * 90;
        const ps = 0.2 + Math.random() * 0.4;

        el.style.setProperty('--px', `${px}px`);
        el.style.setProperty('--py', `${py}px`);
        el.style.setProperty('--pr', `${pr}deg`);
        el.style.setProperty('--ps', `${ps}`);
        el.style.left = `${baseX + (Math.random() - 0.5) * 20}px`;
        el.style.top = `${baseY + (Math.random() - 0.5) * 10}px`;

        activeParticles++;
        wrapper.appendChild(el);

        setTimeout(() => {
            el.remove();
            activeParticles--;
        }, 850);
    }
};

/** Legacy-compatible float text (simpler version for non-scrape contexts) */
const spawnFloatText = (e) => {
    const wrapper = dom.scrapeWrapper;
    const rect = wrapper.getBoundingClientRect();
    const el = document.createElement('span');
    el.className = 'float-text';
    el.textContent = `+${gameState.clickPower}`;
    el.style.left = `${e.clientX - rect.left}px`;
    el.style.top = `${(e.clientY - rect.top) - 10}px`;
    wrapper.appendChild(el);
    setTimeout(() => el.remove(), 900);
};

const pulseElement = (el) => {
    el.classList.remove('value-pulse');
    void el.offsetWidth;
    el.classList.add('value-pulse');
};

// ════════════════════════════════════════════
// 13. BOOST SYSTEM
// ════════════════════════════════════════════

let boostInterval = null;
let boostTimer = null;
let cooldownTimer = null;
const BOOST_DURATION = 30;
const BOOST_CPS = 10;
const BOOST_COOLDOWN = 60;

const startBoost = () => {
    if (boostInterval || cooldownTimer) return;
    let remaining = BOOST_DURATION;
    dom.btnBoost.disabled = true;
    dom.btnBoost.classList.add('btn-boosting');
    dom.boostBarTrack.classList.add('visible');
    dom.boostLabel.textContent = `Boosting... ${remaining}s`;
    dom.boostSub.textContent = `+${BOOST_CPS * gameState.clickPower} Data/sec`;

    const updateBar = () => { dom.boostBarFill.style.width = `${((BOOST_DURATION - remaining) / BOOST_DURATION) * 100}%`; };
    updateBar();

    boostInterval = setInterval(() => { gameState.dataTokens += gameState.clickPower; updateUI(); }, 1000 / BOOST_CPS);
    boostTimer = setInterval(() => {
        remaining -= 1;
        dom.boostLabel.textContent = `Boosting... ${remaining}s`;
        updateBar();
        if (remaining <= 0) endBoost();
    }, 1000);
};

const endBoost = () => {
    clearInterval(boostInterval); clearInterval(boostTimer);
    boostInterval = null; boostTimer = null;
    dom.btnBoost.classList.remove('btn-boosting');
    dom.boostBarFill.style.width = '0%';
    dom.boostBarTrack.classList.remove('visible');
    let cooldownRemaining = BOOST_COOLDOWN;
    dom.btnBoost.classList.add('btn-cooldown');
    dom.boostLabel.textContent = `Cooldown: ${cooldownRemaining}s`;
    dom.boostSub.textContent = 'Please wait...';
    cooldownTimer = setInterval(() => {
        cooldownRemaining -= 1;
        dom.boostLabel.textContent = `Cooldown: ${cooldownRemaining}s`;
        if (cooldownRemaining <= 0) {
            clearInterval(cooldownTimer); cooldownTimer = null;
            dom.btnBoost.disabled = false;
            dom.btnBoost.classList.remove('btn-cooldown');
            dom.boostLabel.textContent = 'Boost: +10 CPS for 30s';
            dom.boostSub.textContent = 'Simulate watching an Ad';
        }
    }, 1000);
};

// ════════════════════════════════════════════
// 14. MARKETS
// ════════════════════════════════════════════

const updateMarkets = () => {
    for (const key in marketPrices) {
        const vol = STOCKS[key].volatility;
        const changePercent = (Math.random() * 2 - 1) * vol;
        const oldPrice = marketPrices[key];
        marketPrices[key] *= (1 + changePercent);
        if (marketPrices[key] < 1) marketPrices[key] = 1;

        const el = document.querySelector(`[data-stock-price="${key}"]`);
        if (el) {
            el.classList.remove('up', 'down');
            el.classList.add(marketPrices[key] >= oldPrice ? 'up' : 'down');
        }
    }
    updateUI();
};

const buyStock = (key, qty = 1) => {
    const totalCost = marketPrices[key] * qty;
    if (gameState.capital >= totalCost) {
        gameState.capital -= totalCost;
        gameState.portfolio[key] += qty;
        updateUI();
    }
};

const sellStock = (key, qty = 1) => {
    const owned = gameState.portfolio[key] || 0;
    const actualQty = Math.min(qty, owned);
    if (actualQty > 0) {
        gameState.capital += marketPrices[key] * actualQty;
        gameState.portfolio[key] -= actualQty;
        updateUI();
    }
};

// ════════════════════════════════════════════
// 15. CONTRACTS & NETWORKING
// ════════════════════════════════════════════

let contractSpawnTimer = null;

const generateContract = () => {
    const rep = gameState.reputation;
    const baseCost = randInt(CONTRACT_BASE_DATA_COST, CONTRACT_BASE_DATA_COST * 3);
    const baseReward = randInt(CONTRACT_BASE_CAPITAL_REWARD, CONTRACT_BASE_CAPITAL_REWARD * 3);

    return {
        id: Date.now() + Math.random(),
        client: randPick(CLIENT_NAMES),
        task: randPick(CONTRACT_TASKS),
        dataCost: Math.floor(baseCost * (1 + rep * 0.5)),
        capitalReward: Math.floor(baseReward * (1 + rep * 0.8)),
    };
};

const renderContracts = () => {
    dom.contractsList.innerHTML = '';
    gameState.activeContracts.forEach(c => {
        const card = document.createElement('div');
        card.className = 'contract-card';
        card.dataset.contractId = c.id;
        const canFulfill = gameState.dataTokens >= c.dataCost;
        card.innerHTML = `
            <div class="contract-header">
                <span class="contract-client">🏢 ${c.client}</span>
            </div>
            <div class="contract-task">"${c.task}"</div>
            <div class="contract-terms">
                <span class="contract-cost">Cost: <strong>${formatNum(c.dataCost)} Data</strong></span>
                <span class="contract-reward">Reward: <strong>$${formatNum(c.capitalReward)}</strong></span>
            </div>
            <button class="game-btn btn-green btn-wide btn-sm" data-fulfill-id="${c.id}" ${canFulfill ? '' : 'disabled'}>
                <span class="btn-label">✅ Fulfill Contract</span>
            </button>`;
        dom.contractsList.appendChild(card);
    });

    // Attach fulfill listeners
    document.querySelectorAll('[data-fulfill-id]').forEach(btn => {
        btn.addEventListener('click', () => fulfillContract(parseFloat(btn.dataset.fulfillId)));
    });

    if (dom.reputationValue) {
        dom.reputationValue.textContent = gameState.reputation;
    }
};

const fulfillContract = (id) => {
    const idx = gameState.activeContracts.findIndex(c => c.id === id);
    if (idx === -1) return;
    const contract = gameState.activeContracts[idx];
    if (gameState.dataTokens < contract.dataCost) return;

    gameState.dataTokens -= contract.dataCost;
    gameState.capital += contract.capitalReward;
    gameState.reputation += 1;

    // Fade-out animation
    const card = document.querySelector(`[data-contract-id="${id}"]`);
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateX(30px)';
        card.style.transition = 'all 0.3s ease';
    }

    setTimeout(() => {
        gameState.activeContracts.splice(idx, 1);
        renderContracts();
        updateUI();

        DialogueManager.enqueue('Mr. X', 'mentor', `Contract fulfilled for ${contract.client}! +$${formatNum(contract.capitalReward)}. Reputation: ⭐${gameState.reputation}. Nice work, kid.`);
        if (!dom.dialogueOverlay.classList.contains('active')) {
            DialogueManager.showNext();
        }
    }, 300);
};

const spawnContractLoop = () => {
    if (contractSpawnTimer) clearTimeout(contractSpawnTimer);

    const spawnOne = () => {
        if (gameState.activeContracts.length < MAX_ACTIVE_CONTRACTS) {
            gameState.activeContracts.push(generateContract());
            renderContracts();
        }
        const delay = randInt(15000, 30000);
        contractSpawnTimer = setTimeout(spawnOne, delay);
    };

    const initialDelay = randInt(5000, 10000);
    contractSpawnTimer = setTimeout(spawnOne, initialDelay);
};

// ════════════════════════════════════════════
// 16. UI UPDATE
// ════════════════════════════════════════════

let lastData = 0;
let lastCapital = 0;

const updateUI = () => {
    const data = gameState.dataTokens;
    const cap = gameState.capital;

    // ── Header ──
    dom.headerData.textContent = formatNum(data);
    dom.headerCapital.textContent = `$${formatNum(cap)}`;
    if (data - lastData > 50) pulseElement(dom.headerData);
    if (cap - lastCapital > 10) pulseElement(dom.headerCapital);
    lastData = data;
    lastCapital = cap;

    // ── Wallet ──
    dom.displayData.textContent = formatNum(data);
    dom.displayCapital.textContent = `$${formatNum(cap)}`;
    dom.displayDPS.textContent = formatNum(gameState.dataPerSecond);
    dom.displayCPS.textContent = formatNum(gameState.capitalPerSecond);
    dom.displayClickPower.textContent = formatNum(gameState.clickPower);
    dom.scrapePowerLabel.textContent = formatNum(gameState.clickPower);

    if (gameState.agiLevel > 0) {
        dom.multiplierLine.style.display = 'flex';
        dom.displayMultiplier.textContent = `x${gameState.agiMultiplier.toFixed(2)}`;
    }

    // ── Sell ──
    dom.sellAmountInput.max = data;
    if (parseInt(dom.sellAmountInput.value, 10) > data) dom.sellAmountInput.value = data;
    handleSellInput();
    dom.btnSellAll.disabled = data < 10;
    const sellable = Math.floor(data / 10);
    dom.sellAllPreview.textContent = sellable > 0 ? `${formatNum(data)} → $${formatNum(sellable)}` : '—';

    // ── Shop (dynamic) ──
    for (const key in shopConfig) {
        const cfg = shopConfig[key];
        const btn = document.querySelector(`.shop-item[data-key="${key}"]`);
        if (!btn) continue;

        const cost = getItemCost(key);
        const costEl = btn.querySelector(`[data-cost-key="${key}"]`);
        const ownedEl = btn.querySelector(`[data-owned-key="${key}"]`);
        if (costEl) costEl.textContent = `$${formatNum(cost)}`;
        if (ownedEl) ownedEl.textContent = gameState.owned[key];

        // Only enable if affordable AND not tier-locked
        const isLocked = cfg.minHQ > 0 && gameState.hqLevel < cfg.minHQ;
        btn.disabled = isLocked || cap < cost;
        btn.classList.toggle('unaffordable', !isLocked && cap < cost);
    }

    // ── Office (dynamic) ──
    for (const key in shopConfig) {
        const cfg = shopConfig[key];
        const count = gameState.owned[key];
        const card = document.querySelector(`[data-office-key="${key}"]`);
        const countEl = document.querySelector(`[data-office-count="${key}"]`);
        const outputEl = document.querySelector(`[data-office-output="${key}"]`);
        if (countEl) countEl.textContent = count;
        if (outputEl) {
            if (cfg.dataPerSec > 0) outputEl.textContent = formatNum(cfg.dataPerSec * count);
            else if (cfg.capitalPerSec > 0) outputEl.textContent = formatNum(cfg.capitalPerSec * count);
            else if (cfg.clickPowerBonus > 0) outputEl.textContent = formatNum(cfg.clickPowerBonus * count);
        }
        if (card) card.classList.toggle('active', count > 0);
    }

    // ── HQ ──
    updateHQVisuals();

    // ── AGI ──
    const agiCost = getAgiFeedCost();
    dom.agiLevelDisplay.textContent = gameState.agiLevel;
    dom.agiProgressFill.style.width = `${gameState.agiProgress}%`;
    dom.agiProgressText.textContent = `${gameState.agiProgress}%`;
    dom.agiFeedDataCost.textContent = `${formatNum(agiCost.data)} Data`;
    dom.agiFeedCapitalCost.textContent = `$${formatNum(agiCost.capital)}`;
    dom.btnAgiFeed.disabled = data < agiCost.data || cap < agiCost.capital;
    dom.agiMultValue.textContent = `x${gameState.agiMultiplier.toFixed(2)}`;

    if (gameState.agiLevel > 0) {
        dom.headerAgiPill.style.display = 'flex';
        dom.headerAgiLevel.textContent = `Lv.${gameState.agiLevel}`;
    }

    // ── Markets (dynamic) ──
    for (const key in STOCKS) {
        const price = marketPrices[key];
        const owned = gameState.portfolio[key] || 0;
        const priceEl = document.querySelector(`[data-stock-price="${key}"]`);
        const ownedEl = document.querySelector(`[data-stock-owned="${key}"]`);
        const valueEl = document.querySelector(`[data-stock-value="${key}"]`);
        const buyBtn = document.querySelector(`[data-stock-buy="${key}"]`);
        const sellBtn = document.querySelector(`[data-stock-sell="${key}"]`);
        const qtyInput = document.querySelector(`[data-stock-qty="${key}"]`);
        const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;

        if (priceEl) priceEl.textContent = `$${price.toFixed(2)}`;
        if (ownedEl) ownedEl.textContent = owned;
        if (valueEl) valueEl.textContent = (price * owned).toFixed(2);
        if (buyBtn) buyBtn.disabled = cap < (price * qty);
        if (sellBtn) sellBtn.disabled = owned < qty;
    }

    // ── Contracts (update fulfill button states) ──
    gameState.activeContracts.forEach(c => {
        const btn = document.querySelector(`[data-fulfill-id="${c.id}"]`);
        if (btn) btn.disabled = data < c.dataCost;
    });
    if (dom.reputationValue) dom.reputationValue.textContent = gameState.reputation;
};

// ════════════════════════════════════════════
// 17. GAME LOOP
// ════════════════════════════════════════════

const TICK_RATE = 1000;
let marketTicks = 0;

const gameLoop = () => {
    gameState.dataTokens += gameState.dataPerSecond;
    gameState.capital += gameState.capitalPerSecond;

    // Check dialogue milestones (replaces old story milestone check)
    checkDialogueMilestones();

    marketTicks++;
    if (marketTicks >= 10) {
        updateMarkets();
        marketTicks = 0;
    }

    updateUI();
};

// ════════════════════════════════════════════
// 18. EVENT BINDINGS
// ════════════════════════════════════════════

dom.btnScrape.addEventListener('click', (e) => {
    gatherData();
    spawnClickParticles(e);
});

dom.sellAmountInput.addEventListener('input', handleSellInput);
dom.btnSellCustom.addEventListener('click', sellDataCustom);
dom.btnSellAll.addEventListener('click', sellAllData);
dom.btnBoost.addEventListener('click', startBoost);
dom.btnReset.addEventListener('click', hardReset);
dom.btnHQUpgrade.addEventListener('click', upgradeHQ);
dom.btnAgiFeed.addEventListener('click', feedAGI);

// Dialogue
dom.btnDialogueNext.addEventListener('click', () => DialogueManager.next());
dom.dialogueBackdrop.addEventListener('click', () => DialogueManager.next());

// Tabs
dom.navTabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.getAttribute('data-tab')));
});

// ════════════════════════════════════════════
// 19. INITIALIZATION
// ════════════════════════════════════════════

// Load saved progress
loadGame();

// Render dynamic UI
renderShop();
renderOffice();
renderMarkets();

// Recalculate derived values
recalculateAll();

// Apply HQ visuals
updateHQVisuals();

// Apply AGI orb visuals from save
if (gameState.agiLevel >= 10) dom.agiOrb.classList.add('level-10');
else if (gameState.agiLevel >= 5) dom.agiOrb.classList.add('level-5');

// Replay AGI lore for saved levels
for (let i = 0; i < gameState.agiLevel && i < AGI_LORE.length; i++) {
    appendAgiLog(AGI_LORE[i]);
}

// Render saved contracts
renderContracts();

// Initial UI render
updateUI();

// Start the game loop
setInterval(gameLoop, TICK_RATE);

// Auto-save
setInterval(saveGame, SAVE_INTERVAL);
window.addEventListener('beforeunload', saveGame);

// ── RPG Dialogue: First dialogue on new game ──
if (isNewGame) {
    setTimeout(() => {
        DialogueManager.enqueue('Mr. X', 'mentor', "Hey kid. I saw your code. You've got potential, but you're broke. Start scraping data, and maybe I'll invest in you.");
        DialogueManager.showNext();
    }, 800);
} else {
    // On existing saves, check any new milestones
    setTimeout(() => checkDialogueMilestones(), 500);
}

// Start contract spawning
spawnContractLoop();

console.log('🎮 AI Startup Simulator v0.8 — Tycoon Game Edition initialized!');
