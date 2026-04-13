import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { DashboardStats } from '../../models/student.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  error = '';

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getStats().subscribe({
      next: (data) => (this.stats = data),
      error: (err) => (this.error = 'Eroare la incarcarea statisticilor: ' + err.message),
    });
  }
}
