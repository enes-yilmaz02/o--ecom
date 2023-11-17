import { Injectable } from '@angular/core';
import { Users } from '../models/users';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { CommonService } from './common.service';
import { AuthService } from './auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
// Kullanıcı işlemlerini yöneten servis
@Injectable({
  providedIn: 'root',
})
export class UserService {
  // JWT token'ını saklamak için kullanılan özel değişken
  private authToken: string | null = null;

  // API endpoint'leri
  usersEndPoint = 'users';
  loginuser = 'login';
  ordersEndPoint = 'orders';
  favoritesEndPoint = 'favorites';
  cartsEndPoint = 'carts';
  sendEmailEndPoint= 'sendEmail' ;

  // Rol ve kullanıcı verilerini saklamak için değişkenler
  role: any;
  userData: any;

  // Siparişler için bir Badge (bildirim sayacı)
  orderBadge: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // Siparişler için bir Badge (bildirim sayacı)
  cartBadge: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // Favoriler için bir Badge
  favoritesBadge: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // Constructor, servis bağımlılıklarını enjekte eder
  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private jwtHelper: JwtHelperService
  ) {

  }

  sendEmail(userId:any , body:any){
    return this.commonService.post(`${this.usersEndPoint}/${userId}/${this.sendEmailEndPoint}`,body);
  }

  // Sipariş badge'ini güncelleyen fonksiyon
  updateOrderBadge(userId: string) {
    this.getOrders(userId).subscribe((items: any) => {
      if (items && items.length !== undefined) {
        this.orderBadge.next(items.length);
      }
    });
  }

  // Belirli bir kullanıcının siparişlerini getiren fonksiyon
  getOrders(userId: string): Observable<Users> {
    return this.commonService
      .get(`${this.usersEndPoint}/${userId}/${this.ordersEndPoint}`)
      .pipe(
        tap((items: any) => {
          if (items && items.length !== undefined) {
            this.orderBadge.next(items.length);
          }
        })
      );
  }

  // Belirli bir kullanıcının siparişini id değerine göre getiren fonksiyon
  getOrder(userId: string, orderId: string): Observable<Users> {
    return this.commonService.get(
      `${this.usersEndPoint}/${userId}/${this.ordersEndPoint}/${orderId}`
    );
  }

  // Belirli bir kullanıcının siparişini id değereine göre güncelleyen fonksiyon
  addOrder(userId: string, body: any): Observable<Users> {
    return this.commonService.post(
      `${this.usersEndPoint}/${userId}/${this.ordersEndPoint}`,
      body
    );
  }
  // Belirli bir kullanıcının siparişini id değereine göre güncelleyen fonksiyon
  updateOrder(userId: string, orderId: string, body: any): Observable<Users> {
    return this.commonService.put(
      `${this.usersEndPoint}/${userId}/${this.ordersEndPoint}/${orderId}`,
      body
    );
  }

  // Belirli bir kullanıcının siparişini id değereine göre güncelleyen fonksiyon
  deleteOrder(userId: string, orderId: string): Observable<Users> {
    return this.commonService.delete(
      `${this.usersEndPoint}/${userId}/${this.ordersEndPoint}/${orderId}`
    );
  }

  // Belirli bir kullanıcının favorilerini getiren fonksiyon
  getFavorites(userId: string): Observable<Users> {
    return this.commonService.get(
      `${this.usersEndPoint}/${userId}/${this.favoritesEndPoint}`
    );
  }

  // Belirli bir kullanıcının favorisini id değerine göre getiren fonksiyon
  getFavorite(userId: string, favoriteId: string): Observable<Users> {
    return this.commonService.get(
      `${this.usersEndPoint}/${userId}/${this.favoritesEndPoint}/${favoriteId}`
    );
  }

  // Belirli bir kullanıcının favorilerine yeni bir favori ekleyen fonksiyon
  addFavorite(
    userId: string,
    favoriteId: string,
    body: any
  ): Observable<Users> {
    return this.commonService.post(
      `${this.usersEndPoint}/${userId}/${this.favoritesEndPoint}/${favoriteId}`,
      body
    );
  }

  // Belirli bir kullanıcının favorisini id değereine göre güncelleyen fonksiyon
  updateFavorite(
    userId: string,
    favoriteId: string,
    body: any
  ): Observable<Users> {
    return this.commonService.put(
      `${this.usersEndPoint}/${userId}/${this.favoritesEndPoint}/${favoriteId}`,
      body
    );
  }

  // Belirli bir kullanıcının siparişini id değereine göre güncelleyen fonksiyon
  deleteFavorite(userId: string, favoriteId: string): Observable<Users> {
    return this.commonService.delete(
      `${this.usersEndPoint}/${userId}/${this.favoritesEndPoint}/${favoriteId}`
    );
  }

  // Belirli bir kullanıcının favorilerini getiren fonksiyon
  getCarts(userId: string): Observable<Users> {
    return this.commonService.get(
      `${this.usersEndPoint}/${userId}/${this.cartsEndPoint}`
    );
  }

  // Belirli bir kullanıcının favorisini id değerine göre getiren fonksiyon
  getCart(userId: string, cartId: string): Observable<Users> {
    return this.commonService.get(
      `${this.usersEndPoint}/${userId}/${this.cartsEndPoint}/${cartId}`
    );
  }

  // Belirli bir kullanıcının favorilerine yeni bir favori ekleyen fonksiyon
  addCart(userId: string, cartId: string, body: any): Observable<Users> {
    return this.commonService.post(
      `${this.usersEndPoint}/${userId}/${this.cartsEndPoint}/${cartId}`,
      body
    );
  }

  // Belirli bir kullanıcının favorisini id değereine göre güncelleyen fonksiyon
  updateCart(userId: string, cartId: string, body: any): Observable<Users> {
    return this.commonService.put(
      `${this.usersEndPoint}/${userId}/${this.cartsEndPoint}/${cartId}`,
      body
    );
  }

  // Belirli bir kullanıcının siparişini id değereine göre güncelleyen fonksiyon
  deleteCart(userId: string, cartId: string): Observable<Users> {
    return this.commonService.delete(
      `${this.usersEndPoint}/${userId}/${this.cartsEndPoint}/${cartId}`
    );
  }
  // Sipariş tamamlandıktan sonra sepeti temizlemek için kullanılan fonksiyon
  clearCart(userId: any): Observable<Users> {
    return this.commonService.delete(
      `${this.usersEndPoint}/${userId}/${this.cartsEndPoint}`
    );
  }
  // Tüm kullanıcıları getiren fonksiyon
  getUsers(): Observable<Users[]> {
    return this.commonService.get(this.usersEndPoint);
  }

  // Belirli bir kullanıcıyı getiren fonksiyon
  getUser(id: string): Observable<Users> {
    return this.commonService.get(`${this.usersEndPoint}/${id}`);
  }

  // Yeni bir kullanıcı ekleyen fonksiyon
  addUsers(user: any) {
    return this.commonService.post(this.usersEndPoint, user);
  }

  // Belirli bir kullanıcının bilgilerini güncelleyen fonksiyon
  updateUser(userId: any, body: any) {
    return this.commonService.put(`${this.usersEndPoint}/${userId}`, body);
  }

  // Belirli bir kullanıcıyı silen fonksiyon
  deleteUser(userId: any) {
    return this.commonService.delete(`${this.usersEndPoint}/${userId}`);
  }

  // E-posta ile kayıt olan kullanıcıyı ekleyen fonksiyon
  registerWithEmail(user: any) {
    return this.commonService.post(this.usersEndPoint, user);
  }

  // E-posta ile giriş yapan kullanıcıyı getiren fonksiyon
  loginWithEmail(user: any) {
    return this.commonService.get(user);
  }

  // Kullanıcı girişi sağlayan fonksiyon
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

  // JWT token'ından kullanıcı ID'sini çıkaran fonksiyon
  getTokenId(): Observable<any> {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      return of('');
    }

    const decodedToken = this.jwtHelper.decodeToken(authToken);

    if (!decodedToken || !decodedToken.id) {
      return of('');
    }

    return of(decodedToken.id);
  }

  // Kullanıcı ID'sini kullanarak kullanıcı bilgilerini getiren fonksiyon
  getUserByTokenId(): Observable<string> {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      // Eğer authToken localStorage'ta bulunmuyorsa işlem yapma
      return of('');
    }
    const decodedToken = this.jwtHelper.decodeToken(authToken);
    if (!decodedToken || !decodedToken.id) {
      // Eğer decodedToken veya user ID yoksa işlem yapma
      return of('');
    }
    // Kullanıcı ID'sini kullanarak kullanıcı bilgilerini getir
    return this.getTokenUser(decodedToken.id);
  }

  // Kullanıcı bilgilerini getiren fonksiyon
  getTokenUser(userId: string): Observable<string> {
    return this.getUser(userId).pipe(
      map((data: any) => {
        this.userData = data['role'];
        return this.userData;
      }),
      catchError((error) => {
        console.error('Error getting user role:', error);
        // Hata durumunda işlem yapabilirsin, default bir role veya boş bir string döndür
        return of('');
      })
    );
  }
}
