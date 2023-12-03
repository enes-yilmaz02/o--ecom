import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-deneme',
  templateUrl: './deneme.component.html',
  styleUrls: ['./deneme.component.scss']
})
export class DenemeComponent {
  items: MenuItem[] | undefined;
  activeIndex: number = 0;
  countdown: string = '00:00:05'; // 1 hour and 20 minutes

  constructor(public messageService: MessageService) {}

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
    this.resetCountdown();
  }

  resetCountdown() {
    // Reset the countdown when the active index changes
    this.countdown = '00:00:05';
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Personal',
        command: (event: any) => {
          this.messageService.add({
            severity: 'info',
            summary: 'First Step',
            detail: event.item.label,
          });
          this.startCountdown();
        },
      },
      {
        label: 'Seat',
        command: (event: any) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Second Step',
            detail: event.item.label,
          });
          this.startCountdown();
        },
      },
      {
        label: 'Payment',
        command: (event: any) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Third Step',
            detail: event.item.label,
          });
          this.startCountdown();
        },
      },
      {
        label: 'Confirmation',
        command: (event: any) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Last Step',
            detail: event.item.label,
          });
          this.resetCountdown();
        },
      },
    ];
  }

  startCountdown() {
    const timer = setInterval(() => {
      const timeParts = this.countdown.split(':');
      let hours = parseInt(timeParts[0]);
      let minutes = parseInt(timeParts[1]);
      let seconds = parseInt(timeParts[2]);

      if (hours === 0 && minutes === 0 && seconds === 0) {
        clearInterval(timer);
        // Move to the next step when the countdown reaches zero
        this.moveToNextStep();
      } else {
        // Decrement the countdown
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            }
          }
        }

        // Update the countdown string
        this.countdown = this.formatTime(hours) + ':' + this.formatTime(minutes) + ':' + this.formatTime(seconds);
      }
    }, 1000);
  }

  formatTime(value: number): string {
    // Helper function to format time values (e.g., add leading zeros)
    return value < 10 ? '0' + value : value.toString();
  }

  moveToNextStep() {
    // Move to the next step programmatically
    if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++;
      this.resetCountdown();
    }
  }
}
