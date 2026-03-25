import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { KpisService } from '../../../services/KPIs/kpis.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mttr',
  imports: [MatIcon],
  templateUrl: './mttr.component.html',
  styleUrl: './mttr.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class MttrComponent implements OnInit{
     store = inject(KpisService);
     mttr:string='0';
     constructor(private router: Router){}
    ngOnInit(): void {
        this.store.getKpiData('mttr',2026,3).subscribe(
          {
            next:(data) => {
                this.mttr='';
                console.log(data.mttr);
                this.mttr=data.mttr;
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
