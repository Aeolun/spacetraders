import * as appStyles from "@front/styles/app.css";
import {Pixi} from "@front/components/Pixi";
import {SelectionDisplay} from "@front/components/SelectionDisplay";

export const World = () => {
  return <section className={appStyles.columns}>
    <Pixi />
    <div className={appStyles.column}>
      <h3>Details</h3>
      <SelectionDisplay />
    </div>
  </section>
}