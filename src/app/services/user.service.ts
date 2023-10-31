import { Injectable } from '@angular/core';
import { Users } from '../models/users';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  formData!: Users;
  private collectionName = 'users';
  authState: any = null;
  isAuthenticated = false;
  constructor(
    private afs: AngularFirestore,
    private afu: AngularFireAuth,
    private router: Router,
    private messageService: MessageService
  ) {
    this.afu.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }
   //checking email
   checkIfEmailExists(email: string) {
    return this.afu.fetchSignInMethodsForEmail(email);
  }
  // get all users
  getUsers(): Observable<Users[]> {
    return this.afs.collection<Users>(this.collectionName).valueChanges();
  }
  // get id user
  getUser(id: string): Observable<Users> {
    return this.afs.collection(this.collectionName).doc(id).valueChanges();
  }
  // add user
   // Yeni bir kullanıcı eklemek için otomatik olarak artan sayısal bir ID oluşturun
   addUsers(user: Users): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Koleksiyon referansı oluşturun
      const collectionRef = this.afs.collection(this.collectionName);

      // Otomatik olarak artan bir ID alın
      collectionRef.add(user).then((documentRef) => {
        const userId = documentRef.id;

        // Belgeyi güncelleyin ve otomatik kimliği atayın
        collectionRef.doc(userId).update({ id: userId }).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  //update user
  updateUsers(user: Users): Promise<void> {
    return this.afs.collection(this.collectionName).doc(user.id).update(user);
  }
 //delete user
 deleteUsers(email: string, password: string):any {
  // Email ile oturum açmayı deneyin
  this.afu
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Firestore'dan kullanıcı verilerini silme işlemi
      this.afs.collection<Users>('users', (ref) =>
        ref.where('email', '==', email).limit(1)
      ).get().subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const docId = doc.id;
          doc.ref.delete().then(() => {
            // Firestore'dan veri başarıyla silindi.

            // Kullanıcıyı kimlik doğrulamadan silme işlemi
            user.delete().then(() => {
              // Kullanıcı başarıyla silindi.
            }).catch((error) => {
              // Kullanıcıyı silerken hata oluştu.
            });
          }).catch((error) => {
            // Firestore'dan veriyi silerken hata oluştu.
          });
        });
      });
    })
    .catch((error) => {
      // Kullanıcıyı oturum açarak silemezsiniz, hata oluştu.
    });
}



  get isUserAnonymousLoggedIn(): boolean {
    return this.authState !== null ? this.authState.isAnonymous : false;
  }

  get currentUserName(): string {
    return this.authState !== null ? this.authState.name : '';
  }

  get currentUserEmail(): string {
    return this.authState['email'];
  }

  get currentUser(): any {
    return this.authState !== null ? this.authState : null;
  }

  get isUserEmailLoggedIn(): boolean {
    if (this.authState !== null && !this.isUserAnonymousLoggedIn) {
      this.isAuthenticated = true;
      this.router.navigate(['product']);
      return true;
    } else {
      return false;
    }
  }

  registerWithEmail(

    name: string,
    username: string,
    email: string,
    phone:string,
    password: string,
    confirmpassword: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.checkIfEmailExists(email).then((methods) => {
        if (methods && methods.length > 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Hata!',
            detail:
              'E-posta adresi başka bir hesap tarafından kullanılıyor. Lütfen yeni e-posta adresi deneyin.',
          });
          reject('E-posta adresi başka bir hesap tarafından kullanılıyor.');
        } else {
          // E-posta adresi kullanılabilir, kayıt işlemine devam edin.
          this.afu
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              return this.afs.collection('users').doc().set({

                name: name,
                username: username,
                email: email,
                phone:phone,
                password: password,
                confirmpassword: confirmpassword,
              });
            })
            .then((user) => {
              this.authState = user;
              resolve(); // İşlem başarılı olduğunda Promise'i çözün.
            })
            .catch((error) => {
              this.messageService.add({
                severity: 'warn',
                summary: 'Hata!',
                detail:
                  'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin',
              });
              reject(error); // Hata oluştuğunda Promise'i reddedin.
            });
        }
      });
    });
  }

  loginWithEmail(email: string, password: string) {
    return this.afu
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.isAuthenticated = true;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  singout(): void {
    this.afu.signOut();
    this.router.navigate(['/']);
  }
}
