const SERVICE_URL = 'http://localhost:3000/users';

function bufferDecode(value) {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}

export default class UserService {
  static async crateUser(username: string) {
    const queryParams = new URLSearchParams({ username });
    try {
      const response = await fetch(`${SERVICE_URL}?${queryParams}`, {
        mode: 'cors',
      });
      const makeCredentialOptions = await response.json();
      makeCredentialOptions.challenge = bufferDecode(makeCredentialOptions.challenge);
      makeCredentialOptions.user.id = bufferDecode(makeCredentialOptions.user.id);
      if (makeCredentialOptions.excludeCredentials) {
        for (let i = 0; i < makeCredentialOptions.excludeCredentials.length; i += 1) {
          // eslint-disable-next-line max-len
          makeCredentialOptions.excludeCredentials[i].id = bufferDecode(makeCredentialOptions.excludeCredentials[i].id);
        }
      }
      console.log('Credential Creation Options');
      console.log(makeCredentialOptions);
      const newCredential = await navigator.credentials.create({
        publicKey: makeCredentialOptions,
      });
      console.log('PublicKeyCredential Created');
      console.log(newCredential);
      // console.log(serverResponse);
    } catch (e) {
      console.error(e);
    }
  }
}
