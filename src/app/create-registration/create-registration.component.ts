import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent {
  [x: string]: any;
  public packages:string[] =["Monthly","Quaterly","Yearly"];
  public genders:string[] = ["Male","Female"];
  public importantList:string[]=["Toxic Fat reducation",
  "Energy and Endurance",
  "Building Lean Muscle",                          
  "Healthier Digestive System",
  "Sugar Craving Body",
  "Fitness"];


  public isUpdateActive: boolean = false;
  registrationForm!: FormGroup;
  private userIdToUpdate!: number;


  constructor(private fb: FormBuilder, private api: ApiService, private activatedRoute: ActivatedRoute,private toastService: NgToastService,private router: Router){
    
  }
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: ['']
    });
      this.registrationForm.controls['height'].valueChanges.subscribe(res=>{
        this.calculateBmi(res);
      })
      this.activatedRoute.params.subscribe(val => {
        this.userIdToUpdate = val['id'];
        
        this.api.getRegisteredUserId(this.userIdToUpdate)
        .subscribe(res=>{
        this.isUpdateActive=true;
          this.fillFormToUpdate(res);
        })
      })  
    }    
  submit() {
    this.api.postRegistration(this.registrationForm.value)
    .subscribe(res => {
      this.toastService.success({ detail: 'SUCCESS', summary: 'Registration Successful', duration: 3000 });
      this.registrationForm.reset();
    });
  }
  update(){
      this.api.updateRegisterUser(this.registrationForm.value, this.userIdToUpdate)
      .subscribe(res => {
        this.toastService.success({ detail: 'SUCCESS', summary: 'Enquiry Updated', duration: 3000 });
        this.registrationForm.reset();
        this.router.navigate(['list']);
      });
  }

  calculateBmi(heightvalue: number) {
    const weight = this.registrationForm.value.weight; // weight in kilograms
    const height = heightvalue; // height in meters
    const bmi = weight / (height * height);
    this.registrationForm.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi < 18.5:
        this.registrationForm.controls['bmiResult'].patchValue("Underweight");
        break;
      case (bmi >= 18.5 && bmi < 25):
        this.registrationForm.controls['bmiResult'].patchValue("Normal");
        break;
      case (bmi >= 25 && bmi < 30):
        this.registrationForm.controls['bmiResult'].patchValue("Overweight");
        break;

      default:
        this.registrationForm.controls['bmiResult'].patchValue("Obese");
        break;
    }
  }

fillFormToUpdate(user: User) {
    this.registrationForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate
    })
  }
}

function subscribe(arg0: (res: any) => void) {
  throw new Error('Function not implemented.');
}
