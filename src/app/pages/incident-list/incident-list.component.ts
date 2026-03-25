import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../../services/incident.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Mouchkour bch t-khdem el form inline
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-incident-list',
  standalone: true, // A3melha standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.css'
})
export class IncidentListComponent implements OnInit {
openCloseModal(_t14: any) {
throw new Error('Method not implemented.');
}
isLoading = false;
  incidents: any[] = [];
  editingContext = { incidentId: null as number | null, field: null as string | null };
  showCreateModal = false; // Bch t-controle el modal mta3 el création
editingTicketId: number | null = null;
tempTicketValue: string = '';
newIncident = {
  titre: '',
  insiter_typo: 'Mineur',
  plant_name: '',
  raised_by: '', 
  description_investigation: ''
};
showInvestigationModal = false;
selectedIncident: any = {};
activeMenuId: number | null = null;
showEditModal = false;
selectedIncidentForEdit: any = {};
  constructor(private incidentService: IncidentService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.loadIncidents();
  }
getStatusStyles(status: string): string {
  switch (status) {
    case 'Open':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'In Progress':
      return 'bg-amber-50 text-amber-700 border-amber-200'; // Amber khir mel yellow (wadh7a 3al 3in)
    case 'Closed':
      return 'bg-green-50 text-green-700 border-green-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}
  loadIncidents() {
    this.incidentService.getAll().subscribe({
       next: (data) => {
      this.incidents = data
      // Toast notification (sghira w ndhifa)
      Swal.fire({
        icon: 'success',
        title: 'Done!',
        text: 'Incident getAll successfully.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    },
    error: (err) => {
      // Check kén l-error hiya login issue (401 or 403)
      if (err.status === 401 || err.status === 403) {
        Swal.fire({
          title: 'Access Denied',
          text: 'You are not authorized to access this incident.',
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
        Swal.fire('Error', 'An error occurred while getAll the incident.', 'error');
      }
    }
  });
     
  }

editIncident(incident: any): void { 
  // Houni l-logic mta3ek mrigla
  console.log('Editing incident:', incident);
  this.selectedIncidentForEdit = { ...incident }; 
  this.showEditModal = true;
}
saveEdit() {
  this.isLoading = true;
  // n-est-a3mlou l-service eli 3andek (PUT wela PATCH)
  this.incidentService.updateincident(this.selectedIncidentForEdit.id_incident, this.selectedIncidentForEdit)
    .subscribe({
      next: () => {
        this.loadIncidents();
        this.showEditModal = false;
        this.isLoading = false;
        Swal.fire('Success', 'Incident updated successfully', 'success');
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to update incident', 'error');
      }
    });
}
// Method bch t-save-i
saveTicket(incident: any) {
  incident.help_desk_ticket_nb = this.tempTicketValue;
  // Houni t-najiym t-a3mel service call: this.incidentService.updateTicket(...)
  this.editingTicketId = null;
}
  // Acknowledge Action
acknowledge(id: number) {
  this.incidentService.acknowledge(id).subscribe({
    next: () => {
      this.loadIncidents();
      // Toast notification (sghira w ndhifa)
      Swal.fire({
        icon: 'success',
        title: 'Done!',
        text: 'Incident Acknowledged successfully.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    },
    error: (err) => {
      // Check kén l-error hiya login issue (401 or 403)
      if (err.status === 401 || err.status === 403) {
        Swal.fire({
          title: 'Access Denied',
          text: 'You are not authorized to acknowledge this incident.',
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
        Swal.fire('Error', 'An error occurred while acknowledging the incident.', 'error');
      }
    }
  });
}

 toggleMenu(event: Event, id: number) {
  event.stopPropagation();
  // Kén l-ID howa bidou, n-sakkrouh (null). Kén mouch howa, n-7ellouh (id).
  this.activeMenuId = (this.activeMenuId === id) ? null : id;
}

// Bch t-saker l-menu ki t-nzel fi ay blasa b-ra l-menu
@HostListener('document:click', ['$event'])
onDocumentClick(event: Event) { // Houni l-far9
  this.activeMenuId = null;
}
  // Inline Edit Logic
  setEdit(incident: any, field: string) {
    if (incident.incident_status === 'In Progress') {
      this.editingContext = { incidentId: incident.id_incident, field: field };
    }
  }

  saveField(incident: any, field: string) {
    this.editingContext = { incidentId: null, field: null };
    const data = { [field]: incident[field] };
    this.incidentService.investigate(incident.id_incident, data).subscribe(() => {
      this.loadIncidents();
    });
  }
 createIncident() {
  this.isLoading = true;
  
  this.incidentService.create(this.newIncident).subscribe({
    next: () => {
      this.loadIncidents();
      this.showCreateModal = false; // Y-sakkker l-modal
      this.isLoading = false;
      // Reset l-form
      this.newIncident = { titre: '', insiter_typo: 'Mineur', plant_name: '', raised_by: 'User', description_investigation: '' };
    },
    error: (err) => {
       if (err.status === 401 || err.status === 403) {
        Swal.fire({
          title: 'Access Denied',
          text: 'You are not authorized to create  this incident.',
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
        Swal.fire('Error', 'An error occurred while create the incident.', 'error');
      }
    }
  });
}
  canEdit(incident: any): boolean {
const currentUserId = this.authService.getCurrentUserId();
  return String(currentUserId).trim() === String(incident.user_id).trim();
  }

  // Close Incident (Phase 4)
  closeIncident(id: number) {
     // Houni t-najiym t-a3mel modal sghira t-a3ti feha el remediation
     const data = { remediation_destination: "Fixed by Analyst" }; 
     this.incidentService.close(id, data).subscribe(() => this.loadIncidents());
  }

  exportPDF(incident: any) {
    alert("Exporting Report for: " + incident.titre);
    // Houni t-connecti library PDF (kif jspdf)
  }
  openInvestigationModal(incident: any) {
  this.selectedIncident = { ...incident }; // N-copiw l-data bch ma t-t-badalch l-UI wa7adha
  this.showInvestigationModal = true;
}
saveInvestigation() {
  this.incidentService.investigate(this.selectedIncident.id_incident, this.selectedIncident).subscribe({
    next: () => {
      this.loadIncidents(); // Refresh l-tableau
      this.showInvestigationModal = false;
      Swal.fire('Updated!', 'Investigation details saved.', 'success');
    },
    error: (err) => Swal.fire('Error', 'Failed to save details.', 'error')
  });
}
updateIncidentField(incident: any) {
  if (!this.canEdit(incident)) return;

  // On envoie les données au backend
  this.incidentService.updateincident(incident.id_incident, incident).subscribe({
    next: (res) => {
      console.log('Champ mis à jour avec succès');
      // Optionnel: a3mel toast sghira bch l-analyste ya3ref elli tsajlet
    },
    error: (err) => {
      console.error('Erreur lors de la mise à jour', err);
      // Ken saret mochkla, t-najem t-rajja3 el list mel backend bch t-reset el data
      this.loadIncidents(); 
    }
  });
}
onExportRapport(id: number) {
    this.incidentService.downloadRapport(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Incident_Report_${id}.pdf`; // Esm el fichier 3and el user
        a.click();
        window.URL.revokeObjectURL(url); // N-nadhou el mémoire
      },
      error: (err) => {
        console.error("Erreur lors de l'export PDF", err);
        alert("Impossible de générer le rapport pour le moment.");
      }
    });
  }
}