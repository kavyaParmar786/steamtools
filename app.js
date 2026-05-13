/* STRAW HAT — APP.JS */
document.addEventListener('DOMContentLoaded', () => {
  // Doodle previews init (mini versions for showcase section)
  if (document.getElementById('doodle-1')) {
    setTimeout(initDoodlePreviews, 80);
  }
  // initCounters + initDoodleCanvas called by shared.js already
});
