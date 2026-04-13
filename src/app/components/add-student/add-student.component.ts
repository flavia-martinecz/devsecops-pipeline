import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { StudentService } from "../../services/student.service";

@Component({
  selector: "app-add-student",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./add-student.component.html",
  styleUrls: ["./add-student.component.scss"],
})
export class AddStudentComponent {
  name = "";
  email = "";
  faculty = "";
  year: number = 1;
  ciclu: "Licenta" | "Masterat" | "" = "";

  success = false;
  addedName = "";
  errorMsg = "";

  faculties = [
    "Automatica si Calculatoare",
    "Electronica si Telecomunicatii",
    "Mecanica",
    "Constructii",
    "Chimie",
  ];

  constructor(
    private studentService: StudentService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.errorMsg = "";
    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.faculty ||
      !this.ciclu
    ) {
      this.errorMsg = "Toate campurile sunt obligatorii.";
      return;
    }

    this.studentService
      .addStudent({
        name: this.name.trim(),
        email: this.email.trim(),
        faculty: this.faculty,
        year: this.year,
        ciclu: this.ciclu as "Licenta" | "Masterat",
      })
      .subscribe({
        next: (student) => {
          this.addedName = student.name;
          this.success = true;
          this.name = "";
          this.email = "";
          this.faculty = "";
          this.year = 1;
          this.ciclu = "";
        },
      });
  }

  onCicluChange(): void {
    if (this.ciclu === "Masterat" && this.year > 2) {
      this.year = 1;
    }
  }

  goToList(): void {
    this.router.navigate(["/students"]);
  }
}
