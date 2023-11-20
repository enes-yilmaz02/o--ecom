import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  creoterId:any;

  creoterData:any;

  constructor(private userService:UserService){
    this.getUserId().subscribe(()=>{
      this.userService.getUser(this.creoterId).subscribe((creoterData:any)=>{
        this.creoterData=creoterData;
        console.log(creoterData);
      })
    })
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.creoterId = id;
        console.log(this.creoterId);
      })
    );
  }
}
