import base64js from 'base64-js';

const BASE_URL = 'http://localhost:3000';
const SERVICE_URL = `${BASE_URL}/users`;
const LOGIN_URL = `${BASE_URL}/login`;

function bufferDecode(value) {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}

function bufferEncode(value) {
  return base64js.fromByteArray(value);
}

export default class UserService {
  static async createUser(username: string) {
    const bodyDataPost = { username };
    try {
      const response = await fetch(SERVICE_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyDataPost),
      });
      const makeCredentialOptions = await response.json();
      makeCredentialOptions.challenge = bufferDecode(makeCredentialOptions.challenge);
      makeCredentialOptions.user.id = bufferDecode(makeCredentialOptions.user.id);
      console.log('userId', makeCredentialOptions.user.id);
      if (makeCredentialOptions.excludeCredentials) {
        for (let i = 0; i < makeCredentialOptions.excludeCredentials.length; i += 1) {
          // eslint-disable-next-line max-len
          makeCredentialOptions.excludeCredentials[i].id = bufferDecode(makeCredentialOptions.excludeCredentials[i].id);
        }
      }
      console.log('Credential Creation Options');
      console.log(makeCredentialOptions);
      // eslint-disable-next-line max-len
      const newCredential: PublicKeyCredential = <PublicKeyCredential> await navigator.credentials.create({
        publicKey: makeCredentialOptions,
      });
      console.log('PublicKeyCredential Created');
      console.log(newCredential);
      // eslint-disable-next-line max-len
      const authenticatorAttestationResponse: AuthenticatorAttestationResponse = <AuthenticatorAttestationResponse>newCredential.response;
      const attestationObject = new Uint8Array(authenticatorAttestationResponse.attestationObject);
      const clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
      const rawId = new Uint8Array(newCredential.rawId);
      const publicKeyCredential = {
        id: newCredential.id,
        rawId: bufferEncode(rawId),
        type: newCredential.type,
        response: {
          attestationObject: bufferEncode(attestationObject),
          clientDataJSON: bufferEncode(clientDataJSON),
        },
      };
      const bodyDataPut = {
        username,
        publicKeyCredential,
      };
      const putResponse = await fetch(SERVICE_URL, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyDataPut),
      });
      console.log(putResponse);
    } catch (e) {
      console.error(e);
    }
  }

  static async login(username: string) {
    const queryParams = new URLSearchParams({ username });
    try {
      const response = await fetch(`${SERVICE_URL}?${queryParams}`, {
        mode: 'cors',
      });
      const publicKeyCredentialRequestOptions = await response.json();
      console.log(publicKeyCredentialRequestOptions);
      // eslint-disable-next-line max-len
      publicKeyCredentialRequestOptions.challenge = bufferDecode(publicKeyCredentialRequestOptions.challenge);
      publicKeyCredentialRequestOptions.allowCredentials.forEach((listItem) => {
        // eslint-disable-next-line no-param-reassign
        listItem.id = bufferDecode(listItem.id);
      });
      const assertion: PublicKeyCredential = <PublicKeyCredential> await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });
      // eslint-disable-next-line max-len
      const authenticatorAssertionResponse: AuthenticatorAssertionResponse = < AuthenticatorAssertionResponse>assertion.response;
      const signature = new Uint8Array(authenticatorAssertionResponse.signature);
      const userHandle = new Uint8Array(authenticatorAssertionResponse.userHandle);
      const clientDataJSON = new Uint8Array(authenticatorAssertionResponse.clientDataJSON);
      const authenticatorData = new Uint8Array(authenticatorAssertionResponse.authenticatorData);
      console.log(bufferEncode(signature));
      console.log(bufferEncode(userHandle));
      console.log(bufferEncode(clientDataJSON));
      console.log(bufferEncode(authenticatorData));
      const bodyDataLogin = {
        signature: bufferEncode(signature),
        userHandle: bufferEncode(userHandle),
        clientDataJSON: bufferEncode(clientDataJSON),
        authenticatorData: bufferEncode(authenticatorData),
      };
      console.log(bodyDataLogin);
      const loginResponse = await fetch(LOGIN_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyDataLogin),
      });
      console.log(loginResponse);
    } catch (error) {
      console.error(error);
    }
  }
}
