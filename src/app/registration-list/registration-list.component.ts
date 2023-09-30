import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit {
  public users!: User[];
  dataSource!: MatTableDataSource<User>;
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'mobile', 'bmiResult', 'gender', 'package', 'enquiryDate', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private apiService: ApiService, private router: Router, private confirmService: NgConfirmService,private toastService: NgToastService) {

  }
  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.apiService.getRegisteredUser()
      .subscribe(res=>{
          this.users = res;
          this.dataSource = new MatTableDataSource(this.users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
    }
    
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    edit(id: number) {
      this.router.navigate(['update', id])
    }

    delete(id: number) {
      this.confirmService.showConfirm("Are you sure you want to delete?",
        () => {
          // Logic if 'Yes' is clicked
          this.apiService.deleteRegistered(id)
            .subscribe({
              next: (res) => {
                // User was deleted successfully
                this.toastService.success({ detail: 'SUCCESS', summary: 'Deleted Successfully', duration: 3000 });
                // Refresh the user list
                this.getUsers();
              },
              error: (err) => {
                // Error occurred during deletion
                this.toastService.error({ detail: 'ERROR', summary: 'Something went wrong!', duration: 3000 });
              }
            });
        },
        () => {
          // Logic if 'No' is clicked (No action required)
        }
      );
    }
    
 } 
