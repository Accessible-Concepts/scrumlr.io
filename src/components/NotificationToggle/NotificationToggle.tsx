import store from "store";
import {ActionFactory} from "store/action";
import "./NotificationToggle.scss";

export const NotificationToggle = () => (
    <div onClick={() => store.dispatch(ActionFactory.toggleNotifications(false))} className="toggolino">
      Blubb
    </div>
  );
