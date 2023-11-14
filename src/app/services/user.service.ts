import { Injectable } from '@angular/core';
import { Users } from '../models/users';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { CommonService } from './common.service';
import { AuthService } from './auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
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

  userData : any ;

  constructor(
    private router: Router,
    private commonService:CommonService,
    private authService:AuthService,
    private jwtHelper: JwtHelperService
  ) {

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

  getUsers(): Observable<Users[]> {
    return this.commonService.get(this.getAllUsersEndPoint);
  }

  getUser(id: string): Observable<Users> {
    return this.commonService.get(this.userEndPoint+`/${id}`);
  }

  addUsers(user:any){
    return this.commonService.post(this.userEndPoint, user);
  }

  updateUser(id:any , body:any){
    return this.commonService.put(this.userEndPoint+`/${id}` , body);
  }

  deleteUser(id:any) {
    return this.commonService.delete(this.deleteUserEndPoint+`/${id}`);
  }


  registerWithEmail(user:any){
    return this.commonService.post(this.userEndPoint , user );
  }

  loginWithEmail(user:any) {
    return this.commonService.get(user);
  }

  getUserByTokenId(): Observable<string> {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      // Handle the case where authToken is not available in local storage
      return of('');
    }

    // Decode the JWT to extract user information
    const decodedToken = this.jwtHelper.decodeToken(authToken);

    if (!decodedToken || !decodedToken.id) {
      // Handle the case where the decoded token or user ID is not available
      return of('');
    }

    // Now, you can use the decoded user ID to get the user role
    return this.getTokenUser(decodedToken.id);
  }

  getTokenUser(userId: string): Observable<string> {
    return this.getUser(userId).pipe(
      map((data: any) => {
        this.userData = data['role'];
        console.log(this.userData);
        return this.userData;
      }),
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
