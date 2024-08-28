/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoginSpaceComponent } from './login.component';

describe('LoginSpaceComponent', () => {
  let component: LoginSpaceComponent;
  let fixture: ComponentFixture<LoginSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginSpaceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
