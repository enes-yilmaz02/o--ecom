import { Injectable } from '@angular/core';
import { Users } from '../models/users';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CommonService } from './common.service';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private authToken: string | null = null;

  userEndPoint = 'user';

  deleteUserEndPoint = 'users';

  getAllUsersEndPoint = 'users';

  loginuser = 'login';

  role : any;


  constructor(
    private router: Router,
    private commonService: CommonService,
    private authService: AuthService
  ) {
    
   }

  getUsers(): Observable<Users[]> {
    return this.commonService.get(this.getAllUsersEndPoint);
  }

  getUser(id: string): Observable<Users> {
    return this.commonService.get(this.userEndPoint + `/${id}`);
  }

  addUsers(user: any) {
    return this.commonService.post(this.userEndPoint, user);
  }

  updateUser(id: any, body: any) {
    return this.commonService.put(this.userEndPoint + `/${id}`, body);
  }

  deleteUser(id: any) {
    return this.commonService.delete(this.deleteUserEndPoint + `/${id}`);
  }

  registerWithEmail(user: any ) {
    return this.commonService.post(this.userEndPoint, user);
  }

  loginWithEmail(user: any) {
    return this.commonService.get(user);
  }

  loginUser(user: any): Observable<{ token: string }> {
    return this.commonService
      .post<{ token: string }>(this.loginuser, user)
      .pipe(
        tap((response) => {
          this.authToken = response.token;
          this.authService.setAuthToken(response.token);
        })
      );
  }


  getToken() {
    return this.authService.decodeToken();
  }
  getUserByTokenId(): Observable<string> {
    const userArray = this.getToken();
    const tokenId = userArray[0]['id'];
    return this.getUser(tokenId).pipe(
      map((data: any) => data['role']),
      catchError((error) => {
        console.error('Error getting user role:', error);
        // Handle error if needed
        return of(''); // Return a default role or an empty string
      })
    );
  }

  singout(): void {
    this.router.navigate(['/']);
  }
}
