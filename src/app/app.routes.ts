import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentSearchComponent } from './components/student-search/student-search.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { GradesReportComponent } from './components/grades-report/grades-report.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'students', component: StudentListComponent },
  { path: 'search', component: StudentSearchComponent },
  { path: 'add-student', component: AddStudentComponent },
  { path: 'grades', component: GradesReportComponent },
];
