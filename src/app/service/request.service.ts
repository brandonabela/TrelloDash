import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  public getXhrResponse(projectUrl: string): Promise<XMLHttpRequest> {
    const promise = new Promise<XMLHttpRequest>(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', projectUrl, true);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr);
        }
      };

      xhr.send(null);
    });

    return promise;
  }

  public getBase64WithCors(imageUrl: string): Promise<string> {
    const queryURL = 'https://cors-anywhere.herokuapp.com/' + imageUrl;

    const promise = new Promise<string>(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', queryURL, true);
      xhr.responseType = 'arraybuffer';

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const uInt8Array = new Uint8Array(xhr.response);
          let uInt8ArrayLength = uInt8Array.length;

          const binaryString = new Array(uInt8ArrayLength);

          while (uInt8ArrayLength--) {
            binaryString[uInt8ArrayLength] = String.fromCharCode(uInt8Array[uInt8ArrayLength]);
          }

          const data = binaryString.join('');
          const base64 = window.btoa(data);

          resolve(base64);
        }
      };

      xhr.send(null);
    });

    return promise;
  }
}
