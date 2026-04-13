import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { Student, Grade } from '../../models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  loading = true;
  selectedStudent: Student | null = null;
  selectedGrades: Grade[] = [];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  selectStudent(student: Student): void {
    this.selectedStudent = student;
    this.selectedGrades = this.studentService.getGradesForStudent(student.id);
  }

  getGradeCount(studentId: number): number {
    return this.studentService.getGradesForStudent(studentId).length;
  }

  getAverage(studentId: number): number {
    const grades = this.studentService.getGradesForStudent(studentId);
    if (grades.length === 0) return 0;
    return grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
  }
}
