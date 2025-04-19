<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>배너 미리보기</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
</head>

<body class="bg-gray-100 text-gray-800">
  <div class="max-w-5xl mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold mb-8">🎯 배너 미리보기 (meta.json 기반)</h1>

    <section>
      <h2 class="text-xl font-semibold mb-2">🅰️ A 배너</h2>
      <div id="bannerA" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"></div>
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-2">🅱️ B 배너</h2>
      <div id="bannerB" class="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
    </section>
  </div>

  <script src="preview.js"></script>
  <script>
    const metaURL = "https://kio-leeyj.github.io/manage_banner/meta.json";
    const baseImagePath = "https://kio-leeyj.github.io/manage_banner/BANNER";
    const formatDate = (dateStr) => dateStr.replace(/-/g, '.');
    const today = new Date();

    fetch(metaURL)
      .then(response => response.json())
      .then(data => {
        data.forEach(banner => {
          const container = banner.folder === "A" ? document.getElementById("bannerA") : document.getElementById("bannerB");

          const card = document.createElement("div");
          card.className = "border rounded-lg p-4 shadow bg-white relative";

          const endDate = new Date(banner.end);
          const isExpired = today > endDate;
          if (isExpired) {
            card.classList.add("opacity-50");
          }

          const badge = document.createElement("span");
          badge.textContent = isExpired ? "종료됨" : "노출 중";
          badge.className = `absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded ${
            isExpired ? "bg-gray-400 text-white" : "bg-green-500 text-white"
          }`;
          card.appendChild(badge);

          const img = document.createElement("img");
          img.src = `${baseImagePath}/${banner.folder}/${banner.file}`;
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

          const link = document.createElement("a");
          link.href = banner.linkURL;
          link.target = "_blank";
          link.className = "text-sm text-blue-500 underline";
          link.textContent = "링크 바로가기";

          card.appendChild(img);
          card.appendChild(fileName);
          card.appendChild(priority);
          card.appendChild(dateRange);
          card.appendChild(link);

          container.appendChild(card);
        });
      })
      .catch(error => {
        console.error("배너 데이터를 불러오는 중 오류 발생:", error);
      });
  </script>
</body>

</html>
