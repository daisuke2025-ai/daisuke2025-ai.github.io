let manulCount = 0;
let clickPower = 1;
let autoCount = 0;

const canPrice = 10;
const autoPrice = 30;

const manulButton = document.getElementById("manulButton");
const buyButton = document.getElementById("buyButton");
const autoBuyButton = document.getElementById("autoBuyButton");
const resetButton = document.getElementById("resetButton");

const countDisplay = document.getElementById("count");
const powerDisplay = document.getElementById("power");
const autoCountDisplay = document.getElementById("autoCount");
const autoPowerDisplay = document.getElementById("autoPower");
const messageDisplay = document.getElementById("message");

// ゲームデータを保存する
function saveGame() {
  const saveData = {
    manulCount: manulCount,
    clickPower: clickPower,
    autoCount: autoCount,
  };

  localStorage.setItem("manulSave", JSON.stringify(saveData));
}

// 保存したゲームデータを読み込む
function loadGame() {
  const savedData = localStorage.getItem("manulSave");

  if (savedData !== null) {
    try {
      const data = JSON.parse(savedData);

      if (
        Number.isSafeInteger(data.manulCount) &&
        data.manulCount >= 0 &&
        Number.isSafeInteger(data.clickPower) &&
        data.clickPower >= 1 &&
        Number.isSafeInteger(data.autoCount) &&
        data.autoCount >= 0
      ) {
        manulCount = data.manulCount;
        clickPower = data.clickPower;
        autoCount = data.autoCount;
      }
    } catch (error) {
      console.error("セーブデータの読み込みに失敗しました", error);
    }
  }
}

// 画面を更新する
function updateDisplay() {
  countDisplay.textContent = manulCount;
  powerDisplay.textContent = clickPower;
  autoCountDisplay.textContent = autoCount;
  autoPowerDisplay.textContent = autoCount;

  buyButton.disabled = manulCount < canPrice;
  autoBuyButton.disabled = manulCount < autoPrice;
}

// マヌルネコをクリックする
manulButton.addEventListener("click", function () {
  manulCount += clickPower;

  updateDisplay();
  saveGame();
});

// 高級マヌル缶を購入する
buyButton.addEventListener("click", function () {
  if (manulCount >= canPrice) {
    manulCount -= canPrice;
    clickPower += 1;

    messageDisplay.textContent = "高級マヌル缶を購入！ 増殖力アップ！";

    updateDisplay();
    saveGame();
  }
});

// 自動増殖装置を購入する
autoBuyButton.addEventListener("click", function () {
  if (manulCount >= autoPrice) {
    manulCount -= autoPrice;
    autoCount += 1;

    messageDisplay.textContent = "自動増殖装置を購入！ 自動増殖開始！";

    updateDisplay();
    saveGame();
  }
});

// 1秒ごとに自動増殖する
setInterval(function () {
  if (autoCount > 0) {
    manulCount += autoCount;

    updateDisplay();
    saveGame();
  }
}, 1000);

// ゲームをリセットする
resetButton.addEventListener("click", function () {
  manulCount = 0;
  clickPower = 1;
  autoCount = 0;

  messageDisplay.textContent = "最初からスタート！";

  updateDisplay();
  saveGame();
});

// ゲーム開始時にセーブデータを読み込む
loadGame();
updateDisplay();

const manulFaces = [
  "images/manul-happy.png",
  "images/manul-angry.png",
  "images/manul-sad.png",
  "images/manul-excited.png",
];

// レア出現時の鳴き声
const rareSound = new Audio("manul-voice.mp3");
rareSound.volume = 0.7;

// マヌルネコをタップしたとき
manulButton.addEventListener("pointerdown", (event) => {
  // 0〜99の乱数を取得
  const random = Math.random() * 100;

  let randomIndex;

  if (random < 40) {
    randomIndex = 0; // 喜：40%
  } else if (random < 70) {
    randomIndex = 1; // 怒：30%
  } else if (random < 90) {
    randomIndex = 2; // 哀：20%
  } else {
    randomIndex = 3; // 楽：10%（レア）
  }

  // マヌルネコの画像を表示
  const manul = document.createElement("img");

  manul.src = manulFaces[randomIndex];
  manul.className = "tap-cat";

  manul.style.left = event.clientX + "px";
  manul.style.top = event.clientY + "px";

  document.body.appendChild(manul);

  // レアが出たときだけ鳴き声を再生
  if (randomIndex === 3) {
    rareSound.currentTime = 0;
    rareSound.play().catch((error) => {
      console.log("音声を再生できませんでした", error);
    });
  }

  // 0.5秒後に画像を消す
  setTimeout(() => {
    manul.remove();
  }, 500);
});

const bgm = new Audio("bgm.mp3");
bgm.loop = true;

const settingsButton = document.getElementById("settingsButton");

const soundSettings = document.getElementById("soundSettings");

const bgmButton = document.getElementById("bgmButton");

const bgmVolume = document.getElementById("bgmVolume");

const volumeValue = document.getElementById("volumeValue");

// 保存済みの設定を読み込む
let soundData = {};

try {
  soundData = JSON.parse(localStorage.getItem("manulSoundSettings")) || {};
} catch (error) {
  console.error("音声設定を読み込めませんでした", error);
}

let bgmEnabled = false;

let volume = Number(soundData.volume);

if (!Number.isFinite(volume) || soundData.volume === undefined) {
  volume = 30;
}

volume = Math.max(0, Math.min(100, volume));

bgm.volume = volume / 100;
bgmVolume.value = volume;
volumeValue.textContent = volume + "%";

// 設定を保存
function saveSoundSettings() {
  localStorage.setItem(
    "manulSoundSettings",
    JSON.stringify({
      enabled: bgmEnabled,
      volume: Number(bgmVolume.value),
    }),
  );
}

// BGMボタンの表示を更新
function updateBgmButton() {
  bgmButton.textContent = bgmEnabled ? "🔊 ON" : "🔇 OFF";
}

// 設定画面の開閉
settingsButton.addEventListener("click", () => {
  soundSettings.hidden = !soundSettings.hidden;
});

// BGMのON/OFF
bgmButton.addEventListener("click", async () => {
  if (bgmEnabled) {
    bgm.pause();
    bgmEnabled = false;
  } else {
    try {
      await bgm.play();
      bgmEnabled = true;
    } catch (error) {
      console.error("BGM再生エラー", error);
      bgmEnabled = false;
    }
  }

  updateBgmButton();
  saveSoundSettings();
});

// 音量調整
bgmVolume.addEventListener("input", () => {
  const volume = Number(bgmVolume.value);

  bgm.volume = volume / 100;
  volumeValue.textContent = volume + "%";

  saveSoundSettings();
});

updateBgmButton();
