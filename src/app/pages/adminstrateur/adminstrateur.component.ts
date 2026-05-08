import { Component, OnInit } from '@angular/core';
import { User, UserService, UserStats } from '../../services/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-adminstrateur',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './adminstrateur.component.html',
  styleUrl: './adminstrateur.component.css'
})
export class AdminstrateurComponent implements OnInit {
 
  users: User[] = [];
  filteredUsers: User[] = [];
  stats: UserStats | null = null;
 
  searchTerm = '';
  roleFilter = '';
  statusFilter = '';
 
  loading = false;
  saving = false;
  showModal = false;
  editUser: User | null = null;
 
  selectedIds = new Set<number>();
 
  userForm!: FormGroup;
 
  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {}
 
  ngOnInit(): void {
    this.initForm();
    this.loadStats();
    this.loadUsers();
  }
 
  // ─── Form ─────────────────────────────────────────────────────────────────
 
  initForm(): void {
    this.userForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      role: ['ANALYSTE_N1'],
      telephone: [''],
      is_approved: [false],
      is_active: [true],
    });
  }
 
  // ─── Data Loading ─────────────────────────────────────────────────────────
 
  loadStats(): void {
    this.userService.getStats().subscribe(s => this.stats = s);
  }
 
  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
 
  // ─── Filtering ────────────────────────────────────────────────────────────
 
  applyFilters(): void {
    let list = [...this.users];
 
    if (this.searchTerm) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(u =>
        [u.username, u.email, u.first_name, u.last_name]
          .some(s => s?.toLowerCase().includes(q))
      );
    }
 
    if (this.roleFilter) {
      list = list.filter(u => u.role === this.roleFilter);
    }
 
    if (this.statusFilter === 'approved')  list = list.filter(u => u.is_approved);
    if (this.statusFilter === 'pending')   list = list.filter(u => !u.is_approved);
    if (this.statusFilter === 'active')    list = list.filter(u => u.is_active);
    if (this.statusFilter === 'inactive')  list = list.filter(u => !u.is_active);
 
    this.filteredUsers = list;
    this.selectedIds.clear();
  }
 
  // ─── Selection ────────────────────────────────────────────────────────────
 
  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.filteredUsers.forEach(u => {
      if (checked) this.selectedIds.add(u.id);
      else this.selectedIds.delete(u.id);
    });
  }
 
  toggleRow(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) this.selectedIds.add(id);
    else this.selectedIds.delete(id);
  }
 
  // ─── CRUD ─────────────────────────────────────────────────────────────────
 
  openModal(user: User | null = null): void {
    this.editUser = user;
    this.showModal = true;
    if (user) {
      this.userForm.patchValue({ ...user, password: '' });
      this.userForm.get('password')?.clearValidators();
    } else {
      this.userForm.reset({ role: 'ANALYSTE_N1', is_active: true, is_approved: false });
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }
    this.userForm.get('password')?.updateValueAndValidity();
  }
 
  closeModal(): void {
    this.showModal = false;
    this.editUser = null;
  }
 
  saveUser(): void {
    if (this.userForm.invalid) return;
    this.saving = true;
    const data = this.userForm.value;
 
    const req = this.editUser
      ? this.userService.updateUser(this.editUser.id, data)
      : this.userService.createUser(data);
 
    req.subscribe({
      next: () => {
        this.closeModal();
        this.loadUsers();
        this.loadStats();
        this.saving = false;
      },
      error: () => { this.saving = false; }
    });
  }
 
  deleteUser(id: number): void {
    if (!confirm('Supprimer définitivement cet utilisateur ?')) return;
    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers();
      this.loadStats();
    });
  }
 
  toggleApprove(user: User): void {
    const req = user.is_approved
      ? this.userService.rejectUser(user.id)
      : this.userService.approveUser(user.id);
    req.subscribe(() => { this.loadUsers(); this.loadStats(); });
  }
 
  // ─── Bulk ─────────────────────────────────────────────────────────────────
 
  bulkAction(action: string): void {
    const ids = [...this.selectedIds];
    this.userService.bulkAction(ids, action).subscribe(() => {
      this.selectedIds.clear();
      this.loadUsers();
      this.loadStats();
    });
  }
 
  // ─── Helpers ──────────────────────────────────────────────────────────────
 
  getInitials(user: User): string {
    return ((user.first_name?.[0] || '') + (user.last_name?.[0] || '')).toUpperCase();
  }
 
  getRoleClass(role: string): string {
    return { admin: 'role-admin', ANALYSTE_N1: 'role-n1', ANALYSTE_N2: 'role-n2', manager: 'role-manager' }[role] || '';
  }
}