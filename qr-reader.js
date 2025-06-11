// member.js
function formatDateLong(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function showProfile(data) {
    console.log('Displaying profile:', data); // Log the values read from the QR
  document.getElementById('scanner-section').style.display = 'none';
  document.getElementById('profile-section').style.display = '';
  const detailsDiv = document.getElementById('profileDetails');
  const isNonMember = (data.memberType || '').toLowerCase() === 'non-member';
  detailsDiv.innerHTML = `
    <div style="text-align:center; margin-bottom:18px;">
      ${data.gymLogoLink ? `<img src="${data.gymLogoLink}" alt="Gym Logo" style="max-width:120px;max-height:120px;border-radius:10px;box-shadow:0 2px 8px #0002;" />` : ''}
    </div>
    <div class="profile-row" style="font-size:22px;font-weight:bold;text-align:center;">
      ${data.gymName ? (data.gymWebsite ? `<a href="${data.gymWebsite}" target="_blank" style="color:#1e90ff;text-decoration:none;">${data.gymName}</a>` : data.gymName) : ''}
    </div>
    <hr style="margin:18px 0;">
    <div class="profile-row"><b>${isNonMember ? 'Name' : 'Member Name'}:</b> ${data.memberName || ''}</div>
    <div class="profile-row"><b>${isNonMember ? 'ID' : 'Member ID'}:</b> ${data.memberId || ''}</div>
    <div class="profile-row"><b>${isNonMember ? 'Type' : 'Member Type'}:</b> ${data.memberType || ''}</div>
    <div class="profile-row"><b>Access Renewal Date:</b> ${formatDateLong(data.accessRenewalDate) || ''}</div>
    <div class="profile-row"><b>Subscription Type:</b> ${data.accessSubscriptionType || ''}</div>
    ${isNonMember
      ? `<div class="profile-row" style="margin-top:18px; color:#1e90ff; font-size:18px; font-weight:bold; text-align:center;">🌟 Ready to level up? Visit our friendly front desk and become a member today! Your fitness journey starts with a smile. 🌟</div>`
      : `<div class="profile-row"><b>Membership Expiration:</b> ${formatDateLong(data.memberShipExpirationDate || data.membershipExpiration) || ''}</div>`
    }
  `;
  // Render QR code for 5-digit memberId
  const qrContainer = document.getElementById('memberQrContainer');
  qrContainer.innerHTML = '';
  qrContainer.style.width = '100%';
  if (window.QRCode && data.memberId && /^\d{5}$/.test(data.memberId)) {
    const canvas = document.createElement('canvas');
    qrContainer.appendChild(canvas);
    QRCode.toCanvas(canvas, data.memberId, { width: 140, margin: 2 }, function (err) {
      if (err) {
        qrContainer.innerHTML = '<span style="color:red;">QR code generation failed</span>';
      }
    });
    const label = document.createElement('div');
    label.style = 'margin-top:8px; font-size:15px; color:#555;';
    label.textContent = 'Login QR';
    qrContainer.appendChild(label);
  }
}

function clearProfile() {
  localStorage.removeItem('memberProfile');
  location.reload();
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
  // Fix: Use correct config for Html5QrcodeScanner (third param is not needed)
  const html5Qr = new Html5QrcodeScanner(
    'qrScanner',
    { fps: 10, qrbox: 220 }
  );
  html5Qr.render(
    function onScanSuccess(decodedText, decodedResult) {
      try {
        const data = JSON.parse(decodedText);
        console.log('QR code data:', data); // Log the values read from the QR
        localStorage.setItem('memberProfile', JSON.stringify(data));
        showProfile(data);
        html5Qr.clear();
      } catch {
        scannerDiv.innerHTML = '<span style="color:red;">Invalid QR code.</span>';
      }
    },
    function onScanFailure(error) {}
  );
});
