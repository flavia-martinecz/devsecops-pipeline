import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { StudentService } from "./student.service";

describe("StudentService", () => {
  let service: StudentService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StudentService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return 10 mock students", (done) => {
    service.getStudents().subscribe((students) => {
      expect(students.length).toBe(10);
      expect(students[0].name).toBe("Maria Ionescu");
      done();
    });
  });

  it("should get single student by id", (done) => {
    service.getStudent(1).subscribe((s) => {
      expect(s.id).toBe(1);
      expect(s.name).toBe("Maria Ionescu");
      done();
    });
  });

  it("should search students by name", (done) => {
    service.searchStudents("Maria").subscribe((results) => {
      expect(results.length).toBe(1);
      expect(results[0].email).toContain("maria");
      done();
    });
  });

  it("should search students by faculty", (done) => {
    service.searchStudents("Automation").subscribe((results) => {
      expect(results.length).toBe(5);
      done();
    });
  });

  it("should return empty for non-matching search", (done) => {
    service.searchStudents("xyznonexistent").subscribe((results) => {
      expect(results.length).toBe(0);
      done();
    });
  });

  it("should return stats with correct totals", (done) => {
    service.getStats().subscribe((stats) => {
      expect(stats.totalStudents).toBe(10);
      expect(stats.totalGrades).toBe(14);
      expect(stats.averageGrade).toBeGreaterThan(0);
      done();
    });
  });

  it("should get grades for student", () => {
    const grades = service.getGradesForStudent(1);
    expect(grades.length).toBe(2);
    expect(grades[0].subject).toBe("Cloud Application Security");
  });

  it("should return empty grades for unknown student", () => {
    expect(service.getGradesForStudent(999).length).toBe(0);
  });

  it("processFormulaSafe should calculate average", () => {
    expect(service.processFormulaSafe(8, 10)).toBe(9);
  });

  it("should migrate legacy Romanian data from localStorage", (done) => {
    localStorage.setItem(
      "portal_students",
      JSON.stringify([
        {
          id: 1,
          name: "Maria Ionescu",
          email: "maria.ionescu@student.upt.ro",
          faculty: "Automatica si Calculatoare",
          year: 3,
          ciclu: "Masterat",
        },
      ]),
    );
    localStorage.setItem(
      "portal_grades",
      JSON.stringify([
        {
          id: 1,
          studentId: 1,
          subject: "Retele de Calculatoare",
          grade: 9,
          semester: "2026-1",
        },
      ]),
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const migrated = TestBed.inject(StudentService);

    migrated.getStudents().subscribe((students) => {
      expect(students.length).toBe(1);
      expect(students[0].faculty).toBe("Automation and Computers");
      expect(students[0].cycle).toBe("Master");
      expect((students[0] as unknown as { ciclu?: string }).ciclu).toBeUndefined();
      expect(migrated.getGradesForStudent(1)[0].subject).toBe("Computer Networks");

      const saved = JSON.parse(localStorage.getItem("portal_students")!);
      expect(saved[0].faculty).toBe("Automation and Computers");
      done();
    });
  });
});
