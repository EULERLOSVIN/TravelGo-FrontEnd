import { Component } from '@angular/core';
import { SidebarComponent } from "../../components/sidebar.component/sidebar.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-admin',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './admin.page.html',
  styleUrl: './admin.page.scss',
})
export class AdminComponent {

}
