import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import cryptoJS from 'crypto-js';
import fetch from 'node-fetch';
import generador from 'password-generator';
import {Llaves} from '../config/Llaves';
@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */
  GenerarClave() {
    let clave = generador(8, false);
    return clave;
  }

  CifrarClave(clave: string) {
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada
  }

  MensajeClave(correo: string, asunto: string, contenido: string) {
    let envio = false
    fetch(`${Llaves.urlNotif}/email?correo=${correo}&asunto=${asunto}&cuerpo=${contenido}`)
      .then((result: any) => {
        console.log(result);
        envio = true;
      }).catch((err: any) => {
        console.log(err);
        envio = false;
      });
    return envio;
  }
}
