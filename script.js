// ========================================
// 睡眠健康アプリ v0.6
// 統計期間対応版
// ========================================


// ========================================
// Google Apps Script
// ========================================

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbw8i1Bi9XHbExxk314TUurwygCIf79JEsuSd8DRXBpghtHMXJcj_oUg9t8UXwYnwm23Qg/exec";


// ========================================
// グローバル変数
// ========================================

let allSleepData = [];

let currentPeriod = "7";


// グラフ
let statisticsSleepChart = null;
let statisticsRhythmChart = null;
let statisticsPhysicalChart = null;
let statisticsComparisonChart = null;


// ========================================
// ページ読み込み
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  () => {


    // ======================================
    // 入力フォーム
    // ======================================

const dateInput =
  document.getElementById("date");


const sleepDurationInput =
  document.getElementById(
    "sleepDuration"
  );


const sleepScoreInput =
  document.getElementById(
    "sleepScore"
  );


const deepSleepPercentInput =
  document.getElementById(
    "deepSleepPercent"
  );


const lightSleepPercentInput =
  document.getElementById(
    "lightSleepPercent"
  );


const remSleepPercentInput =
  document.getElementById(
    "remSleepPercent"
  );


const sleepStartInput =
  document.getElementById(
    "sleepStart"
  );


const sleepEndInput =
  document.getElementById(
    "sleepEnd"
  );


const gameInput =
  document.getElementById(
    "game"
  );


const rhythmGameConditionInput =
  document.getElementById(
    "rhythmGameCondition"
  );


const physicalConditionInput =
  document.getElementById(
    "physicalCondition"
  );


const beverageInput =
  document.getElementById(
    "beverage"
  );


const caffeineTimeInput =
  document.getElementById(
    "caffeineTime"
  );


const notesInput =
  document.getElementById(
    "notes"
  );


    const saveButton =
      document.getElementById(
        "saveButton"
      );

    const message =
      document.getElementById(
        "message"
      );


    // ======================================
    // ダッシュボード
    // ======================================

    const latestDate =
      document.getElementById(
        "latestDate"
      );

    const latestSleepDuration =
      document.getElementById(
        "latestSleepDuration"
      );

    const latestRhythmGame =
      document.getElementById(
        "latestRhythmGame"
      );

    const latestPhysicalCondition =
      document.getElementById(
        "latestPhysicalCondition"
      );

    const recordCount =
      document.getElementById(
        "recordCount"
      );

    const averageSleepDuration =
      document.getElementById(
        "averageSleepDuration"
      );

    const averageRhythmGame =
      document.getElementById(
        "averageRhythmGame"
      );

    const averagePhysicalCondition =
      document.getElementById(
        "averagePhysicalCondition"
      );

    const historyTableBody =
      document.getElementById(
        "historyTableBody"
      );


    // ======================================
    // 統計
    // ======================================

    const statsRecordCount =
      document.getElementById(
        "statsRecordCount"
      );

    const statsAverageSleep =
      document.getElementById(
        "statsAverageSleep"
      );

    const statsMedianSleep =
      document.getElementById(
        "statsMedianSleep"
      );

    const statsMinSleep =
      document.getElementById(
        "statsMinSleep"
      );

    const statsMaxSleep =
      document.getElementById(
        "statsMaxSleep"
      );

    const statsAverageRhythm =
      document.getElementById(
        "statsAverageRhythm"
      );

    const statsAveragePhysical =
      document.getElementById(
        "statsAveragePhysical"
      );

    const sleepRhythmCorrelation =
      document.getElementById(
        "sleepRhythmCorrelation"
      );

    const correlationDescription =
      document.getElementById(
        "correlationDescription"
      );

    const statisticsPeriodText =
      document.getElementById(
        "statisticsPeriodText"
      );


    // ======================================
    // 必須要素確認
    // ======================================

const requiredElements = [

  dateInput,
  sleepDurationInput,

  sleepScoreInput,
  deepSleepPercentInput,
  lightSleepPercentInput,
  remSleepPercentInput,

  sleepStartInput,
  sleepEndInput,

  gameInput,
  rhythmGameConditionInput,

  physicalConditionInput,

  beverageInput,
  caffeineTimeInput,

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

  historyTableBody,

  statsRecordCount,
  statsAverageSleep,
  statsMedianSleep,
  statsMinSleep,
  statsMaxSleep,
  statsAverageRhythm,
  statsAveragePhysical,

  sleepRhythmCorrelation,
  correlationDescription,
  statisticsPeriodText

];


    if (
      requiredElements.some(
        element =>
          element === null
      )
    ) {

      console.error(
        "必要なHTML要素が見つかりません。"
      );

      return;
    }


    // ======================================
    // 今日の日付
    // ======================================

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


    // ======================================
    // タブ切り替え
    // ======================================

    setupTabs();


    // ======================================
    // 期間ボタン
    // ======================================

    setupPeriodButtons();


    // ======================================
    // データ読み込み
    // ======================================

    loadDashboard();


    // ======================================
    // 保存
    // ======================================

    saveButton.addEventListener(
      "click",
      async () => {

        message.textContent = "";


const date =
  dateInput.value;


const sleepDurationMinutes =
  Number(
    sleepDurationInput.value
  );


const sleepScore =
  sleepScoreInput.value === ""
    ? null
    : Number(
        sleepScoreInput.value
      );


const deepSleepPercent =
  deepSleepPercentInput.value === ""
    ? null
    : Number(
        deepSleepPercentInput.value
      );


const lightSleepPercent =
  lightSleepPercentInput.value === ""
    ? null
    : Number(
        lightSleepPercentInput.value
      );


const remSleepPercent =
  remSleepPercentInput.value === ""
    ? null
    : Number(
        remSleepPercentInput.value
      );


const sleepStart =
  sleepStartInput.value;


const sleepEnd =
  sleepEndInput.value;


const game =
  gameInput.value;


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


const caffeineTime =
  caffeineTimeInput.value;


const notes =
  notesInput.value.trim();


        // ==================================
        // 入力チェック
        // ==================================

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
        
if (
  !game
) {

  message.textContent =
    "プレイした音ゲーを選択してください。";

  return;
}

        if (
          !rhythmGameCondition
        ) {

          message.textContent =
            "音ゲーの調子を選択してください。";

          return;
        }


        if (
          !physicalCondition
        ) {

          message.textContent =
            "体調を選択してください。";

          return;
        }

const data = {

  date:
    date,

  sleepDurationMinutes:
    sleepDurationMinutes,

  sleepScore:
    sleepScore,

  deepSleepPercent:
    deepSleepPercent,

  lightSleepPercent:
    lightSleepPercent,

  remSleepPercent:
    remSleepPercent,

  sleepStart:
    sleepStart,

  sleepEnd:
    sleepEnd,

  game:
    game,

  rhythmGameCondition:
    rhythmGameCondition,

  physicalCondition:
    physicalCondition,

  beverage:
    beverage,

  caffeineTime:
    caffeineTime,

  notes:
    notes

};


        // ==================================
        // 保存開始
        // ==================================

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

                method:
                  "POST",

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


    // ======================================
    // タブ設定
    // ======================================

    function setupTabs() {

      const tabButtons =
        document.querySelectorAll(
          ".tab-button"
        );

      const tabContents =
        document.querySelectorAll(
          ".tab-content"
        );


      tabButtons.forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              const target =
                button.dataset.tab;


              tabButtons.forEach(
                item => {

                  item.classList.toggle(
                    "active",
                    item === button
                  );

                }
              );


              tabContents.forEach(
                content => {

                  content.classList.toggle(
                    "active",
                    content.id === target
                  );

                }
              );


              // 統計画面を開いたとき
              if (
                target ===
                "statistics"
              ) {

                updateStatistics();

              }

            }
          );

        }
      );

    }


    // ======================================
    // 期間ボタン設定
    // ======================================

    function setupPeriodButtons() {

      const buttons =
        document.querySelectorAll(
          ".period-button"
        );


      buttons.forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              currentPeriod =
                button.dataset.period;


              buttons.forEach(
                item => {

                  item.classList.toggle(
                    "active",
                    item === button
                  );

                }
              );


              updateStatistics();

            }
          );

        }
      );

    }


    // ======================================
    // GASデータ取得
    // ======================================

    function loadDashboard() {

      return new Promise(
        (resolve, reject) => {


          latestDate.textContent =
            "読み込み中...";

          latestSleepDuration.textContent =
            "読み込み中...";

          latestRhythmGame.textContent =
            "読み込み中...";

          latestPhysicalCondition.textContent =
            "読み込み中...";


          const callbackName =
            "dashboardCallback_" +
            Date.now();


          const script =
            document.createElement(
              "script"
            );


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

                delete window[
                  callbackName
                ];


                showDashboardError();


                reject(
                  new Error(
                    "GASからの応答がありません。"
                  )
                );

              },
              15000
            );


          window[
            callbackName
          ] =
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

              delete window[
                callbackName
              ];


              console.log(
                "GASから取得したJSON:",
                result
              );


              if (
                !result ||
                result.status !==
                "success"
              ) {

                showDashboardError();


                reject(
                  new Error(
                    result &&
                    result.message
                      ? result.message
                      : "データ取得に失敗しました。"
                  )
                );

                return;
              }


              const data =
                Array.isArray(
                  result.data
                )
                  ? result.data
                  : [];


              allSleepData =
                data;


              updateDashboard(
                data
              );


              updateStatistics();


              resolve(data);

            };


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

              delete window[
                callbackName
              ];


              showDashboardError();


              reject(
                new Error(
                  "GASへの通信に失敗しました。"
                )
              );

            };


          const jsonpUrl =
            GAS_URL +
            "?callback=" +
            encodeURIComponent(
              callbackName
            );


          script.src =
            jsonpUrl;


          document.head.appendChild(
            script
          );

        }
      );

    }


    // ======================================
    // ダッシュボード更新
    // ======================================

    function updateDashboard(data) {

      const sortedData =
        data
          .slice()
          .sort(
            (a, b) =>
              parseDate(a.date) -
              parseDate(b.date)
          );


      if (
        sortedData.length ===
        0
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


      // ==================================
      // 平均
      // ==================================

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


      recordCount.textContent =
        `${sortedData.length}日`;


      if (
        sleepValues.length > 0
      ) {

        const average =
          calculateMean(
            sleepValues
          );


        averageSleepDuration.textContent =
          formatSleepDuration(
            Math.round(
              average
            )
          );

      } else {

        averageSleepDuration.textContent =
          "---";

      }


      if (
        rhythmValues.length > 0
      ) {

        averageRhythmGame.textContent =
          calculateMean(
            rhythmValues
          ).toFixed(1);

      } else {

        averageRhythmGame.textContent =
          "---";

      }


      if (
        physicalValues.length > 0
      ) {

        averagePhysicalCondition.textContent =
          calculateMean(
            physicalValues
          ).toFixed(1);

      } else {

        averagePhysicalCondition.textContent =
          "---";

      }


      // ==================================
      // 履歴
      // ==================================

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


    // ======================================
    // 統計対象期間取得
    // ======================================

    function getPeriodData() {

      const sortedData =
        allSleepData
          .slice()
          .sort(
            (a, b) =>
              parseDate(a.date) -
              parseDate(b.date)
          );


      if (
        currentPeriod ===
        "all"
      ) {

        return sortedData;

      }


      const days =
        Number(
          currentPeriod
        );


      const today =
        new Date();

      today.setHours(
        23,
        59,
        59,
        999
      );


      const startDate =
        new Date(
          today
        );


      startDate.setDate(
        startDate.getDate() -
        (days - 1)
      );


      startDate.setHours(
        0,
        0,
        0,
        0
      );


      return sortedData.filter(
        item => {

          const date =
            parseDate(
              item.date
            );


          return (
            date >= startDate &&
            date <= today
          );

        }
      );

    }


    // ======================================
    // 統計更新
    // ======================================

    function updateStatistics() {

      const data =
        getPeriodData();


      updatePeriodDescription();


      // ==================================
      // データなし
      // ==================================

      if (
        data.length === 0
      ) {

        statsRecordCount.textContent =
          "0日";

        statsAverageSleep.textContent =
          "---";

        statsMedianSleep.textContent =
          "---";

        statsMinSleep.textContent =
          "---";

        statsMaxSleep.textContent =
          "---";

        statsAverageRhythm.textContent =
          "---";

        statsAveragePhysical.textContent =
          "---";

        sleepRhythmCorrelation.textContent =
          "---";

        correlationDescription.textContent =
          "この期間には十分なデータがありません。";


        destroyStatisticsCharts();

        return;
      }


      // ==================================
      // 睡眠
      // ==================================

      const sleepValues =
        data
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


      // ==================================
      // 音ゲー
      // ==================================

      const rhythmValues =
        data
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


      // ==================================
      // 体調
      // ==================================

      const physicalValues =
        data
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


      // ==================================
      // 基本統計
      // ==================================

      statsRecordCount.textContent =
        `${data.length}日`;


      if (
        sleepValues.length > 0
      ) {

        statsAverageSleep.textContent =
          formatSleepDuration(
            Math.round(
              calculateMean(
                sleepValues
              )
            )
          );


        statsMedianSleep.textContent =
          formatSleepDuration(
            Math.round(
              calculateMedian(
                sleepValues
              )
            )
          );


        statsMinSleep.textContent =
          formatSleepDuration(
            Math.min(
              ...sleepValues
            )
          );


        statsMaxSleep.textContent =
          formatSleepDuration(
            Math.max(
              ...sleepValues
            )
          );

      } else {

        statsAverageSleep.textContent =
          "---";

        statsMedianSleep.textContent =
          "---";

        statsMinSleep.textContent =
          "---";

        statsMaxSleep.textContent =
          "---";

      }


      if (
        rhythmValues.length > 0
      ) {

        statsAverageRhythm.textContent =
          calculateMean(
            rhythmValues
          ).toFixed(1);

      } else {

        statsAverageRhythm.textContent =
          "---";

      }


      if (
        physicalValues.length > 0
      ) {

        statsAveragePhysical.textContent =
          calculateMean(
            physicalValues
          ).toFixed(1);

      } else {

        statsAveragePhysical.textContent =
          "---";

      }


      // ==================================
      // 相関
      // ==================================

      calculateSleepRhythmCorrelation(
        data
      );


      // ==================================
      // グラフ
      // ==================================

      createStatisticsCharts(
        data
      );

    }


    // ======================================
    // 期間説明
    // ======================================

    function updatePeriodDescription() {

      if (
        currentPeriod ===
        "all"
      ) {

        statisticsPeriodText.textContent =
          "記録されている全期間のデータ";

        return;
      }


      statisticsPeriodText.textContent =
        `過去${currentPeriod}日間のデータ`;

    }


    // ======================================
    // 平均
    // ======================================

    function calculateMean(values) {

      if (
        values.length === 0
      ) {

        return NaN;

      }


      return (
        values.reduce(
          (sum, value) =>
            sum + value,
          0
        ) /
        values.length
      );

    }


    // ======================================
    // 中央値
    // ======================================

    function calculateMedian(values) {

      if (
        values.length === 0
      ) {

        return NaN;

      }


      const sorted =
        values
          .slice()
          .sort(
            (a, b) =>
              a - b
          );


      const middle =
        Math.floor(
          sorted.length / 2
        );


      if (
        sorted.length % 2 === 0
      ) {

        return (
          (
            sorted[middle - 1] +
            sorted[middle]
          ) /
          2
        );

      }


      return sorted[middle];

    }


    // ======================================
    // 睡眠時間－音ゲー相関
    // ======================================

    function calculateSleepRhythmCorrelation(
      data
    ) {

      const pairs =
        data
          .map(
            item => {

              const sleep =
                Number(
                  item.sleepDurationMinutes
                );

              const rhythm =
                Number(
                  item.rhythmGameCondition
                );


              if (
                !Number.isFinite(
                  sleep
                ) ||
                !Number.isFinite(
                  rhythm
                ) ||
                sleep <= 0 ||
                rhythm <= 0
              ) {

                return null;

              }


              return {
                sleep,
                rhythm
              };

            }
          )
          .filter(
            item =>
              item !== null
          );


      if (
        pairs.length < 2
      ) {

        sleepRhythmCorrelation.textContent =
          "---";

        correlationDescription.textContent =
          "相関分析には2日以上の有効なデータが必要です。";

        return;
      }


      const x =
        pairs.map(
          item =>
            item.sleep
        );


      const y =
        pairs.map(
          item =>
            item.rhythm
        );


      const correlation =
        calculatePearsonCorrelation(
          x,
          y
        );


      if (
        !Number.isFinite(
          correlation
        )
      ) {

        sleepRhythmCorrelation.textContent =
          "---";

        correlationDescription.textContent =
          "相関係数を計算できませんでした。";

        return;
      }


      sleepRhythmCorrelation.textContent =
        correlation.toFixed(2);


      correlationDescription.textContent =
        interpretCorrelation(
          correlation
        );

    }


    // ======================================
    // Pearson相関係数
    // ======================================

    function calculatePearsonCorrelation(
      x,
      y
    ) {

      if (
        x.length !== y.length ||
        x.length < 2
      ) {

        return NaN;

      }


      const meanX =
        calculateMean(x);

      const meanY =
        calculateMean(y);


      let numerator = 0;

      let denominatorX = 0;

      let denominatorY = 0;


      for (
        let i = 0;
        i < x.length;
        i++
      ) {

        const diffX =
          x[i] - meanX;

        const diffY =
          y[i] - meanY;


        numerator +=
          diffX * diffY;

        denominatorX +=
          diffX * diffX;

        denominatorY +=
          diffY * diffY;

      }


      const denominator =
        Math.sqrt(
          denominatorX *
          denominatorY
        );


      if (
        denominator === 0
      ) {

        return NaN;

      }


      return (
        numerator /
        denominator
      );

    }


    // ======================================
    // 相関の解釈
    // ======================================

    function interpretCorrelation(
      correlation
    ) {

      const absolute =
        Math.abs(
          correlation
        );


      if (
        absolute < 0.2
      ) {

        return "睡眠時間と音ゲーの調子には、ほとんど相関が見られません。";

      }


      if (
        absolute < 0.4
      ) {

        if (
          correlation > 0
        ) {

          return "睡眠時間が長いほど音ゲーの調子が良くなる傾向が、弱く見られます。";

        }


        return "睡眠時間が長いほど音ゲーの調子が悪くなる傾向が、弱く見られます。";

      }


      if (
        absolute < 0.7
      ) {

        if (
          correlation > 0
        ) {

          return "睡眠時間が長いほど音ゲーの調子が良くなる傾向が、中程度見られます。";

        }


        return "睡眠時間が長いほど音ゲーの調子が悪くなる傾向が、中程度見られます。";

      }


      if (
        correlation > 0
      ) {

        return "睡眠時間が長いほど音ゲーの調子が良くなる、比較的強い相関が見られます。";

      }


      return "睡眠時間が長いほど音ゲーの調子が悪くなる、比較的強い相関が見られます。";

    }


    // ======================================
    // 統計グラフ
    // ======================================

    function createStatisticsCharts(
      data
    ) {

      const labels =
        data.map(
          item =>
            formatDate(
              item.date
            )
        );


      const sleepValues =
        data.map(
          item =>
            Number(
              item.sleepDurationMinutes
            )
        );


      const rhythmValues =
        data.map(
          item =>
            Number(
              item.rhythmGameCondition
            )
        );


      const physicalValues =
        data.map(
          item =>
            Number(
              item.physicalCondition
            )
        );


      // ==================================
      // 睡眠
      // ==================================

      const sleepCanvas =
        document.getElementById(
          "statisticsSleepChart"
        );


      if (sleepCanvas) {

        if (
          statisticsSleepChart
        ) {

          statisticsSleepChart.destroy();

        }


        statisticsSleepChart =
          new Chart(
            sleepCanvas,
            {

              type:
                "line",

              data: {

                labels:
                  labels,

                datasets: [

                  {

                    label:
                      "睡眠時間",

                    data:
                      sleepValues,

                    tension:
                      0.2

                  }

                ]

              },

              options: {

                responsive:
                  true,

                scales: {

                  y: {

                    title: {

                      display:
                        true,

                      text:
                        "睡眠時間（分）"

                    },

                    beginAtZero:
                      false

                  }

                }

              }

            }
          );

      }


      // ==================================
      // 音ゲー
      // ==================================

      const rhythmCanvas =
        document.getElementById(
          "statisticsRhythmChart"
        );


      if (rhythmCanvas) {

        if (
          statisticsRhythmChart
        ) {

          statisticsRhythmChart.destroy();

        }


        statisticsRhythmChart =
          new Chart(
            rhythmCanvas,
            {

              type:
                "line",

              data: {

                labels:
                  labels,

                datasets: [

                  {

                    label:
                      "音ゲーの調子",

                    data:
                      rhythmValues,

                    tension:
                      0.2

                  }

                ]

              },

              options: {

                responsive:
                  true,

                scales: {

                  y: {

                    min:
                      1,

                    max:
                      5,

                    ticks: {

                      stepSize:
                        1

                    },

                    title: {

                      display:
                        true,

                      text:
                        "調子（1～5）"

                    }

                  }

                }

              }

            }
          );

      }


      // ==================================
      // 体調
      // ==================================

      const physicalCanvas =
        document.getElementById(
          "statisticsPhysicalChart"
        );


      if (physicalCanvas) {

        if (
          statisticsPhysicalChart
        ) {

          statisticsPhysicalChart.destroy();

        }


        statisticsPhysicalChart =
          new Chart(
            physicalCanvas,
            {

              type:
                "line",

              data: {

                labels:
                  labels,

                datasets: [

                  {

                    label:
                      "体調",

                    data:
                      physicalValues,

                    tension:
                      0.2

                  }

                ]

              },

              options: {

                responsive:
                  true,

                scales: {

                  y: {

                    min:
                      1,

                    max:
                      5,

                    ticks: {

                      stepSize:
                        1

                    },

                    title: {

                      display:
                        true,

                      text:
                        "体調（1～5）"

                    }

                  }

                }

              }

            }
          );

      }


      // ==================================
      // 比較
      // ==================================

      const comparisonCanvas =
        document.getElementById(
          "statisticsComparisonChart"
        );


      if (comparisonCanvas) {

        if (
          statisticsComparisonChart
        ) {

          statisticsComparisonChart.destroy();

        }


        statisticsComparisonChart =
          new Chart(
            comparisonCanvas,
            {

              type:
                "line",

              data: {

                labels:
                  labels,

                datasets: [

                  {

                    label:
                      "睡眠時間（分）",

                    data:
                      sleepValues,

                    tension:
                      0.2,

                    yAxisID:
                      "y"

                  },

                  {

                    label:
                      "音ゲーの調子",

                    data:
                      rhythmValues,

                    tension:
                      0.2,

                    yAxisID:
                      "y1"

                  }

                ]

              },

              options: {

                responsive:
                  true,

                scales: {

                  y: {

                    type:
                      "linear",

                    position:
                      "left",

                    title: {

                      display:
                        true,

                      text:
                        "睡眠時間（分）"

                    }

                  },


                  y1: {

                    type:
                      "linear",

                    position:
                      "right",

                    min:
                      1,

                    max:
                      5,

                    ticks: {

                      stepSize:
                        1

                    },

                    title: {

                      display:
                        true,

                      text:
                        "音ゲーの調子"

                    },

                    grid: {

                      drawOnChartArea:
                        false

                    }

                  }

                }

              }

            }
          );

      }

    }


    // ======================================
    // グラフ破棄
    // ======================================

    function destroyStatisticsCharts() {

      if (
        statisticsSleepChart
      ) {

        statisticsSleepChart.destroy();

        statisticsSleepChart =
          null;

      }


      if (
        statisticsRhythmChart
      ) {

        statisticsRhythmChart.destroy();

        statisticsRhythmChart =
          null;

      }


      if (
        statisticsPhysicalChart
      ) {

        statisticsPhysicalChart.destroy();

        statisticsPhysicalChart =
          null;

      }


      if (
        statisticsComparisonChart
      ) {

        statisticsComparisonChart.destroy();

        statisticsComparisonChart =
          null;

      }

    }


    // ======================================
    // エラー
    // ======================================

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


      allSleepData = [];

      updateStatistics();

    }


    // ======================================
    // 保存後
    // ======================================

function clearInputAfterSave() {

  sleepDurationInput.value =
    "";

  sleepScoreInput.value =
    "";

  deepSleepPercentInput.value =
    "";

  lightSleepPercentInput.value =
    "";

  remSleepPercentInput.value =
    "";

  sleepStartInput.value =
    "";

  sleepEndInput.value =
    "";

  gameInput.value =
    "";

  rhythmGameConditionInput.value =
    "";

  physicalConditionInput.value =
    "";

  beverageInput.value =
    "";

  caffeineTimeInput.value =
    "";

  notesInput.value =
    "";

}


    // ======================================
    // 睡眠時間表示
    // ======================================

    function formatSleepDuration(
      minutes
    ) {

      if (
        !Number.isFinite(
          minutes
        ) ||
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
        remainingMinutes ===
        0
      ) {

        return `${hours}時間`;

      }


      return (
        `${hours}時間` +
        `${remainingMinutes}分`
      );

    }


    // ======================================
    // 調子表示
    // ======================================

    function formatCondition(
      value
    ) {

      const number =
        Number(value);


      if (
        !Number.isFinite(
          number
        ) ||
        number <= 0
      ) {

        return "---";

      }


      return `${number} / 5`;

    }


    // ======================================
    // 日付解析
    // ======================================

    function parseDate(
      value
    ) {

      if (!value) {

        return new Date(
          NaN
        );

      }


      const text =
        String(value);


      // YYYY-MM-DD
      if (
        /^\d{4}-\d{2}-\d{2}$/.test(
          text
        )
      ) {

        const parts =
          text.split("-");


        return new Date(
          Number(parts[0]),
          Number(parts[1]) - 1,
          Number(parts[2])
        );

      }


      return new Date(
        text
      );

    }


    // ======================================
    // 日付表示
    // ======================================

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


      const date =
        new Date(text);


      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {

        const year =
          date.getFullYear();

        const month =
          String(
            date.getMonth() + 1
          ).padStart(
            2,
            "0"
          );

        const day =
          String(
            date.getDate()
          ).padStart(
            2,
            "0"
          );


        return (
          `${year}/` +
          `${month}/` +
          `${day}`
        );

      }


      return text;

    }


    // ======================================
    // Service Worker
    // ======================================

    if (
      "serviceWorker" in
      navigator
    ) {

      navigator.serviceWorker
        .register(
          "./sw.js"
        )
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

  }
);