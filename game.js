"use strict";

const GAME_CONFIG = {
  canvas: { width: 1280, height: 720 },
  storageKey: "candida-run-save-v1",
  schemaVersion: 2,
  world: {
    groundY: 610,
    groundHeight: 120,
    patternAhead: 1180,
    biomeDuration: 34
  },
  player: {
    x: 190,
    width: 64,
    height: 124,
    gravity: 2500,
    jumpVelocity: -930,
    maxFallSpeed: 1660
  },
  run: {
    initialLives: 3,
    maxLivesCap: 5,
    initialSpeed: 365,
    maxSpeed: 830,
    speedIncreasePerSecond: 8.5,
    scorePerSecond: 8,
    hurtInvulnerabilitySeconds: 1.05
  },
  spawn: {
    badChanceStart: 0.27,
    badChanceMax: 0.7,
    badChanceIncreasePerSecond: 0.0044,
    consumableChance: 0.1,
    outfitChance: 0.1
  },
  rarities: [
    { id: "common", label: "comum", aura: "#49d17f", scoreMultiplier: 1, chance: 0.66 },
    { id: "rare", label: "raro", aura: "#3aa6ff", scoreMultiplier: 1.55, chance: 0.25 },
    { id: "special", label: "especial", aura: "#f2b84b", scoreMultiplier: 2.25, chance: 0.09 }
  ]
};

const BIOMES = [
  {
    id: "street",
    label: "Rua",
    skyTop: "#82dff2",
    skyBottom: "#f8f4cc",
    ground: "#447568",
    groundTop: "#69c18d",
    platform: "#5ebd91",
    shadow: "#24524b",
    accent: "#ffd36b",
    prop: "lamp"
  },
  {
    id: "houses",
    label: "Bairro",
    skyTop: "#8ed0ff",
    skyBottom: "#ffe2c2",
    ground: "#5b6e69",
    groundTop: "#7dcc91",
    platform: "#efb76b",
    shadow: "#6b4d38",
    accent: "#ff8f70",
    prop: "houses"
  },
  {
    id: "park",
    label: "Parque",
    skyTop: "#7be0c6",
    skyBottom: "#e9ffd8",
    ground: "#2f7b51",
    groundTop: "#65cb79",
    platform: "#78bd55",
    shadow: "#1e5c3b",
    accent: "#ffe071",
    prop: "trees"
  },
  {
    id: "desert",
    label: "Deserto",
    skyTop: "#ffcf82",
    skyBottom: "#fff0b5",
    ground: "#b67b42",
    groundTop: "#e5b15f",
    platform: "#d99a4c",
    shadow: "#815832",
    accent: "#f7e389",
    prop: "cactus"
  },
  {
    id: "night",
    label: "Noite urbana",
    skyTop: "#1e315f",
    skyBottom: "#5f7aa6",
    ground: "#26384a",
    groundTop: "#4f8b7d",
    platform: "#4e7ea0",
    shadow: "#172535",
    accent: "#ffe78a",
    prop: "city"
  }
];

const GOOD_ITEMS = [
  { id: "hygiene", label: "Higiene adequada", shortLabel: "Higiene", icon: "drop", score: 60 },
  { id: "doctor", label: "Consulta médica", shortLabel: "Consulta", icon: "cross", score: 75 },
  { id: "medicine-right", label: "Uso correto de medicamentos", shortLabel: "Medicação", icon: "rx", score: 70 },
  { id: "trusted-info", label: "Informação confiável", shortLabel: "Informação", icon: "book", score: 70 },
  { id: "breathable", label: "Roupa respirável", shortLabel: "Respirável", icon: "shirt", score: 68 },
  { id: "dry", label: "Manter seco", shortLabel: "Seco", icon: "sun", score: 66 },
  { id: "cotton", label: "Algodão e conforto", shortLabel: "Algodão", icon: "cotton", score: 78 },
  { id: "symptom-log", label: "Acompanhar sintomas", shortLabel: "Sintomas", icon: "calendar", score: 72 }
];

const BAD_ITEMS = [
  { id: "self-medication", label: "Automedicação", shortLabel: "Automed.", icon: "pill" },
  { id: "wrong-antibiotic", label: "Antibiótico sem orientação", shortLabel: "Antibiótico", icon: "bottle" },
  { id: "internet-myths", label: "Mitos da internet", shortLabel: "Mitos", icon: "phone" },
  { id: "ignore-symptoms", label: "Ignorar sintomas", shortLabel: "Ignorar", icon: "clock" },
  { id: "tight-clothes", label: "Roupa apertada", shortLabel: "Apertada", icon: "tightPants" },
  { id: "wet-clothes", label: "Roupa molhada por muito tempo", shortLabel: "Molhada", icon: "wetClothes" },
  { id: "perfumed-products", label: "Perfumes e duchas íntimas", shortLabel: "Perfume", icon: "spray" },
  { id: "glucose", label: "Glicemia sem acompanhamento", shortLabel: "Glicemia", icon: "sugar" }
];

const CONSUMABLES = [
  { id: "water", label: "Água", shortLabel: "Água", icon: "water", aura: "#5ac8ff", chance: 0.22 },
  { id: "comfort-pants", label: "Calça confortável", shortLabel: "Calça", icon: "pants", aura: "#49d17f", chance: 0.12 },
  { id: "breathing", label: "Pausa para respirar", shortLabel: "Respirar", icon: "breath", aura: "#b78cff", chance: 0.18 },
  { id: "quick-consult", label: "Consulta rápida", shortLabel: "Consulta", icon: "cross", aura: "#3aa6ff", chance: 0.14 },
  { id: "info-boost", label: "Informação confiável", shortLabel: "Info x2", icon: "book", aura: "#f2b84b", chance: 0.14 }
];

const HAIR_STYLES = [
  { id: "curly", label: "Cacheado" },
  { id: "bob", label: "Curto" },
  { id: "pony", label: "Rabo" },
  { id: "braids", label: "Tranças" },
  { id: "waves", label: "Ondulado" }
];

const HAIR_COLORS = [
  { id: "brown", label: "Castanho", color: "#4b2d22" },
  { id: "black", label: "Preto", color: "#171717" },
  { id: "copper", label: "Cobre", color: "#a6532f" },
  { id: "blonde", label: "Loiro", color: "#d9ad55" },
  { id: "plum", label: "Ameixa", color: "#65315f" }
];

const SKIN_COLORS = [
  { id: "deep", label: "Profunda", color: "#5b3327" },
  { id: "brown", label: "Marrom", color: "#8d5a42" },
  { id: "tan", label: "Dourada", color: "#b97955" },
  { id: "light", label: "Clara", color: "#d99a75" }
];

const RUN_STYLES = [
  { id: "light", label: "Leve", lean: 0.1, stride: 0.86, bounce: 0.78 },
  { id: "athletic", label: "Atlética", lean: 0.2, stride: 1.12, bounce: 1 },
  { id: "bouncy", label: "Saltitante", lean: 0.12, stride: 0.94, bounce: 1.28 },
  { id: "focused", label: "Focada", lean: 0.24, stride: 1.02, bounce: 0.7 }
];

const OUTFIT_RARITIES = [
  { id: "common", label: "Comum", aura: "#49d17f", chance: 0.62, buffCount: 1 },
  { id: "rare", label: "Raro", aura: "#3aa6ff", chance: 0.28, buffCount: 2 },
  { id: "special", label: "Especial", aura: "#f2b84b", chance: 0.1, buffCount: 3 }
];

const BUFF_DEFS = [
  {
    id: "scoreBoost",
    label: "Mais pontos",
    values: { common: 0.06, rare: 0.11, special: 0.18 },
    text: (value) => `+${Math.round(value * 100)}% score`
  },
  {
    id: "startLife",
    label: "Vida extra",
    values: { common: 1, rare: 1, special: 2 },
    text: (value) => `+${value} vida inicial`
  },
  {
    id: "waterChance",
    label: "Mais água",
    values: { common: 0.05, rare: 0.09, special: 0.14 },
    text: (value) => `+${Math.round(value * 100)}% chance de água`
  },
  {
    id: "dodgeChance",
    label: "Esquiva",
    values: { common: 0.05, rare: 0.09, special: 0.14 },
    text: (value) => `${Math.round(value * 100)}% chance de evitar dano`
  },
  {
    id: "invulnerability",
    label: "Recuperação",
    values: { common: 0.25, rare: 0.45, special: 0.75 },
    text: (value) => `+${value.toFixed(2)}s invulnerável`
  },
  {
    id: "rareBoost",
    label: "Achados raros",
    values: { common: 0.04, rare: 0.08, special: 0.13 },
    text: (value) => `+${Math.round(value * 100)}% itens raros`
  },
  {
    id: "clothingChance",
    label: "Roupa no caminho",
    values: { common: 0.04, rare: 0.08, special: 0.13 },
    text: (value) => `+${Math.round(value * 100)}% encontrar roupa`
  },
  {
    id: "consumableHeal",
    label: "Consumíveis melhores",
    values: { common: 1, rare: 1, special: 2 },
    text: (value) => `+${value} cura em consumíveis`
  },
  {
    id: "jumpBoost",
    label: "Pulo confortável",
    values: { common: 0.05, rare: 0.08, special: 0.12 },
    text: (value) => `+${Math.round(value * 100)}% pulo`
  },
  {
    id: "dangerReduction",
    label: "Menos perigos",
    values: { common: 0.04, rare: 0.08, special: 0.12 },
    text: (value) => `-${Math.round(value * 100)}% perigos`
  }
];

const OUTFIT_COLORS = {
  cap: ["#1b9a77", "#f2b84b", "#3aa6ff", "#ef6f6c", "#7b61ff", "#242f40"],
  shirt: ["#f07d6f", "#2faf83", "#3aa6ff", "#f2b84b", "#ffffff", "#a7d8ff"],
  pants: ["#285f77", "#205f55", "#264d78", "#7d6032", "#393e46", "#6b7a8f"],
  shoes: ["#ffffff", "#111827", "#ffead6", "#6c63ff", "#e85d75", "#2bb3a3"]
};

const NAME_PARTS = {
  prefix: ["Brisa", "Fluxo", "Aura", "Luz", "Passo", "Equilíbrio", "Algodão", "Sopro"],
  suffix: ["Livre", "Conforto", "Urbano", "Solar", "Ativo", "Sereno", "Fresco", "Seguro"]
};

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const previewCanvas = document.getElementById("previewCanvas");
const previewCtx = previewCanvas.getContext("2d");

const refs = {
  score: document.getElementById("scoreValue"),
  lives: document.getElementById("livesValue"),
  highScore: document.getElementById("highScoreValue"),
  speed: document.getElementById("speedValue"),
  menuScreen: document.getElementById("menuScreen"),
  inventoryScreen: document.getElementById("inventoryScreen"),
  gameOverScreen: document.getElementById("gameOverScreen"),
  pauseBanner: document.getElementById("pauseBanner"),
  pickupToast: document.getElementById("pickupToast"),
  touchControls: document.getElementById("touchControls"),
  finalScore: document.getElementById("finalScoreValue"),
  finalHighScore: document.getElementById("finalHighScoreValue"),
  hairStyleOptions: document.getElementById("hairStyleOptions"),
  hairColorOptions: document.getElementById("hairColorOptions"),
  skinColorOptions: document.getElementById("skinColorOptions"),
  runStyleOptions: document.getElementById("runStyleOptions"),
  outfitOptions: document.getElementById("outfitOptions"),
  equippedSummary: document.getElementById("equippedSummary"),
  newOutfitCount: document.getElementById("newOutfitCount"),
  startButton: document.getElementById("startButton"),
  inventoryButton: document.getElementById("inventoryButton"),
  backFromInventoryButton: document.getElementById("backFromInventoryButton"),
  restartButton: document.getElementById("restartButton"),
  menuButton: document.getElementById("menuButton"),
  gameOverInventoryButton: document.getElementById("gameOverInventoryButton"),
  jumpButton: document.getElementById("jumpButton"),
  pauseButton: document.getElementById("pauseButton")
};

const app = {
  mode: "menu",
  paused: false,
  lastFrameTime: 0,
  save: loadSave(),
  game: null,
  nextId: 1,
  toastTimer: 0
};

saveProgress();
bindUi();
renderInventory();
setMode("menu");
requestAnimationFrame(gameLoop);

function bindUi() {
  refs.startButton.addEventListener("click", startGame);
  refs.inventoryButton.addEventListener("click", openInventory);
  refs.backFromInventoryButton.addEventListener("click", openMenu);
  refs.restartButton.addEventListener("click", startGame);
  refs.menuButton.addEventListener("click", openMenu);
  refs.gameOverInventoryButton.addEventListener("click", openInventory);
  refs.jumpButton.addEventListener("pointerdown", handleJumpPress);
  refs.pauseButton.addEventListener("click", togglePause);

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") {
      event.preventDefault();
      if (app.mode === "playing" && !app.paused) {
        jump();
      } else if (app.mode === "menu" || app.mode === "gameover") {
        startGame();
      }
    }

    if (event.code === "Escape" && app.mode === "playing") {
      event.preventDefault();
      togglePause();
    }
  });
}

function handleJumpPress(event) {
  event.preventDefault();
  if (app.mode === "playing" && !app.paused) {
    jump();
  }
}

function openMenu() {
  app.paused = false;
  app.game = null;
  setMode("menu");
}

function openInventory() {
  app.paused = false;
  renderInventory();
  setMode("inventory");
}

function startGame() {
  app.game = createGameState();
  app.paused = false;
  setMode("playing");
}

function togglePause() {
  if (app.mode !== "playing") {
    return;
  }

  app.paused = !app.paused;
  refs.pauseBanner.hidden = !app.paused;
  refs.pauseButton.textContent = app.paused ? "Retomar" : "Pausar";
}

function setMode(mode) {
  app.mode = mode;
  document.body.dataset.mode = mode;
  refs.menuScreen.hidden = mode !== "menu";
  refs.inventoryScreen.hidden = mode !== "inventory";
  refs.gameOverScreen.hidden = mode !== "gameover";
  refs.touchControls.hidden = mode !== "playing";
  refs.pauseBanner.hidden = !app.paused || mode !== "playing";
  refs.pauseButton.textContent = app.paused ? "Retomar" : "Pausar";
  updateHud();
}

function createGameState() {
  const buffs = getEquippedBuffs();
  const maxLives = Math.min(GAME_CONFIG.run.maxLivesCap, GAME_CONFIG.run.initialLives + buffs.startLifeBonus);
  const state = {
    elapsed: 0,
    score: 0,
    lives: maxLives,
    maxLives,
    speed: GAME_CONFIG.run.initialSpeed,
    worldOffset: 0,
    nextPatternX: 1180,
    buffs,
    infoBoostUntil: 0,
    dustTimer: 0,
    player: {
      x: GAME_CONFIG.player.x,
      y: GAME_CONFIG.world.groundY - GAME_CONFIG.player.height,
      width: GAME_CONFIG.player.width,
      height: GAME_CONFIG.player.height,
      vy: 0,
      grounded: true,
      runTime: 0,
      hurtCooldown: 0,
      hitFlash: 0
    },
    grounds: [
      { id: nextId(), x: -180, y: GAME_CONFIG.world.groundY, width: 1560, height: GAME_CONFIG.world.groundHeight }
    ],
    platforms: [],
    collectibles: [],
    floatingTexts: [],
    particles: []
  };

  app.game = state;
  ensureWorldAhead();
  return state;
}

function gameLoop(timestamp) {
  const delta = Math.min((timestamp - app.lastFrameTime) / 1000 || 0, 0.033);
  app.lastFrameTime = timestamp;

  if (app.mode === "playing" && app.game && !app.paused) {
    updateGame(delta);
  }

  updateToast(delta);
  draw();
  drawInventoryPreview();
  requestAnimationFrame(gameLoop);
}

function updateGame(delta) {
  const game = app.game;
  const difficulty = getDifficulty();

  game.elapsed += delta;
  game.speed = Math.min(
    GAME_CONFIG.run.maxSpeed,
    GAME_CONFIG.run.initialSpeed + game.elapsed * GAME_CONFIG.run.speedIncreasePerSecond + difficulty * 44
  );

  const scoreMultiplier = getScoreMultiplier();
  game.score += GAME_CONFIG.run.scorePerSecond * scoreMultiplier * delta;
  game.worldOffset += game.speed * delta;

  moveWorld(delta);
  updatePlayer(delta);
  updateCollectibles(delta);
  updateFloatingTexts(delta);
  updateParticles(delta);
  ensureWorldAhead();
  updateHud();
}

function getDifficulty() {
  if (!app.game) {
    return 0;
  }

  return clamp(app.game.elapsed / 95 + app.game.score / 9000, 0, 1);
}

function getScoreMultiplier() {
  const game = app.game;
  const infoBoost = game && game.elapsed < game.infoBoostUntil ? 1.65 : 1;
  return (1 + (game?.buffs.scoreBoost || 0)) * infoBoost;
}

function moveWorld(delta) {
  const game = app.game;
  const distance = game.speed * delta;

  for (const list of [game.grounds, game.platforms, game.collectibles]) {
    for (const item of list) {
      item.x -= distance;
    }
  }

  game.nextPatternX -= distance;
  game.grounds = game.grounds.filter((ground) => ground.x + ground.width > -260);
  game.platforms = game.platforms.filter((platform) => platform.x + platform.width > -260);
  game.collectibles = game.collectibles.filter((item) => !item.collected && item.x + item.size > -220);
}

function updatePlayer(delta) {
  const game = app.game;
  const player = game.player;
  const previousBottom = player.y + player.height;

  player.runTime += delta * (game.speed / GAME_CONFIG.run.initialSpeed);
  player.hurtCooldown = Math.max(0, player.hurtCooldown - delta);
  player.hitFlash = Math.max(0, player.hitFlash - delta);
  player.vy = Math.min(GAME_CONFIG.player.maxFallSpeed, player.vy + GAME_CONFIG.player.gravity * delta);
  player.y += player.vy * delta;
  player.grounded = false;

  if (player.vy >= 0) {
    const surfaces = [...game.grounds, ...game.platforms];
    for (const surface of surfaces) {
      const playerBottom = player.y + player.height;
      const overlapsX = player.x + player.width > surface.x + 6 && player.x < surface.x + surface.width - 6;
      const crossedTop = previousBottom <= surface.y && playerBottom >= surface.y;

      if (overlapsX && crossedTop) {
        player.y = surface.y - player.height;
        player.vy = 0;
        player.grounded = true;
        break;
      }
    }
  }

  if (player.grounded) {
    game.dustTimer -= delta;
    if (game.dustTimer <= 0) {
      game.dustTimer = 0.055;
      addParticle(player.x + 4, player.y + player.height - 8, "#e8fff3", randomBetween(-120, -45), randomBetween(-80, -30), 0.32, 4);
    }
  }

  if (player.y > GAME_CONFIG.canvas.height + 160) {
    applyDamage("Queda");
    player.y = GAME_CONFIG.world.groundY - player.height;
    player.vy = GAME_CONFIG.player.jumpVelocity * 0.25;
  }
}

function updateCollectibles(delta) {
  const game = app.game;
  const playerRect = getPlayerRect();

  for (const item of game.collectibles) {
    item.age += delta;
    if (!item.collected && rectsOverlap(playerRect, getCollectibleRect(item))) {
      item.collected = true;
      handleCollectible(item);
    }
  }
}

function updateFloatingTexts(delta) {
  const game = app.game;

  for (const text of game.floatingTexts) {
    text.y -= 42 * delta;
    text.life -= delta;
  }

  game.floatingTexts = game.floatingTexts.filter((text) => text.life > 0);
}

function updateParticles(delta) {
  const game = app.game;

  for (const particle of game.particles) {
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.vy += 420 * delta;
    particle.life -= delta;
  }

  game.particles = game.particles.filter((particle) => particle.life > 0);
}

function updateToast(delta) {
  if (app.toastTimer <= 0) {
    return;
  }

  app.toastTimer -= delta;
  if (app.toastTimer <= 0) {
    refs.pickupToast.hidden = true;
  }
}

function ensureWorldAhead() {
  const game = app.game;
  if (!game) {
    return;
  }

  while (game.nextPatternX < GAME_CONFIG.canvas.width + GAME_CONFIG.world.patternAhead) {
    spawnParkourPattern();
  }
}

function spawnParkourPattern() {
  const game = app.game;
  const difficulty = getDifficulty();
  const x = game.nextPatternX;
  const sectionWidth = randomBetween(780, 980);
  const platformCount = Math.random() < 0.24 + difficulty * 0.18 ? 2 : 1;
  const laneOptions = [530, 485, 440];

  addGround(x, sectionWidth + 80);

  for (let index = 0; index < platformCount; index += 1) {
    const platformX = x + 270 + index * randomBetween(245, 320);
    const platformY = laneOptions[Math.floor(Math.random() * laneOptions.length)];
    const platformWidth = randomBetween(205, 310);
    addPlatform(platformX, platformY, platformWidth);
    addCollectibleAt(platformX + platformWidth * 0.55, platformY - 62);
  }

  addCollectibleAt(x + 140, GAME_CONFIG.world.groundY - 82);

  if (Math.random() < 0.16 + game.buffs.waterChance * 0.25) {
    addCollectibleAt(x + sectionWidth - 170, GAME_CONFIG.world.groundY - 92, "consumable");
  }

  if (Math.random() < 0.12 + game.buffs.clothingChance) {
    addCollectibleAt(x + sectionWidth * 0.72, GAME_CONFIG.world.groundY - 100, "outfit");
  }

  game.nextPatternX += sectionWidth;
}

function addGround(x, width) {
  app.game.grounds.push({
    id: nextId(),
    x,
    y: GAME_CONFIG.world.groundY,
    width,
    height: GAME_CONFIG.world.groundHeight
  });
}

function addPlatform(x, y, width) {
  const difficulty = getDifficulty();
  app.game.platforms.push({
    id: nextId(),
    x,
    y,
    width: Math.max(185, width - difficulty * 14),
    height: 32
  });
}

function addCollectibleAt(x, y, forcedKind) {
  const collectible = createCollectible(x, y, forcedKind);
  app.game.collectibles.push(collectible);
}

function createCollectible(x, y, forcedKind) {
  const game = app.game;
  const buffs = game.buffs;
  const difficulty = getDifficulty();
  const badChance = clamp(
    GAME_CONFIG.spawn.badChanceStart + game.elapsed * GAME_CONFIG.spawn.badChanceIncreasePerSecond - buffs.dangerReduction,
    0.12,
    GAME_CONFIG.spawn.badChanceMax
  );
  const outfitChance = clamp(GAME_CONFIG.spawn.outfitChance + buffs.clothingChance, 0.04, 0.28);
  const consumableChance = clamp(GAME_CONFIG.spawn.consumableChance + buffs.waterChance * 0.35, 0.08, 0.24);
  let kind = forcedKind;

  if (!kind) {
    const roll = Math.random();
    if (roll < outfitChance) {
      kind = "outfit";
    } else if (roll < outfitChance + consumableChance) {
      kind = "consumable";
    } else if (roll < outfitChance + consumableChance + badChance + difficulty * 0.08) {
      kind = "bad";
    } else {
      kind = "good";
    }
  }

  if (kind === "bad") {
    const item = BAD_ITEMS[Math.floor(Math.random() * BAD_ITEMS.length)];
    return baseCollectible({ x, y, type: "bad", item, aura: "#ff4e58", size: 64 });
  }

  if (kind === "consumable") {
    const item = pickConsumable();
    return baseCollectible({ x, y, type: "consumable", item, aura: item.aura, size: 60 });
  }

  if (kind === "outfit") {
    const outfit = generateOutfit();
    return baseCollectible({
      x,
      y,
      type: "outfit",
      item: {
        id: "outfit",
        label: outfit.name,
        shortLabel: "Roupa",
        icon: "outfit",
        outfit
      },
      rarity: getOutfitRarity(outfit.rarity),
      aura: getOutfitRarity(outfit.rarity).aura,
      size: 66
    });
  }

  const item = GOOD_ITEMS[Math.floor(Math.random() * GOOD_ITEMS.length)];
  const rarity = pickItemRarity();
  return baseCollectible({ x, y, type: "good", item, rarity, aura: rarity.aura, size: 58 });
}

function baseCollectible({ x, y, type, item, rarity, aura, size }) {
  return {
    id: nextId(),
    x,
    y,
    type,
    item,
    rarity,
    aura,
    size,
    age: Math.random() * 2,
    collected: false
  };
}

function pickItemRarity() {
  const buffs = app.game?.buffs || {};
  const rareBoost = buffs.rareBoost || 0;
  const rarities = GAME_CONFIG.rarities.map((rarity) => {
    if (rarity.id === "common") {
      return { ...rarity, chance: Math.max(0.2, rarity.chance - rareBoost) };
    }
    return { ...rarity, chance: rarity.chance + rareBoost / 2 };
  });

  return weightedPick(rarities);
}

function pickConsumable() {
  const buffs = app.game.buffs;
  const weighted = CONSUMABLES.map((item) => ({
    ...item,
    chance: item.id === "water" ? item.chance + buffs.waterChance : item.chance
  }));
  return weightedPick(weighted);
}

function handleCollectible(collectible) {
  const game = app.game;

  if (collectible.type === "bad") {
    applyDamage(collectible.item.shortLabel);
    burstParticles(collectible.x, collectible.y, "#ff4e58", 12);
    return;
  }

  if (collectible.type === "consumable") {
    applyConsumable(collectible.item, collectible.x, collectible.y);
    burstParticles(collectible.x, collectible.y, collectible.aura, 14);
    return;
  }

  if (collectible.type === "outfit") {
    const outfit = collectible.item.outfit;
    outfit.isNew = true;
    outfit.discoveredAt = new Date().toISOString();
    app.save.inventory.outfits.push(outfit);
    game.score += 130 * getOutfitRarity(outfit.rarity).buffCount;
    saveProgress();
    renderInventory();
    addFloatingText(collectible.x, collectible.y - 18, `Novo conjunto: ${outfit.name}`, collectible.aura);
    showToast(`Novo conjunto encontrado: ${outfit.name}. Ele está no inventário e não foi equipado automaticamente.`);
    burstParticles(collectible.x, collectible.y, collectible.aura, 18);
    return;
  }

  const gained = Math.round(collectible.item.score * collectible.rarity.scoreMultiplier * getScoreMultiplier());
  game.score += gained;
  addFloatingText(collectible.x, collectible.y - 18, `+${gained} ${collectible.item.shortLabel}`, collectible.aura);
  burstParticles(collectible.x, collectible.y, collectible.aura, 12);
}

function applyConsumable(item, x, y) {
  const game = app.game;
  const healBonus = game.buffs.consumableHealBonus;

  if (item.id === "water") {
    const before = game.lives;
    const healAmount = Math.min(2, 1 + healBonus);
    game.lives = Math.min(game.maxLives, game.lives + healAmount);
    addFloatingText(x, y - 18, game.lives > before ? "+ vida" : "+ cuidado", item.aura);
    return;
  }

  if (item.id === "comfort-pants") {
    if (game.maxLives < GAME_CONFIG.run.maxLivesCap) {
      game.maxLives += 1;
      game.lives = Math.min(GAME_CONFIG.run.maxLivesCap, game.lives + 1);
      addFloatingText(x, y - 18, "+ vida temporária", item.aura);
    } else {
      game.score += 45;
      addFloatingText(x, y - 18, "+ conforto", item.aura);
    }
    return;
  }

  if (item.id === "breathing") {
    game.player.hurtCooldown = Math.max(game.player.hurtCooldown, Math.min(2.2, 1.45 + game.buffs.invulnerabilityBonus));
    addFloatingText(x, y - 18, "Proteção breve", item.aura);
    return;
  }

  if (item.id === "quick-consult") {
    removeClosestDanger(x, y);
    addFloatingText(x, y - 18, "Perigo removido", item.aura);
    return;
  }

  game.infoBoostUntil = Math.max(game.infoBoostUntil, game.elapsed + 8);
  addFloatingText(x, y - 18, "Score acelerado", item.aura);
}

function removeClosestDanger(x, y) {
  const game = app.game;
  let closest = null;
  let closestDistance = Infinity;

  for (const item of game.collectibles) {
    if (item.type !== "bad" || item.x < game.player.x) {
      continue;
    }

    const distance = Math.abs(item.x - x) + Math.abs(item.y - y) * 0.4;
    if (distance < closestDistance) {
      closest = item;
      closestDistance = distance;
    }
  }

  if (closest) {
    closest.collected = true;
    burstParticles(closest.x, closest.y, "#ffffff", 16);
  }
}

function applyDamage(reason) {
  const game = app.game;
  const player = game.player;

  if (player.hurtCooldown > 0) {
    return;
  }

  if (Math.random() < game.buffs.dodgeChance) {
    player.hurtCooldown = 0.55;
    addFloatingText(player.x + 70, player.y + 36, "Esquivou", "#49d17f");
    return;
  }

  game.lives -= 1;
  player.hurtCooldown = Math.min(1.8, GAME_CONFIG.run.hurtInvulnerabilitySeconds + game.buffs.invulnerabilityBonus);
  player.hitFlash = 0.28;
  addFloatingText(player.x + 82, player.y + 38, `-1 vida (${reason})`, "#d64a4a");

  if (game.lives <= 0) {
    finishGame();
  }
}

function finishGame() {
  const finalScore = Math.floor(app.game.score);

  if (finalScore > app.save.highScore) {
    app.save.highScore = finalScore;
    saveProgress();
  }

  refs.finalScore.textContent = String(finalScore);
  refs.finalHighScore.textContent = String(app.save.highScore);
  setMode("gameover");
}

function jump() {
  const game = app.game;
  const player = game?.player;

  if (!player || !player.grounded) {
    return;
  }

  player.vy = GAME_CONFIG.player.jumpVelocity * (1 + game.buffs.jumpBoost);
  player.grounded = false;
}

function addFloatingText(x, y, value, color) {
  app.game.floatingTexts.push({ x, y, value, color, life: 1.15 });
}

function addParticle(x, y, color, vx, vy, life, size) {
  app.game.particles.push({ x, y, color, vx, vy, life, size });
}

function burstParticles(x, y, color, count) {
  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomBetween(80, 250);
    addParticle(x, y, color, Math.cos(angle) * speed, Math.sin(angle) * speed - 120, randomBetween(0.42, 0.85), randomBetween(3, 7));
  }
}

function showToast(message) {
  refs.pickupToast.textContent = message;
  refs.pickupToast.hidden = false;
  app.toastTimer = 4.2;
}

function updateHud() {
  const game = app.game;
  const speed = game ? game.speed / GAME_CONFIG.run.initialSpeed : 1;
  refs.score.textContent = String(game ? Math.floor(game.score) : 0);
  refs.lives.textContent = String(game ? Math.max(0, game.lives) : GAME_CONFIG.run.initialLives);
  refs.highScore.textContent = String(app.save.highScore);
  refs.speed.textContent = `${speed.toFixed(1)}x`;
}

function renderInventory() {
  renderSkinColors();
  renderHairStyles();
  renderHairColors();
  renderRunStyles();
  renderOutfits();
  renderEquippedSummary();
}

function renderSkinColors() {
  renderSwatches(refs.skinColorOptions, SKIN_COLORS, app.save.equipped.skinColor, (id) => {
    app.save.equipped.skinColor = id;
    saveProgress();
    renderInventory();
  });
}

function renderHairStyles() {
  renderPills(refs.hairStyleOptions, HAIR_STYLES, app.save.equipped.hairStyle, (id) => {
    app.save.equipped.hairStyle = id;
    saveProgress();
    renderInventory();
  });
}

function renderHairColors() {
  renderSwatches(refs.hairColorOptions, HAIR_COLORS, app.save.equipped.hairColor, (id) => {
    app.save.equipped.hairColor = id;
    saveProgress();
    renderInventory();
  });
}

function renderRunStyles() {
  renderPills(refs.runStyleOptions, RUN_STYLES, app.save.equipped.runStyle, (id) => {
    app.save.equipped.runStyle = id;
    saveProgress();
    renderInventory();
  });
}

function renderPills(container, options, selectedId, onSelect) {
  container.innerHTML = "";
  for (const option of options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-pill";
    button.textContent = option.label;
    button.classList.toggle("is-selected", selectedId === option.id);
    button.addEventListener("click", () => onSelect(option.id));
    container.append(button);
  }
}

function renderSwatches(container, options, selectedId, onSelect) {
  container.innerHTML = "";
  for (const option of options) {
    const button = document.createElement("button");
    const swatch = document.createElement("span");

    button.type = "button";
    button.className = "swatch-button";
    button.title = option.label;
    button.setAttribute("aria-label", option.label);
    button.classList.toggle("is-selected", selectedId === option.id);
    swatch.style.background = option.color;
    button.append(swatch);
    button.addEventListener("click", () => onSelect(option.id));
    container.append(button);
  }
}

function renderOutfits() {
  refs.outfitOptions.innerHTML = "";

  const outfits = [...app.save.inventory.outfits].sort((a, b) => Number(b.isNew) - Number(a.isNew));
  const newCount = outfits.filter((outfit) => outfit.isNew).length;
  refs.newOutfitCount.textContent = newCount ? `${newCount} novo${newCount > 1 ? "s" : ""} !` : "";

  for (const outfit of outfits) {
    const rarity = getOutfitRarity(outfit.rarity);
    const button = document.createElement("button");
    const swatches = document.createElement("span");
    const rarityLabel = document.createElement("span");
    const name = document.createElement("strong");
    const buffs = document.createElement("span");

    button.type = "button";
    button.className = "outfit-card";
    button.classList.toggle("is-selected", app.save.equipped.outfitId === outfit.id);
    swatches.className = "outfit-swatch";
    for (const color of [outfit.pieces.cap, outfit.pieces.shirt, outfit.pieces.pants, outfit.pieces.shoes]) {
      const colorNode = document.createElement("i");
      colorNode.style.background = color;
      swatches.append(colorNode);
    }

    rarityLabel.className = "rarity";
    rarityLabel.textContent = rarity.label;
    name.className = "outfit-name";
    name.textContent = outfit.name;
    buffs.className = "outfit-buffs";
    buffs.textContent = outfit.buffs.map(formatBuff).join(" · ");
    button.append(swatches, rarityLabel, name, buffs);

    if (outfit.isNew) {
      const badge = document.createElement("span");
      badge.className = "new-badge";
      badge.textContent = "!";
      button.append(badge);
    }

    button.addEventListener("click", () => {
      app.save.equipped.outfitId = outfit.id;
      outfit.isNew = false;
      saveProgress();
      renderInventory();
    });

    refs.outfitOptions.append(button);
  }
}

function renderEquippedSummary() {
  const outfit = getEquippedOutfit();
  const rarity = getOutfitRarity(outfit.rarity);
  refs.equippedSummary.innerHTML = "";

  const title = document.createElement("strong");
  const body = document.createElement("span");
  title.textContent = outfit.name;
  body.textContent = `${rarity.label}. ${outfit.buffs.map(formatBuff).join(" · ")}`;
  refs.equippedSummary.append(title, body);
}

function formatBuff(buff) {
  const def = BUFF_DEFS.find((item) => item.id === buff.id);
  return def ? def.text(buff.value) : buff.id;
}

function draw() {
  drawBackground(ctx);
  drawWorld(ctx);
  drawCollectibles(ctx);
  drawParticles(ctx);
  drawPlayer(ctx);
  drawFloatingTexts(ctx);

  if (app.mode === "menu" || app.mode === "inventory") {
    drawMenuSheen(ctx);
  }
}

function drawInventoryPreview() {
  if (!previewCtx || app.mode !== "inventory") {
    return;
  }

  const time = performance.now() / 1000;
  const width = previewCanvas.width;
  const height = previewCanvas.height;
  const gradient = previewCtx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#dffaf2");
  gradient.addColorStop(1, "#f8f1d6");
  previewCtx.fillStyle = gradient;
  previewCtx.fillRect(0, 0, width, height);

  previewCtx.fillStyle = "rgba(27, 154, 119, 0.14)";
  previewCtx.beginPath();
  previewCtx.ellipse(width / 2, 348, 118, 24, 0, 0, Math.PI * 2);
  previewCtx.fill();
  drawRunnerCharacter(previewCtx, width / 2, 342, 1.5, time, true, 1.1, getAppearance());
}

function drawBackground(context) {
  const width = GAME_CONFIG.canvas.width;
  const height = GAME_CONFIG.canvas.height;
  const offset = app.game ? app.game.worldOffset : performance.now() * 0.02;
  const gradient = context.createLinearGradient(0, 0, 0, height);

  gradient.addColorStop(0, "#93e6d0");
  gradient.addColorStop(0.58, "#dff7df");
  gradient.addColorStop(1, "#f5f0ce");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  drawCloud(context, 150 - (offset * 0.05) % 1450, 95, 1.08);
  drawCloud(context, 540 - (offset * 0.035) % 1450, 138, 0.86);
  drawCloud(context, 980 - (offset * 0.045) % 1450, 82, 1);
  drawSoftHills(context, offset);
}

function drawCloud(context, x, y, scale) {
  const wrappedX = x < -180 ? x + 1450 : x;

  context.save();
  context.translate(wrappedX, y);
  context.scale(scale, scale);
  context.fillStyle = "rgba(255, 255, 255, 0.82)";
  context.beginPath();
  context.arc(0, 20, 30, 0, Math.PI * 2);
  context.arc(34, 10, 42, 0, Math.PI * 2);
  context.arc(78, 22, 28, 0, Math.PI * 2);
  context.fillRect(-4, 20, 98, 30);
  context.fill();
  context.restore();
}

function drawSoftHills(context, offset) {
  const baseY = GAME_CONFIG.world.groundY;
  const scroll = (offset * 0.12) % 520;

  context.fillStyle = "rgba(31, 137, 93, 0.28)";
  for (let x = -520 - scroll; x < GAME_CONFIG.canvas.width + 520; x += 520) {
    context.beginPath();
    context.moveTo(x, baseY);
    context.quadraticCurveTo(x + 150, baseY - 125, x + 310, baseY);
    context.quadraticCurveTo(x + 420, baseY - 74, x + 540, baseY);
    context.closePath();
    context.fill();
  }
}

function drawSunOrMoon(context, biome) {
  context.save();
  if (biome.id === "night") {
    context.fillStyle = "rgba(255, 247, 203, 0.9)";
    context.beginPath();
    context.arc(1070, 98, 44, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "rgba(255, 255, 255, 0.75)";
    for (let index = 0; index < 16; index += 1) {
      const x = 90 + index * 72;
      const y = 48 + (index % 5) * 32;
      context.fillRect(x, y, 3, 3);
    }
  } else {
    context.fillStyle = "rgba(255, 226, 116, 0.9)";
    context.beginPath();
    context.arc(1070, 102, 54, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function drawParallaxHills(context, biome, offset) {
  const baseY = GAME_CONFIG.world.groundY;
  const scroll = (offset * 0.11) % 540;

  context.fillStyle = colorWithAlpha(biome.groundTop, 0.24);
  for (let x = -540 - scroll; x < GAME_CONFIG.canvas.width + 540; x += 540) {
    context.beginPath();
    context.moveTo(x, baseY);
    context.quadraticCurveTo(x + 150, baseY - 124, x + 310, baseY);
    context.quadraticCurveTo(x + 430, baseY - 72, x + 560, baseY);
    context.closePath();
    context.fill();
  }
}

function drawBiomeProps(context, biome, offset) {
  const scroll = (offset * 0.22) % 360;
  for (let x = -360 - scroll; x < GAME_CONFIG.canvas.width + 360; x += 360) {
    if (biome.prop === "houses") {
      drawHouse(context, x + 40, 478, biome);
      drawHouse(context, x + 178, 500, biome);
    } else if (biome.prop === "trees") {
      drawTree(context, x + 80, 500, biome);
      drawTree(context, x + 220, 485, biome);
    } else if (biome.prop === "cactus") {
      drawCactus(context, x + 100, 510, biome);
      drawDune(context, x + 220, 550, biome);
    } else if (biome.prop === "city") {
      drawBuilding(context, x + 60, 455, biome);
      drawBuilding(context, x + 190, 498, biome);
    } else {
      drawLamp(context, x + 120, 510, biome);
      drawBench(context, x + 230, 548, biome);
    }
  }
}

function drawHouse(context, x, y, biome) {
  context.fillStyle = colorWithAlpha("#ffffff", 0.4);
  roundRect(context, x, y, 94, 70, 6);
  context.fill();
  context.fillStyle = biome.accent;
  context.beginPath();
  context.moveTo(x - 8, y + 4);
  context.lineTo(x + 47, y - 42);
  context.lineTo(x + 104, y + 4);
  context.closePath();
  context.fill();
}

function drawTree(context, x, y, biome) {
  context.fillStyle = "#7a5731";
  roundRect(context, x + 21, y, 18, 72, 6);
  context.fill();
  context.fillStyle = biome.groundTop;
  context.beginPath();
  context.arc(x + 28, y - 8, 42, 0, Math.PI * 2);
  context.arc(x + 6, y + 12, 30, 0, Math.PI * 2);
  context.arc(x + 54, y + 16, 30, 0, Math.PI * 2);
  context.fill();
}

function drawCactus(context, x, y, biome) {
  context.strokeStyle = biome.groundTop;
  context.lineWidth = 16;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(x, y + 58);
  context.lineTo(x, y);
  context.moveTo(x, y + 28);
  context.lineTo(x - 24, y + 28);
  context.lineTo(x - 24, y + 8);
  context.moveTo(x, y + 40);
  context.lineTo(x + 26, y + 40);
  context.lineTo(x + 26, y + 18);
  context.stroke();
}

function drawDune(context, x, y, biome) {
  context.fillStyle = colorWithAlpha(biome.accent, 0.34);
  context.beginPath();
  context.ellipse(x, y, 140, 38, 0, 0, Math.PI * 2);
  context.fill();
}

function drawBuilding(context, x, y, biome) {
  context.fillStyle = colorWithAlpha("#111827", 0.3);
  roundRect(context, x, y, 76, 118, 6);
  context.fill();
  context.fillStyle = biome.accent;
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 2; col += 1) {
      context.fillRect(x + 16 + col * 28, y + 18 + row * 23, 10, 10);
    }
  }
}

function drawLamp(context, x, y, biome) {
  context.strokeStyle = colorWithAlpha(biome.shadow, 0.55);
  context.lineWidth = 8;
  context.beginPath();
  context.moveTo(x, y + 74);
  context.lineTo(x, y);
  context.lineTo(x + 42, y);
  context.stroke();
  context.fillStyle = biome.accent;
  context.beginPath();
  context.arc(x + 45, y + 6, 13, 0, Math.PI * 2);
  context.fill();
}

function drawBench(context, x, y, biome) {
  context.fillStyle = colorWithAlpha(biome.shadow, 0.46);
  roundRect(context, x, y, 86, 12, 4);
  context.fill();
  roundRect(context, x + 8, y + 18, 70, 10, 4);
  context.fill();
}

function drawWorld(context) {
  const grounds = app.game?.grounds || [{ x: -100, y: GAME_CONFIG.world.groundY, width: 1500, height: GAME_CONFIG.world.groundHeight }];
  const platforms = app.game?.platforms || [
    { x: 660, y: 520, width: 140, height: 32 },
    { x: 865, y: 470, width: 140, height: 32 },
    { x: 1080, y: 420, width: 155, height: 32 }
  ];

  for (const ground of grounds) {
    drawGroundSegment(context, ground);
  }

  for (const platform of platforms) {
    drawPlatform(context, platform);
  }
}

function drawGroundSegment(context, ground) {
  context.fillStyle = "#6fcf97";
  context.fillRect(ground.x, ground.y, ground.width, ground.height + 40);
  context.fillStyle = "#2e8c66";
  context.fillRect(ground.x, ground.y, ground.width, 26);

  const offset = app.game ? app.game.worldOffset : performance.now() * 0.06;
  for (let x = ground.x + 24 - (offset % 96); x < ground.x + ground.width; x += 96) {
    context.fillStyle = "rgba(255, 255, 255, 0.18)";
    roundRect(context, x, ground.y + 9, 52, 6, 3);
    context.fill();
  }
}

function drawPlatform(context, platform) {
  context.fillStyle = "rgba(9, 72, 62, 0.2)";
  roundRect(context, platform.x + 5, platform.y + 8, platform.width, platform.height, 8);
  context.fill();
  context.fillStyle = "#5ebd91";
  roundRect(context, platform.x, platform.y, platform.width, platform.height, 8);
  context.fill();
  context.fillStyle = "rgba(255, 255, 255, 0.25)";
  roundRect(context, platform.x + 14, platform.y + 8, platform.width - 28, 5, 3);
  context.fill();
}

function drawCollectibles(context) {
  for (const collectible of app.game?.collectibles || []) {
    drawCollectible(context, collectible);
  }
}

function drawCollectible(context, collectible) {
  const pulse = Math.sin(collectible.age * 6) * 0.07 + 1;
  const radius = collectible.size / 2;

  context.save();
  context.translate(collectible.x, collectible.y);
  context.scale(pulse, pulse);
  context.strokeStyle = collectible.aura;
  context.lineWidth = collectible.type === "bad" ? 8 : 7;
  context.globalAlpha = 0.5;
  context.beginPath();
  context.arc(0, 0, radius + 10, 0, Math.PI * 2);
  context.stroke();
  context.globalAlpha = 1;

  if (collectible.type === "bad") {
    context.fillStyle = "#d64a4a";
    drawDiamond(context, 0, 0, radius);
  } else {
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = collectible.aura;
    context.beginPath();
    context.arc(0, 0, radius - 9, 0, Math.PI * 2);
    context.fill();
  }

  drawItemIcon(context, collectible.item.icon, collectible.type, radius);
  context.restore();
  drawItemLabel(context, collectible);
}

function drawDiamond(context, x, y, radius) {
  context.beginPath();
  context.moveTo(x, y - radius);
  context.lineTo(x + radius, y);
  context.lineTo(x, y + radius);
  context.lineTo(x - radius, y);
  context.closePath();
  context.fill();
}

function drawItemIcon(context, icon, type, radius) {
  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = type === "bad" ? "#fff" : "#102423";
  context.fillStyle = type === "bad" ? "#fff" : "#102423";
  context.lineWidth = 5;

  if (icon === "drop" || icon === "water") {
    context.beginPath();
    context.moveTo(0, -18);
    context.quadraticCurveTo(20, 5, 0, 22);
    context.quadraticCurveTo(-20, 5, 0, -18);
    context.fill();
  } else if (icon === "cross") {
    roundRect(context, -7, -24, 14, 48, 4);
    context.fill();
    roundRect(context, -24, -7, 48, 14, 4);
    context.fill();
  } else if (icon === "book") {
    roundRect(context, -22, -20, 44, 40, 5);
    context.stroke();
    context.beginPath();
    context.moveTo(0, -18);
    context.lineTo(0, 20);
    context.stroke();
  } else if (icon === "rx" || icon === "bottle") {
    roundRect(context, -15, -22, 30, 42, 6);
    context.stroke();
    context.beginPath();
    context.moveTo(-10, -27);
    context.lineTo(10, -27);
    context.stroke();
    context.font = "900 15px system-ui";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(icon === "rx" ? "Rx" : "!", 0, 2);
  } else if (icon === "phone") {
    roundRect(context, -15, -24, 30, 48, 6);
    context.stroke();
    context.font = "900 22px system-ui";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("?", 0, 2);
  } else if (icon === "clock" || icon === "calendar") {
    context.beginPath();
    context.arc(0, 0, 22, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, -13);
    context.moveTo(0, 0);
    context.lineTo(12, 7);
    context.stroke();
  } else if (icon === "shirt") {
    drawMiniShirt(context, -25, -20, 50, 42);
  } else if (icon === "pants" || icon === "tightPants") {
    drawMiniPants(context, -18, -22, 36, 46);
  } else if (icon === "wetClothes") {
    drawMiniShirt(context, -24, -20, 48, 40);
    context.beginPath();
    context.moveTo(-18, 24);
    context.quadraticCurveTo(-8, 38, 2, 24);
    context.quadraticCurveTo(12, 38, 22, 24);
    context.stroke();
  } else if (icon === "spray") {
    roundRect(context, -12, -10, 24, 32, 5);
    context.stroke();
    context.beginPath();
    context.moveTo(-6, -18);
    context.lineTo(15, -18);
    context.moveTo(18, -21);
    context.lineTo(30, -26);
    context.moveTo(20, -15);
    context.lineTo(33, -15);
    context.stroke();
  } else if (icon === "sugar") {
    context.font = "900 30px system-ui";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("G", 0, 1);
  } else if (icon === "sun" || icon === "breath") {
    context.beginPath();
    context.arc(0, 0, 15, 0, Math.PI * 2);
    context.fill();
    for (let i = 0; i < 8; i += 1) {
      const a = i * Math.PI / 4;
      context.beginPath();
      context.moveTo(Math.cos(a) * 22, Math.sin(a) * 22);
      context.lineTo(Math.cos(a) * 30, Math.sin(a) * 30);
      context.stroke();
    }
  } else if (icon === "cotton") {
    context.beginPath();
    context.arc(-12, 0, 13, 0, Math.PI * 2);
    context.arc(4, -8, 16, 0, Math.PI * 2);
    context.arc(16, 5, 12, 0, Math.PI * 2);
    context.fill();
  } else {
    drawMiniOutfit(context, radius);
  }

  context.restore();
}

function drawMiniShirt(context, x, y, width, height) {
  context.beginPath();
  context.moveTo(x + 12, y);
  context.lineTo(x + width - 12, y);
  context.lineTo(x + width, y + 12);
  context.lineTo(x + width - 8, y + 24);
  context.lineTo(x + width - 14, y + 18);
  context.lineTo(x + width - 14, y + height);
  context.lineTo(x + 14, y + height);
  context.lineTo(x + 14, y + 18);
  context.lineTo(x + 8, y + 24);
  context.lineTo(x, y + 12);
  context.closePath();
  context.stroke();
}

function drawMiniPants(context, x, y, width, height) {
  context.beginPath();
  context.moveTo(x + 6, y);
  context.lineTo(x + width - 6, y);
  context.lineTo(x + width - 2, y + height);
  context.lineTo(x + width / 2 + 5, y + height);
  context.lineTo(x + width / 2, y + 16);
  context.lineTo(x + width / 2 - 5, y + height);
  context.lineTo(x + 2, y + height);
  context.closePath();
  context.stroke();
}

function drawMiniOutfit(context) {
  drawMiniShirt(context, -26, -22, 34, 34);
  drawMiniPants(context, 5, -18, 28, 42);
  context.beginPath();
  context.arc(-16, -26, 12, Math.PI, Math.PI * 2);
  context.stroke();
}

function drawItemLabel(context, collectible) {
  const text = collectible.item.shortLabel;
  context.save();
  context.font = "800 14px system-ui";
  const width = Math.max(78, context.measureText(text).width + 18);
  const x = collectible.x - width / 2;
  const y = collectible.y + collectible.size / 2 + 12;
  context.fillStyle = collectible.type === "bad" ? "rgba(255, 240, 240, 0.93)" : "rgba(255, 255, 255, 0.9)";
  roundRect(context, x, y, width, 25, 8);
  context.fill();
  context.fillStyle = collectible.type === "bad" ? "#a52727" : "#102423";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, collectible.x, y + 12.5);
  context.restore();
}

function drawParticles(context) {
  for (const particle of app.game?.particles || []) {
    context.save();
    context.globalAlpha = clamp(particle.life * 1.8, 0, 1);
    context.fillStyle = particle.color;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

function drawPlayer(context) {
  const game = app.game;
  const player = game?.player || {
    x: GAME_CONFIG.player.x,
    y: GAME_CONFIG.world.groundY - GAME_CONFIG.player.height,
    height: GAME_CONFIG.player.height,
    grounded: true,
    runTime: performance.now() / 820,
    hitFlash: 0
  };
  const blink = player.hitFlash > 0 && Math.floor(player.hitFlash * 30) % 2 === 0;

  if (blink) {
    return;
  }

  const speedScale = game ? game.speed / GAME_CONFIG.run.initialSpeed : 1;
  drawRunnerCharacter(
    context,
    player.x + player.width / 2,
    player.y + player.height,
    0.6,
    player.runTime,
    player.grounded,
    speedScale,
    getAppearance()
  );
}

function drawRunnerCharacter(context, footX, footY, scale, runTime, grounded, speedScale, appearance) {
  const outfit = appearance.outfit;
  const skin = appearance.skin.color;
  const hair = appearance.hairColor.color;
  const style = appearance.runStyle;
  const phase = runTime * (8.8 + speedScale * 2.4);
  const wave = Math.sin(phase);
  const bounce = grounded ? Math.abs(Math.sin(phase)) * 5 * style.bounce : -8;
  const stride = style.stride * clamp(speedScale, 0.9, 1.55);
  const lean = style.lean * 10;

  context.save();
  context.translate(footX, footY - bounce);
  context.scale(scale, scale);
  context.lineCap = "round";
  context.lineJoin = "round";

  drawClassicLeg(context, -14, -76, wave, stride, outfit.pieces.pants, outfit.pieces.shoes);
  drawClassicLeg(context, 14, -76, -wave, stride, outfit.pieces.pants, outfit.pieces.shoes);
  drawClassicArm(context, -24 + lean * 0.25, -134, -wave, stride, skin, outfit.pieces.shirt);
  drawClassicArm(context, 24 + lean * 0.25, -134, wave, stride, skin, outfit.pieces.shirt);
  drawClassicBody(context, lean, outfit.pieces.shirt, outfit.pieces.pants);
  drawClassicHair(context, 0 + lean * 0.7, -178, appearance.hairStyle.id, hair, wave, speedScale);
  drawClassicHead(context, 0 + lean * 0.7, -178, skin);
  drawClassicCap(context, 0 + lean * 0.7, -178, outfit.pieces.cap);

  context.restore();
}

function drawClassicLeg(context, hipX, hipY, wave, stride, pantsColor, shoeColor) {
  const kneeX = hipX + wave * 18 * stride;
  const kneeY = hipY + 34 + Math.abs(wave) * 7;
  const footX = hipX - 8 + wave * 34 * stride;
  const footY = -6 - Math.max(0, wave) * 9;

  context.strokeStyle = pantsColor;
  context.lineWidth = 12;
  context.beginPath();
  context.moveTo(hipX, hipY);
  context.lineTo(kneeX, kneeY);
  context.lineTo(footX, footY);
  context.stroke();

  context.fillStyle = shoeColor;
  context.save();
  context.translate(footX + 4, footY + 1);
  context.rotate(wave * 0.1);
  roundRect(context, -16, -5, 34, 12, 6);
  context.fill();
  context.restore();
}

function drawClassicArm(context, shoulderX, shoulderY, wave, stride, skin, shirtColor) {
  const elbowX = shoulderX - wave * 16 * stride;
  const elbowY = shoulderY + 28 + Math.abs(wave) * 4;
  const handX = shoulderX - wave * 26 * stride;
  const handY = shoulderY + 54;

  context.strokeStyle = shirtColor;
  context.lineWidth = 10;
  context.beginPath();
  context.moveTo(shoulderX, shoulderY);
  context.lineTo(elbowX, elbowY);
  context.stroke();

  context.strokeStyle = skin;
  context.lineWidth = 8;
  context.beginPath();
  context.moveTo(elbowX, elbowY);
  context.lineTo(handX, handY);
  context.stroke();

  context.fillStyle = skin;
  context.beginPath();
  context.arc(handX, handY, 5, 0, Math.PI * 2);
  context.fill();
}

function drawClassicBody(context, lean, shirtColor, pantsColor) {
  context.save();
  context.translate(lean * 0.25, 0);

  context.fillStyle = shirtColor;
  roundRect(context, -27, -146, 54, 54, 15);
  context.fill();

  context.fillStyle = "rgba(255, 255, 255, 0.55)";
  roundRect(context, -11, -140, 22, 9, 5);
  context.fill();

  context.fillStyle = pantsColor;
  roundRect(context, -25, -95, 50, 21, 8);
  context.fill();
  context.restore();
}

function drawClassicHead(context, x, y, skin) {
  context.fillStyle = skin;
  roundRect(context, x - 8, y + 17, 16, 22, 7);
  context.fill();
  context.beginPath();
  context.ellipse(x, y, 22, 24, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#241815";
  context.beginPath();
  context.arc(x - 7, y - 2, 2.5, 0, Math.PI * 2);
  context.arc(x + 7, y - 2, 2.5, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "#4a2620";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(x, y + 6, 8, 0.12 * Math.PI, 0.88 * Math.PI);
  context.stroke();
}

function drawClassicHair(context, x, y, style, color, wave, speedScale) {
  const sway = wave * (4 + speedScale * 3);
  context.fillStyle = color;

  if (style === "curly") {
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      context.beginPath();
      context.arc(x + Math.cos(angle) * 18 + sway * 0.18, y - 5 + Math.sin(angle) * 14, 10, 0, Math.PI * 2);
      context.fill();
    }
  } else if (style === "bob") {
    context.beginPath();
    context.ellipse(x, y + 4, 27, 30, 0, 0, Math.PI * 2);
    context.fill();
  } else if (style === "pony") {
    context.beginPath();
    context.ellipse(x, y - 2, 24, 24, 0, 0, Math.PI * 2);
    context.ellipse(x + 31 + sway, y + 8 + Math.abs(wave) * 3, 13, 28, 0.55, 0, Math.PI * 2);
    context.fill();
  } else if (style === "braids") {
    context.beginPath();
    context.ellipse(x, y - 3, 24, 24, 0, 0, Math.PI * 2);
    context.fill();
    for (let i = 0; i < 4; i += 1) {
      context.beginPath();
      context.arc(x + 28 + sway * 0.2, y + 5 + i * 10, 7, 0, Math.PI * 2);
      context.fill();
    }
  } else {
    context.beginPath();
    context.ellipse(x, y - 2, 28, 23, 0, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.ellipse(x + 28 + sway * 0.3, y + 12, 14, 22, 0.55, 0, Math.PI * 2);
    context.fill();
  }
}

function drawClassicCap(context, x, y, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y - 18, 21, Math.PI, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.ellipse(x + 18, y - 16, 18, 7, 0.12, 0, Math.PI * 2);
  context.fill();
}

function drawFloatingTexts(context) {
  const texts = app.game?.floatingTexts || [];
  context.save();
  context.font = "900 20px system-ui";
  context.textAlign = "center";
  context.textBaseline = "middle";

  for (const text of texts) {
    context.globalAlpha = clamp(text.life, 0, 1);
    context.fillStyle = "rgba(255, 255, 255, 0.9)";
    roundRect(context, text.x - 130, text.y - 18, 260, 36, 8);
    context.fill();
    context.fillStyle = text.color;
    context.fillText(text.value, text.x, text.y);
  }

  context.restore();
}

function drawMenuSheen(context) {
  context.save();
  context.fillStyle = "rgba(255, 255, 255, 0.12)";
  context.beginPath();
  context.ellipse(1000, 150, 260, 72, -0.25, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function getAppearance() {
  return {
    outfit: getEquippedOutfit(),
    skin: SKIN_COLORS.find((item) => item.id === app.save.equipped.skinColor) || SKIN_COLORS[1],
    hairStyle: HAIR_STYLES.find((item) => item.id === app.save.equipped.hairStyle) || HAIR_STYLES[0],
    hairColor: HAIR_COLORS.find((item) => item.id === app.save.equipped.hairColor) || HAIR_COLORS[0],
    runStyle: RUN_STYLES.find((item) => item.id === app.save.equipped.runStyle) || RUN_STYLES[0]
  };
}

function getCurrentBiome() {
  const elapsed = app.game ? app.game.elapsed : performance.now() / 1000;
  const index = Math.floor(elapsed / GAME_CONFIG.world.biomeDuration) % BIOMES.length;
  return BIOMES[index];
}

function getPlayerRect() {
  const player = app.game.player;
  return {
    x: player.x + 14,
    y: player.y + 20,
    width: player.width - 28,
    height: player.height - 28
  };
}

function getCollectibleRect(item) {
  const radius = getCollectibleHitRadius(item);
  return {
    x: item.x - radius,
    y: item.y - radius,
    width: radius * 2,
    height: radius * 2
  };
}

function getCollectibleHitRadius(item) {
  if (item.type === "bad") {
    return item.size * 0.34;
  }

  if (item.type === "outfit") {
    return item.size * 0.32;
  }

  return item.size * 0.31;
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

function getEquippedOutfit() {
  const outfit = app.save.inventory.outfits.find((item) => item.id === app.save.equipped.outfitId);
  return outfit || app.save.inventory.outfits[0] || createStarterOutfit();
}

function getEquippedBuffs() {
  const totals = {
    scoreBoost: 0,
    startLifeBonus: 0,
    waterChance: 0,
    dodgeChance: 0,
    invulnerabilityBonus: 0,
    rareBoost: 0,
    clothingChance: 0,
    consumableHealBonus: 0,
    jumpBoost: 0,
    dangerReduction: 0
  };

  for (const buff of getEquippedOutfit().buffs) {
    if (buff.id === "startLife") totals.startLifeBonus += buff.value;
    if (buff.id === "invulnerability") totals.invulnerabilityBonus += buff.value;
    if (buff.id === "consumableHeal") totals.consumableHealBonus += buff.value;
    if (buff.id in totals) totals[buff.id] += buff.value;
  }

  totals.dodgeChance = clamp(totals.dodgeChance, 0, 0.35);
  totals.dangerReduction = clamp(totals.dangerReduction, 0, 0.28);
  return totals;
}

function generateOutfit() {
  const rarity = weightedPick(OUTFIT_RARITIES);
  const buffDefs = shuffled(BUFF_DEFS).slice(0, rarity.buffCount);
  const name = `${pick(NAME_PARTS.prefix)} ${pick(NAME_PARTS.suffix)}`;
  const created = Date.now().toString(36);
  const randomId = Math.random().toString(36).slice(2, 8);

  return {
    id: `outfit-${created}-${randomId}`,
    name,
    rarity: rarity.id,
    discoveredAt: null,
    isNew: false,
    pieces: {
      cap: pick(OUTFIT_COLORS.cap),
      shirt: pick(OUTFIT_COLORS.shirt),
      pants: pick(OUTFIT_COLORS.pants),
      shoes: pick(OUTFIT_COLORS.shoes)
    },
    buffs: buffDefs.map((def) => ({ id: def.id, value: def.values[rarity.id] }))
  };
}

function createStarterOutfit() {
  return {
    id: "starter-comfort",
    name: "Conjunto Leve Inicial",
    rarity: "common",
    discoveredAt: null,
    isNew: false,
    pieces: {
      cap: "#1b9a77",
      shirt: "#f07d6f",
      pants: "#285f77",
      shoes: "#ffffff"
    },
    buffs: [{ id: "scoreBoost", value: 0.06 }]
  };
}

function getOutfitRarity(id) {
  return OUTFIT_RARITIES.find((rarity) => rarity.id === id) || OUTFIT_RARITIES[0];
}

function loadSave() {
  const fallback = createDefaultSave();

  try {
    const raw = localStorage.getItem(GAME_CONFIG.storageKey);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion === GAME_CONFIG.schemaVersion) {
      return sanitizeSave(parsed);
    }

    return migrateSave(parsed);
  } catch (error) {
    console.warn("Não foi possível carregar o progresso salvo.", error);
    return fallback;
  }
}

function createDefaultSave() {
  const starter = createStarterOutfit();
  return {
    schemaVersion: GAME_CONFIG.schemaVersion,
    highScore: 0,
    inventory: { outfits: [starter] },
    equipped: {
      outfitId: starter.id,
      hairStyle: "curly",
      hairColor: "brown",
      skinColor: "brown",
      runStyle: "light"
    }
  };
}

function migrateSave(parsed) {
  const save = createDefaultSave();
  save.highScore = Number(parsed?.highScore) || 0;

  const legacyOutfits = Array.isArray(parsed?.inventory?.outfits) ? parsed.inventory.outfits : [];
  for (let index = 0; index < legacyOutfits.length; index += 1) {
    const legacyId = legacyOutfits[index];
    if (legacyId === "basic" || legacyId === "starter-comfort") {
      continue;
    }

    const outfit = generateOutfit();
    outfit.id = `legacy-${legacyId}-${index}`;
    outfit.name = `Conjunto Migrado ${index}`;
    outfit.isNew = false;
    save.inventory.outfits.push(outfit);
  }

  if (HAIR_STYLES.some((item) => item.id === parsed?.equipped?.hairStyle)) {
    save.equipped.hairStyle = parsed.equipped.hairStyle;
  }

  if (HAIR_COLORS.some((item) => item.id === parsed?.equipped?.hairColor)) {
    save.equipped.hairColor = parsed.equipped.hairColor;
  }

  return sanitizeSave(save);
}

function sanitizeSave(save) {
  const clean = createDefaultSave();
  clean.highScore = Number(save.highScore) || 0;
  clean.inventory.outfits = Array.isArray(save.inventory?.outfits)
    ? save.inventory.outfits.filter(isValidOutfit)
    : [];

  if (!clean.inventory.outfits.some((outfit) => outfit.id === "starter-comfort")) {
    clean.inventory.outfits.unshift(createStarterOutfit());
  }

  if (!clean.inventory.outfits.length) {
    clean.inventory.outfits.push(createStarterOutfit());
  }

  clean.equipped = {
    outfitId: save.equipped?.outfitId || clean.inventory.outfits[0].id,
    hairStyle: optionOrDefault(HAIR_STYLES, save.equipped?.hairStyle, "curly"),
    hairColor: optionOrDefault(HAIR_COLORS, save.equipped?.hairColor, "brown"),
    skinColor: optionOrDefault(SKIN_COLORS, save.equipped?.skinColor, "brown"),
    runStyle: optionOrDefault(RUN_STYLES, save.equipped?.runStyle, "light")
  };

  if (!clean.inventory.outfits.some((outfit) => outfit.id === clean.equipped.outfitId)) {
    clean.equipped.outfitId = clean.inventory.outfits[0].id;
  }

  return clean;
}

function isValidOutfit(outfit) {
  return Boolean(
    outfit &&
    outfit.id &&
    outfit.name &&
    outfit.pieces &&
    outfit.pieces.cap &&
    outfit.pieces.shirt &&
    outfit.pieces.pants &&
    outfit.pieces.shoes &&
    Array.isArray(outfit.buffs)
  );
}

function optionOrDefault(options, id, fallback) {
  return options.some((item) => item.id === id) ? id : fallback;
}

function saveProgress() {
  try {
    localStorage.setItem(GAME_CONFIG.storageKey, JSON.stringify(app.save));
  } catch (error) {
    console.warn("Não foi possível salvar o progresso.", error);
  }
}

function roundRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + getPickWeight(item), 0);
  let cursor = Math.random() * total;

  for (const item of items) {
    cursor -= getPickWeight(item);
    if (cursor <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

function getPickWeight(item) {
  return item.chance ?? item.weight ?? 0;
}

function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function nextId() {
  app.nextId += 1;
  return app.nextId;
}

function colorWithAlpha(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
