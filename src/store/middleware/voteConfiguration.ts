import {AnyAction, Dispatch, MiddlewareAPI} from "redux";
import {ApplicationState} from "types/store";
import {API} from "api";
import {Toast} from "utils/Toast";
import {ActionType, ReduxAction} from "store/action";
import {StatusResponse} from "types";

export const passVoteConfigurationMiddlware = async (stateAPI: MiddlewareAPI<Dispatch<AnyAction>, ApplicationState>, dispatch: Dispatch, action: ReduxAction) => {
  /**
   * New vote configuration added by the moderator/admin
   */
  if (action.type === ActionType.AddVoteConfiguration) {
    const response = (await API.addVoteConfiguration(action.voteConfiguration)) as StatusResponse;
    if (response.status === "Error") {
      Toast.error(response.description);
    }
  }
};
