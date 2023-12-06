import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { Users } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class CereoterService {
  creotersEndPoint = 'waitList';
  constructor(private commonService: CommonService) {}

  // Tüm croterları getiren fonksiyon
  getCreoters(): Observable<Users[]> {
    return this.commonService.get(this.creotersEndPoint);
  }

  // Belirli bir creoteri getiren fonksiyon
  getCreoter(id: string): Observable<Users> {
    return this.commonService.get(`${this.creotersEndPoint}/${id}`);
  }

   // Yeni bir creoterı ekleyen fonksiyon
   addCreoter(user: any) {
    return this.commonService.post(this.creotersEndPoint, user);
  }

   // Belirli bir creoterin bilgilerini güncelleyen fonksiyon
   updateCreoter(userId: any, body: any) {
    return this.commonService.put(`${this.creotersEndPoint}/${userId}`, body);
  }

  // Belirli bir creoteri silen fonksiyon
  deleteCreoter(userId: any) {
    return this.commonService.delete(`${this.creotersEndPoint}/${userId}`);
  }
}
