// ✅ 1회성 토큰 기반 GitHub 배너 등록 시스템
//     - localStorage 없이 매번 토큰 입력
//     - meta.json 업데이트 후 즉시 리로드

// ✅ DOM 로드 후 이벤트 연결
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bannerForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
});

// 📤 Form 제출 핸들러
async function handleFormSubmit(event) {
  event.preventDefault();
  console.log("📌 handleFormSubmit 작동함");
  alert("📌 handleFormSubmit 작동함");

  const token = document.getElementById('tokenInput')?.value.trim();
  console.log("🔐 입력된 토큰:", token);
  alert("🔐 입력된 토큰: " + token);
  if (!token) return alert('❗ GitHub 토큰을 입력해주세요');

  const fileInput = document.getElementById('imageUpload');
  const file = fileInput?.files[0];
  console.log("🖼️ 이미지 선택 여부:", !!file);
  alert("🖼️ 이미지 선택됨: " + (!!file));
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
    console.log("📦 newEntry 객체:", newEntry);
    alert("📦 배너 정보 수집 완료\n파일: " + fileName);

    const repo = 'KIO-LEEYJ/manage_banner';
    const path = 'meta.json';
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;

    // GET meta.json
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) throw new Error('❌ meta.json 불러오기 실패');

    const fileData = await response.json();
    console.log("📥 [응답] meta.json 내용:", fileData);
    alert("📥 meta.json 불러오기 완료 (SHA: " + fileData.sha + ")");
    const currentMeta = JSON.parse(atob(fileData.content));

    currentMeta.push(newEntry);

    const updatedContent = btoa(unescape(encodeURIComponent(JSON.stringify(currentMeta, null, 2))));

    // PUT meta.json 업데이트
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

    const updateText = await updateRes.text();
    console.log("📬 [PUT 응답 본문]:", updateText);
    alert("📬 PUT 응답 수신 완료\n결과: " + updateText.slice(0, 120));
    if (!updateRes.ok) throw new Error('❌ meta.json 업데이트 실패');

    alert('✅ 배너 등록 완료!');
    location.reload();
  } catch (err) {
    console.error(err);
    alert('🚨 오류: ' + err.message);
  }
}
