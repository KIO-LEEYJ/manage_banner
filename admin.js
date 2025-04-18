// 🔐 GitHub 토큰 저장
function saveToken() {
  const tokenInput = document.getElementById('tokenInput');
  if (tokenInput && tokenInput.value) {
    localStorage.setItem('gh_token', tokenInput.value.trim());
    alert('🔐 토큰이 저장되었습니다!');
  } else {
    alert('❗ 토큰을 입력해주세요.');
  }
}

// 🔐 GitHub 토큰 불러오기
function getToken() {
  return localStorage.getItem('gh_token');
}

// ✅ 페이지 로드시 토큰 자동 세팅
window.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  const tokenInput = document.getElementById('tokenInput');
  if (token && tokenInput) {
    tokenInput.value = token;
  }

  const form = document.getElementById('bannerForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
});

// 📤 Form 제출 핸들러
async function handleFormSubmit(event) {
  event.preventDefault();

  const token = getToken();
  if (!token) return alert('❗ GitHub 토큰이 없습니다.');

  const fileInput = document.getElementById('imageUpload');
  const folder = document.getElementById('folderSelect').value;
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;
  const active = document.getElementById('activeSelect').value === 'true';
  const priority = parseInt(document.getElementById('prioritySelect').value);
  const linkURL = document.getElementById('linkURL').value.trim();

  if (!fileInput.files.length) return alert('❗ 이미지를 업로드해주세요.');
  const file = fileInput.files[0];
  const fileName = file.name;

  const newEntry = {
    file: fileName,
    folder,
    start,
    end,
    active,
    priority,
    linkURL
  };

  try {
    const repo = 'KIO-LEEYJ/manage_banner';
    const path = 'meta.json';
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (!res.ok) throw new Error('meta.json을 불러오지 못했습니다.');

    const fileData = await res.json();
    const content = JSON.parse(atob(fileData.content));
    content.push(newEntry);

    const updatedContent = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));

    const updateRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `✨ 배너 추가: ${fileName}`,
        content: updatedContent,
        sha: fileData.sha
      })
    });

    if (!updateRes.ok) throw new Error('meta.json 업데이트 실패');

    alert('✅ 배너가 성공적으로 등록되었습니다!');
    location.reload();
  } catch (err) {
    console.error(err);
    alert('🚨 오류 발생: ' + err.message);
  }
}
