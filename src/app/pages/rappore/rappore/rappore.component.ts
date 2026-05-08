import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '../../../services/incident.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rappore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rappore.component.html',
  styleUrl: './rappore.component.css'
})
export class RapporeComponent implements OnInit {
  incident: any = {};
  isLoading = false;
  selectedFile: File | null = null; 
  selectedImage: any = null;        
  selectedImageName: string = '';
  constructor(
    private route: ActivatedRoute,
    private incidentService: IncidentService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIncidentData(+id);
    }
  }

  loadIncidentData(id: number) {
    this.incidentService.getById(id).subscribe(data => {
      this.incident = data;
    });
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedImageName = this.selectedFile.name;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);

      console.log("File captured:", this.selectedFile); // ثبت في الـ Console تلقى تفاصيل الملف
    }
  }
  exportToPDF() {
    this.isLoading = true;
    const formData = new FormData();

    formData.append('description_investigation', this.incident.description_investigation || '');
    formData.append('remediation_destination', this.incident.remediation_destination || '');

    if (this.selectedFile) {
      formData.append('evidence_image', this.selectedFile);
    }

    this.incidentService.downloadRapport(this.incident.id_incident, formData).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Incident_Report_${this.incident.id_incident}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      Swal.fire({
          icon: 'success',
          title: 'Export Successful!',
          text: 'Your PDF report has been generated.',
          confirmButtonColor: '#001f3f'
        });
      },
      error: async (err) => {
        this.isLoading = false;
        
        let errorMessage = "An unexpected error occurred.";

        if (err.status === 403) {
          const errText = await err.error.text();
          const errObj = JSON.parse(errText);
          errorMessage = errObj.error || "You are not authorized.";
        }

        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: errorMessage,
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}