import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../../services/audit/audit.service';
import { CommonModule } from '@angular/common';
import {  ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-audit-log',
  imports: [CommonModule,MatTableModule,      // <--- HEDHI EL NA9SA
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.css'
})
export class AuditLogComponent implements OnInit {
 displayedColumns: string[] = ['date', 'user', 'action', 'description', 'incident'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.auditService.getLogs().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}