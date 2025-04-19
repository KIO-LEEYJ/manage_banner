const metaURL = "https://kio-leeyj.github.io/manage_banner/meta.json";
const baseImagePath = "https://kio-leeyj.github.io/manage_banner";
const formatDate = (dateStr) => dateStr.replace(/-/g, '.');
const today = new Date();
let banners = [];

fetch(metaURL)
  .then(response => response.json())
  .then(data => {
    banners = data;
    renderAll();
    bindSortAndFilter();
  })
  .catch(error => {
    console.error("배너 데이터를 불러오는 중 오류 발생:", error);
  });

function renderAll() {
  renderSection("A");
  renderSection("B");
}

function bindSortAndFilter() {
  ["A", "B"].forEach(folder => {
    document.getElementById(`sort${folder}`).addEventListener("change", () => renderSection(folder));
    document.getElementById(`filter${folder}`).addEventListener("change", () => renderSection(folder));
  });
}

function renderSection(folder) {
  const container = document.getElementById(`banner${folder}`);
  container.innerHTML = "";

  const sortKey = document.getElementById(`sort${folder}`).value;
  const filterOn = document.getElementById(`filter${folder}`).checked;

  let filtered = banners.filter(b => b.folder === folder);
  if (filterOn) {
    filtered = filtered.filter(b => {
      const start = new Date(b.start);
      const end = new Date(b.end);
      return start <= today && today <= end;
    });
  }

  filtered.sort((a, b) => {
    if (sortKey === "priority") return a.priority - b.priority;
    if (sortKey === "start") return new Date(b.start) - new Date(a.start);
    if (sortKey === "end") return new Date(a.end) - new Date(b.end);
    return 0;
  });

  filtered.forEach(banner => {
    const card = document.createElement("div");
    card.className = "border rounded-lg p-4 shadow bg-white relative";

    const startDate = new Date(banner.start);
    const endDate = new Date(banner.end);
    const isExpired = today > endDate;
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    if (isExpired) card.classList.add("opacity-50");

    if (remainingDays <= 5 && remainingDays >= 0) {
      card.classList.add("border-red-500");
    }

    const badge = document.createElement("span");
    badge.textContent = isExpired ? "종료됨" : "노출 중";
    badge.className = `absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded ${
      isExpired ? "bg-gray-400 text-white" : "bg-green-500 text-white"
    }`;
    card.appendChild(badge);

    const img = document.createElement("img");
    img.src = `${baseImagePath}/${banner.folder}/${banner.file}?v=${Date.now()}`;
    img.alt = banner.file;
    img.className = "w-full h-auto mb-3 rounded";
    img.onerror = () => {
      img.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
    };

    const fileName = document.createElement("p");
    fileName.className = "text-sm font-bold mb-1";
    fileName.textContent = `파일명: ${banner.file}`;

    const priority = document.createElement("p");
    priority.className = "text-sm text-gray-700 mb-1";
    priority.textContent = `우선순위: ${banner.priority}`;

    const dateRange = document.createElement("p");
    dateRange.className = "text-sm text-gray-700 mb-1";
    dateRange.textContent = `기간: ${formatDate(banner.start)} ~ ${formatDate(banner.end)}`;

    const exposure = document.createElement("p");
    exposure.className = "text-sm text-gray-700 mb-1";
    exposure.textContent = `노출기간: ${totalDays}일`;

    const remain = document.createElement("p");
    remain.className = "text-sm text-gray-700 mb-1";
    remain.textContent = isExpired ? "남은기간: 종료됨" : `남은기간: ${remainingDays}일`;

    const link = document.createElement("a");
    link.href = banner.linkURL;
    link.target = "_blank";
    link.className = "text-sm text-blue-500 underline";
    link.textContent = "링크 바로가기";

    card.appendChild(img);
    card.appendChild(fileName);
    card.appendChild(priority);
    card.appendChild(dateRange);
    card.appendChild(exposure);
    card.appendChild(remain);
    card.appendChild(link);

    container.appendChild(card);
  });
}
