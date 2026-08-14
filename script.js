// Google Apps ScriptのWebアプリURLを、後でここに貼り付けます。
// 例:
// const GAS_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
const GAS_URL = "https://script.google.com/macros/s/AKfycbwuhXTHELQ0Rc5zpmdAzPvoPD06idv2qRGYPsBwaV-BgvUCEsFmwpiwRnm20BHrsOx14Q/exec";

const dateInput = document.getElementById("date");
const sleepDurationInput = document.getElementById("sleepDuration");
const rhythmGameConditionInput = document.getElementById("rhythmGameCondition");
const physicalConditionInput = document.getElementById("physicalCondition");
const beverageInput = document.getElementById("beverage");
const notesInput = document.getElementById("notes");
const saveButton = document.getElementById("saveButton");
const message = document.getElementById("message");

// 今日の日付を初期値にする
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
dateInput.value = `${yyyy}-${mm}-${dd}`;

saveButton.addEventListener("click", async () => {
  message.textContent = "";

  const date = dateInput.value;
  const sleepDurationMinutes = Number(sleepDurationInput.value);
  const rhythmGameCondition = Number(rhythmGameConditionInput.value);
  const physicalCondition = Number(physicalConditionInput.value);
  const beverage = beverageInput.value;
  const notes = notesInput.value.trim();

  // 入力チェック
  if (!date) {
    message.textContent = "日付を入力してください。";
    return;
  }

  if (!sleepDurationMinutes || sleepDurationMinutes <= 0) {
    message.textContent = "睡眠時間を入力してください。";
    return;
  }

  if (!rhythmGameCondition) {
    message.textContent = "音ゲーの調子を選択してください。";
    return;
  }

  if (!physicalCondition) {
    message.textContent = "体調を選択してください。";
    return;
  }

  const data = {
    date,
    sleepDurationMinutes,
    rhythmGameCondition,
    physicalCondition,
    beverage,
    notes
  };

  // GAS URLがまだ設定されていない場合
  if (!GAS_URL) {
    console.log("送信予定データ:", data);
    message.textContent = "入力データを取得しました。GAS設定前のため保存はしていません。";
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = "保存中...";

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.status === "success") {
      message.textContent = "保存しました。";
      clearInputAfterSave();
    } else {
      message.textContent = "保存に失敗しました。";
      console.error(result);
    }
  } catch (error) {
    console.error(error);
    message.textContent = "通信エラーが発生しました。";
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "保存する";
  }
});

function clearInputAfterSave() {
  sleepDurationInput.value = "";
  rhythmGameConditionInput.value = "";
  physicalConditionInput.value = "";
  beverageInput.value = "";
  notesInput.value = "";
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js");
    });
}