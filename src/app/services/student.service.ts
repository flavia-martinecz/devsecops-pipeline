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
      faculty: "Automation and Computers",
      year: 3,
      cycle: "Bachelor",
    },
    {
      id: 2,
      name: "Andrei Popescu",
      email: "andrei.popescu@student.upt.ro",
      faculty: "Automation and Computers",
      year: 2,
      cycle: "Bachelor",
    },
    {
      id: 3,
      name: "Elena Dumitrescu",
      email: "elena.dumitrescu@student.upt.ro",
      faculty: "Electronics and Telecommunications",
      year: 4,
      cycle: "Bachelor",
    },
    {
      id: 4,
      name: "Alexandru Marin",
      email: "alex.marin@student.upt.ro",
      faculty: "Mechanical Engineering",
      year: 1,
      cycle: "Master",
    },
    {
      id: 5,
      name: "Ioana Stanescu",
      email: "ioana.stanescu@student.upt.ro",
      faculty: "Automation and Computers",
      year: 3,
      cycle: "Master",
    },
    {
      id: 6,
      name: "Cristian Radu",
      email: "cristian.radu@student.upt.ro",
      faculty: "Electronics and Telecommunications",
      year: 2,
      cycle: "Bachelor",
    },
    {
      id: 7,
      name: "Ana Georgescu",
      email: "ana.georgescu@student.upt.ro",
      faculty: "Civil Engineering",
      year: 1,
      cycle: "Bachelor",
    },
    {
      id: 8,
      name: "Mihai Popa",
      email: "mihai.popa@student.upt.ro",
      faculty: "Automation and Computers",
      year: 4,
      cycle: "Master",
    },
    {
      id: 9,
      name: "Diana Florea",
      email: "diana.florea@student.upt.ro",
      faculty: "Chemistry",
      year: 2,
      cycle: "Bachelor",
    },
    {
      id: 10,
      name: "Stefan Moldovan",
      email: "stefan.moldovan@student.upt.ro",
      faculty: "Automation and Computers",
      year: 1,
      cycle: "Master",
    },
  ];

  private mockGrades: Grade[] = [
    {
      id: 1,
      studentId: 1,
      subject: "Cloud Application Security",
      grade: 10,
      semester: "2026-2",
    },
    {
      id: 2,
      studentId: 1,
      subject: "Computer Networks",
      grade: 9,
      semester: "2026-1",
    },
    {
      id: 3,
      studentId: 2,
      subject: "Algorithms and Data Structures",
      grade: 8,
      semester: "2025-1",
    },
    {
      id: 4,
      studentId: 2,
      subject: "Databases",
      grade: 7,
      semester: "2025-1",
    },
    {
      id: 5,
      studentId: 3,
      subject: "Operating Systems",
      grade: 9,
      semester: "2025-2",
    },
    {
      id: 6,
      studentId: 4,
      subject: "Mathematics 1",
      grade: 6,
      semester: "2025-1",
    },
    {
      id: 7,
      studentId: 5,
      subject: "Software Engineering",
      grade: 10,
      semester: "2025-2",
    },
    { id: 8, studentId: 5, subject: "DevOps", grade: 9, semester: "2025-2" },
    {
      id: 9,
      studentId: 6,
      subject: "Digital Electronics",
      grade: 8,
      semester: "2026-1",
    },
    {
      id: 10,
      studentId: 7,
      subject: "Strength of Materials",
      grade: 7,
      semester: "2025-1",
    },
    {
      id: 11,
      studentId: 8,
      subject: "Artificial Intelligence",
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
      subject: "Organic Chemistry",
      grade: 8,
      semester: "2025-1",
    },
    {
      id: 14,
      studentId: 10,
      subject: "C Programming",
      grade: 7,
      semester: "2026-1",
    },
  ];

  private readonly LS_STUDENTS = "portal_students";
  private readonly LS_GRADES = "portal_grades";

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  // Data saved in localStorage before the app was translated to English
  private readonly LEGACY_FACULTIES: Record<string, string> = {
    "Automatica si Calculatoare": "Automation and Computers",
    "Electronica si Telecomunicatii": "Electronics and Telecommunications",
    Mecanica: "Mechanical Engineering",
    Constructii: "Civil Engineering",
    Chimie: "Chemistry",
  };
  private readonly LEGACY_CYCLES: Record<string, Student["cycle"]> = {
    Licenta: "Bachelor",
    Masterat: "Master",
  };
  private readonly LEGACY_SUBJECTS: Record<string, string> = {
    "Securitatea Aplicatiilor Cloud": "Cloud Application Security",
    "Retele de Calculatoare": "Computer Networks",
    "Algoritmi si Structuri de Date": "Algorithms and Data Structures",
    "Baze de Date": "Databases",
    "Sisteme de Operare": "Operating Systems",
    "Matematica 1": "Mathematics 1",
    "Inginerie Software": "Software Engineering",
    "Electronica Digitala": "Digital Electronics",
    "Rezistenta Materialelor": "Strength of Materials",
    "Inteligenta Artificiala": "Artificial Intelligence",
    "Chimie Organica": "Organic Chemistry",
    "Programare C": "C Programming",
  };

  private loadFromStorage(): void {
    const savedStudents = localStorage.getItem(this.LS_STUDENTS);
    if (savedStudents) {
      const parsed = JSON.parse(savedStudents);
      this.mockStudents = parsed.map(
        (s: Student & { ciclu?: string }, i: number): Student => {
          const rawCycle = s.cycle ?? s.ciclu;
          const cycle =
            (rawCycle && (this.LEGACY_CYCLES[rawCycle] ?? rawCycle)) ||
            this.mockStudents[i]?.cycle ||
            "Bachelor";
          return {
            id: s.id,
            name: s.name,
            email: s.email,
            faculty: this.LEGACY_FACULTIES[s.faculty] ?? s.faculty,
            year: s.year,
            cycle: cycle as Student["cycle"],
            ...(s.enrolledAt ? { enrolledAt: s.enrolledAt } : {}),
          };
        },
      );
      this.saveStudents();
    }
    const savedGrades = localStorage.getItem(this.LS_GRADES);
    if (savedGrades) {
      const parsed: Grade[] = JSON.parse(savedGrades);
      this.mockGrades = parsed.map((g) => ({
        ...g,
        subject: this.LEGACY_SUBJECTS[g.subject] ?? g.subject,
      }));
      this.saveGrades();
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
      cycle: student.cycle!,
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
