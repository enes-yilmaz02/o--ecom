import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneratedCodeService {
  private generatedCode: string;

  setGeneratedCode(code: string): void {
    this.generatedCode = code;
  }

  getGeneratedCode(): string {
    return this.generatedCode;
  }
}
