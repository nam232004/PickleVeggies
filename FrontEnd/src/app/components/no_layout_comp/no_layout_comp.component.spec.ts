/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { No_layout_compComponent } from './no_layout_comp.component';

describe('No_layout_compComponent', () => {
  let component: No_layout_compComponent;
  let fixture: ComponentFixture<No_layout_compComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ No_layout_compComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(No_layout_compComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
