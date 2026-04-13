import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  email = "";
  password = "";
  errorMsg = "";

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogin(): void {
    this.errorMsg = "";
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMsg = "Email si parola sunt obligatorii.";
      return;
    }

    if (this.authService.login(this.email, this.password)) {
      this.router.navigate(["/dashboard"]);
    } else {
      this.errorMsg = "Email sau parola incorecte.";
    }
  }
}
