// 切換日期 Tab
function showDay(dayId) {
    // 隱藏所有日期內容
    document.querySelectorAll('.day-content').forEach(el => {
        el.classList.remove('active');
    });
    // 移除所有按鈕的 active 狀態
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 顯示選中的日期
    document.getElementById(dayId).classList.add('active');
    
    // 將對應按鈕設為 active (需要透過 event 獲取，這裡簡化處理)
    const btnMap = {
        'day1': 0, 'day2': 1, 'day3': 2, 'day4': 3, 'day5': 4
    };
    document.querySelectorAll('.day-btn')[btnMap[dayId]].classList.add('active');
}

// 切換底部主選單 (行程 vs 工具)
function switchTab(tabName) {
    const itineraryView = document.getElementById('itinerary-view');
    const infoView = document.getElementById('info-view');
    const btns = document.querySelectorAll('.nav-btn');

    if (tabName === 'itinerary') {
        itineraryView.style.display = 'block';
        infoView.style.display = 'none';
        btns[0].classList.add('active');
        btns[1].classList.remove('active');
    } else {
        itineraryView.style.display = 'none';
        infoView.style.display = 'block';
        btns[0].classList.remove('active');
        btns[1].classList.add('active');
    }
    
    // 捲動到頂部
    window.scrollTo(0,0);
}

// 匯率換算 (固定匯率版，避免 API 複雜度，可手動調整)
function convertCurrency() {
    const rate = 0.22; // 假設匯率，出發前可修改
    const jpy = document.getElementById('jpy-input').value;
    const twd = Math.round(jpy * rate);
    document.getElementById('twd-output').innerText = `約 ${twd} TWD`;
}
