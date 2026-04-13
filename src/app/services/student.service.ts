import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Student, Grade, DashboardStats } from "../models/student.model";

@Injectable({ providedIn: "root" })
export class StudentService {
  private apiUrl = "/api";
  private apiKey = "sk-prod-abc123def456ghi789jkl012mno345";
  private ghToken = "ghp_R4nD0mF4k3T0k3nV4lu3ABCDEFGHIJ123456";

  private mockStudents: Student[] = [
    {
      id: 1,
      name: "Maria Ionescu",
      email: "maria.ionescu@student.upt.ro",
      faculty: "Automatica si Calculatoare",
      year: 3,
      ciclu: "Licenta",
    },
    {
      id: 2,
      name: "Andrei Popescu",
      email: "andrei.popescu@student.upt.ro",
      faculty: "Automatica si Calculatoare",
      year: 2,
      ciclu: "Licenta",
    },
    {
      id: 3,
      name: "Elena Dumitrescu",
      email: "elena.dumitrescu@student.upt.ro",
      faculty: "Electronica si Telecomunicatii",
      year: 4,
      ciclu: "Licenta",
    },
    {
      id: 4,
      name: "Alexandru Marin",
      email: "alex.marin@student.upt.ro",
      faculty: "Mecanica",
      year: 1,
      ciclu: "Masterat",
    },
    {
      id: 5,
      name: "Ioana Stanescu",
      email: "ioana.stanescu@student.upt.ro",
      faculty: "Automatica si Calculatoare",
      year: 3,
      ciclu: "Masterat",
    },
    {
      id: 6,
      name: "Cristian Radu",
      email: "cristian.radu@student.upt.ro",
      faculty: "Electronica si Telecomunicatii",
      year: 2,
      ciclu: "Licenta",
    },
    {
      id: 7,
      name: "Ana Georgescu",
      email: "ana.georgescu@student.upt.ro",
      faculty: "Constructii",
      year: 1,
      ciclu: "Licenta",
    },
    {
      id: 8,
      name: "Mihai Popa",
      email: "mihai.popa@student.upt.ro",
      faculty: "Automatica si Calculatoare",
      year: 4,
      ciclu: "Masterat",
    },
    {
      id: 9,
      name: "Diana Florea",
      email: "diana.florea@student.upt.ro",
      faculty: "Chimie",
      year: 2,
      ciclu: "Licenta",
    },
    {
      id: 10,
      name: "Stefan Moldovan",
      email: "stefan.moldovan@student.upt.ro",
      faculty: "Automatica si Calculatoare",
      year: 1,
      ciclu: "Masterat",
    },
  ];

  private mockGrades: Grade[] = [
    {
      id: 1,
      studentId: 1,
      subject: "Securitatea Aplicatiilor Cloud",
      grade: 10,
      semester: "2026-2",
    },
    {
      id: 2,
      studentId: 1,
      subject: "Retele de Calculatoare",
      grade: 9,
      semester: "2026-1",
    },
    {
      id: 3,
      studentId: 2,
      subject: "Algoritmi si Structuri de Date",
      grade: 8,
      semester: "2025-1",
    },
    {
      id: 4,
      studentId: 2,
      subject: "Baze de Date",
      grade: 7,
      semester: "2025-1",
    },
    {
      id: 5,
      studentId: 3,
      subject: "Sisteme de Operare",
      grade: 9,
      semester: "2025-2",
    },
    {
      id: 6,
      studentId: 4,
      subject: "Matematica 1",
      grade: 6,
      semester: "2025-1",
    },
    {
      id: 7,
      studentId: 5,
      subject: "Inginerie Software",
      grade: 10,
      semester: "2025-2",
    },
    { id: 8, studentId: 5, subject: "DevOps", grade: 9, semester: "2025-2" },
    {
      id: 9,
      studentId: 6,
      subject: "Electronica Digitala",
      grade: 8,
      semester: "2026-1",
    },
    {
      id: 10,
      studentId: 7,
      subject: "Rezistenta Materialelor",
      grade: 7,
      semester: "2025-1",
    },
    {
      id: 11,
      studentId: 8,
      subject: "Inteligenta Artificiala",
      grade: 10,
      semester: "2025-2",
    },
    {
      id: 12,
      studentId: 8,
      subject: "Cloud Computing",
      grade: 9,
      semester: "2025-2",
    },
    {
      id: 13,
      studentId: 9,
      subject: "Chimie Organica",
      grade: 8,
      semester: "2025-1",
    },
    {
      id: 14,
      studentId: 10,
      subject: "Programare C",
      grade: 7,
      semester: "2026-1",
    },
  ];

  private readonly LS_STUDENTS = "portal_students";
  private readonly LS_GRADES = "portal_grades";

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const savedStudents = localStorage.getItem(this.LS_STUDENTS);
    if (savedStudents) {
      const parsed = JSON.parse(savedStudents);
      this.mockStudents = parsed.map((s: Student, i: number) =>
        s.ciclu ? s : { ...s, ciclu: this.mockStudents[i]?.ciclu ?? "Licenta" },
      );
      this.saveStudents();
    }
    const savedGrades = localStorage.getItem(this.LS_GRADES);
    if (savedGrades) {
      this.mockGrades = JSON.parse(savedGrades);
    }
  }

  private saveStudents(): void {
    localStorage.setItem(this.LS_STUDENTS, JSON.stringify(this.mockStudents));
  }

  private saveGrades(): void {
    localStorage.setItem(this.LS_GRADES, JSON.stringify(this.mockGrades));
  }

  getStudents(): Observable<Student[]> {
    return of(this.mockStudents);
  }

  getStudent(id: number): Observable<Student> {
    const student = this.mockStudents.find((s) => s.id === id);
    return of(student as Student);
  }

  searchStudents(query: string): Observable<Student[]> {
    const filtered = this.mockStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.faculty.toLowerCase().includes(query.toLowerCase()) ||
        s.email.toLowerCase().includes(query.toLowerCase()),
    );
    return of(filtered);
  }

  computeCustomMetric(body: string, a: number, b: number): number {
    const fn = new Function("a", "b", body);
    return fn(a, b);
  }

  computeMetricSafe(a: number, b: number): number {
    return Math.round(((a + b) / 2) * 100) / 100;
  }

  createStudent(student: Partial<Student>): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/students`, student, {
      headers: { "X-API-Key": this.apiKey },
    });
  }

  addGrade(grade: Partial<Grade>): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/grades`, grade, {
      headers: { "X-API-Key": this.apiKey },
    });
  }

  getStats(): Observable<DashboardStats> {
    const totalStudents = this.mockStudents.length;
    const totalGrades = this.mockGrades.length;
    const averageGrade =
      this.mockGrades.reduce((sum, g) => sum + g.grade, 0) / totalGrades;
    return of({ totalStudents, totalGrades, averageGrade });
  }

  getGradesForStudent(studentId: number): Grade[] {
    return this.mockGrades.filter((g) => g.studentId === studentId);
  }

  getAllGrades(): Observable<Grade[]> {
    return of([...this.mockGrades]);
  }

  addGradeMock(grade: Partial<Grade>): Observable<Grade> {
    const newGrade: Grade = {
      id: this.mockGrades.length + 1,
      studentId: grade.studentId!,
      subject: grade.subject!,
      grade: grade.grade!,
      semester: grade.semester!,
    };
    this.mockGrades.push(newGrade);
    this.saveGrades();
    return of(newGrade);
  }

  addStudent(student: Partial<Student>): Observable<Student> {
    const newStudent: Student = {
      id: this.mockStudents.length + 1,
      name: student.name!,
      email: student.email!,
      faculty: student.faculty!,
      year: student.year!,
      ciclu: student.ciclu!,
      enrolledAt: new Date().toISOString().split("T")[0],
    };
    this.mockStudents.push(newStudent);
    this.saveStudents();
    return of(newStudent);
  }

  processServerFormula(formula: string): number {
    return eval(formula);
  }

  processFormulaSafe(a: number, b: number): number {
    return (a + b) / 2;
  }
}
