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
