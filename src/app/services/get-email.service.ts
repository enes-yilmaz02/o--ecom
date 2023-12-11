import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetEmailService {
  private email: string;

  setEmail(email: string): void {
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }
}
