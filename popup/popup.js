document.addEventListener('DOMContentLoaded', function() {
  const fieldsContainer = document.getElementById('fields-container');
  const addFieldButton = document.getElementById('add-field');
  const saveProfileButton = document.getElementById('save-profile');

  // Function to render a single field
  function renderField(field = { key: '', value: '' }) {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'field';
    fieldDiv.innerHTML = `
      <input type="text" class="key" placeholder="Field Name" value="${field.key}">
      <input type="text" class="value" placeholder="Field Value" value="${field.value}">
      <button class="delete-field">Delete</button>
    `;
    fieldsContainer.appendChild(fieldDiv);

    // Add event listener to the delete button
    fieldDiv.querySelector('.delete-field').addEventListener('click', function() {
      fieldDiv.remove();
    });
  }

  // Load profile from storage and render the fields
  chrome.storage.sync.get('profile', function(data) {
    if (data.profile) {
      data.profile.forEach(field => renderField(field));
    }
  });

  // Check for a new field suggestion
  chrome.storage.local.get('newField', function(data) {
    if (data.newField) {
      renderField({ key: data.newField, value: '' });
      chrome.storage.local.remove('newField');
    }
  });

  // Add a new field
  addFieldButton.addEventListener('click', function() {
    renderField();
  });

  // Save the profile
  saveProfileButton.addEventListener('click', function() {
    const fields = [];
    document.querySelectorAll('.field').forEach(fieldDiv => {
      const key = fieldDiv.querySelector('.key').value;
      const value = fieldDiv.querySelector('.value').value;
      if (key) {
        fields.push({ key, value });
      }
    });
    chrome.storage.sync.set({ profile: fields }, function() {
      console.log('Profile saved');
    });
  });

  // Send a message to fill forms
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'fillForms' });
  });
});
