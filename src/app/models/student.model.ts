export interface Student {
  id: number;
  name: string;
  email: string;
  faculty: string;
  year: number;
  ciclu: 'Licenta' | 'Masterat';
  enrolledAt?: string;
}

export interface Grade {
  id: number;
  studentId: number;
  subject: string;
  grade: number;
  semester: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalGrades: number;
  averageGrade: number;
}
