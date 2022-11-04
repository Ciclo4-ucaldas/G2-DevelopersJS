import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Estudiante} from './estudiante.model';
import {Horario} from './horario.model';
import {Profesor} from './profesor.model';

@model()
export class Grupo extends Entity {
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
  NombreGrupo: string;

  @property({
    type: 'string',
    required: true,
  })
  Categoria: string;

  @hasMany(() => Estudiante)
  estudiantes: Estudiante[];

  @belongsTo(() => Horario)
  horarioId: string;

  @belongsTo(() => Profesor)
  profesorId: string;

  constructor(data?: Partial<Grupo>) {
    super(data);
  }
}

export interface GrupoRelations {
  // describe navigational properties here
}

export type GrupoWithRelations = Grupo & GrupoRelations;
