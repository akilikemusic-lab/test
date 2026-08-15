// ========================================
// 睡眠健康アプリ v0.4
// ========================================


// ========================================
// Google Apps Script
// ========================================

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbyB2xFMddxc0w_-xFR26Fpky3igexOODTBdcIMTNHi7o3fs9jB9IK_Dqo-K1CIjihkY1Q/exec";


// ========================================
// ページ読み込み後に実行
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  // ========================================
  // 入力フォーム
  // ========================================

  const dateInput =
    document.getElementById("date");

  const sleepDurationInput =
    document.getElementById("sleepDuration");

  const rhythmGameConditionInput =
    document.getElementById("rhythmGameCondition");

  const physicalConditionInput =
    document.getElementById("physicalCondition");

  const beverageInput =
    document.getElementById("beverage");

  const notesInput =
    document.getElementById("notes");

  const saveButton =
    document.getElementById("saveButton");

  const message =
    document.getElementById("message");


  // ========================================
  // ダッシュボード
  // ========================================

  const latestDate =
    document.getElementById("latestDate");

  const latestSleepDuration =
    document.getElementById("latestSleepDuration");

  const latestRhythmGame =
    document.getElementById("latestRhythmGame");

  const latestPhysicalCondition =
    document.getElementById("latestPhysicalCondition");

  const recordCount =
    document.getElementById("recordCount");

  const averageSleepDuration =
    document.getElementById("averageSleepDuration");

  const averageRhythmGame =
    document.getElementById("averageRhythmGame");

  const averagePhysicalCondition =
    document.getElementById("averagePhysicalCondition");

  const historyTableBody =
    document.getElementById("historyTableBody");


  // ========================================
  // HTML要素の存在確認
  // ========================================

  const requiredElements = [
    dateInput,
    sleepDurationInput,
    rhythmGameConditionInput,
    physicalConditionInput,
    beverageInput,
    notesInput,
    saveButton,
    message,
    latestDate,
    latestSleepDuration,
    latestRhythmGame,
    latestPhysicalCondition,
    recordCount,
    averageSleepDuration,
    averageRhythmGame,
    averagePhysicalCondition,
    historyTableBody
  ];


  if (
    requiredElements.some(
      element => element === null
    )
  ) {

    console.error(
      "必要なHTML要素が見つかりません。"
    );

    return;

  }


  // ========================================
  // 今日の日付
  // ========================================

  const today =
    new Date();

  const yyyy =
    today.getFullYear();

  const mm =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const dd =
    String(
      today.getDate()
    ).padStart(2, "0");


  dateInput.value =
    `${yyyy}-${mm}-${dd}`;


  // ========================================
  // ページ読み込み時
  // ========================================

  loadDashboard();


  // ========================================
  // 保存ボタン
  // ========================================

  saveButton.addEventListener(
    "click",
    async () => {

      message.textContent =
        "";


      const date =
        dateInput.value;


      const sleepDurationMinutes =
        Number(
          sleepDurationInput.value
        );


      const rhythmGameCondition =
        Number(
          rhythmGameConditionInput.value
        );


      const physicalCondition =
        Number(
          physicalConditionInput.value
        );


      const beverage =
        beverageInput.value;


      const notes =
        notesInput.value.trim();


      // ========================================
      // 入力チェック
      // ========================================

      if (!date) {

        message.textContent =
          "日付を入力してください。";

        return;

      }


      if (
        !sleepDurationMinutes ||
        sleepDurationMinutes <= 0
      ) {

        message.textContent =
          "睡眠時間を入力してください。";

        return;

      }


      if (!rhythmGameCondition) {

        message.textContent =
          "音ゲーの調子を選択してください。";

        return;

      }


      if (!physicalCondition) {

        message.textContent =
          "体調を選択してください。";

        return;

      }


      const data = {

        date:
          date,

        sleepDurationMinutes:
          sleepDurationMinutes,

        rhythmGameCondition:
          rhythmGameCondition,

        physicalCondition:
          physicalCondition,

        beverage:
          beverage,

        notes:
          notes

      };


      // ========================================
      // 保存開始
      // ========================================

      saveButton.disabled =
        true;

      saveButton.textContent =
        "保存中...";


      try {

        console.log(
          "GASへ保存データを送信:",
          data
        );


        const response =
          await fetch(
            GAS_URL,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "text/plain;charset=utf-8"
              },

              body:
                JSON.stringify(data)

            }
          );


        const result =
          await response.json();


        console.log(
          "GAS保存結果:",
          result
        );


        if (
          result.status ===
          "success"
        ) {

          message.textContent =
            "保存しました。";


          clearInputAfterSave();


          // ダッシュボード更新
          await loadDashboard();


        } else {

          message.textContent =
            "保存に失敗しました。";

          console.error(
            result
          );

        }


      } catch (error) {

        console.error(
          "保存エラー:",
          error
        );

        message.textContent =
          "通信エラーが発生しました。";


      } finally {

        saveButton.disabled =
          false;

        saveButton.textContent =
          "保存する";

      }

    }
  );
  
// ========================================
// ダッシュボードデータ取得
// JSONP方式
// ========================================

function loadDashboard() {

  return new Promise(
    (resolve, reject) => {

      console.log(
        "GASからダッシュボードデータを取得します。"
      );


      // ------------------------------------
      // 読み込み中
      // ------------------------------------

      latestDate.textContent =
        "読み込み中...";

      latestSleepDuration.textContent =
        "読み込み中...";


      // ------------------------------------
      // JSONP callback名
      // ------------------------------------

      const callbackName =
        "dashboardCallback_" +
        Date.now();


      // ------------------------------------
      // scriptタグ
      // ------------------------------------

      const script =
        document.createElement(
          "script"
        );


      // ------------------------------------
      // タイムアウト
      // ------------------------------------

      let finished =
        false;


      const timeout =
        setTimeout(
          () => {

            if (finished) {
              return;
            }


            finished =
              true;


            script.remove();


            delete window[callbackName];


            console.error(
              "GASからの応答がタイムアウトしました。"
            );


            showDashboardError();


            reject(
              new Error(
                "GASからの応答がありません。"
              )
            );

          },
          15000
        );


      // ------------------------------------
      // 成功時callback
      // ------------------------------------

      window[callbackName] =
        function(result) {

          if (finished) {
            return;
          }


          finished =
            true;


          clearTimeout(
            timeout
          );


          script.remove();


          delete window[callbackName];


          console.log(
            "GASから取得したJSON:",
            result
          );


          // --------------------------------
          // GAS側エラー
          // --------------------------------

          if (
            !result ||
            result.status !==
            "success"
          ) {

            const error =
              new Error(
                result &&
                result.message
                  ? result.message
                  : "データ取得に失敗しました。"
              );


            console.error(
              "GASエラー:",
              error
            );


            showDashboardError();


            reject(
              error
            );


            return;

          }


          // --------------------------------
          // データ取得
          // --------------------------------

          const data =
            Array.isArray(
              result.data
            )
              ? result.data
              : [];


          console.log(
            "取得したデータ:",
            data
          );


          console.log(
            "データ件数:",
            data.length
          );


          // --------------------------------
          // ダッシュボード更新
          // --------------------------------

          updateDashboard(
            data
          );


          resolve(
            data
          );

        };


      // ------------------------------------
      // 通信エラー
      // ------------------------------------

      script.onerror =
        function() {

          if (finished) {
            return;
          }


          finished =
            true;


          clearTimeout(
            timeout
          );


          script.remove();


          delete window[callbackName];


          console.error(
            "GASへのJSONP通信に失敗しました。"
          );


          showDashboardError();


          reject(
            new Error(
              "GASへの通信に失敗しました。"
            )
          );

        };


      // ------------------------------------
      // GAS URL
      // ------------------------------------

      script.src =
        GAS_URL +
        "?callback=" +
        encodeURIComponent(
          callbackName
        );


      console.log(
        "JSONP URL:",
        script.src
      );


      // ------------------------------------
      // 読み込み開始
      // ------------------------------------

      document
        .head
        .appendChild(
          script
        );

    }
  );

}

  // ========================================
  // ダッシュボード更新
  // ========================================

  function updateDashboard(data) {

    console.log(
      "ダッシュボード更新:",
      data
    );


    // 日付順に並べる
    const sortedData =
      data
        .slice()
        .sort(
          (a, b) =>
            String(a.date)
              .localeCompare(
                String(b.date)
              )
        );


    // ========================================
    // データなし
    // ========================================

    if (
      sortedData.length === 0
    ) {

      latestDate.textContent =
        "まだ記録がありません。";

      latestSleepDuration.textContent =
        "---";

      latestRhythmGame.textContent =
        "---";

      latestPhysicalCondition.textContent =
        "---";

      recordCount.textContent =
        "0日";

      averageSleepDuration.textContent =
        "---";

      averageRhythmGame.textContent =
        "---";

      averagePhysicalCondition.textContent =
        "---";


      historyTableBody.innerHTML = `
        <tr>
          <td colspan="4">
            まだ記録がありません。
          </td>
        </tr>
      `;

      return;

    }


    // ========================================
    // 最新データ
    // ========================================

    const latest =
      sortedData[
        sortedData.length - 1
      ];


    latestDate.textContent =
      formatDate(
        latest.date
      );


    latestSleepDuration.textContent =
      formatSleepDuration(
        Number(
          latest.sleepDurationMinutes
        )
      );


    latestRhythmGame.textContent =
      formatCondition(
        latest.rhythmGameCondition
      );


    latestPhysicalCondition.textContent =
      formatCondition(
        latest.physicalCondition
      );


    // ========================================
    // 平均値
    // ========================================

    const sleepValues =
      sortedData
        .map(
          item =>
            Number(
              item.sleepDurationMinutes
            )
        )
        .filter(
          value =>
            Number.isFinite(value) &&
            value > 0
        );


    const rhythmValues =
      sortedData
        .map(
          item =>
            Number(
              item.rhythmGameCondition
            )
        )
        .filter(
          value =>
            Number.isFinite(value) &&
            value > 0
        );


    const physicalValues =
      sortedData
        .map(
          item =>
            Number(
              item.physicalCondition
            )
        )
        .filter(
          value =>
            Number.isFinite(value) &&
            value > 0
        );


    // ========================================
    // 記録日数
    // ========================================

    recordCount.textContent =
      `${sortedData.length}日`;


    // ========================================
    // 平均睡眠時間
    // ========================================

    if (
      sleepValues.length > 0
    ) {

      const average =
        sleepValues.reduce(
          (sum, value) =>
            sum + value,
          0
        ) /
        sleepValues.length;


      averageSleepDuration.textContent =
        formatSleepDuration(
          Math.round(average)
        );

    } else {

      averageSleepDuration.textContent =
        "---";

    }


    // ========================================
    // 平均音ゲー調子
    // ========================================

    if (
      rhythmValues.length > 0
    ) {

      const average =
        rhythmValues.reduce(
          (sum, value) =>
            sum + value,
          0
        ) /
        rhythmValues.length;


      averageRhythmGame.textContent =
        average.toFixed(1);

    } else {

      averageRhythmGame.textContent =
        "---";

    }


    // ========================================
    // 平均体調
    // ========================================

    if (
      physicalValues.length > 0
    ) {

      const average =
        physicalValues.reduce(
          (sum, value) =>
            sum + value,
          0
        ) /
        physicalValues.length;


      averagePhysicalCondition.textContent =
        average.toFixed(1);

    } else {

      averagePhysicalCondition.textContent =
        "---";

    }


    // ========================================
    // 履歴
    // ========================================

    const history =
      sortedData
        .slice()
        .reverse()
        .slice(
          0,
          10
        );


    historyTableBody.innerHTML =
      "";


    history.forEach(
      item => {

        const row =
          document.createElement(
            "tr"
          );


        const dateCell =
          document.createElement(
            "td"
          );

        dateCell.textContent =
          formatDate(
            item.date
          );


        const sleepCell =
          document.createElement(
            "td"
          );

        sleepCell.textContent =
          formatSleepDuration(
            Number(
              item.sleepDurationMinutes
            )
          );


        const rhythmCell =
          document.createElement(
            "td"
          );

        rhythmCell.textContent =
          formatCondition(
            item.rhythmGameCondition
          );


        const physicalCell =
          document.createElement(
            "td"
          );

        physicalCell.textContent =
          formatCondition(
            item.physicalCondition
          );


        row.appendChild(
          dateCell
        );

        row.appendChild(
          sleepCell
        );

        row.appendChild(
          rhythmCell
        );

        row.appendChild(
          physicalCell
        );


        historyTableBody.appendChild(
          row
        );

      }
    );

  }


  // ========================================
  // 保存後の入力欄クリア
  // ========================================

  function clearInputAfterSave() {

    sleepDurationInput.value =
      "";

    rhythmGameConditionInput.value =
      "";

    physicalConditionInput.value =
      "";

    beverageInput.value =
      "";

    notesInput.value =
      "";

  }


  // ========================================
  // 睡眠時間表示
  // ========================================

  function formatSleepDuration(
    minutes
  ) {

    if (
      !Number.isFinite(minutes) ||
      minutes < 0
    ) {

      return "---";

    }


    const hours =
      Math.floor(
        minutes / 60
      );


    const remainingMinutes =
      minutes % 60;


    if (
      remainingMinutes === 0
    ) {

      return `${hours}時間`;

    }


    return (
      `${hours}時間` +
      `${remainingMinutes}分`
    );

  }


  // ========================================
  // 調子表示
  // ========================================

  function formatCondition(
    value
  ) {

    const number =
      Number(value);


    if (
      !Number.isFinite(number) ||
      number <= 0
    ) {

      return "---";

    }


    return `${number} / 5`;

  }


  // ========================================
  // 日付表示
  // ========================================

  function formatDate(
    value
  ) {

    if (!value) {

      return "---";

    }


    const text =
      String(value);


    if (
      /^\d{4}-\d{2}-\d{2}$/.test(
        text
      )
    ) {

      const parts =
        text.split("-");


      return (
        `${parts[0]}/` +
        `${parts[1]}/` +
        `${parts[2]}`
      );

    }


    return text;

  }


  // ========================================
  // Service Worker
  // ========================================

  if (
    "serviceWorker" in navigator
  ) {

    navigator.serviceWorker
      .register("./sw.js")
      .then(
        registration => {

          console.log(
            "Service Worker登録成功:",
            registration.scope
          );

        }
      )
      .catch(
        error => {

          console.error(
            "Service Worker登録失敗:",
            error
          );

        }
      );

  }

});

// ========================================
// ダッシュボード取得エラー表示
// ========================================

function showDashboardError() {

  latestDate.textContent =
    "---";

  latestSleepDuration.textContent =
    "---";

  latestRhythmGame.textContent =
    "---";

  latestPhysicalCondition.textContent =
    "---";

  recordCount.textContent =
    "---";

  averageSleepDuration.textContent =
    "---";

  averageRhythmGame.textContent =
    "---";

  averagePhysicalCondition.textContent =
    "---";


  historyTableBody.innerHTML = `
    <tr>
      <td colspan="4">
        データを取得できませんでした。
      </td>
    </tr>
  `;

}