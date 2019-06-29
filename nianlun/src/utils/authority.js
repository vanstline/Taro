import { Base64 } from 'js-base64';
const localKey = Base64.encode('ism-authority');
// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(key) {
  const authority = localStorage.getItem(localKey);
  const soundCode = authority ? Base64.decode(authority) : '';
  if (soundCode && soundCode.indexOf('{') == 0) {
    const authorityJson = JSON.parse(soundCode);
    return authorityJson[key || 'access_token'];
  }
  return null;
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  const baseString = Base64.encode(JSON.stringify(proAuthority));
  return localStorage.setItem(localKey, baseString);
}

export function removeAuthority() {
  return localStorage.removeItem(localKey);
}
