import * as accounts from './accounts.js';

const $ = selector => document.querySelector(selector);
const usernameField = '<label for="account-username">Username</label><input id="account-username" required minlength="3" maxlength="30" pattern="[A-Za-z0-9_]+" autocomplete="username" autocapitalize="none" spellcheck="false" aria-describedby="username-help"><p id="username-help">3–30 letters, numbers, or underscores. Capitalization does not matter.</p>';
const emailField = '<label for="account-email">Email</label><input id="account-email" type="email" required autocomplete="email">';

function bindSubmit(action) {
  $('#auth-form').onsubmit = async event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const buttons = [...$('#modal-content').querySelectorAll('button')];
    const error = $('#auth-error');
    error.textContent = '';
    buttons.forEach(button => button.disabled = true);
    try { await action(); }
    catch (reason) { error.textContent = reason.message || 'Please try again.'; }
    finally { buttons.forEach(button => button.disabled = false); }
  };
}

export function showUsernameSetup(modal) {
  modal('<h2>Choose your username</h2><p>Your existing account and progress stay with you. Choose a unique username for future logins.</p><form id="auth-form">'+usernameField+'<button class="primary" type="submit">Save username</button></form><p id="auth-error" role="status"></p>');
  bindSubmit(async () => {
    await accounts.setUsername($('#account-username').value.trim());
    location.reload();
  });
}

export function showSignIn(modal, google = false, mode = 'login') {
  const signup = mode === 'signup';
  const legacy = mode === 'legacy';
  const title = signup ? 'Join the climb.' : legacy ? 'Connect your existing account' : 'Welcome back.';
  const intro = legacy ? '<p>Sign in with your original email once, then choose a username.</p>' : '';
  modal('<h2>'+title+'</h2>'+intro+'<form id="auth-form">'+
    (legacy ? emailField : signup ? usernameField+emailField : '<label for="account-username">Username</label><input id="account-username" required autocomplete="username" autocapitalize="none" spellcheck="false">')+
    '<label for="account-password">Password</label><input id="account-password" type="password" required '+(signup?'minlength="10" ':'')+'maxlength="128" autocomplete="'+(signup?'new-password':'current-password')+'"><button class="primary" type="submit">'+(signup?'Create account':'Sign in')+'</button></form>'+
    '<button class="primary" type="button" id="auth-switch">'+(mode==='login'?'Create an account':'Back to sign in')+'</button>'+
    (mode==='login'?'<button class="primary" type="button" id="auth-legacy">Already have an account without a username?</button>':'')+
    (google?'<button class="primary" type="button" id="google">Continue with Google</button>':'')+
    '<p id="auth-error" role="status"></p>');
  $('#auth-switch').onclick = () => showSignIn(modal, google, mode==='login'?'signup':'login');
  if ($('#auth-legacy')) $('#auth-legacy').onclick = () => showSignIn(modal, google, 'legacy');
  bindSubmit(async () => {
    const password = $('#account-password').value;
    if (signup) await accounts.signUp($('#account-username').value.trim(), $('#account-email').value.trim(), password);
    else if (legacy) {
      await accounts.signInEmail($('#account-email').value.trim(), password);
      const session = await accounts.getSession();
      if (!session?.user?.username) { showUsernameSetup(modal); return; }
    } else await accounts.signIn($('#account-username').value.trim(), password);
    location.reload();
  });
  if ($('#google')) $('#google').onclick = async () => {
    try { const result = await accounts.googleSignIn(); if (result.url) location.assign(result.url); }
    catch (error) { $('#auth-error').textContent = error.message; }
  };
}
