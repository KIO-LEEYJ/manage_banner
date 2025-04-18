const metaPath = './meta.json';

function getImageURL(item) {
  return `https://github.com/KIO-LEEYJ/manage_banner/blob/main/${item.folder}/${item.file}?raw=true`;
}

function createCard(item) {
  const container = document.createElement('div');
  container.className = 'bg-white rounded-xl shadow-md p-4';

  const image = document.createElement('img');
  image.src = getImageURL(item);
  image.alt = item.file;
  image.className = 'w-full h-48 object-cover rounded mb-4';

  const name = document.createElement('p');
  name.className = 'font-bold';
  name.textContent = `파일명: ${item.file}`;

  const period = document.createElement('p');
  period.textContent = `노출: ${item.start} ~ ${item.end}`;

  const priority = document.createElement('p');
  priority.textContent = `우선순위: ${item.priority}`;

  const link = document.createElement('a');
  link.href = item.linkURL;
  link.target = '_blank';
  link.className = 'text-blue-600 underline';
  link.textContent = '🔗 링크 확인';

  container.appendChild(image);
  container.appendChild(name);
  container.appendChild(period);
  container.appendChild(priority);
  container.appendChild(link);

  return container;
}

fetch(metaPath)
  .then(res => res.json())
  .then(data => {
    const now = new Date();
    const bannerA = document.getElementById('bannerA');
    const bannerB = document.getElementById('bannerB');

    data.forEach(item => {
      const start = new Date(item.start);
      const end = new Date(item.end);

      if (!item.active || now < start || now > end) return;

      const card = createCard(item);
      if (item.folder === 'A') bannerA.appendChild(card);
      else if (item.folder === 'B') bannerB.appendChild(card);
    });
  })
  .catch(err => {
    console.error('🚨 meta.json 불러오기 실패:', err);
  });
