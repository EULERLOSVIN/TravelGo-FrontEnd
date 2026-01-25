import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {

  listPlaces = [
    {id:1, name:'Lima'},
    {id:2, name:'Arequipa'},
    {id:3, name:'Trujillo'},
    {id:4, name:'Cusco'},
    {id:5, name:'Iquitos'},
    {id:6, name:'Puno'},
    {id:7, name:'Chiclayo'}
  ]
}
