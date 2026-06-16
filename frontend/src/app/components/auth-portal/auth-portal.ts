import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2>SECURE COMMAND PORTAL</h2>
        <p class="subtitle">RESTRICTED AREA: VALIDATION REQUIRED</p>
        
        <div *ngIf="loginError" class="error-banner">
          ⚠️ {{ loginError }}
        </div>

        <div class="form-group">
          <label>COMMANDER ID:</label>
          <input 
            type="text" 
            [(ngModel)]="credentials.username" 
            placeholder="Enter operator username"
            class="terminal-input"
          >
        </div>

        <div class="form-group">
          <label>SECURITY PASSCODE:</label>
          <input 
            type="password" 
            [(ngModel)]="credentials.password" 
            placeholder="Enter master passcode" 
            class="terminal-input"
            (keyup.enter)="validateCredentials()"
          >
        </div>

        <button (click)="validateCredentials()" class="terminal-btn">
          INITIALIZE INTERFACE KEYPAD 🔑
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      font-family: 'Courier New', Courier, monospace;
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      background: #0f1115;
      color: #00ff66;
      border: 2px solid #00ff66;
      padding: 35px;
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(0, 255, 102, 0.25);
    }
    h2 {
      text-align: center;
      margin: 0 0 5px 0;
      color: #ffffff;
      letter-spacing: 1px;
      font-size: 22px;
    }
    .subtitle {
      text-align: center;
      color: #666;
      font-size: 11px;
      margin-bottom: 30px;
      letter-spacing: 0.5px;
    }
    .error-banner {
      background: rgba(220, 53, 69, 0.15);
      color: #ff4d5a;
      border: 1px solid #ff4d5a;
      padding: 10px;
      margin-bottom: 20px;
      border-radius: 4px;
      font-size: 13px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: bold;
      font-size: 12px;
    }
    .terminal-input {
      width: 100%;
      padding: 10px;
      background: #161a22;
      border: 1px solid #333;
      color: #ffffff;
      box-sizing: border-box;
      border-radius: 4px;
      font-family: inherit;
    }
    .terminal-input:focus {
      outline: none;
      border-color: #00ff66;
      box-shadow: 0 0 5px rgba(0, 255, 102, 0.5);
    }
    .terminal-btn {
      width: 100%;
      background: #00ff66;
      color: #0b0c10;
      border: none;
      padding: 12px;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      border-radius: 4px;
      font-family: inherit;
      transition: all 0.2s ease;
    }
    .terminal-btn:hover {
      background: #00cc52;
      box-shadow: 0 0 10px rgba(0, 255, 102, 0.4);
    }
  `]
})
export class AuthPortalComponent implements OnInit {
  
  // ✅ Production standard: Emits events outward to notify parent wrapper blocks
  @Output() loginSuccess = new EventEmitter<string>();

  credentials = { username: '', password: '' };
  loginError: string = '';

  ngOnInit() {
    // Session persistent checking
    if (sessionStorage.getItem('active_defense_session') === 'true') {
      const savedUser = sessionStorage.getItem('session_user') || 'Admin';
      this.loginSuccess.emit(savedUser);
    }
  }

  validateCredentials() {
    this.loginError = '';
    
    const user = this.credentials.username.trim();
    const pass = this.credentials.password;

    // Production Fallback Testing Accounts
    if (user === 'admin' && pass === 'admin123') {
      sessionStorage.setItem('active_defense_session', 'true');
      sessionStorage.setItem('session_user', user);
      
      // Notify parent system container to unlock layout nodes
      this.loginSuccess.emit(user);
    } else {
      this.loginError = 'INVALID CREDENTIALS CODE. PORTAL DEVIATION CAPTURED.';
    }
  }
}