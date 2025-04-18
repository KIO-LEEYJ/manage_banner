// 🔐 GitHub 토큰 불러오기
function getToken() {
  return localStorage.getItem('gh_token');
}

// ✅ DOM 로드 시 토큰 입력 반영 및 이벤트 바인딩
window.addEventListener('DOMContentLoaded', () => {
  const tokenInput = document.getElementById('tokenInput');
  const storedToken = getToken();
  if (tokenInput && storedToken) tokenInput.value = storedToken;

  const form = document.getElementById('bannerForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  const saveBtn = document.getElementById('saveTokenBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const token = tokenInput.value.trim();
      if (token) {
        localStorage.setItem('gh_token', token);
        alert('🔐 토큰 저장 완료');
      }
    });
  }
});

// 📤 Form 제출 핸들러
async function handleFormSubmit(event) {
  event.preventDefault();

  const token = getToken();
  if (!token) return alert('❗ GitHub 토큰이 없습니다');

  const fileInput = document.getElementById('imageUpload');
  const file = fileInput?.files[0];
  if (!file) return alert('❗ 이미지를 업로드해주세요');

  const fileName = file.name;
  const folder = document.getElementById('folderSelect').value;
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;
  const active = document.getElementById('activeSelect').value === 'true';
  const priority = parseInt(document.getElementById('prioritySelect').value);
  const linkURL = document.getElementById('linkURL').value.trim();

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
    console.log("✅ [디버깅] Form 데이터 수집 완료");
    console.log("🧾 fileName:", fileName);
    console.log("📁 folder:", folder);
    console.log("📅 기간:", start, "~", end);
    console.log("🔘 active:", active, " / 🏷️ priority:", priority);
    console.log("🔗 linkURL:", linkURL);
    console.log("📦 newEntry 객체:", newEntry);
    const repo = 'KIO-LEEYJ/manage_banner';
    const path = 'meta.json';
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;

    console.log("🌐 [요청] meta.json GET 요청 시작:", url);
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) throw new Error('❌ meta.json 불러오기 실패');

    const fileData = await response.json();
    console.log("📥 [응답] meta.json 내용:", fileData);
    const currentMeta = JSON.parse(atob(fileData.content));

    currentMeta.push(newEntry);

    const updatedContent = btoa(unescape(encodeURIComponent(JSON.stringify(currentMeta, null, 2))));

    console.log("📤 [요청] meta.json 업데이트 시작 (PUT)");
    const updateRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `🎯 배너 추가: ${fileName}`,
        content: updatedContent,
        sha: fileData.sha
      })
    });

    console.log("📬 [응답] PUT 결과:", updateRes);
    const updateText = await updateRes.text();
    console.log("📬 [본문] PUT 응답 본문:", updateText);
    if (!updateRes.ok) throw new Error('❌ meta.json 업데이트 실패');

    alert('✅ 배너 등록 완료!');
    location.reload();
  } catch (err) {
    console.error(err);
    alert('🚨 오류: ' + err.message);
  }
}
