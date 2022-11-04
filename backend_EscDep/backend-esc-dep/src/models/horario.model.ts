import {Entity, model, property, hasOne} from '@loopback/repository';
import {Grupo} from './grupo.model';

@model()
export class Horario extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  @property({
    type: 'date',
    required: true,
  })
  FechaHora_sesion1: string;

  @property({
    type: 'date',
    required: true,
  })
  FechaHora_sesion2: string;

  @hasOne(() => Grupo)
  grupo: Grupo;

  constructor(data?: Partial<Horario>) {
    super(data);
  }
}

export interface HorarioRelations {
  // describe navigational properties here
}

export type HorarioWithRelations = Horario & HorarioRelations;
