import { Ship } from "../ship";

export interface TaskInterface {
  type: string;

  execute(ship: Ship): Promise<void>;
  serialize(): string;
}