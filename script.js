// =========================================================================
// 全域變數與初始化
// =========================================================================

// 匯率設定 (因為 GitHub Pages/本地檔案無法直接存取外部 API，我們提供查詢連結)
const BASE_CURRENCY = 'TWD'; // 基礎貨幣：台幣
const TARGET_CURRENCY = 'JPY'; // 目標貨幣：日圓
// 預設匯率 (1 TWD 可換多少 JPY)
const defaultExchangeRate = 4.5; 

// 住宿清單 - 包含詳細資訊
const accommodations = [
    {
        name: "名古屋站前大和roynet飯店",
        day: "Day 1, 2",
        address: "〒450-0002 愛知県名古屋市中村区名駅4-25-10",
        phone: "+81 52-581-4545",
        checkIn: "15:00",
        checkOut: "10:00",
        notes: "近名古屋站櫻通口，交通便利。**早餐很推薦**。",
        nearby: [
            { name: "7-Eleven (近飯店出口)", distance: "步行 1 分鐘", mapLink: "https://maps.app.goo.gl/abcdefg1" },
            { name: "Lawson (站前地下街)", distance: "步行 3 分鐘", mapLink: "https://maps.app.goo.gl/abcdefg2" }
        ],
        mapUrl: "https://maps.app.goo.gl/S4p7xH7D3L3Vw" 
    },
    {
        name: "金星Neo飯店 (Hotel Kinjo Neo)",
        day: "Day 3",
        address: "〒460-0012 愛知県名古屋市中区千代田1-3-11",
        phone: "+81 52-251-2222",
        checkIn: "16:00",
        checkOut: "10:00",
        notes: "近地鐵鶴舞站。房間較小，但價格實惠，安靜。",
        nearby: [
            { name: "FamilyMart (鶴舞公園前)", distance: "步行 2 分鐘", mapLink: "https://maps.app.goo.gl/abcdefg3" }
        ],
        mapUrl: "https://maps.app.goo.gl/X9yWvY7D3L3Vw" 
    },
    {
        name: "Dormy Inn PREMIUM Sakae",
        day: "Day 4",
        address: "〒460-0008 愛知県名古屋市中区栄3-25-20",
        phone: "+81 52-243-5777",
        checkIn: "15:00",
        checkOut: "11:00",
        notes: "有天然溫泉大浴場、免費提供**宵夜醬油拉麵** (21:30~23:00)。",
        nearby: [
            { name: "7-Eleven (飯店旁)", distance: "步行 1 分鐘", mapLink: "https://maps.app.goo.gl/abcdefg4" },
            { name: "松坂屋百貨", distance: "步行 5 分鐘", mapLink: "https://maps.app.goo.gl/abcdefg5" }
        ],
        mapUrl: "https://maps.app.goo.gl/D7eS9Y7D3L3Vw" 
    }
];


// =========================================================================
// 核心函式：Tab 切換與日期切換
// =========================================================================

function switchTab(targetViewId) {
    // 隱藏所有主要內容區塊
    document.querySelectorAll('#main-content > div').forEach(view => {
        view.classList.remove('active-view');
        view.classList.add('view-hidden');
    });

    // 顯示目標區塊
    const targetView = document.getElementById(targetViewId);
    if (targetView) {
        targetView.classList.add('active-view');
        targetView.classList.remove('view-hidden');
    }

    // 更新底部導航按鈕的 active 狀態
    document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
        if (btn.onclick.toString().includes(`'${targetViewId.replace('-view', '')}'`)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 如果切換到 info-view，確保住宿清單被渲染
    if (targetViewId === 'info-view') {
        renderAccommodations();
        updateExchangeRateDisplay();
    }
}

function showDay(dayId) {
    // 隱藏所有行程內容
    document.querySelectorAll('.day-content').forEach(day => {
        day.classList.remove('active');
    });

    // 顯示目標日期內容
    const targetDay = document.getElementById(dayId);
    if (targetDay) {
        targetDay.classList.add('active');
    }

    // 更新日期按鈕的 active 狀態
    document.querySelectorAll('.day-tabs .day-btn').forEach(btn => {
        if (btn.onclick.toString().includes(`'${dayId}'`)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}


// =========================================================================
// 資訊頁面函式 (匯率與住宿)
// =========================================================================

/**
 * 渲染詳細住宿清單
 */
function renderAccommodations() {
    const container = document.getElementById('accommodation-detail-container'); 
    if (!container) return;

    // 清空舊內容
    container.innerHTML = '';

    accommodations.forEach(hotel => {
        // 鄰近超商/設施的 HTML
        let nearbyHtml = hotel.nearby.map(place => `
            <li>
                <i class="fas fa-store-alt"></i> ${place.name} 
                (<span style="font-weight: bold;">${place.distance}</span>) 
                <a href="${place.mapLink}" target="_blank" style="color: #007bff; text-decoration: none;">
                    <i class="fas fa-map-marker-alt"></i> (地圖)
                </a>
            </li>
        `).join('');

        const hotelCard = document.createElement('div');
        hotelCard.className = 'info-card hotel-card'; // 使用 info-card 保持風格
        hotelCard.innerHTML = `
            <h2><i class="fas fa-hotel"></i> ${hotel.name}</h2>
            <p style="font-size: 0.9em; color: #666; margin-top: -5px;">適用行程: ${hotel.day}</p>

            <div class="info-group">
                <h3><i class="fas fa-map-marker-alt"></i> 地址與地圖</h3>
                <p>${hotel.address}</p>
                <p><strong>電話:</strong> ${hotel.phone}</p>
                <a href="${hotel.mapUrl}" target="_blank" class="map-btn" style="display: block; width: 100%; text-align: center; margin-top: 10px;">
                    <i class="fas fa-route"></i> 導航至此飯店
                </a>
            </div>

            <div class="info-group">
                <h3><i class="fas fa-calendar-alt"></i> 入住/退房時間</h3>
                <p><strong>入住 (Check-in):</strong> ${hotel.checkIn}</p>
                <p><strong>退房 (Check-out):</strong> ${hotel.checkOut}</p>
            </div>
            
            <div class="info-group">
                <h3><i class="fas fa-clipboard-list"></i> 備註與特色</h3>
                <p>${hotel.notes}</p>
            </div>

            <div class="info-group">
                <h3><i class="fas fa-store-alt"></i> 鄰近設施</h3>
                <ul class="nearby-list" style="list-style-type: none; padding-left: 0;">
                    ${nearbyHtml}
                </ul>
            </div>
            
        `;
        container.appendChild(hotelCard);
    });
}


/**
 * 顯示匯率查詢資訊
 */
function updateExchangeRateDisplay() {
    const container = document.getElementById('currency-display');
    if (!container) return;

    // 清空舊內容
    container.innerHTML = ''; 

    const linkElement = document.createElement('p');
    linkElement.id = 'exchange-rate-link';
    linkElement.innerHTML = `
        <i class="fas fa-info-circle"></i> 匯率會變動，建議每日確認。<br>
        <span style="color: #007bff; font-weight: bold;">目前預設估算約 ${defaultExchangeRate.toFixed(2)} 日圓/台幣。</span>
        <a href="https://www.google.com/search?q=${BASE_CURRENCY}+to+${TARGET_CURRENCY}+exchange+rate" target="_blank" class="map-btn" style="margin-top: 10px; display: block;">
            <i class="fas fa-external-link-alt"></i> 點此查詢今日即時匯率 (Google)
        </a>
    `;
    container.appendChild(linkElement);
}


// =========================================================================
// 應用程式啟動
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 首次載入時，確保第一個日期顯示
    showDay('day1'); 
    
    // 預先載入住宿和匯率資訊 (即使在行程頁面)
    renderAccommodations();
    updateExchangeRateDisplay();

    // 綁定底部導航列的事件監聽器
    document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
        const targetViewId = btn.onclick.toString().match(/'([^']*)'/)[1] + '-view';
        btn.addEventListener('click', () => switchTab(targetViewId));
    });
});
