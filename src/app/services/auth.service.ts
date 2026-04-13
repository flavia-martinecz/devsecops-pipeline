import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AuthService {
  private jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVQVCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  private password = "SuperSecret123!";
  private isAuthenticated = false;
  private currentUser: string | null = null;

  login(email: string, inputPassword: string): boolean {
    if (inputPassword === this.password) {
      this.isAuthenticated = true;
      this.currentUser = email;
      localStorage.setItem("auth_token", this.jwtToken);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.currentUser = null;
    localStorage.removeItem("auth_token");
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getUser(): string | null {
    return this.currentUser;
  }
}
