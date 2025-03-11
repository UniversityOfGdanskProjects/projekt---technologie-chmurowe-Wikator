import {ActionType} from "@/enums/actionType";

export default interface Action<T> {
  type: ActionType,
  payload: T
}