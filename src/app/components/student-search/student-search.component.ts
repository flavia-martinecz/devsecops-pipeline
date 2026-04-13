import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { StudentService } from "../../services/student.service";
import { Student } from "../../models/student.model";

@Component({
  selector: "app-student-search",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./student-search.component.html",
  styleUrls: ["./student-search.component.scss"],
})
export class StudentSearchComponent {
  searchQuery = "";
  results: Student[] = [];
  searched = false;

  constructor(private studentService: StudentService) {}

  quickSearch(query: string): void {
    this.searchQuery = query;
    this.onSearch();
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) return;

    this.studentService.searchStudents(this.searchQuery).subscribe({
      next: (data) => {
        this.results = data;
        this.searched = true;
      },
      error: () => {
        this.results = [];
        this.searched = true;
      },
    });
  }
}
