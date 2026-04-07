/* 
  飯店管理系統資料結構
*/
const resourceData = [
    {
        target: "常用",
        icon: "⭐",
        sheets: [
            { name: "候補訂房單", url: "https://docs.google.com/spreadsheets/d/1jxpdglp4rjJ_Hyf7rpNni3ydh4ofz6-Fqf6-Jwe69Fk/edit?gid=2061401511#gid=2061401511" },
            { name: "旅遊行程", url: "https://docs.google.com/spreadsheets/d/1sjj1ZoJFJKtHua9J2yr0HT-PaUWkgupCVZ3Oj-zHNpU/edit?gid=755432321#gid=755432321" },
            { name: "公務出差登記表", url: "https://docs.google.com/spreadsheets/d/16tL7WLrZ9c5OeArKI0OJpAxzp0Ym_vw0y1jqQuDeyFM/edit?gid=2147132441#gid=2147132441" }
        ]
    },
    {
        target: "出納",
        icon: "💰",
        sheets: [
            { name: "零用金", url: "https://docs.google.com/spreadsheets/d/1Ztu7eJxQxpZTojhS0KBZVDDAjJP61fPvx8fMPFXOk40/" },
            { name: "BK佣金", url: "https://docs.google.com/spreadsheets/d/1ETI9iwfQgm3ux9bZoIPO8RqSTNL7K1qjeYuxfBUw_Ow/edit?gid=0#gid=0" },
            { name: "房務續退表", url: "https://docs.google.com/spreadsheets/d/1o1AuN5hJVC2PjXO1EEFQuBiaJXEv1S33WYz9gJ68JDw/edit?gid=1173601301#gid=1173601301" }
        ]
    },
    {
        target: "總機",
        icon: "📞",
        sheets: [
            { name: "訂金本", url: "https://docs.google.com/spreadsheets/d/1WQPGCoyJrgZxoAKSaYkTHXHWavW08hqqdfcblVmpujU/edit?gid=0#gid=0" },
            { name: "澎湖洗衣廠", url: "https://docs.google.com/spreadsheets/d/13E5SmRMO63O7Jjs826fz49eJYnLK2rBjgH7V4Ekrhqc/" }
        ]
    },
    {
        target: "寄信",
        icon: "✉️",
        sheets: [
            { name: "鎖房寄信", url: "https://docs.google.com/spreadsheets/d/17LdPMkyVT-xm4LDBwSsOkncCFSpeA4aCBYn44bWFBeI/edit?gid=0#gid=0" },
            { name: "行程寄信", url: "https://docs.google.com/spreadsheets/d/1UHmxgO2TPIGGMTCL_rmQ0dBcd5j7DQOxKHflpWwJqH4/edit?gid=0#gid=0" }
        ]
    },
    {
        target: "沒訂",
        icon: "❌",
        sheets: [
            { name: "散客沒訂", url: "https://docs.google.com/spreadsheets/d/1LBrzF9tjHiGuOFQil9KuMk8mL9QD1HecNLlvIN254x4/edit?gid=948852613#gid=948852613" },
            { name: "團體沒訂", url: "https://docs.google.com/spreadsheets/d/1TR5fbwwjd9mCqh-mb4vq_RvjKROO8do1vSkwnPCz_sU/edit?gid=315387566#gid=315387566" }
        ]
    },
    {
        target: "其它",
        icon: "📁",
        sheets: [
            { name: "集團員工電話", url: "https://docs.google.com/spreadsheets/d/1ETMqUuRkYNd3K52zr3J92YK0cIXAp2uQRVymrW9ZsIc/edit?gid=0#gid=0" },
            { name: "班表", url: "https://docs.google.com/spreadsheets/d/130QCq1GylF5IsQzBpGG6h6Wm43ryus41EWagDuSSveA/edit?gid=1726635402#gid=1726635402" }
        ]
    }
];

// 當網頁載入完成後，執行以下程式
document.addEventListener("DOMContentLoaded", () => {

    // ======== 登入系統與 GPS 定位功能 ========
    const loginScreen = document.getElementById("login-screen");
    const appContainer = document.getElementById("app-container");
    const loginBtn = document.getElementById("login-btn");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginError = document.getElementById("login-error");

    // 網路 IP 鎖定清單
    const ALLOWED_IPS = [
        "61.219.113.251", // 公司固定 IP1
        "61.219.113.252", // 公司固定 IP2
        "1.175.177.14",    // 新增的第二個 IP
        "1.175.146.55"
    ];

    // 驗證帳號密碼與 IP 的非同步函式
    const checkLogin = async () => {
        // 1. 先驗證帳號密碼
        if (usernameInput.value === "yaling" && passwordInput.value === "9261366") {

            // 2. 帳密正確，準備檢查網路 IP
            loginBtn.innerText = "🌐 網路環境確認中...";
            loginBtn.style.opacity = "0.7";
            loginBtn.style.cursor = "not-allowed";
            loginBtn.disabled = true;
            loginError.style.display = "none";

            try {
                // 向外部服務請求目前的公開 IP
                const response = await fetch('https://api.ipify.org?format=json');
                if (!response.ok) throw new Error("網路請求失敗");

                const data = await response.json();
                const currentIP = data.ip;

                // 確認目前的 IP 是否在允許清單中
                if (ALLOWED_IPS.includes(currentIP)) {
                    // IP 符合，登入成功！
                    loginScreen.style.display = "none";
                    appContainer.style.display = "flex";
                    loginError.style.display = "none";
                } else {
                    // IP 不符合
                    loginError.innerHTML = `登入失敗：請連接公司專屬網路！<br><span style="font-size: 0.85rem; color: #888;">(您目前的網路 IP: ${currentIP})</span>`;
                    loginError.style.display = "block";

                    loginBtn.innerText = "重新登入";
                    loginBtn.style.opacity = "1";
                    loginBtn.style.cursor = "pointer";
                    loginBtn.disabled = false;
                }
            } catch (error) {
                // 如果使用者沒連上網，或者 api 壞掉
                loginError.innerText = "無法取得您的網路 IP 資訊，請確認網路連線是否正常！";
                loginError.style.display = "block";

                loginBtn.innerText = "重新登入";
                loginBtn.style.opacity = "1";
                loginBtn.style.cursor = "pointer";
                loginBtn.disabled = false;
            }
        } else {
            loginError.innerText = "帳號或密碼錯誤！";
            loginError.style.display = "block";
        }
    };

    // 點擊「登入」按鈕時觸發
    loginBtn.addEventListener("click", checkLogin);

    // 在密碼欄位按下 Enter 鍵時也觸發登入
    passwordInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") checkLogin();
    });
    // ==============================

    const folderTree = document.getElementById("folder-tree");
    const iframeContainer = document.getElementById("iframe-container");
    const tabsContainer = document.getElementById("tabs-container");
    const welcomeScreen = document.getElementById("welcome-screen");

    // ======== 多分頁狀態與管理函式 ========
    let openedTabs = [];
    let currentActiveTabId = null;

    function activateTab(tabId) {
        currentActiveTabId = tabId;
        openedTabs.forEach(tab => {
            if (tab.id === tabId) {
                tab.tabEl.classList.add("active");
                tab.iframeEl.style.display = "block";
            } else {
                tab.tabEl.classList.remove("active");
                tab.iframeEl.style.display = "none";
            }
        });
    }

    function closeTab(tabId) {
        const tabIndex = openedTabs.findIndex(t => t.id === tabId);
        if (tabIndex === -1) return;

        const tabObj = openedTabs[tabIndex];
        // 移除 DOM
        tabObj.tabEl.remove();
        tabObj.iframeEl.remove();

        // 從陣列移除
        openedTabs.splice(tabIndex, 1);

        // 若關閉的是目前正在顯示的分頁，自動切換到最後一個分頁
        if (currentActiveTabId === tabId) {
            if (openedTabs.length > 0) {
                activateTab(openedTabs[openedTabs.length - 1].id);
            } else {
                currentActiveTabId = null;
                tabsContainer.style.display = "none";
                welcomeScreen.style.display = "flex"; // 恢復歡迎畫面
            }
        }
    }

    function openTab(name, url) {
        tabsContainer.style.display = "flex"; // 確保分頁列有顯示
        welcomeScreen.style.display = "none"; // 隱藏歡迎畫面

        // 檢查是否已經開過 (透過 URL 判斷)
        const existingTab = openedTabs.find(t => t.url === url);
        if (existingTab) {
            activateTab(existingTab.id); // 已經開過就直接切換過去
            return;
        }

        // 沒開過，建立全新的分頁
        const tabId = "tab_" + Date.now();

        // 1. 建立標籤 UI
        const tabEl = document.createElement("div");
        tabEl.className = "tab";

        const titleEl = document.createElement("span");
        titleEl.className = "tab-title";
        titleEl.innerText = name;
        titleEl.title = name;

        const closeBtn = document.createElement("span");
        closeBtn.className = "close-btn";
        closeBtn.innerHTML = "✖";
        closeBtn.title = "關閉分頁";

        tabEl.appendChild(titleEl);
        tabEl.appendChild(closeBtn);

        // 2. 建立 iframe 渲染畫面
        const iframeEl = document.createElement("iframe");
        iframeEl.className = "sheet-frame";
        iframeEl.src = url;
        iframeEl.frameBorder = "0";
        iframeEl.allowFullscreen = true;
        iframeEl.title = name;

        // 放入畫面中
        tabsContainer.appendChild(tabEl);
        iframeContainer.appendChild(iframeEl);

        // 紀錄到狀態陣列
        openedTabs.push({
            id: tabId,
            url: url,
            tabEl: tabEl,
            iframeEl: iframeEl
        });

        // 綁定事件
        tabEl.addEventListener("click", () => activateTab(tabId));
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // 阻止點擊事件往上傳遞給 tabEl
            closeTab(tabId);
        });

        // 剛開好就預設讓他成為顯示中
        activateTab(tabId);
    }
    // ======================================

    // ======== 側邊欄自動彈出與鎖定功能 ========
    const showSidebarBtn = document.getElementById("show-sidebar");
    const sidebar = document.getElementById("sidebar");
    const pinBtn = document.getElementById("pin-sidebar");
    const hoverTrigger = document.getElementById("hover-trigger");

    let isPinned = false; // 紀錄是否鎖定側欄

    // 【自動機制】預設進入網頁時將側欄先收起來
    sidebar.classList.add("collapsed");
    showSidebarBtn.style.display = "flex";
    if (hoverTrigger) hoverTrigger.style.display = "block"; // 顯示透明感應區

    // 點擊右上角圖釘/解鎖按鈕
    if (pinBtn) {
        pinBtn.addEventListener("click", () => {
            isPinned = !isPinned; // 切換鎖定狀態
            if (isPinned) {
                pinBtn.innerHTML = "📌";
                pinBtn.title = "解除鎖定 (自動隱藏)";
            } else {
                pinBtn.innerHTML = "🔓";
                pinBtn.title = "釘選選單 (保持展開)";
            }
        });
    }

    // 將展開側欄的邏輯寫成共用函式
    const expandSidebar = () => {
        sidebar.classList.remove("collapsed");
        showSidebarBtn.style.display = "none";
        if (hoverTrigger) hoverTrigger.style.display = "none"; // 展開後將感應區隱藏，避免干擾
    };

    // 1. 滑鼠「移入」漢堡按鈕 或 「整個左邊邊緣」時 -> 展開側欄
    showSidebarBtn.addEventListener("mouseenter", expandSidebar);
    if (hoverTrigger) hoverTrigger.addEventListener("mouseenter", expandSidebar);

    // 2. 滑鼠「移出」整個側欄的範圍時 -> 若「未鎖定」則自動收合
    sidebar.addEventListener("mouseleave", () => {
        if (!isPinned) {
            sidebar.classList.add("collapsed");
            showSidebarBtn.style.display = "flex";
            if (hoverTrigger) hoverTrigger.style.display = "block"; // 恢復邊緣感應區
        }
    });
    // ============================================

    // 記住目前被點擊的連結
    let currentActiveLink = null;

    // 動態生成一層的資料夾結構
    resourceData.forEach((folder) => {
        // 建立資料夾容器
        const folderEl = document.createElement("div");
        folderEl.className = "folder";

        // 建立資料夾標題
        const folderTitle = document.createElement("div");
        folderTitle.className = "folder-title";
        folderTitle.innerHTML = `<span>${folder.icon}</span> &nbsp;${folder.target}`;
        folderEl.appendChild(folderTitle);

        // 資料夾內容容器
        const sheetGroup = document.createElement("div");
        sheetGroup.className = "sub-folder-group";

        // 處理每個 Google Sheet 連結
        folder.sheets.forEach((sheet) => {
            const sheetLinkEl = document.createElement("div");
            sheetLinkEl.className = "sheet-link";
            const defaultText = sheet.url ? sheet.name : `${sheet.name} (尚未加網址)`;
            sheetLinkEl.innerHTML = `📄 ${defaultText}`;

            // 點擊網址事件
            sheetLinkEl.addEventListener("click", (e) => {
                e.stopPropagation();

                if (currentActiveLink) {
                    currentActiveLink.classList.remove("active");
                }
                // 反白選取的項目
                sheetLinkEl.classList.add("active");
                currentActiveLink = sheetLinkEl;

                // 多分頁切換邏輯
                if (sheet.url) {
                    openTab(sheet.name, sheet.url);
                } else {
                    alert(`還沒放上「${sheet.name}」的網址喔！請到 list.js 設定。`);
                }
            });

            sheetGroup.appendChild(sheetLinkEl);
        });

        // 點擊資料夾標題時才展開/收合
        folderTitle.addEventListener("click", () => {
            folderEl.classList.toggle("open");
        });

        // 將內容組裝起來
        folderEl.appendChild(sheetGroup);
        folderTree.appendChild(folderEl);
    });
});
