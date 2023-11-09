import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  baseUrl: string;

  constructor(private http: HttpClient) {
      this.baseUrl = environment.baseUrl;
  }
  post<T>(endPoint: string, body: any): Observable<T> {
      console.log(this.baseUrl+endPoint , body)
      return this.http.post<T>(this.baseUrl + endPoint, body);
  }
  get<T>(endPoint: string): Observable<T> {
      return this.http.get<T>(this.baseUrl + endPoint);
  }
  put<T>(endPoint: string, body: any): Observable<T> {
      return this.http.put<T>(this.baseUrl + endPoint, body);
  }
  delete<T>(endPoint: string ): Observable<T> {
      return this.http.delete<T>(this.baseUrl + endPoint);
  }
  patch<T>(endPoint: string, body: any): Observable<T> {
      return this.http.patch<T>(this.baseUrl + endPoint, body);
  }

  postWithHeader(endPoint: string, body: any, header: any) {
      return this.http.post(this.baseUrl + endPoint, body, header);
  }

}
