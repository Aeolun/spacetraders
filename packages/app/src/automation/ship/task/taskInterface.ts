import { Ship } from "../ship";

export interface TaskInterface {
  name: string;

  execute(ship: Ship): Promise<void>;
}