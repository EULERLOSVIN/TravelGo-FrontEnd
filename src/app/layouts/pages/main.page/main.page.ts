import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-main.page',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './main.page.html',
  styleUrl: './main.page.scss',
})
export class MainPage {

}
