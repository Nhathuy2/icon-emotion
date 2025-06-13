// Cấu hình ứng dụng
const EMOTIONS = {
  happy: { icon: "far fa-laugh-beam", name: "Vui vẻ", color: "#4CAF50" },
  sad: { icon: "far fa-sad-tear", name: "Buồn", color: "#2196F3" },
  angry: { icon: "far fa-angry", name: "Giận dữ", color: "#F44336" },
  normal: { icon: "far fa-meh", name: "Bình thường", color: "#E91E63" },
  awful: { icon: "far fa-frown", name: "Tồi tệ", color: "#9C27B0" },
};

// Từng lời nói cho cảm xúc
const EMOTION_MESSAGES = {
  happy: [
    "Thật tuyệt! Hãy giữ vững năng lượng tích cực nhé! 😊",
    "Một ngày tràn đầy niềm vui! Tiếp tục lan toả nhé!",
    "Bạn đang làm rất tốt, hãy mỉm cười nhiều hơn nữa! 🌈",
  ],
  sad: [
    "Hãy cố gắng lên, mọi chuyện rồi sẽ ổn. 🤗",
    "Bạn không cô đơn đâu. Luôn có người bên bạn.",
    "Buồn là một phần của cuộc sống. Hãy nhẹ nhàng với chính mình nhé!",
  ],
  angry: [
    "Thư giãn một chút nhé. Hãy hít sâu và thở ra thật chậm.",
    "Giận cũng được, nhưng đừng quên yêu thương bản thân mình.",
    "Mọi chuyện rồi sẽ trôi qua. Bạn sẽ ổn thôi!",
  ],
  awful: [
    "Hôm nay thật tồi tệ đúng không? Nhưng ngày mai sẽ khác!",
    "Hãy dành thời gian nghỉ ngơi và yêu thương bản thân.",
    "Bạn mạnh mẽ hơn bạn nghĩ đấy!",
  ],
  normal: [
    "Một ngày bình thường cũng rất đáng trân trọng. ☁️",
    "Bình yên là món quà tuyệt vời nhất!",
    "Không sao cả, cứ nhẹ nhàng trôi theo ngày hôm nay nhé.",
  ],
};

// Dữ liệu ứng dụng
let emotionHistory = JSON.parse(localStorage.getItem("emotionHistory")) || [];
let appState = JSON.parse(localStorage.getItem("appState")) || {
  person1: [],
  person2: [],
};

// Khởi tạo biểu đồ với chiều cao cố định
const emotionChart = new Chart(document.getElementById("emotionChart"), {
  type: "bar",
  data: {
    labels: Object.values(EMOTIONS).map((e) => e.name),
    datasets: [
      {
        label: "Tỉ lệ cảm xúc (%)",
        data: [25, 15, 10, 30, 20],
        backgroundColor: Object.values(EMOTIONS).map((e) => e.color),
        borderWidth: 0,
        barThickness: 25,
      },
    ],
  },
  options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  },
});

// Tạo hiệu ứng particle background
function createParticles(emotion) {
  const container = document.body;

  const emojiMap = {
    happy: "❤️",
    sad: "💧",
    angry: "🔥",
    normal: "☁️",
    awful: "💔",
  };

  const icon = emojiMap[emotion] || "✨";

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.innerHTML = icon;

    // Vị trí & hiệu ứng ngẫu nhiên
    const scale = Math.random() * 0.6 + 0.8;
    particle.style.transform = `scale(${scale})`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 20 + 10}s`;

    container.appendChild(particle);

    // Tự xoá sau 15–30s
    setTimeout(() => {
      particle.remove();
    }, 20000);
  }
}

// Cập nhật giao diện khi tải trang
function updateUI() {
  // Cập nhật bình cảm xúc
  updateJar("person1", appState.person1);
  updateJar("person2", appState.person2);
  renderHistory();
}

// Cập nhật nội dung bình cảm xúc
function updateJar(personId, emotions) {
  const jarContent = document.getElementById(
    `jar-content${personId === "person1" ? "1" : "2"}`
  );
  jarContent.innerHTML = "";

  if (emotions.length === 0) {
    jarContent.innerHTML =
      '<div class="empty-message">Chưa có cảm xúc nào</div>';
    return;
  }

  // Hiển thị các cảm xúc trong bình
  const lastEmotions = emotions.slice(-30);
  lastEmotions.forEach((emotion) => {
    const emotionEl = document.createElement("div");
    emotionEl.className = "emotion-item";
    emotionEl.innerHTML = `<i class="${EMOTIONS[emotion].icon}"></i>`;
    jarContent.appendChild(emotionEl);
    setTimeout(() => {
      jarContent.scrollTop = jarContent.scrollHeight;
    }, 0);
  });
}

// Thêm cảm xúc vào bình
function addEmotionToJar(personId, emotion) {
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);

  // Kiểm tra xem người này đã ghi hôm nay chưa
  const alreadyLogged = emotionHistory.some(
    (entry) =>
      entry.person === personId &&
      new Date(entry.timestamp).toISOString().slice(0, 10) === todayKey
  );

  if (alreadyLogged) {
    alert(
      "Bạn đã ghi nhận cảm xúc hôm nay rồi 😊\nHãy quay lại vào ngày mai nhé!"
    );
    return;
  }
  let reason = prompt("Hôm nay bạn cảm thấy thế vì lý do gì?");
  if (reason === null || reason.trim() === "") {
    alert(
      "Bạn chưa nhập lý do. Vui lòng nhập lý do để ghi nhận cảm xúc của bạn."
    );
    return;
  }
  reason = reason.trim();

  // Ghi cảm xúc mới
  emotionHistory.push({
    person: personId,
    emotion: emotion,
    timestamp: now.getTime(),
    reason: reason,
  });

  // Cập nhật appState với 1 cảm xúc/ngày
  const perDayMap = {};
  const filtered = emotionHistory
    .filter((e) => e.person === personId)
    .sort((a, b) => a.timestamp - b.timestamp);

  filtered.forEach((entry) => {
    const date = new Date(entry.timestamp).toISOString().slice(0, 10);
    perDayMap[date] = entry.emotion;
  });

  appState[personId] = Object.values(perDayMap).slice(-31);

  // ✅ Nếu đã đủ 30 ngày, thì reset sạch cho người đó
  if (appState[personId].length >= 30) {
    alert(
      "Bạn đã hoàn thành 30 ngày cảm xúc! 🎉 Bình sẽ được làm mới từ hôm nay."
    );
    appState[personId] = [];
    emotionHistory = emotionHistory.filter(
      (entry) => entry.person !== personId
    );
  }

  // Cập nhật lại giao diện và lưu
  createFallingEmotion(emotion, personId);
  createParticles(emotion);
  // Hiện thị lời nói phù hợp vs cảm xúc
  const message = EMOTION_MESSAGES[emotion];
  if (message && message.length > 0) {
    const randomMsg = message[Math.floor(Math.random() * message.length)];
    setTimeout(() => {
      alert(randomMsg);
    }, 300);
  }
  saveData();
  updateJar(personId, appState[personId]);
  renderHistory();
}

// Tạo hiệu ứng cảm xúc rơi
function createFallingEmotion(emotion, personId) {
  const emotionEl = document.createElement("div");
  emotionEl.className = "falling-emotion";
  emotionEl.innerHTML = `<i class="${EMOTIONS[emotion].icon}"></i>`;

  // Tính toán vị trí bắt đầu (ngẫu nhiên ở trên cùng)
  const startX = Math.random() * window.innerWidth;
  emotionEl.style.left = `${startX}px`;
  emotionEl.style.top = "-50px";

  document.body.appendChild(emotionEl);

  // Xóa sau khi animation kết thúc
  setTimeout(() => {
    emotionEl.remove();
  }, 1000);
}

// Lưu dữ liệu vào localStorage
function saveData() {
  localStorage.setItem("appState", JSON.stringify(appState));
  localStorage.setItem("emotionHistory", JSON.stringify(emotionHistory));
}

// Tính toán thống kê
function calculateStats(person, month) {
  // Lọc dữ liệu theo người và tháng
  const filtered = emotionHistory.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    return (
      (person === "both" ||
        (person === "person1" && entry.person === "person1") ||
        (person === "person2" && entry.person === "person2")) &&
      (month === null || entryDate.getMonth() === parseInt(month))
    );
  });

  // Tính tổng số cảm xúc
  const total = filtered.length;
  if (total === 0) return null;

  // Tính phần trăm từng cảm xúc
  const stats = {};
  Object.keys(EMOTIONS).forEach((emotion) => {
    const count = filtered.filter((e) => e.emotion === emotion).length;
    stats[emotion] = Math.round((count / total) * 100);
  });

  return stats;
}

// Cập nhật biểu đồ
function updateCharts() {
  const person = document.getElementById("personSelect").value;
  const month = document.getElementById("monthSelect").value;

  const stats = calculateStats(person, month);

  if (!stats) {
    alert("Không có dữ liệu thống kê cho lựa chọn này");
    return;
  }

  // Cập nhật biểu đồ
  emotionChart.data.datasets[0].data = Object.values(stats);
  emotionChart.update();
}

// Xử lý sự kiện khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  createParticles();
  updateUI();

  // Xử lý sự kiện nút cảm xúc
  document.querySelectorAll(".emotion-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const emotion = button.dataset.emotion;
      const personId = button.dataset.person;
      addEmotionToJar(personId, emotion);
    });
  });

  // Xử lý nút hiển thị thống kê
  document.getElementById("showStats").addEventListener("click", updateCharts);

  // Thiết lập tháng hiện tại trong dropdown
  const currentMonth = new Date().getMonth();
  document.getElementById("monthSelect").value = currentMonth;

  // Hiển thị dữ liệu mẫu ban đầu
  if (emotionHistory.length === 0) {
    emotionChart.update();
  }
});

// Xóa dữ liệu
document.getElementById("resetAll").addEventListener("click", () => {
  if (confirm("Bạn có chắc muốn xóa toàn bộ cảm xúc và thống kê?")) {
    // Xóa dữ liệu trong bộ nhớ
    appState = {
      person1: [],
      person2: [],
    };
    emotionHistory = [];

    // Lưu lại rỗng vào localStorage
    saveData();

    // Cập nhật lại giao diện
    updateUI();
    renderHistory();

    // Làm trống biểu đồ
    emotionChart.data.datasets[0].data = [0, 0, 0, 0, 0];
    emotionChart.update();
  }
});

function renderHistory() {
  const container = document.getElementById("emotionHistoryList");
  container.innerHTML = "";

  if (emotionHistory.length === 0) {
    container.innerHTML =
      '<div class="empty-message">Chưa có biểu cảm nào</div>';
    return;
  }

  // Hiển thị từ mới nhất xuống cũ hơn
  [...emotionHistory].reverse().forEach((entry) => {
    const emotion = EMOTIONS[entry.emotion];
    const time = new Date(entry.timestamp).toLocaleString("vi-VN");
    const who = entry.person === "person1" ? "Trần Nhật Huy" : "Đinh Nhất Ngọc";

    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
                    <i class="${emotion.icon}" style="color:${
      emotion.color
    }"></i>
                    <div>
                        <div><strong>${who}</strong> - ${
      emotion.name
    }</div>          
                        <div style="font-size: 0.85rem; color: #607d8b; margin-left: 20px;">
                            ${entry.reason || "<em>Không ghi lý do</em>"}
                        </div>
                    </div>
                    <span class="time">${time}</span>
                `;
    container.appendChild(div);
  });
}
