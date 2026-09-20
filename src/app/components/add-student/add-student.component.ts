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
  cycle: "Bachelor" | "Master" | "" = "";

  success = false;
  addedName = "";
  errorMsg = "";

  faculties = [
    "Automation and Computers",
    "Electronics and Telecommunications",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemistry",
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
      !this.cycle
    ) {
      this.errorMsg = "All fields are required.";
      return;
    }

    this.studentService
      .addStudent({
        name: this.name.trim(),
        email: this.email.trim(),
        faculty: this.faculty,
        year: this.year,
        cycle: this.cycle as "Bachelor" | "Master",
      })
      .subscribe({
        next: (student) => {
          this.addedName = student.name;
          this.success = true;
          this.name = "";
          this.email = "";
          this.faculty = "";
          this.year = 1;
          this.cycle = "";
        },
      });
  }

  onCycleChange(): void {
    if (this.cycle === "Master" && this.year > 2) {
      this.year = 1;
    }
  }

  goToList(): void {
    this.router.navigate(["/students"]);
  }
}
