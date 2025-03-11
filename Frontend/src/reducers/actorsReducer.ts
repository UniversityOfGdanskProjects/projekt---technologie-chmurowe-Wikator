import ActorDto from "@/dtos/responses/actorDto";

export enum ActorsActionTypes {
  Set,
  Delete
}

export interface ActorsAction {
  type: ActorsActionTypes;
  id?: string;
  payload?: ActorDto[];
}

export function actorsReducer(state: ActorDto[] = [], action: ActorsAction): ActorDto[] {
  switch (action.type) {
    case ActorsActionTypes.Set:
      if (!action.payload) return state;
      return action.payload;
    case ActorsActionTypes.Delete:
      return state.filter((actor: ActorDto) => actor.id !== action.id);
    default:
      return state;
  }
}
