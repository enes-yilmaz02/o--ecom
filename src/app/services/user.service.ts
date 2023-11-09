import { Injectable } from '@angular/core';
import { Users } from '../models/users';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  userEndPoint='user';

  deleteUserEndPoint='users';

  getAllUsersEndPoint='users';




  constructor(
    private router: Router,
    private commonService:CommonService
  ) {

  }

  getUsers(): Observable<Users[]> {
    return this.commonService.get(this.getAllUsersEndPoint);
  }

  getUser(id: string): Observable<Users> {
    return this.commonService.get(this.userEndPoint+`/${id}`);
  }

  addUsers(user:any){

    return this.commonService.post(this.userEndPoint, user);
  }

  updateUser(user:any){
    return this.commonService.post(this.userEndPoint, user);
  }

  deleteUser(id:any) {
    return this.commonService.delete(this.deleteUserEndPoint+`/${id}`);
  }


  registerWithEmail(user:any){
    debugger
    return this.commonService.post(this.userEndPoint , user );
  }

  loginWithEmail(user:any) {
    return this.commonService.get(user);
  }

  singout(): void {
    this.router.navigate(['/']);
  }
}
