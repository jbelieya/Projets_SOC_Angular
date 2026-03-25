import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { KpisService } from '../../../services/KPIs/kpis.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mttd',
  imports: [MatIcon],
  templateUrl: './mttd.component.html',
  styleUrl: './mttd.component.css'
})
export class MTTDComponent implements OnInit {
store = inject(KpisService);
     mttd:string='0';
     constructor(private router: Router){}
    ngOnInit(): void {
        this.store.getKpiData('mttd',2026,3).subscribe(
          {
            next:(data) => {
                this.mttd='';
                console.log(data.mttd);
                this.mttd=data.mttd;
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


