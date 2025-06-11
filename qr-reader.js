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
});
