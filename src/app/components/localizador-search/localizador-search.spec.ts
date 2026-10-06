import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizadorSearch } from './localizador-search';

describe('LocalizadorSearch', () => {
  let component: LocalizadorSearch;
  let fixture: ComponentFixture<LocalizadorSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalizadorSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(LocalizadorSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
