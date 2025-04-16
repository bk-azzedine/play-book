import {inject, Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from '@angular/forms';
import {catchError, map, Observable, of} from 'rxjs';
import {UserService} from '../../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class EmailValidator implements AsyncValidator {
  userService = inject(UserService);


  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.userService.checkEmail(control.value).pipe(
      map((isTaken) => (isTaken ? {emailTaken: true} : null)),
      catchError(() => of(null)),
    );
  }
}
