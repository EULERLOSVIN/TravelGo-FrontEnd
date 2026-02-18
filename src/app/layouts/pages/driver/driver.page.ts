import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NavbarDriverComponent } from "../../components/navbar-driver/navbar-driver.component";

@Component({
  selector: 'app-driver',
  imports: [RouterOutlet, NavbarDriverComponent],
  templateUrl: './driver.page.html',
  styleUrl: './driver.page.scss',
})
export class DriverPage {

}
