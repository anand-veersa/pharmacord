import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Idle,
  DocumentInterruptSource,
  StorageInterruptSource,
} from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthService } from './auth/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'enhancement';
  public idleState = 'Not started.';
  public timedOut = false;
  public lastPing: Date;
  public openLogoutDialog: boolean = false;

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private authService: AuthService
  ) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(environment.setTimeoutInterval * 60);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(10);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(this.createCustomInterruptSources());

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      console.log(this.idleState);
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.openLogoutDialog = false;
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState);
      this.router.navigate(['/logout']);
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = "You've gone idle!";
      console.log(this.idleState);
      this.openLogoutDialog = true;
    });

    idle.onTimeoutWarning.subscribe(countdown => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      console.log(this.idleState);
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.authService.userName.subscribe(userName => {
      if (userName) {
        idle.watch();
        this.timedOut = false;
      } else {
        idle.stop();
      }
    });
    // this.reset();
  }

  public confirmExit(event: boolean): void {
    this.openLogoutDialog = false;
    if (event) this.router.navigate(['/logout']);
    else this.reset();
  }

  private reset(): void {
    this.idle.watch();
    //xthis.idleState = 'Started.';
    this.timedOut = false;
  }

  private createCustomInterruptSources(
    options?: any
  ): [DocumentInterruptSource, StorageInterruptSource] {
    return [
      new DocumentInterruptSource('keydown mousedown click', options),
      new StorageInterruptSource(options),
    ];
  }
}
