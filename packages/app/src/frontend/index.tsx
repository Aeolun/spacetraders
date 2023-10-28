import {Provider} from "react-redux";
import {store} from "@front/ui/store";
import {createRoot} from "react-dom/client";
import {Pixi} from "@front/components/Pixi";
import * as appStyles from "@front/styles/app.css";

if (!localStorage.getItem('agent-token')) {
    const agentToken = prompt('Please enter your agent token')
    localStorage.setItem('agent-token', agentToken)
}


const App = () => {
    return <div className={appStyles.app}>
        <div className={appStyles.menu}>
            <div className={appStyles.menuItem}>Main</div>
            <div className={appStyles.menuItem}>Ships</div>
            <div className={appStyles.menuItem}>Waypoints</div>
            <div className={appStyles.menuItem}>Systems</div>
        </div>
        <section className={appStyles.columns}>
            <div className={appStyles.column}>
                <h3>Options</h3>
            </div>
            <Pixi />
            <div className={appStyles.column}>
                <h3>Details</h3>
            </div>
        </section>
    </div>
}

const root = createRoot(document.getElementById('app'))
root.render(<Provider store={store}><App /></Provider>)