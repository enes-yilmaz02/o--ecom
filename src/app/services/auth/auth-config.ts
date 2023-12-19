export const authConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: window.location.origin + '/login-callback',
  clientId: '614449184147-9gnmmtskp97qaccqqirdo0jfo1he55na.apps.googleusercontent.com',
  responseType: 'id_token token',
  scope: 'openid profile email',
  showDebugInformation: true,
};
