import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Grupo} from './grupo.model';
import { Usuario } from './usuario.model';

@model()
export class Estudiante extends Usuario {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  @property({
    type: 'string',
    required: false,
  })
  Estado: string;

  @belongsTo(() => Grupo)
  grupoId: string;

  constructor(data?: Partial<Estudiante>) {
    super(data);
  }
}

export interface EstudianteRelations {
  // describe navigational properties here
}

export type EstudianteWithRelations = Estudiante & EstudianteRelations;
