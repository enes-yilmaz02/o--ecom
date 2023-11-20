import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {


    constructor(public layoutService: LayoutService) { }

    ngOnInit() {

    }
}
