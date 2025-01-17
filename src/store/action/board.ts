import {BoardClientModel, EditBoardRequest} from "types/board";

/** This object lists board object specific internal Redux Action types. */
export const BoardActionType = {
  /*
   * ATTENTION:
   * Don't forget the `as` casting for each field, because the type inference
   * won't work otherwise (e.g. in reducers).
   */
  LeaveBoard: "@@SCRUMLR/leaveBoard" as const,
  JoinBoard: "@@SCRUMLR/joinBoard" as const,
  InitializeBoard: "@@SCRUMLR/initBoard" as const,
  EditBoard: "@@SCRUMLR/editBoard" as const,
  UpdatedBoard: "@@SCRUMLR/updatedBoard" as const,
  DeleteBoard: "@@SCRUMLR/deleteBoard" as const,
  PermittedBoardAccess: "@@SCRUMLR/permittedBoardAccess" as const,
  RejectedBoardAccess: "@@SCRUMLR/rejectedBoardAccess" as const,
  PendingBoardAccessConfirmation: "@@SCRUMLR/pendingBoardAccessConfirmation" as const,
  PassphraseChallengeRequired: "@@SCRUMLR/passphraseChallengeRequired" as const,
  IncorrectPassphrase: "@@SCRUMLR/incorrectPassphrase" as const,
  CancelVoting: "@@SCRUMLR/cancelVoting" as const,
  SetTimer: "@@SCRUMLR/setTimer" as const,
  CancelTimer: "@@SCRUMLR/cancelTimer" as const,
};

/** Factory or creator class of internal Redux board object specific actions. */
export const BoardActionFactory = {
  /*
   * ATTENTION:
   * Each action creator should be also listed in the type `BoardReduxAction`, because
   * the type inference won't work otherwise (e.g. in reducers).
   */
  /** Creates an action which should be dispatched when the user leaves the current board. */
  leaveBoard: () => ({
    type: BoardActionType.LeaveBoard,
  }),
  /**
   * Creates an action which should be dispatched when the user tries to join a board.
   *
   * @param boardId the board id
   * @param passphrase optional passphrase is board is protected by it
   */
  joinBoard: (boardId: string, passphrase?: string) => ({
    type: BoardActionType.JoinBoard,
    boardId,
    passphrase,
  }),
  /**
   * Creates an action which should be dispatched when the initial query on the board data from the server returns
   * its result.
   *
   * @param board the board data
   */
  initializeBoard: (board: BoardClientModel) => ({
    type: BoardActionType.InitializeBoard,
    board,
  }),
  /**
   * Creates an action which should be dispatched when the user wants to edit the board.
   *
   * @param board the partial board model with the fields to update
   */
  editBoard: (board: EditBoardRequest) => ({
    type: BoardActionType.EditBoard,
    board,
  }),
  /**
   * Creates an action which should be dispatched when the board data was updated on the server.
   *
   * @param board the updated board
   */
  updatedBoard: (board: BoardClientModel) => ({
    type: BoardActionType.UpdatedBoard,
    board,
  }),
  /** Creates an action which should be dispatched when the user wants to delete the current board. */
  deleteBoard: (boardId: string) => ({
    type: BoardActionType.DeleteBoard,
    boardId,
  }),
  /**
   * Creates an action which should be dispatched when the user was permitted to access the board with
   * the specified id.
   *
   * @param boardId the board id
   */
  permittedBoardAccess: (boardId: string) => ({
    type: BoardActionType.PermittedBoardAccess,
    boardId,
  }),
  /** Creates an action which should be dispatched was rejected from a board. */
  rejectedBoardAccess: () => ({
    type: BoardActionType.RejectedBoardAccess,
  }),
  /**
   * Creates an action which should be dispatched when the user access request to a board is pending.
   *
   * @param requestReference the reference id on the join request
   */
  pendingBoardAccessConfirmation: (requestReference: string) => ({
    type: BoardActionType.PendingBoardAccessConfirmation,
    requestReference,
  }),
  requirePassphraseChallenge: () => ({
    type: BoardActionType.PassphraseChallengeRequired,
  }),
  incorrectPassphrase: () => ({
    type: BoardActionType.IncorrectPassphrase,
  }),
  /**
   * Creates an action which should be dispatched when the current voting phase was canceled.
   *
   * @param boardId
   */
  cancelVoting: (boardId: string) => ({
    type: BoardActionType.CancelVoting,
    boardId,
  }),
  /** Creates an action which should be dispatched when a moderator wants to set a timer.
   *
   * @param endDate the date where the timer ends
   */
  setTimer: (endDate: Date) => ({
    type: BoardActionType.SetTimer,
    endDate,
  }),
  /**
   * Creates an action which should be dispatched when a moderator wants to cancel the timer.
   */
  cancelTimer: () => ({
    type: BoardActionType.CancelTimer,
  }),
};

export type BoardReduxAction =
  | ReturnType<typeof BoardActionFactory.leaveBoard>
  | ReturnType<typeof BoardActionFactory.joinBoard>
  | ReturnType<typeof BoardActionFactory.initializeBoard>
  | ReturnType<typeof BoardActionFactory.editBoard>
  | ReturnType<typeof BoardActionFactory.updatedBoard>
  | ReturnType<typeof BoardActionFactory.deleteBoard>
  | ReturnType<typeof BoardActionFactory.permittedBoardAccess>
  | ReturnType<typeof BoardActionFactory.rejectedBoardAccess>
  | ReturnType<typeof BoardActionFactory.pendingBoardAccessConfirmation>
  | ReturnType<typeof BoardActionFactory.cancelVoting>
  | ReturnType<typeof BoardActionFactory.setTimer>
  | ReturnType<typeof BoardActionFactory.cancelTimer>
  | ReturnType<typeof BoardActionFactory.requirePassphraseChallenge>
  | ReturnType<typeof BoardActionFactory.incorrectPassphrase>;
