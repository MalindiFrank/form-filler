chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'fillForms') {
    fillForms();
  }
});

function fillForms() {
  chrome.storage.sync.get('profile', function(data) {
    const profile = data.profile || [];
    const profileKeys = profile.map(field => field.key.toLowerCase());
    let newFieldFound = false;

    // Fill known fields
    profile.forEach(field => {
      const key = field.key.toLowerCase();
      const value = field.value;
      const inputs = document.querySelectorAll(`input[name*="${key}" i], input[id*="${key}" i]`);
      inputs.forEach(input => {
        if (input.type !== 'checkbox' && input.type !== 'radio') {
          input.value = value;
        }
      });
    });

    // Find new fields
    const allInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    allInputs.forEach(input => {
      if (newFieldFound) return;

      const inputName = input.name || input.id;
      if (inputName) {
        const inputKey = inputName.toLowerCase();
        if (!profileKeys.some(key => inputKey.includes(key))) {
          chrome.runtime.sendMessage({ action: 'newField', fieldName: inputName });
          newFieldFound = true;
        }
      }
    });
  });
}
