import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import { HttpErrors, RedirectRoute, Request } from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import { AutenticacionService } from '../services';

export class EstrategiaProfesor implements AuthenticationStrategy{
  name:string="prof";

  constructor(@service(AutenticacionService)
  public servicioAutenticacion:AutenticacionService){

  }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = parseBearerToken(request);
    if(token){
      let datos = this.servicioAutenticacion.ValidarTokenJWT(token);
      if(datos){
      if(datos.data.rol=="Profesor"){
        let perfil:UserProfile=Object.assign({
          nombre:datos.data.nombre,
          rol:datos.data.rol
        })
        return perfil;
      }else{
        throw new HttpErrors[401]("El usuario no es valido")
      }
    }else{
      throw new HttpErrors[401]("El token no es valido")
    }
    }else{
      throw new HttpErrors[401]("No se ha incluido un token valido en la solicitud")
    }
  }
}
