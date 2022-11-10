import {Entity, model, property, hasMany} from '@loopback/repository';
import {Grupo} from './grupo.model';

@model()
export class Profesor extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  @property({
    type: 'string',
    required: true,
  })
  carnet: string;

  @hasMany(() => Grupo)
  grupos: Grupo[];

  constructor(data?: Partial<Profesor>) {
    super(data);
  }
}

export interface ProfesorRelations {
  // describe navigational properties here
}

export type ProfesorWithRelations = Profesor & ProfesorRelations;
