import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { forkJoin } from "rxjs";
import { StudentService } from "../../services/student.service";
import { Student, Grade } from "../../models/student.model";

interface EnrichedGrade extends Grade {
  studentName: string;
  faculty: string;
}

@Component({
  selector: "app-grades-report",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./grades-report.component.html",
  styleUrls: ["./grades-report.component.scss"],
})
export class GradesReportComponent implements OnInit {
  allGrades: EnrichedGrade[] = [];
  filteredGrades: EnrichedGrade[] = [];
  allStudents: Student[] = [];

  filterFaculty = "";
  filterSemester = "";

  faculties: string[] = [];
  semesters: string[] = [];

  newStudentId: number | "" = "";
  newSubject = "";
  newGrade: number = 10;
  newSemester = "2026-2";
  gradeSuccess = false;
  gradeError = "";

  readonly gradeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  readonly semesterOptions = ["2026-2", "2026-1", "2025-2", "2025-1"];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      students: this.studentService.getStudents(),
      grades: this.studentService.getAllGrades(),
    }).subscribe(({ students, grades }) => {
      this.allStudents = students;

      const map = new Map<number, Student>(students.map((s) => [s.id, s]));
      this.allGrades = grades.map((g) => ({
        ...g,
        studentName: map.get(g.studentId)?.name ?? "Necunoscut",
        faculty: map.get(g.studentId)?.faculty ?? "-",
      }));

      this.faculties = [
        ...new Set(this.allGrades.map((g) => g.faculty)),
      ].sort();
      this.semesters = [...new Set(this.allGrades.map((g) => g.semester))]
        .sort()
        .reverse();

      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredGrades = this.allGrades.filter((g) => {
      const matchFaculty =
        !this.filterFaculty || g.faculty === this.filterFaculty;
      const matchSemester =
        !this.filterSemester || g.semester === this.filterSemester;
      return matchFaculty && matchSemester;
    });
  }

  getOverallAverage(): number {
    if (!this.filteredGrades.length) return 0;
    return (
      this.filteredGrades.reduce((s, g) => s + g.grade, 0) /
      this.filteredGrades.length
    );
  }

  getSubjectStats(): { subject: string; count: number; avg: number }[] {
    const map = new Map<string, number[]>();
    this.filteredGrades.forEach((g) => {
      if (!map.has(g.subject)) map.set(g.subject, []);
      map.get(g.subject)!.push(g.grade);
    });
    return [...map.entries()]
      .map(([subject, grades]) => ({
        subject,
        count: grades.length,
        avg: grades.reduce((s, v) => s + v, 0) / grades.length,
      }))
      .sort((a, b) => b.avg - a.avg);
  }

  onAddGrade(): void {
    this.gradeError = "";
    this.gradeSuccess = false;

    if (!this.newStudentId || !this.newSubject.trim() || !this.newSemester) {
      this.gradeError = "Toate campurile sunt obligatorii.";
      return;
    }

    this.studentService
      .addGradeMock({
        studentId: +this.newStudentId,
        subject: this.newSubject.trim(),
        grade: this.newGrade,
        semester: this.newSemester,
      })
      .subscribe({
        next: () => {
          this.gradeSuccess = true;
          this.newStudentId = "";
          this.newSubject = "";
          this.newGrade = 10;
          this.newSemester = "2026-2";
          this.loadData();
        },
      });
  }
}
