import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  doPost(url: string, body: any, options: any) {
    return this.http.post(url, body, options);
  }
}
