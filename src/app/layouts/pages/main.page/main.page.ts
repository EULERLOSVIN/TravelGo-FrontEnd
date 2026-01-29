import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-main.page',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './main.page.html',
  styleUrl: './main.page.scss',
})
export class MainPage {

}
