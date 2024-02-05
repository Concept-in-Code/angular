import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PasswordService } from '../../services/password.service';

@Component({
  selector: 'cin-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ]
})
export class PasswordStrengthComponent {

  public rate = this.passwordService.passwordStrength();

  constructor(
    private passwordService: PasswordService,
  ) { }
}