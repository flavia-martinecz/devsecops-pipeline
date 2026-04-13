import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { StudentListComponent } from "./student-list.component";
import { StudentService } from "../../services/student.service";

describe("StudentListComponent", () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        StudentService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load 10 students", () => {
    expect(component.students.length).toBe(10);
    expect(component.loading).toBeFalse();
  });

  it("should select a student and show grades", () => {
    const student = component.students[0];
    component.selectStudent(student);
    expect(component.selectedStudent).toBe(student);
    expect(component.selectedGrades.length).toBeGreaterThan(0);
  });

  it("should calculate grade count", () => {
    expect(component.getGradeCount(1)).toBe(2);
    expect(component.getGradeCount(4)).toBe(1);
  });

  it("should calculate average", () => {
    const avg = component.getAverage(1);
    expect(avg).toBe(9.5);
  });

  it("should return 0 for student without grades", () => {
    expect(component.getAverage(999)).toBe(0);
  });
});
