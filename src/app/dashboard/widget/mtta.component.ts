import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { KpisService } from '../../services/KPIs/kpis.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mtta',
  imports: [MatIcon],
  templateUrl: './mtta.component.html',
  styleUrl: './mtta.component.css'
})
export class MTTAComponent implements OnInit{
store = inject(KpisService);
     mtta:string='0';
     constructor(private router: Router){}
    ngOnInit(): void {
        this.store.getKpiData('mtta',2026,3).subscribe(
          {
            next:(data) => {
                this.mtta='';
                console.log(data.mtta);
                this.mtta=data.mtta;
            },
            error:(err) =>{
               if (err.status === 401 || err.status === 403) {
                       Swal.fire({
                         title: 'Access Denied',
                         text: 'You are not authorized to access dashborde.',
                         icon: 'warning',
                         confirmButtonText: 'Go to Login',
                         confirmButtonColor: '#4f46e5' // Indigo color
                       }).then((result) => {
                         if (result.isConfirmed) {
                           this.router.navigate(['/login']); // Redirect l-page l-login
                         }
                       });
                     } else {
                       // Error o5ra (server down, etc.)
                       Swal.fire('Error', 'An error occurred while dashboard the incident.', 'error');
                     }
                   }
                 });
            }
          }

