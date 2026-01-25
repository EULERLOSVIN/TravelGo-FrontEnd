import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main.page',
  imports: [RouterOutlet,CommonModule, RouterLink],
  templateUrl: './main.page.html',
  styleUrl: './main.page.scss',
})
export class MainPage {

}
