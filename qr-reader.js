// member.js
function formatDateLong(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function showProfile(data) {
  // Instead of rendering, redirect to profile.html and pass memberId in query string
  if (data && data.memberId) {
    // Save the profile to the set (in case it's not already saved)
    saveProfileToSet(data);
    window.location.href = 'profile.html?memberId=' + encodeURIComponent(data.memberId);
    return;
  }
}

function clearProfile() {
  localStorage.removeItem('memberProfile');
  location.reload();
}

function saveProfileToSet(profile) {
  let profiles = {};
  try {
    profiles = JSON.parse(localStorage.getItem('memberProfiles') || '{}');
  } catch {}
  if (profile.memberId) {
    profiles[profile.memberId] = profile;
    localStorage.setItem('memberProfiles', JSON.stringify(profiles));
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('clearProfileBtn').onclick = clearProfile;

  const saved = localStorage.getItem('memberProfile');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      showProfile(data);
      return;
    } catch {
      localStorage.removeItem('memberProfile');
    }
  }

  // Use html5-qrcode for scanning (like log.html)
  const scannerDiv = document.getElementById('qrScanner');
  scannerDiv.style.display = '';
  scannerDiv.innerHTML = '';
  const html5Qr = new Html5QrcodeScanner(
    'qrScanner',
    { fps: 10, qrbox: 220 }
  );
  html5Qr.render(
    function onScanSuccess(decodedText, decodedResult) {
      try {
        const data = JSON.parse(decodedText);
        console.log('QR code data:', data); // Log the values read from the QR
        saveProfileToSet(data);
        showProfile(data);
        html5Qr.clear();
      } catch {
        scannerDiv.innerHTML = '<span style="color:red;">Invalid QR code.</span>';
      }
    },
    function onScanFailure(error) {}
  );
});
