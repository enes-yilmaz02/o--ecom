import { Injectable } from '@angular/core';
import { Users } from '../models/users';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { CommonService } from './common.service';
import { AuthService } from './auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BadgeService } from './badge.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authToken: string | null = null;

  // API endpoint'leri
  usersEndPoint = 'users';
  loginuser = 'login';
  loginuserWithEmail = 'loginEmail';
  ordersEndPoint = 'orders';
  favoritesEndPoint = 'favorites';
  cartsEndPoint = 'carts';
  sendEmailEndPoint = 'sendEmail';
  usersAdminEndPoint = 'users-admin';
  productEndPoint = 'product';
  emailEndPoint = 'email';
  passwordEndPoint = 'password';
  checkPasswordEndPoint = 'checkpassword';
  exFavoritesEndPoint = 'exfavorites';

  role: any;
  userData: any;

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
    private badgeService: BadgeService
  ) {}

  /**
   * Verilen e-posta adresine sahip kullanıcının mevcut olup olmadığını kontrol eden fonksiyon.
   *
   * @param email Kontrol edilecek kullanıcının e-posta adresi.
   * @returns Observable<boolean> Türünde bir değer döndürür. Observable, kontrol sonucunu içerir.
   *          true: Kullanıcı mevcut.
   *          false: Kullanıcı mevcut değil veya kontrol sırasında bir hata oluştu.
   */
  checkIfUserExists(email: string): Observable<boolean> {
    return this.commonService.get(`${this.usersEndPoint}?email=${email}`).pipe(
      map((users: any[]) => {
        return users.length > 0;
      }),
      catchError((error) => {
        console.error('Error checking if user exists:', error);
        return of(false);
      })
    );
  }

  /**
   * Kullanıcı kaydı yapan fonksiyon. Önce belirli bir e-posta adresine sahip kullanıcının mevcut olup olmadığını kontrol eder.
   *
   * @param user Kaydedilecek kullanıcı bilgilerini içeren nesne, değişken.
   * @returns Observable<any> Türünde bir değer döndürür. Observable, kayıt işlemi sonucunu içerir.
   *          Başarılı kayıt durumunda: Kaydedilen kullanıcı bilgilerini içeren nesne.
   *          Hata durumunda: { error: 'Registration failed.' } şeklinde bir nesne.
   *          (Eğer kullanıcı zaten mevcutsa hata: 'Kullanıcı kaydı zaten bulunmaktadır.' şeklinde bir hata nesnesi.)
   */
  registerUser(user: any): Observable<any> {
    return this.checkIfUserExists(user.email).pipe(
      map((userExists: boolean) => {
        if (!userExists) {
          return this.commonService.post(this.usersEndPoint, user);
        } else {
          throw new Error('Kullanıcı kaydı zaten bulunmaktadır.');
        }
      }),
      catchError((error) => {
        console.error('Kayıt sırasında hata:', error);
        return of({ error: 'Kayıt başarısız' });
      })
    );
  }

  /**
   * Belirli bir kullanıcıya e-posta gönderen fonksiyon.
   *
   * @param userId E-posta gönderilecek kullanıcının kimlik numarası veya benzersiz anahtarı.
   * @param body Gönderilecek e-posta içeriğini içeren nesne.
   * @returns Observable<any> Türünde bir değer döndürür. Observable, e-posta gönderme işlemi sonucunu içerir.
   *          Başarılı gönderme durumunda: Gönderilen e-posta bilgilerini içeren nesne.
   *          Hata durumunda: { error: 'Email gönderimi başarısız' } şeklinde bir nesne.
   */
  sendEmail(userId: any, body: any) {
    return this.commonService.post(
      `${this.usersEndPoint}/${userId}/${this.sendEmailEndPoint}`,
      body
    );
  }

  /**
   * Tüm kullanıcılara genel bir e-posta gönderen fonksiyon.
   *
   * @param body Gönderilecek genel e-posta içeriğini içeren nesne.
   * @returns Observable<any> Türünde bir değer döndürür. Observable, genel e-posta gönderme işlemi sonucunu içerir.
   *          Başarılı gönderme durumunda: Gönderilen genel e-posta bilgilerini içeren nesne.
   *          Hata durumunda: { error: 'Email gönderimi başarısız.' } şeklinde bir nesne.
   */
  sendEmailGlobal(body: any) {
    return this.commonService.post(
      `${this.usersEndPoint}/${this.sendEmailEndPoint}`,
      body
    );
  }

  /**
   * Belirli bir kullanıcının siparişlerini getiren fonksiyon.
   *
   * @param userId Siparişleri alınacak kullanıcının benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür. Observable, belirli kullanıcının sipariş bilgilerini içerir.
   *          Başarılı getirme durumunda: Kullanıcının sipariş bilgilerini içeren nesne.
   *          Hata durumunda: Boş bir nesne veya hata mesajını içeren nesne.
   */
  getOrders(userId: string): Observable<Users> {
    return this.commonService
      .get(`${this.usersEndPoint}/${userId}/${this.ordersEndPoint}`)
      .pipe(
        tap((items: any) => {
          if (items && items.length !== undefined) {
            this.badgeService.updateOrderBadge(items.length);
          }
        })
      );
  }

  /**
   * Belirli bir kullanıcının belirli bir siparişini getiren fonksiyon.
   *
   * @param userId Siparişi alınacak kullanıcının benzersiz kimliği.
   * @param orderId Alınacak siparişin benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür. Observable, belirli kullanıcının belirli sipariş bilgilerini içerir.
   *          Başarılı getirme durumunda: Kullanıcının belirli sipariş bilgilerini içeren nesne.
   *          Hata durumunda: Boş bir nesne veya hata mesajını içeren nesne.
   */
  getOrder(userId: string, orderId: string): Observable<Users> {
    return this.commonService.get(
      `${this.usersEndPoint}/${userId}/${this.ordersEndPoint}/${orderId}`
    );
  }

  /**
   * Belirli bir kullanıcıya ait yeni bir sipariş ekleyen fonksiyon.
   *
   * @param userId Siparişin eklenmesi gereken kullanıcının benzersiz kimliği.
   * @param body Eklenen siparişin bilgilerini içeren nesne.
   * @returns Observable<Users> Türünde bir değer döndürür. Observable, eklenen siparişin bilgilerini içerir.
   *          Başarılı ekleme durumunda: Eklenen siparişin bilgilerini içeren nesne.
   *          Hata durumunda: Boş bir nesne veya hata mesajını içeren nesne.
   */
  addOrder(userId: string, body: any): Observable<Users> {
    return this.commonService.post(
      `${this.usersEndPoint}/${userId}/${this.ordersEndPoint}`,
      body
    );
  }

  /**
   * Belirli bir kullanıcıya ait ve belirli bir siparişin kimliğine sahip olan siparişi güncelleyen fonksiyon.
   *
   * @param userId Siparişin bulunduğu kullanıcının benzersiz kimliği.
   * @param orderId Güncellenmesi gereken siparişin benzersiz kimliği.
   * @param body Güncellenen siparişin yeni bilgilerini içeren nesne.
   * @returns Observable<Users> Türünde bir değer döndürür. Observable, güncellenen siparişin bilgilerini içerir.
   *          Başarılı güncelleme durumunda: Güncellenen siparişin bilgilerini içeren nesne.
   *          Hata durumunda: Boş bir nesne veya hata mesajını içeren nesne.
   */
  updateOrder(userId: string, orderId: string, body: any): Observable<Users> {
    return this.commonService.put(
      `${this.usersEndPoint}/${userId}/${this.ordersEndPoint}/${orderId}`,
      body
    );
  }

  /**
   * Belirli bir kullanıcıya ait ve belirli bir siparişin kimliğine sahip olan siparişi silen fonksiyon.
   *
   * @param userId Siparişin bulunduğu kullanıcının benzersiz kimliği.
   * @param orderId Silinmesi gereken siparişin benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür. Observable, silinen siparişin bilgilerini içerir.
   *          Başarılı silme durumunda: Silinen siparişin bilgilerini içeren nesne.
   *          Hata durumunda: Boş bir nesne veya hata mesajını içeren nesne.
   */
  deleteOrder(userId: string, orderId: string): Observable<Users> {
    return this.commonService.delete(
      `${this.usersEndPoint}/${userId}/${this.ordersEndPoint}/${orderId}`
    );
  }

  /**
   * Belirli bir kullanıcıya ait favori ürünlerin listesini getiren fonksiyon.
   *
   * @param userId Favori ürünlerin bulunduğu kullanıcının benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür. Observable, kullanıcının favori ürünlerini içerir.
   *          Başarılı getirme durumunda: Kullanıcının favori ürünlerini içeren nesne.
   *          Hata durumunda: Boş bir nesne veya hata mesajını içeren nesne.
   */
  getFavorites(userId: string): Observable<any> {
    return this.commonService
      .get(`${this.usersEndPoint}/${userId}/${this.favoritesEndPoint}`)
      .pipe(
        tap((items: any) => {
          if (items && items.length !== undefined) {
            this.badgeService.updateFavoritesBadge();
          }
        })
      );
  }

  /**
   * Belirli bir kullanıcıya ait favori ürünlerden bir tanesini getiren fonksiyon.
   *
   * @param userId Favori ürünlerin bulunduğu kullanıcının benzersiz kimliği.
   * @param favoriteId Getirilecek favori ürünün benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür. Observable, belirtilen favori ürünü içerir.
   *          Başarılı getirme durumunda: Belirtilen favori ürünü içeren nesne.
   *          Hata durumunda: Boş bir nesne veya hata mesajını içeren nesne.
   */
  getFavorite(userId: string, favoriteId: string): Observable<any> {
    return this.commonService.get(
      `${this.usersEndPoint}/${userId}/${this.favoritesEndPoint}/${favoriteId}`
    );
  }

  /**
   * Belirli bir kullanıcının favorilerinde belirli bir ürünün bulunup bulunmadığını kontrol eden fonksiyon.
   *
   * @param userId Favori ürünlerin bulunduğu kullanıcının benzersiz kimliği.
   * @param productId Kontrol edilecek ürünün benzersiz kimliği.
   * @returns Observable<boolean> Türünde bir değer döndürür.
   *          Başarılı kontrol durumunda: true (ürün favorilerde bulunuyor).
   *          Başarısız kontrol durumunda: false (ürün favorilerde bulunmuyor).
   */
  getFavoriteById(userId: string, productId: string): Observable<boolean> {
    return this.commonService.get(
      `${this.usersEndPoint}/${userId}/${this.favoritesEndPoint}/${this.productEndPoint}/${productId}`
    );
  }

  /**
   * Belirli bir kullanıcının favorilerine yeni bir favori ekleyen fonksiyon.
   *
   * @param userId Favori eklenen kullanıcının benzersiz kimliği.
   * @param favoriteId Favori olarak eklenen ürünün benzersiz kimliği.
   * @param body Favori olarak eklenen ürünün diğer bilgilerini içeren veri.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Başarılı ekleme durumunda: Güncellenmiş kullanıcı bilgileri.
   *          Başarısız ekleme durumunda: Hata mesajı içeren bir nesne.
   */
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

  /**
   * Belirli bir kullanıcının favorilerindeki bir favoriyi güncellemek için kullanılan fonksiyon.
   *
   * @param userId Favorisi güncellenen kullanıcının benzersiz kimliği.
   * @param favoriteId Güncellenen favorinin benzersiz kimliği.
   * @param body Güncellenen favorinin yeni bilgilerini içeren veri.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Başarılı güncelleme durumunda: Güncellenmiş kullanıcı bilgileri.
   *          Başarısız güncelleme durumunda: Hata mesajı içeren bir nesne.
   */
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

  /**
   * Belirli bir kullanıcının favorilerinden bir favoriyi silmek için kullanılan fonksiyon.
   *
   * @param userId Favorisi silinen kullanıcının benzersiz kimliği.
   * @param favoriteId Silinen favorinin benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Başarılı silme durumunda: Güncellenmiş kullanıcı bilgileri.
   *          Başarısız silme durumunda: Hata mesajı içeren bir nesne.
   */
  deleteFavorite(userId: string, favoriteId: string): Observable<Users> {
    return this.commonService.delete(
      `${this.usersEndPoint}/${userId}/${this.favoritesEndPoint}/${favoriteId}`
    );
  }

  /**
   * Belirli bir kullanıcının favorilerinden belirli bir ürünü silmek için kullanılan fonksiyon.
   *
   * @param userId Favorisi silinen kullanıcının benzersiz kimliği.
   * @param productId Silinen ürünün benzersiz kimliği.
   * @returns Observable<any> Türünde bir değer döndürür.
   *          Başarılı silme durumunda: Boş bir değer.
   *          Başarısız silme durumunda: Hata mesajı içeren bir nesne.
   */
  deleteFavoriteById(userId: string, productId: string): Observable<any> {
    return this.commonService.delete(
      `${this.usersEndPoint}/${userId}/${this.favoritesEndPoint}/${this.productEndPoint}/${productId}`
    );
  }


  /**
   * Belirli bir kullanıcıya ait eski favori ürünlerin listesini getiren fonksiyon.
   *
   * @param userId Favori ürünlerin bulunduğu kullanıcının benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür. Observable, kullanıcının favori ürünlerini içerir.
   *          Başarılı getirme durumunda: Kullanıcının favori ürünlerini içeren nesne.
   *          Hata durumunda: Boş bir nesne veya hata mesajını içeren nesne.
   */
  getExFavorites(userId: string): Observable<any> {
    return this.commonService
      .get(`${this.usersEndPoint}/${userId}/${this.exFavoritesEndPoint}`)
      .pipe(
        tap((items: any) => {
          if (items && items.length !== undefined) {
            this.badgeService.updateFavoritesBadge();
          }
        })
      );
  }

  /**
   * Belirli bir kullanıcıya ait eski favori ürünlerden bir tanesini getiren fonksiyon.
   *
   * @param userId Favori ürünlerin bulunduğu kullanıcının benzersiz kimliği.
   * @param favoriteId Getirilecek favori ürünün benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür. Observable, belirtilen favori ürünü içerir.
   *          Başarılı getirme durumunda: Belirtilen favori ürünü içeren nesne.
   *          Hata durumunda: Boş bir nesne veya hata mesajını içeren nesne.
   */
  getExFavorite(userId: string, favoriteId: string): Observable<any> {
    return this.commonService.get(
      `${this.usersEndPoint}/${userId}/${this.exFavoritesEndPoint}/${favoriteId}`
    );
  }

  /**
   * Belirli bir kullanıcının eski favorilerine yeni bir favori ekleyen fonksiyon.
   *
   * @param userId Favori eklenen kullanıcının benzersiz kimliği.
   * @param favoriteId Favori olarak eklenen ürünün benzersiz kimliği.
   * @param body Favori olarak eklenen ürünün diğer bilgilerini içeren veri.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Başarılı ekleme durumunda: Güncellenmiş kullanıcı bilgileri.
   *          Başarısız ekleme durumunda: Hata mesajı içeren bir nesne.
   */
  addExFavorite(
    userId: string,
    favoriteId: string,
    body: any
  ): Observable<Users> {
    return this.commonService.post(
      `${this.usersEndPoint}/${userId}/${this.exFavoritesEndPoint}/${favoriteId}`,
      body
    );
  }

  /**
   * Belirli bir kullanıcının eski favorilerindeki bir favoriyi güncellemek için kullanılan fonksiyon.
   *
   * @param userId Favorisi güncellenen kullanıcının benzersiz kimliği.
   * @param favoriteId Güncellenen favorinin benzersiz kimliği.
   * @param body Güncellenen favorinin yeni bilgilerini içeren veri.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Başarılı güncelleme durumunda: Güncellenmiş kullanıcı bilgileri.
   *          Başarısız güncelleme durumunda: Hata mesajı içeren bir nesne.
   */
  updateExFavorite(
    userId: string,
    favoriteId: string,
    body: any
  ): Observable<Users> {
    return this.commonService.put(
      `${this.usersEndPoint}/${userId}/${this.exFavoritesEndPoint}/${favoriteId}`,
      body
    );
  }

  /**
   * Belirli bir kullanıcının eski favorilerinden bir favoriyi silmek için kullanılan fonksiyon.
   *
   * @param userId Favorisi silinen kullanıcının benzersiz kimliği.
   * @param favoriteId Silinen favorinin benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Başarılı silme durumunda: Güncellenmiş kullanıcı bilgileri.
   *          Başarısız silme durumunda: Hata mesajı içeren bir nesne.
   */
  deleteExFavorite(userId: string, favoriteId: string): Observable<Users> {
    return this.commonService.delete(
      `${this.usersEndPoint}/${userId}/${this.exFavoritesEndPoint}/${favoriteId}`
    );
  }

  /**
   * Belirli bir kullanıcının alışveriş sepetindeki ürünleri getirmek için kullanılan fonksiyon.
   *
   * @param userId Sepeti getirilen kullanıcının benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Başarılı getirme durumunda: Kullanıcının alışveriş sepetindeki ürünleri içeren bir nesne.
   *          Başarısız getirme durumunda: Hata mesajı içeren bir nesne.
   */
  getCarts(userId: string): Observable<Users> {
    return this.commonService
      .get(`${this.usersEndPoint}/${userId}/${this.cartsEndPoint}`)
      .pipe(
        tap((items: any) => {
          if (items && items.length !== undefined) {
            this.badgeService.updateCartsBadge(items.length);
          }
        })
      );
  }

  /**
   * Belirli bir kullanıcının belirli bir alışveriş sepetindeki ürünleri getirmek için kullanılan fonksiyon.
   *
   * @param userId Sepeti getirilen kullanıcının benzersiz kimliği.
   * @param cartId Getirilecek alışveriş sepetinin benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Başarılı getirme durumunda: Belirli alışveriş sepetindeki ürünleri içeren bir nesne.
   *          Başarısız getirme durumunda: Hata mesajı içeren bir nesne.
   */
  getCart(userId: string, cartId: string): Observable<Users> {
    return this.commonService.get(
      `${this.usersEndPoint}/${userId}/${this.cartsEndPoint}/${cartId}`
    );
  }

  /**
   * Belirli bir kullanıcının belirli bir alışveriş sepetine yeni bir öğe eklemek için kullanılan fonksiyon.
   *
   * @param userId Alışveriş sepetine öğe eklenen kullanıcının benzersiz kimliği.
   * @param cartId Yeni öğe eklenecek alışveriş sepetinin benzersiz kimliği.
   * @param body Eklenen öğenin bilgilerini içeren nesne.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Başarılı ekleme durumunda: Güncellenmiş alışveriş sepetini içeren bir nesne.
   *          Başarısız ekleme durumunda: Hata mesajı içeren bir nesne.
   */
  addCart(userId: string, cartId: string, body: any): Observable<Users> {
    return this.commonService.post(
      `${this.usersEndPoint}/${userId}/${this.cartsEndPoint}/${cartId}`,
      body
    );
  }

  /**
   * Belirli bir kullanıcının alışveriş sepetini id değerine göre güncelleyen fonksiyon.
   *
   * @param userId Alışveriş sepeti güncellenecek kullanıcının benzersiz kimliği.
   * @param cartId Güncellenen alışveriş sepetinin benzersiz kimliği.
   * @param body Güncellenen alışveriş sepeti bilgilerini içeren nesne.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Başarılı güncelleme durumunda: Güncellenmiş alışveriş sepetini içeren bir nesne.
   *          Başarısız güncelleme durumunda: Hata mesajı içeren bir nesne.
   */
  updateCart(userId: string, cartId: string, body: any): Observable<Users> {
    return this.commonService.put(
      `${this.usersEndPoint}/${userId}/${this.cartsEndPoint}/${cartId}`,
      body
    );
  }

  /**
   * Belirli bir kullanıcının alışveriş sepetini id değerine göre silen fonksiyon.
   *
   * @param userId Alışveriş sepeti silinecek kullanıcının benzersiz kimliği.
   * @param cartId Silinecek alışveriş sepetinin benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Başarılı silme durumunda: Güncellenmiş kullanıcı bilgilerini içeren bir nesne.
   *          Başarısız silme durumunda: Hata mesajı içeren bir nesne.
   */
  deleteCart(userId: string, cartId: string): Observable<Users> {
    return this.commonService.delete(
      `${this.usersEndPoint}/${userId}/${this.cartsEndPoint}/${cartId}`
    );
  }

  /**
   * Sipariş tamamlandıktan sonra belirli bir kullanıcının alışveriş sepetini temizleyen fonksiyon.
   *
   * @param userId Alışveriş sepeti temizlenecek kullanıcının benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Başarılı temizleme durumunda: Güncellenmiş kullanıcı bilgilerini içeren bir nesne.
   *          Başarısız temizleme durumunda: Hata mesajı içeren bir nesne.
   */
  clearCart(userId: any): Observable<Users> {
    return this.commonService.delete(
      `${this.usersEndPoint}/${userId}/${this.cartsEndPoint}`
    );
  }

  /**
   * Tüm kullanıcıları getiren fonksiyon.
   *
   * @returns Observable<Users[]> Türünde bir değer döndürür.
   *          Tüm kullanıcıları içeren bir dizi.
   */
  getUsers(): Observable<Users[]> {
    return this.commonService.get(this.usersEndPoint);
  }

  /**
   * Belirli bir kullanıcıyı getiren fonksiyon.
   *
   * @param id Getirilecek kullanıcının benzersiz kimliği.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Belirtilen kullanıcının bilgilerini içeren bir nesne.
   */
  getUser(id: string): Observable<Users> {
    return this.commonService.get(`${this.usersEndPoint}/${id}`);
  }

  /**
   * Belirli bir kullanıcıyı email datası ile getiren fonksiyon.
   *
   * @param email Getirilecek kullanıcının e-posta adresi.
   * @returns Observable<Users> Türünde bir değer döndürür.
   *          Belirtilen e-posta adresine sahip kullanıcının bilgilerini içeren bir nesne.
   */
  getUserWithEmail(email: any): Observable<Users> {
    return this.commonService.get(
      `${this.usersEndPoint}/${this.emailEndPoint}/${email}`
    );
  }

  /**
   * Yeni bir kullanıcı ekleyen fonksiyon.
   *
   * @param user Eklenecek yeni kullanıcının bilgilerini içeren nesne.
   * @returns Observable<any> Türünde bir değer döndürür.
   *          Başarılı ekleme durumunda: Eklenen kullanıcının bilgilerini içeren bir nesne.
   *          Başarısız ekleme durumunda: Hata mesajı içeren bir nesne.
   */
  addUsers(user: any) {
    return this.commonService.post(this.usersEndPoint, user);
  }

  /**
   * Admin tarafında yeni bir kullanıcı ekleyen fonksiyon.
   *
   * @param user Eklenecek yeni kullanıcının bilgilerini içeren nesne.
   * @returns Observable<any> Türünde bir değer döndürür.
   *          Başarılı ekleme durumunda: Eklenen kullanıcının bilgilerini içeren bir nesne.
   *          Başarısız ekleme durumunda: Hata mesajı içeren bir nesne.
   */
  addUsersAdmin(user: any) {
    return this.commonService.post(this.usersAdminEndPoint, user);
  }

  /**
   * Belirli bir kullanıcının bilgilerini güncelleyen fonksiyon.
   *
   * @param userId Güncellenecek kullanıcının benzersiz kimliği.
   * @param body Güncellenen kullanıcı bilgilerini içeren nesne.
   * @returns Observable<any> Türünde bir değer döndürür.
   *          Başarılı güncelleme durumunda: Güncellenmiş kullanıcının bilgilerini içeren bir nesne.
   *          Başarısız güncelleme durumunda: Hata mesajı içeren bir nesne.
   */
  updateUser(userId: any, body: any) {
    return this.commonService.put(`${this.usersEndPoint}/${userId}`, body);
  }

  /**
   * Belirli bir kullanıcının şifre bilgilerini güncelleyen fonksiyon.
   *
   * @param userId Şifresi güncellenecek kullanıcının benzersiz kimliği.
   * @param body Güncellenen şifre bilgilerini içeren nesne.
   * @returns Observable<any> Türünde bir değer döndürür.
   *          Başarılı güncelleme durumunda: Güncellenmiş kullanıcının bilgilerini içeren bir nesne.
   *          Başarısız güncelleme durumunda: Hata mesajı içeren bir nesne.
   */
  updateUserPassword(userId: any, body: any) {
    return this.commonService.put(
      `${this.usersEndPoint}/${userId}/${this.passwordEndPoint}`,
      body
    );
  }

  /**
   * Belirli bir kullanıcının şifre bilgilerinin doğruluğunu kontrol eden fonksiyon.
   *
   * @param userId Şifre doğruluğu kontrol edilecek kullanıcının benzersiz kimliği.
   * @param password Kontrol edilecek şifre.
   * @returns Observable<any> Türünde bir değer döndürür.
   *          Şifre doğruysa: Boş bir nesne döner.
   *          Şifre yanlışsa: Hata mesajı içeren bir nesne döner.
   */

  checkUserPassword(userId: any, password: any) {
    const body = { password: password };
    return this.commonService.post(
      `${this.checkPasswordEndPoint}/${userId}`,
      body
    );
  }

  /**
   * Belirli bir kullanıcıyı silen fonksiyon.
   *
   * @param userId Silinecek kullanıcının benzersiz kimliği.
   * @returns Observable<any> Türünde bir değer döndürür.
   *          Başarılı silme durumunda: Silinen kullanıcının bilgilerini içeren bir nesne.
   *          Başarısız silme durumunda: Hata mesajı içeren bir nesne.
   */
  deleteUser(userId: any) {
    return this.commonService.delete(`${this.usersEndPoint}/${userId}`);
  }

  /**
   * E-posta ile kayıt olan kullanıcıyı ekleyen fonksiyon.
   *
   * @param user Kayıt olacak kullanıcının bilgilerini içeren nesne.
   * @returns Observable<any> Türünde bir değer döndürür.
   *          Başarılı kayıt durumunda: Eklenen kullanıcının bilgilerini içeren bir nesne.
   *          Başarısız kayıt durumunda: Hata mesajı içeren bir nesne.
   */
  registerWithEmail(user: any) {
    return this.commonService.post(this.usersEndPoint, user);
  }

  /**
   * E-posta ile giriş yapan kullanıcıyı getiren fonksiyon.
   *
   * @param user Giriş yapacak kullanıcının e-posta bilgilerini içeren nesne.
   * @returns Observable<any> Türünde bir değer döndürür.
   *          Giriş yapan kullanıcının bilgilerini içeren bir nesne.
   */
  loginWithEmail(user: any) {
    return this.commonService.get(user);
  }

  /**
   * Kullanıcı girişi sağlayan fonksiyon.
   *
   * @param user Giriş yapacak kullanıcının bilgilerini içeren nesne.
   * @returns Observable<{ token: string }> Türünde bir değer döndürür.
   *          Başarılı giriş durumunda: Kullanıcıya ait bir JWT token içeren bir nesne.
   *          Başarısız giriş durumunda: Hata mesajı içeren bir nesne.
   */
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

  /**
   * E-posta ile kullanıcı girişi sağlayan fonksiyon.
   *
   * @param email Giriş yapacak kullanıcının e-posta bilgilerini içeren nesne.
   * @returns Observable<{ token: string }> Türünde bir değer döndürür.
   *          Başarılı giriş durumunda: Kullanıcıya ait bir JWT token içeren bir nesne.
   *          Başarısız giriş durumunda: Hata mesajı içeren bir nesne.
   */
  loginUserWithEmail(email: any): Observable<{ token: string }> {
    return this.commonService
      .post<{ token: string }>(this.loginuserWithEmail, email)
      .pipe(
        tap((response) => {
          this.authToken = response.token;
          this.authService.setAuthToken(response.token);
        })
      );
  }

  /**
   * JWT token'ından kullanıcı ID'sini çıkaran fonksiyon.
   *
   * @returns Observable<any> Türünde bir değer döndürür.
   *          JWT token varsa: Kullanıcı ID'sini içeren bir nesne.
   *          JWT token yoksa veya geçersizse: Boş bir nesne.
   */
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

  /**
   * Kullanıcı ID'sini kullanarak kullanıcı bilgilerini getiren fonksiyon.
   *
   * @returns Observable<string> Türünde bir değer döndürür.
   *          Başarılı getirme durumunda: Kullanıcının rol bilgisini içeren bir nesne.
   *          Başarısız getirme durumunda: Boş bir nesne.
   */
  getUserByTokenId(): Observable<string> {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      return of('');
    }
    const decodedToken = this.jwtHelper.decodeToken(authToken);
    if (!decodedToken || !decodedToken.id) {
      return of('');
    }
    return this.getTokenUser(decodedToken.id);
  }

  /**
   * Kullanıcının role bilgisini getiren fonksiyon.
   *
   * @param userId Kullanıcının benzersiz kimliği.
   * @returns Observable<string> Türünde bir değer döndürür.
   *          Başarılı getirme durumunda: Kullanıcının rol bilgisini içeren bir nesne.
   *          Başarısız getirme durumunda: Boş bir nesne.
   */
  getTokenUser(userId: string): Observable<string> {
    return this.getUser(userId).pipe(
      map((data: any) => {
        this.userData = data['role'];
        return this.userData;
      }),
      catchError((error) => {
        console.error('Error getting user role:', error);
        return of('');
      })
    );
  }
}
