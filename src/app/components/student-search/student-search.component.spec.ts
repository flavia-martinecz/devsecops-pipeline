import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { StudentSearchComponent } from "./student-search.component";
import { StudentService } from "../../services/student.service";

describe("StudentSearchComponent", () => {
  let component: StudentSearchComponent;
  let fixture: ComponentFixture<StudentSearchComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [StudentSearchComponent, FormsModule],
      providers: [StudentService, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should not search on empty query", () => {
    component.searchQuery = "   ";
    component.onSearch();
    expect(component.searched).toBeFalse();
  });

  it("should initialize with empty results", () => {
    expect(component.results).toEqual([]);
    expect(component.searched).toBeFalse();
  });

  it("should find students by name", () => {
    component.searchQuery = "Maria";
    component.onSearch();
    expect(component.results.length).toBe(1);
    expect(component.results[0].name).toBe("Maria Ionescu");
  });

  it("should find students by faculty", () => {
    component.searchQuery = "Automatica";
    component.onSearch();
    expect(component.results.length).toBe(5);
  });

  it("should return no results for unknown query", () => {
    component.searchQuery = "xyznonexistent";
    component.onSearch();
    expect(component.results.length).toBe(0);
    expect(component.searched).toBeTrue();
  });

  it("should quick search by tag", () => {
    component.quickSearch("Mecanica");
    expect(component.searchQuery).toBe("Mecanica");
    expect(component.results.length).toBe(1);
  });
});
