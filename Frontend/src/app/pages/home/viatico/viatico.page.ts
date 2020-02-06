import { CrearGastoPage } from './../components/crear-gasto/crear-gasto.page';
import { HttpClient } from '@angular/common/http';
import { ToastController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { formatDate } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {OverlayEventDetail} from '@ionic/core'; 


@Component({
  selector: 'app-viatico',
  templateUrl: './viatico.page.html',
  styleUrls: ['./viatico.page.scss','../../../app.component.scss'],
})
export class ViaticoPage implements OnInit {

  //@Input() comision: string  = '';
  comisionCompleta = '';
  comision: Number;
  viatico: any;
  id_viatico: Number;
  fgCreate: FormGroup;
  fgGasto: FormGroup;
  token: string;
  guardado = false;
  myDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController
    ) {
      this.comision = +this.activatedRoute.snapshot.paramMap.get('folio');
      this.fgCreate = this.formBuilder.group({
        id_comision: new FormControl(this.comision, [Validators.required]),
        invitado_nombre: new FormControl('', []),
        comentarios: new FormControl('', [Validators.required])
      });
    }

  ngOnInit() {
    this.getComision();
    
    //this.fgCreate.value.id_comision = this.comisionCompleta;
    
  }

  async getComision(){
    const resp = await this.auth.getComision(this.comision);
    if (resp) {
      this.comisionCompleta = resp;
    } else {
      this.presentToast(resp.mensaje);
    }
  }

  async saveViatico(){
    if (this.fgCreate.valid) {
     
      const resp = await this.auth.saveViatico(this.fgCreate.value).toPromise();
      if (resp) {
        this.presentToast('Guardado correctamente');
        this.viatico = resp;
        this.guardado = true;      
        this.id_viatico = this.viatico.body.id_viatico;
      } else {
        this.presentToast('Error');
      }
    } else {
      this.presentToast('Datos no Validos');
    }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async openModal() {
    const modal: HTMLIonModalElement =
       await this.modalController.create({
          component: CrearGastoPage,
          componentProps: {
            id_viatico: this.id_viatico,
          }
    });
     
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
       if (detail !== null) {
         console.log('The result: ', detail.data);
       }
    });
    
    await modal.present();
  }

}
