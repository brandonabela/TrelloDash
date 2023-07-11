import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(private http: HttpClient) { }

  public getResponse(projectUrl: string): Observable<string> {
    return this.http.get(projectUrl, { responseType: 'text' });
  }

  public getResponseWithCors(imageUrl: string): Observable<ArrayBuffer> {
    const queryURL = 'https://cors-anywhere.herokuapp.com/' + imageUrl;

    return this.http.get(queryURL, { responseType: 'arraybuffer' });
  }
}
