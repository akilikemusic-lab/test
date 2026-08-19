// ========================================
// 睡眠健康アプリ v1.0
// 統計期間対応版
// ========================================

// ========================================
// Google Apps Script
// ========================================

const GAS_URL =
"https://script.google.com/macros/s/AKfycbyO9QkxmmebJCeP_y0sxFw3YlgaN-RHnCciZkX8pzO29q7tyMrGILzI3XH_vyFB655EPg/exec";

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

document.addEventListener("DOMContentLoaded",() => {

// ======================================
// 入力フォーム
// ======================================

    const dateInput = document.getElementById("date");
    const sleepDurationInput = document.getElementById("sleepDuration");
    const sleepScoreInput = document.getElementById("sleepScore");
    const deepSleepPercentInput = document.getElementById("deepSleepPercent");
    const lightSleepPercentInput = document.getElementById("lightSleepPercent");
    const remSleepPercentInput = document.getElementById("remSleepPercent");
    const sleepStartInput = document.getElementById("sleepStart");
    const sleepEndInput = document.getElementById("sleepEnd");
    const gameInput = document.getElementById("game");
    
    gameInput.addEventListener("change", () => {
        const selectedValues = Array.from(gameInput.selectedOptions).map(option => option.value);
        if (selectedValues.includes("なし")) {
            Array.from(gameInput.options).forEach(option => {
                option.selected = option.value === "なし";
            });
        }
    });
    const rhythmGameConditionInput = document.getElementById("rhythmGameCondition");
    const physicalConditionInput = document.getElementById("physicalCondition");
    const beverageInput = document.getElementById("beverage");
    const caffeineTimeInput = document.getElementById("caffeineTime");
    const notesInput = document.getElementById("notes");
    const saveButton = document.getElementById("saveButton");
    const message = document.getElementById("message");

// ======================================
// ダッシュボード
// ======================================

    const latestDate = document.getElementById("latestDate");
    const latestSleepDuration = document.getElementById("latestSleepDuration");
    const latestRhythmGame = document.getElementById("latestRhythmGame");
    const latestPhysicalCondition = document.getElementById("latestPhysicalCondition");
    const recordCount = document.getElementById("recordCount");
    const averageSleepDuration = document.getElementById("averageSleepDuration");
    const averageRhythmGame = document.getElementById("averageRhythmGame");
    const averagePhysicalCondition = document.getElementById("averagePhysicalCondition");
    const historyTableBody = document.getElementById("historyTableBody");

// ======================================
// 統計
// ======================================

    const statsRecordCount = document.getElementById("statsRecordCount");
    const statsAverageSleep = document.getElementById("statsAverageSleep");
    const statsMedianSleep = document.getElementById("statsMedianSleep");
    const statsMinSleep = document.getElementById("statsMinSleep");
    const statsMaxSleep = document.getElementById("statsMaxSleep");
    const statsAverageRhythm = document.getElementById("statsAverageRhythm");
    const statsAveragePhysical = document.getElementById("statsAveragePhysical");
    const sleepRhythmCorrelation = document.getElementById("sleepRhythmCorrelation");
    const correlationDescription = document.getElementById("correlationDescription");
    const statisticsPeriodText = document.getElementById("statisticsPeriodText");

// ======================================
// AI分析
// ======================================

    const generateAiPromptButton = document.getElementById("generateAiPromptButton");
    const aiPrompt = document.getElementById("aiPrompt");
    const copyAiPromptButton = document.getElementById("copyAiPromptButton");
    const aiPromptMessage = document.getElementById("aiPromptMessage");

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
    statisticsPeriodText,
    generateAiPromptButton,
    aiPrompt,
    copyAiPromptButton,
    aiPromptMessage,
    ];

    if (requiredElements.some(element => element === null)) {
        console.error("必要なHTML要素が見つかりません。");
        return;
    }

// ======================================
// 今日の日付
// ======================================

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.value =`${yyyy}-${mm}-${dd}`;

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
// generateAiPromptButton.addEventListener()まで大きな塊の処理
// ======================================

    saveButton.addEventListener("click",async () => {
        message.textContent = "";
        const date = dateInput.value;

        const sleepDurationInputValue = sleepDurationInput.value.trim();
        let sleepDurationMinutes = null;
        if (sleepDurationInputValue !== "") {
            if (!/^\d{4}$/.test(sleepDurationInputValue)) {
                message.textContent = "睡眠時間は4桁で入力してください（例：0730）。";
                return;
            }
            const hours = Number(sleepDurationInputValue.slice(0, 2));
            const minutes = Number(sleepDurationInputValue.slice(2, 4));

            if (hours > 23 || minutes > 59) {
                message.textContent = "睡眠時間の入力が正しくありません。例：0730";
                return;
            }
            sleepDurationMinutes = hours * 60 + minutes;
        }

        const sleepScore = sleepScoreInput.value === "" ? null
        : Number(sleepScoreInput.value);

        const deepSleepPercent = deepSleepPercentInput.value === "" ? null
        : Number(deepSleepPercentInput.value);

        const lightSleepPercent = lightSleepPercentInput.value === "" ? null
        : Number(lightSleepPercentInput.value);

        const remSleepPercent = remSleepPercentInput.value === "" ? null
        : Number(remSleepPercentInput.value);

        const sleepStart = sleepStartInput.value;
        const sleepEnd = sleepEndInput.value;
        const selectedGames = Array.from(gameInput.selectedOptions).map(option => option.value);

        const rhythmGameCondition = rhythmGameConditionInput.value === "" ? null 
        : Number(rhythmGameConditionInput.value);

        const physicalCondition = Number(physicalConditionInput.value);
        const beverage = beverageInput.value;
        const caffeineTime = caffeineTimeInput.value;
        const notes = notesInput.value.trim();

// ==================================
// 入力チェック
// ==================================

    if (!date) {
        message.textContent = "日付を入力してください。";
        return;
    }

    if (!sleepDurationMinutes || sleepDurationMinutes <= 0) {
        message.textContent = "睡眠時間を入力してください。";
        return;
    }

    if (selectedGames.length === 0) {
        message.textContent ="プレイした音ゲーを選択してください。";
        return;
    }

    if (!physicalCondition) {
        message.textContent = "体調を選択してください。";
        return;
    }

    const data = {
    date:date,
    sleepDurationMinutes:sleepDurationMinutes,
    sleepScore:sleepScore,
    deepSleepPercent:deepSleepPercent,
    lightSleepPercent:lightSleepPercent,

    remSleepPercent:remSleepPercent,
    sleepStart:sleepStart,
    sleepEnd:sleepEnd,
    game:selectedGames,
    rhythmGameCondition:rhythmGameCondition,

    physicalCondition:physicalCondition,
    beverage:beverage,
    caffeineTime:caffeineTime,
    notes:notes

    };

// ==================================
// 保存開始
// ==================================

    saveButton.disabled = true;
    saveButton.textContent = "保存中...";

    try {
        console.log("GASへ保存データを送信:", data);
        const response = await fetch(GAS_URL,{
            method: "POST",headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
        body: JSON.stringify(data)
    });

    console.log("GAS HTTPステータス:", response.status);
    const result = await response.json();
    console.log("GAS保存結果:", result);

    if (result.status === "success") {
        message.textContent = "保存しました。";
        clearInputAfterSave();
        await loadDashboard();
    } else {
        message.textContent = "保存に失敗しました。";
        console.error("GAS保存エラー:",result);
    }

    } catch (error) {

    console.error("保存通信エラー:",error);

    // ==================================
    // 通信失敗＝保存失敗とは限らない
    // ==================================

    message.textContent = "保存結果を確認しています...";

    try {
        const latestData = await loadDashboard();
        const saved = isDataAlreadySaved(latestData,data);

    if (saved) {
        console.log("通信結果は取得できなかったが、保存を確認しました。");
        message.textContent = "保存しました。";
        clearInputAfterSave();
    } else {
        console.error("保存確認できませんでした。");
        message.textContent = "通信エラーが発生しました。保存状態を確認してください。";
    }

    } catch (verifyError) {
        console.error("保存確認エラー:",verifyError);
        message.textContent = "保存結果を確認できませんでした。";
    }

    } finally {
        saveButton.disabled = false;
        saveButton.textContent = "保存する";
    }    
    });

// ======================================
// AI分析プロンプト生成
// ======================================

    generateAiPromptButton.addEventListener("click",() => {
        aiPromptMessage.textContent = "";
        console.log("AIプロンプト生成開始");
        console.log("allSleepData:",allSleepData);
        console.log("currentPeriod:",currentPeriod);

        const data = getPeriodData();
        console.log("getPeriodData結果:",data);
        console.log("データ件数:",data.length);

        if (data.length === 0) {
            aiPrompt.value = "";
            copyAiPromptButton.disabled = true;
            aiPromptMessage.textContent = "この期間には分析できるデータがありません。";
            return;
        }
        const prompt = generateAiAnalysisPrompt(data);
        aiPrompt.value = prompt;
        copyAiPromptButton.disabled = false;
        aiPromptMessage.textContent = "AI分析用プロンプトを作成しました。";
    });

// ======================================
// AI分析プロンプトコピー
// ======================================

    copyAiPromptButton.addEventListener("click",async () => {if (!aiPrompt.value) {return;}

    try {
        await navigator.clipboard.writeText(aiPrompt.value);
        aiPromptMessage.textContent = "プロンプトをコピーしました。";
        } catch (error) {
        console.error("コピーエラー:",error);
        aiPromptMessage.textContent ="コピーできませんでした。プロンプトを手動でコピーしてください。";
        }
    });

// ======================================
// タブ設定
// ======================================

    function setupTabs() {
        const tabButtons = document.querySelectorAll(".tab-button");
        const tabContents = document.querySelectorAll(".tab-content");
        
        tabButtons.forEach(button => {button.addEventListener("click",() => {const target = button.dataset.tab;
        tabButtons.forEach(item => {item.classList.toggle("active",item === button);
        });

        tabContents.forEach(content => { content.classList.toggle("active",content.id === target);
        });

        // 統計画面を開いたとき
        if (target === "statistics") {
            updateStatistics();
        }
        });
        });
    }

// ======================================
// AI分析プロンプト生成
// ======================================

    function generateAiAnalysisPrompt(data) { const sortedData = data.slice().sort((a, b) => parseDate(a.date) - parseDate(b.date));

// ==================================
// 基本統計
// ==================================

    const sleepValues = sortedData.map(item =>
    Number(item.sleepDurationMinutes)).filter(value => Number.isFinite(value) && value > 0);

    const rhythmValues = sortedData.map(item =>
    Number(item.rhythmGameCondition)).filter(value =>Number.isFinite(value) && value > 0);

    const physicalValues = sortedData.map(item =>
    Number(item.physicalCondition)).filter(value => Number.isFinite(value) && value > 0);

    const averageSleep = sleepValues.length > 0 ? Math.round(calculateMean(sleepValues)) : null;
    const medianSleep = sleepValues.length > 0 ? Math.round(calculateMedian(sleepValues)) : null;
    const minSleep = sleepValues.length > 0 ? Math.min(...sleepValues) : null;
    const maxSleep = sleepValues.length > 0 ? Math.max(...sleepValues) : null;

    const averageRhythm = rhythmValues.length > 0 ? calculateMean(rhythmValues) : null;
    const averagePhysical = physicalValues.length > 0 ? calculateMean(physicalValues) : null;

// ==================================
// 睡眠時間と音ゲーの相関
// ==================================

    const correlation = calculateSleepRhythmCorrelationValue(sortedData);

// ==================================
// 期間
// ==================================

    let periodText;
    if (currentPeriod === "all") {
        periodText = "全期間";
    } else {
        periodText = `過去${currentPeriod}日間`;
    }

// ==================================
// 日別データ
// ==================================

    const dailyData = sortedData.map(item => {
        const sleep = Number(item.sleepDurationMinutes);
        const sleepText = Number.isFinite(sleep) && sleep > 0 ? formatSleepDuration(sleep) : "未入力";
        const sleepScore = item.sleepScore !== null && item.sleepScore !== undefined &&
        item.sleepScore !== "" ? item.sleepScore : "未入力";

        const deepSleep = item.deepSleepPercent !== null && item.deepSleepPercent !== undefined &&
        item.deepSleepPercent !== "" ? `${item.deepSleepPercent}%` : "未入力";

        const lightSleep = item.lightSleepPercent !== null && item.lightSleepPercent !== undefined &&
        item.lightSleepPercent !== "" ? `${item.lightSleepPercent}%` : "未入力";

        const remSleep = item.remSleepPercent !== null && item.remSleepPercent !== undefined &&
        item.remSleepPercent !== "" ? `${item.remSleepPercent}%` : "未入力";

        const rhythm = item.rhythmGameCondition ? `${item.rhythmGameCondition}/5` : "未入力";
        const physical = item.physicalCondition ? `${item.physicalCondition}/5` : "未入力";

        const game = Array.isArray(item.game) ? item.game.join("、") : item.game || "未入力";
        const sleepStart = item.sleepStart || "未入力";

        const sleepEnd = item.sleepEnd || "未入力";
        const beverage = item.beverage || "未入力";
        const caffeineTime = item.caffeineTime || "未入力";
        const notes = item.notes || "なし";

        return (
        `・${formatDate(item.date)}` +
        `｜睡眠${sleepText}` +
        `｜睡眠スコア${sleepScore}` +
        `｜深い睡眠${deepSleep}` +
        `｜浅い睡眠${lightSleep}` +
        `｜REM${remSleep}` +
        `｜就寝${sleepStart}` +
        `｜起床${sleepEnd}` +
        `｜音ゲー${game}` +
        `｜音ゲー調子${rhythm}` +
        `｜体調${physical}` +
        `｜飲料${beverage}` +
        `｜カフェイン${caffeineTime}` +
        `｜メモ${notes}`
        );
    }
    ).join("\n");

// ==================================
// プロンプト
// ==================================

const prompt = `あなたは睡眠データと日常コンディションを分析するAIです。
以下のデータは、睡眠健康アプリに記録された実データです。
このデータを客観的に分析し、睡眠状態・体調・リズムゲームのコンディションについて、
分かりやすく説明してください。

【分析期間】

${periodText}
記録日数： ${sortedData.length}日

【統計データ】

平均睡眠時間： ${averageSleep !== null ? formatSleepDuration(averageSleep) : "データなし"}
中央値睡眠時間： ${medianSleep !== null ? formatSleepDuration(medianSleep) : "データなし"}
最短睡眠時間： ${minSleep !== null ? formatSleepDuration(minSleep) : "データなし"}
最長睡眠時間： ${maxSleep !== null ? formatSleepDuration(maxSleep) : "データなし"}
平均音ゲー調子： ${averageRhythm !== null ? averageRhythm.toFixed(2) : "データなし"}
平均体調： ${averagePhysical !== null ? averagePhysical.toFixed(2) : "データなし"}
睡眠時間と音ゲー調子の相関係数： ${correlation !== null ? correlation.toFixed(2) : "データなし"}

【日別データ】

${dailyData}

【良い日・悪い日の判定方法】

・音ゲーの調子が記録されている場合、5段階評価のうち4～5を「良かった日」、1～2を「悪かった日」として分析してください。
・体調についても同様に、4～5を「良かった日」、1～2を「悪かった日」としてください。
・3は中間として扱ってください。
・該当する日がない場合は「該当データなし」としてください。
・複数の指標で評価が異なる場合は、その違いを明記してください。

【分析してほしい内容】

1. 睡眠時間の状態
2. 睡眠時間のばらつき
3. 睡眠スコアの傾向
4. 深い睡眠・浅い睡眠・REM睡眠の傾向
5. 就寝時刻・起床時刻の傾向
6. 体調の傾向
7. 音ゲーのコンディションの傾向
8. 睡眠時間と音ゲーのコンディションの関係
9. 睡眠と体調の関係
10. 飲料・カフェイン摂取と睡眠の関係
11. 特に良かった日の特徴
12. 特に悪かった日の特徴
13. 今後試してみる価値がある改善方法

【重要な分析ルール】

・データに存在しない事実を作らないでください。
・入力されていないデータは「データなし」としてください。
・相関関係と因果関係を混同しないでください。
・「睡眠時間が長いから音ゲーの調子が良くなった」のような因果関係を断定しないでください。
・「睡眠時間が長い日に音ゲーの調子が良い傾向がある」のように表現してください。
・記録日数が少ない場合は、そのことを明記してください。
・少ないデータから強い結論を出さないでください。
・外れ値がある場合は、その影響について説明してください。
・医学的な診断は行わないでください。
・病気や疾患について断定しないでください。

【回答形式】

以下の構成で回答してください。

■ 総合評価

現在の睡眠状態を簡潔に説明してください。

■ 睡眠

睡眠時間、睡眠スコア、睡眠段階、就寝・起床時刻について説明してください。

■ 体調

睡眠と体調の関係について、データから確認できる傾向を説明してください。

■ 音ゲー

睡眠と音ゲーのコンディションについて、データから確認できる傾向を説明してください。

■ 良かった日の特徴

特にコンディションが良かった日の特徴を説明してください。

■ 悪かった日の特徴

特にコンディションが悪かった日の特徴を説明してください。

■ 改善提案

今後試してみる価値がある改善方法を、優先順位をつけて3つ程度提案してください。

■ 注意点

今回のデータから判断できないことや、分析上の注意点があれば説明してください。
`;
return prompt;
}

// ======================================
// 相関係数取得
// ======================================

    function calculateSleepRhythmCorrelationValue(data) {
        const pairs = data.map(item => { const sleep = Number(item.sleepDurationMinutes);
        const rhythm = Number(item.rhythmGameCondition);

        if (!Number.isFinite(sleep) || !Number.isFinite(rhythm) || sleep <= 0 || rhythm <= 0) {
            return null;
        }

        return {
            sleep,rhythm
        };
        }).filter(item => item !== null);

        if (pairs.length < 2 ) {
            return null;
        }

        const x = pairs.map(item => item.sleep);
        const y = pairs.map(item => item.rhythm);
        const correlation = calculatePearsonCorrelation(x,y);

        if (!Number.isFinite(correlation)) {
            return null;
        }

    return correlation;
    }

// ======================================
// 期間ボタン設定
// ======================================

    function setupPeriodButtons() {

        const buttons = document.querySelectorAll(".period-button");
        buttons.forEach(button => {button.addEventListener("click",() => {currentPeriod = button.dataset.period;
        buttons.forEach(item => {item.classList.toggle("active",item === button);
        });

        updateStatistics();
        });
        });
    }

// ======================================
// GASデータ取得
// ======================================

    function loadDashboard() {
        return new Promise((resolve, reject) => {
            latestDate.textContent = "読み込み中...";
            latestSleepDuration.textContent = "読み込み中...";
            latestRhythmGame.textContent = "読み込み中...";
            latestPhysicalCondition.textContent = "読み込み中...";
            
            const callbackName = "dashboardCallback_" + Date.now();
            const script = document.createElement("script");
            let finished = false;
            const timeout = setTimeout(() => {
                if (finished) {
                    return;
                }
            finished = true;
            script.remove();
            delete window[callbackName];
            showDashboardError();
            reject(new Error("GASからの応答がありません。"));
        },15000);

    window[callbackName] = function(result) {
        if (finished) {
            return;
    }

    finished = true;
    clearTimeout(timeout);
    script.remove();
    delete window[callbackName];

    console.log("GASから取得したJSON:", result);

    if (!result || result.status !== "success") {
        showDashboardError();
        reject(new Error(result && result.message ? result.message : "データ取得に失敗しました。"));
        return;
    }

    const data = Array.isArray(result.data) ? result.data : [];
        allSleepData = data;
        updateDashboard(data);
        updateStatistics();
        resolve(data);
    };

    script.onerror = function() {
        if (finished) {
            return;
        }

        finished = true;
        clearTimeout(timeout);
        script.remove();
        delete window[callbackName];
        showDashboardError();
        reject(new Error("GASへの通信に失敗しました。"));
        };

    const jsonpUrl = GAS_URL + "?callback=" + encodeURIComponent(callbackName);
    script.src = jsonpUrl;
    document.head.appendChild(script);
    }
    );

    }

// ======================================
// 保存確認
// ======================================

    function isDataAlreadySaved(allData, targetData) {
        if (!Array.isArray(allData)) {
            return false;
        }

        return allData.some(item => {
            return (
                String(item.date) === String(targetData.date) &&
                Number(item.sleepDurationMinutes) === Number(targetData.sleepDurationMinutes) &&
                String(item.sleepScore ?? "") === String(targetData.sleepScore ?? "") &&
                String(item.deepSleepPercent ?? "") === String(targetData.deepSleepPercent ?? "") &&
                String(item.lightSleepPercent ?? "") === String(targetData.lightSleepPercent ?? "") &&
                String(item.remSleepPercent ?? "") === String(targetData.remSleepPercent ?? "") &&
                String(item.sleepStart ?? "") === String(targetData.sleepStart ?? "") &&
                String(item.sleepEnd ?? "") === String(targetData.sleepEnd ?? "") &&
                
                JSON.stringify(item.game ?? []) === JSON.stringify(targetData.game ?? []) &&
                
                String(item.rhythmGameCondition ?? "") === String(targetData.rhythmGameCondition ?? "") &&
                String(item.physicalCondition ?? "") === String(targetData.physicalCondition ?? "") &&
                String(item.beverage ?? "") === String(targetData.beverage ?? "") &&
                String(item.caffeineTime ?? "") === String(targetData.caffeineTime ?? "") &&
                String(item.notes ?? "") === String(targetData.notes ?? "")
            );
        });
    }

    // ======================================
    // ダッシュボード更新
    // ======================================

    function updateDashboard(data) {
        const sortedData = data.slice().sort((a, b) => parseDate(a.date) - parseDate(b.date));
        if (sortedData.length === 0) {
            latestDate.textContent = "まだ記録がありません。";
            latestSleepDuration.textContent = "---";
            latestRhythmGame.textContent = "---";
            latestPhysicalCondition.textContent = "---";
            recordCount.textContent = "0日";
            averageSleepDuration.textContent = "---";
            averageRhythmGame.textContent = "---";
            averagePhysicalCondition.textContent = "---";
            historyTableBody.innerHTML =
            `<tr>
            <td colspan="4">まだ記録がありません。</td>
            </tr>
            `;
        return;
    }

    const latest = sortedData[sortedData.length - 1];
    latestDate.textContent = formatDate(latest.date);
    latestSleepDuration.textContent = formatSleepDuration(Number(latest.sleepDurationMinutes));
    latestRhythmGame.textContent = formatCondition(latest.rhythmGameCondition);
    latestPhysicalCondition.textContent = formatCondition(latest.physicalCondition);

// ==================================
// 平均
// ==================================

    const sleepValues = sortedData.map(item => Number(item.sleepDurationMinutes)).filter(value => Number.isFinite(value) && value > 0);
    const rhythmValues = sortedData.map(item => Number(item.rhythmGameCondition)).filter(value => Number.isFinite(value) && value > 0);
    const physicalValues = sortedData.map(item => Number(item.physicalCondition)).filter(value => Number.isFinite(value) && value > 0);
    recordCount.textContent = `${sortedData.length}日`;
    
    if (sleepValues.length > 0) {
        const average = calculateMean(sleepValues);
        averageSleepDuration.textContent = formatSleepDuration(Math.round(average));
    } else {
        averageSleepDuration.textContent = "---";
    }

    if (rhythmValues.length > 0) {
        averageRhythmGame.textContent = calculateMean(rhythmValues).toFixed(1);
    } else {
        averageRhythmGame.textContent ="---";
    }

    if (physicalValues.length > 0) {
        averagePhysicalCondition.textContent = calculateMean(physicalValues).toFixed(1);
    } else {
        averagePhysicalCondition.textContent = "---";
    }

// ==================================
// 履歴
// ==================================

    const history = sortedData.slice().reverse().slice(0,10);
    historyTableBody.innerHTML = "";
    history.forEach(item => {
    
        const row = document.createElement("tr");
        const dateCell = document.createElement("td");
        dateCell.textContent = formatDate(item.date);

        const sleepCell = document.createElement("td");
        sleepCell.textContent = formatSleepDuration(Number(item.sleepDurationMinutes));

        const rhythmCell = document.createElement("td");
        rhythmCell.textContent = formatCondition(item.rhythmGameCondition);

        const physicalCell = document.createElement("td");
        physicalCell.textContent = formatCondition(item.physicalCondition);

        row.appendChild(dateCell);
        row.appendChild(sleepCell);
        row.appendChild(rhythmCell);
        row.appendChild(physicalCell);
        historyTableBody.appendChild(row);
    });
    }
    
// ======================================
// 統計対象期間取得
// ======================================

    function getPeriodData() {
        const sortedData = allSleepData.slice().sort((a, b) => parseDate(a.date) - parseDate(b.date));
        // 全期間
        if (currentPeriod === "all") {
            return sortedData;
        }
        const days = Number(currentPeriod);

        if (!Number.isFinite(days) || days <= 0) {
            return [];
        }
        
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - (days - 1));
        startDate.setHours(0, 0, 0, 0);

        return sortedData.filter(item => {
            const date = parseDate(item.date);
            if (Number.isNaN(date.getTime())) {
                return false;
            }
            return date >= startDate && date <= today;
        });
    }
    
// ======================================
// 統計更新
// ======================================

    function updateStatistics() {
        const data = getPeriodData();
        updatePeriodDescription();

// ==================================
// データなし
// ==================================

    if (data.length === 0) {
        statsRecordCount.textContent = "0日";
        statsAverageSleep.textContent = "---";
        statsMedianSleep.textContent = "---";
        statsMinSleep.textContent = "---";
        statsMaxSleep.textContent = "---";
        statsAverageRhythm.textContent = "---";
        statsAveragePhysical.textContent = "---";
        sleepRhythmCorrelation.textContent = "---";
        correlationDescription.textContent = "この期間には十分なデータがありません。";
        destroyStatisticsCharts();
        return;
    }

// ==================================
// 睡眠
// ==================================

    const sleepValues = data.map(item => Number(item.sleepDurationMinutes)).filter(value => Number.isFinite(value) && value > 0);

// ==================================
// 音ゲー
// ==================================

    const rhythmValues = data.map(item => Number(item.rhythmGameCondition)).filter(value => Number.isFinite(value) && value > 0);

// ==================================
// 体調
// ==================================

    const physicalValues = data.map(item => Number(item.physicalCondition)).filter(value => Number.isFinite(value) && value > 0);

// ==================================
// 基本統計
// ==================================

    statsRecordCount.textContent = `${data.length}日`;

    if (sleepValues.length > 0) {
        statsAverageSleep.textContent = formatSleepDuration(Math.round(calculateMean(sleepValues)));
        statsMedianSleep.textContent = formatSleepDuration(Math.round(calculateMedian(sleepValues)));
        statsMinSleep.textContent = formatSleepDuration(Math.min(...sleepValues));
        statsMaxSleep.textContent = formatSleepDuration(Math.max(...sleepValues));
    } else {
        statsAverageSleep.textContent = "---";
        statsMedianSleep.textContent = "---";
        statsMinSleep.textContent = "---";
        statsMaxSleep.textContent = "---";
    }

    if (rhythmValues.length > 0) {
        statsAverageRhythm.textContent = calculateMean(rhythmValues).toFixed(1);
    } else {
        statsAverageRhythm.textContent = "---";
    }
    if (physicalValues.length > 0) {
        statsAveragePhysical.textContent = calculateMean(physicalValues).toFixed(1);
    } else {
        statsAveragePhysical.textContent = "---";
    }

// ==================================
// 相関
// ==================================

    calculateSleepRhythmCorrelation(data);

// ==================================
// グラフ
// ==================================

    createStatisticsCharts(data);
    }

// ======================================
// 期間説明
// ======================================

    function updatePeriodDescription() {
        if (currentPeriod === "all") {
            statisticsPeriodText.textContent = "記録されている全期間のデータ";
            return;
        }
    statisticsPeriodText.textContent = `過去${currentPeriod}日間のデータ`;
    }

// ======================================
// 平均
// ======================================

    function calculateMean(values) {
        if (values.length === 0) {
            return NaN;
        }
        return (values.reduce((sum, value) => sum + value,0) / values.length);
    }

// ======================================
// 中央値
// ======================================

    function calculateMedian(values) {
        if (values.length === 0) {
            return NaN;
        }
            const sorted = values.slice().sort((a, b) =>a - b);
            const middle = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return ((sorted[middle - 1] + sorted[middle]) / 2);
        }
        return sorted[middle];
    }

// ======================================
// 睡眠時間－音ゲー相関
// ======================================

    function calculateSleepRhythmCorrelation(data) {
        const pairs = data.map(item => {
            const sleep = Number(item.sleepDurationMinutes);
            const rhythm = Number(item.rhythmGameCondition);
        if (!Number.isFinite(sleep) || !Number.isFinite(rhythm) || sleep <= 0 || rhythm <= 0) {
            return null;
        }
        return {
            sleep,rhythm
        };
        }).filter(item => item !== null);

        if (pairs.length < 5) {
            sleepRhythmCorrelation.textContent = "---";
            correlationDescription.textContent = "相関分析には5日以上の有効なデータが必要です。";
            return;
        }

        const x = pairs.map(item => item.sleep);
        const y = pairs.map(item => item.rhythm);
        const correlation = calculatePearsonCorrelation(x,y);

        if (!Number.isFinite(correlation)) {
            sleepRhythmCorrelation.textContent = "---";
            correlationDescription.textContent = "相関係数を計算できませんでした。";
            return;
        }
        sleepRhythmCorrelation.textContent = `${correlation.toFixed(2)}（${pairs.length}日）`;
        correlationDescription.textContent = interpretCorrelation(correlation);
    }

// ======================================
// Pearson相関係数
// ======================================

    function calculatePearsonCorrelation(x,y) {
        if (x.length !== y.length || x.length < 2) {
            return NaN;
        }
        const meanX = calculateMean(x);
        const meanY = calculateMean(y);

        let numerator = 0;
        let denominatorX = 0;
        let denominatorY = 0;

        for (let i = 0; i < x.length; i++) {
            const diffX = x[i] - meanX;
            const diffY = y[i] - meanY;
            numerator += diffX * diffY;
            denominatorX += diffX * diffX;
            denominatorY += diffY * diffY;
        }
        
        const denominator = Math.sqrt(denominatorX * denominatorY);
        if (denominator === 0) {
        return NaN;
        
        }
        return (numerator / denominator);
    }

// ======================================
// 相関の解釈
// ======================================

    function interpretCorrelation(correlation) {
        const absolute = Math.abs(correlation);
        if (absolute < 0.2) {
            return "睡眠時間と音ゲーの調子には、ほとんど相関が見られません。";
        }
        
        if (absolute < 0.4) {
            if (correlation > 0) {
                return "睡眠時間が長いほど音ゲーの調子が良くなる傾向が、弱く見られます。";
            }
            return "睡眠時間が長いほど音ゲーの調子が悪くなる傾向が、弱く見られます。";
        }
        
        if (absolute < 0.7) {
            if (correlation > 0) {
                return "睡眠時間が長いほど音ゲーの調子が良くなる傾向が、中程度見られます。";
            }
            return "睡眠時間が長いほど音ゲーの調子が悪くなる傾向が、中程度見られます。";
        }
        
        if (correlation > 0) {
            return "睡眠時間が長いほど音ゲーの調子が良くなる、比較的強い相関が見られます。";
        }
        return "睡眠時間が長いほど音ゲーの調子が悪くなる、比較的強い相関が見られます。";
    }

// ======================================
// 統計グラフ
// ======================================

    function createStatisticsCharts(data) {
    const labels = data.map(item => formatDate(item.date));
    const sleepValues = data.map(item => { 
        const value = Number(item.sleepDurationMinutes);
        return Number.isFinite(value) && value > 0 ? value : null;
    });

    const rhythmValues = data.map(item => {
        const value = Number(item.rhythmGameCondition);
        return Number.isFinite(value) && value > 0 ? value : null;
    });

    const physicalValues = data.map(item => {
        const value = Number(item.physicalCondition);
        return Number.isFinite(value) && value > 0 ? value : null;
    });

// ==================================
// 睡眠
// ==================================

    const sleepCanvas = document.getElementById("statisticsSleepChart");
    if (sleepCanvas) {
        if (statisticsSleepChart) {
            statisticsSleepChart.destroy();
        }
        statisticsSleepChart = new Chart(sleepCanvas,{
            type:"line",data: {
                labels:labels,datasets: [{label:"睡眠時間",data:sleepValues,tension:0.2}]
            },
            options: {
                responsive:true,scales: {
                    y: {
                        title: {
                            display:true,text:"睡眠時間（分）"
                        },
                    beginAtZero:false
                    }
                }
            }
        });
    }

// ==================================
// 音ゲー
// ==================================

    const rhythmCanvas = document.getElementById("statisticsRhythmChart");
    
    if (rhythmCanvas) {
        if (statisticsRhythmChart) {
            statisticsRhythmChart.destroy();
        }
        statisticsRhythmChart = new Chart(rhythmCanvas,{
            type:"line",data: {
                labels:labels,datasets: [{label:"音ゲーの調子",data:rhythmValues,tension:0.2}]
            },
        options: {
            responsive:true,scales: {
                y: {
                    min:1,max:5,ticks: {
                        stepSize:1
                    },
                    title: {
                        display:true,text:"調子（1～5）"
                    }
                }
            }
            }
        });
    }

// ==================================
// 体調
// ==================================

    const physicalCanvas = document.getElementById("statisticsPhysicalChart");

    if (physicalCanvas) {
        if (statisticsPhysicalChart) {
            statisticsPhysicalChart.destroy();
        }
        statisticsPhysicalChart = new Chart(physicalCanvas,{
            type:"line",data: {
                labels:labels,datasets:[{label:"体調",data:physicalValues,tension:0.2}]
            },
            options: {
                responsive:true,scales: {
                    y: {
                        min:1,max:5,ticks: {
                            stepSize:1
                        },
                        title: {
                            display:true,text:"体調（1～5）"
                        }
                    }
                }
            }
        });
    }

// ==================================
// 比較
// ==================================

    const comparisonCanvas = document.getElementById("statisticsComparisonChart");
    
    if (comparisonCanvas) {
        if (statisticsComparisonChart) {
            statisticsComparisonChart.destroy();
        }
        statisticsComparisonChart = new Chart(comparisonCanvas,{
            type:"line",
            data:{
                labels:labels,
                datasets:[{label:"睡眠時間（分）",data: sleepValues,tension:0.2,yAxisID:"y"},
                          {label:"音ゲーの調子",data:rhythmValues,tension:0.2,yAxisID:"y1"}]
            },
            options:{
                responsive:true,
                scales: {
                    y: {
                        type:"linear",
                        position:"left",
                        title: {
                            display:true,
                            text:"睡眠時間（分）"
                        }
                    },
                    y1: {
                        type:"linear",
                        position:"right",
                        min:1,
                        max:5,
                        ticks: {
                            stepSize:1
                        },
                    title: {
                        display:true,
                        text:"音ゲーの調子"
                    },
                    grid: {
                        drawOnChartArea:false
                    }
                    }
                }
            }
            });
        }
    }

// ======================================
// グラフ破棄
// ======================================

    function destroyStatisticsCharts() {
        if (statisticsSleepChart) {
            statisticsSleepChart.destroy();
            statisticsSleepChart = null;
        }
        if (statisticsRhythmChart) {
            statisticsRhythmChart.destroy();
            statisticsRhythmChart = null;
        }
        if (statisticsPhysicalChart) {
            statisticsPhysicalChart.destroy();
            statisticsPhysicalChart = null;
        }
        if (statisticsComparisonChart) {
            statisticsComparisonChart.destroy();
            statisticsComparisonChart = null;
        }
    }

// ======================================
// エラー
// ======================================

    function showDashboardError() {
        latestDate.textContent = "---";
        latestSleepDuration.textContent = "---";
        latestRhythmGame.textContent = "---";
        latestPhysicalCondition.textContent = "---";
        recordCount.textContent = "---";
        averageSleepDuration.textContent = "---";
        averageRhythmGame.textContent = "---";
        averagePhysicalCondition.textContent = "---";

        historyTableBody.innerHTML = 
        `<tr>
        <td colspan="4">データを取得できませんでした。</td>
        </tr>
        `;

        allSleepData = [];
        updateStatistics();
    }

// ======================================
// 保存後
// ======================================

    function clearInputAfterSave() {
        sleepDurationInput.value = "";
        sleepScoreInput.value = "";
        deepSleepPercentInput.value = "";
        lightSleepPercentInput.value = "";
        remSleepPercentInput.value = "";
        sleepStartInput.value = "";
        sleepEndInput.value = "";
        Array.from(gameInput.options).forEach(option => {
            option.selected = false;
        });

        rhythmGameConditionInput.value = "";
        physicalConditionInput.value = "";
        beverageInput.value = "";
        caffeineTimeInput.value = "";
        notesInput.value = "";
    }

// ======================================
// 睡眠時間表示
// ======================================

    function formatSleepDuration(minutes) {
        if (!Number.isFinite(minutes) || minutes < 0) {
            return "---";
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (remainingMinutes === 0) {
            return `${hours}時間`;
        }
        return (`${hours}時間` + `${remainingMinutes}分`);
    }

// ======================================
// 調子表示
// ======================================

    function formatCondition(value) {
        const number = Number(value);
        if (!Number.isFinite(number) || number <= 0) {
            return "---";
        }
        return `${number} / 5`;
    }

// ======================================
// 日付解析
// ======================================

    function parseDate(value) {
        if (!value) {
            return new Date(NaN);
        }
        const text = String(value);

        // YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
            const parts = text.split("-");
            return new Date(Number(parts[0]),Number(parts[1]) - 1,Number(parts[2]));
        }
            return new Date(text);
        }

// ======================================
// 日付表示
// ======================================

    function formatDate(value) {
        if (!value) {
            return "---";
        }
        const text = String(value);
        
        if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
            const parts = text.split("-");
            return (`${parts[0]}/` + `${parts[1]}/` + `${parts[2]}`);
        }
        const date = new Date(text);

        if (!Number.isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2,"0");
            const day = String(date.getDate()).padStart(2,"0");
            return (`${year}/` + `${month}/` + `${day}`);
        }
        return text;
    }

// ======================================
// Service Worker
// ======================================

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js").then(registration => {
            console.log("Service Worker登録成功:", registration.scope);
        }).catch(error => {
            console.error("Service Worker登録失敗:",error);
        });
        }
        }
    );