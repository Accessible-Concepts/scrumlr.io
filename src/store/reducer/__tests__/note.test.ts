import {NoteClientModel} from "types/note";
import {noteReducer} from "store/reducer/note";
import {ActionFactory} from "store/action";

const COLUMN_ID = "column";
const AUTHOR_ID = "John Doe";
const NOTE_TEXT = "Hello world";

jest.mock("parse", () => ({
  User: {
    current: () => ({
      id: AUTHOR_ID,
    }),
  },
}));

const createServerNote = (id: string, parent?: string, posInStack?: number, text: string = NOTE_TEXT): NoteClientModel => ({
  id,
  columnId: COLUMN_ID,
  text,
  author: AUTHOR_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  dirty: false,
  focus: false,
  positionInStack: posInStack ?? -1,
  parentId: parent,
});

describe("note reducer", () => {
  let initialState: NoteClientModel[];
  beforeEach(() => {
    initialState = [createServerNote("1"), createServerNote("2")];
  });

  test("add note", () => {
    const newState = noteReducer(initialState, ActionFactory.addNote(COLUMN_ID, NOTE_TEXT));
    expect(newState.length).toEqual(3);

    const newNote = newState.find((note) => note.id === undefined);
    expect(newNote?.columnId).toEqual(COLUMN_ID);
    expect(newNote?.author).toEqual(AUTHOR_ID);
    expect(newNote?.text).toEqual(NOTE_TEXT);
    expect(newNote?.dirty).toBe(true);
  });

  test("created note from server", () => {
    const newState = noteReducer(initialState, ActionFactory.createdNote(createServerNote("3")));
    expect(newState.length).toEqual(3);
  });

  describe("sync server note with local note", () => {
    test("created note synced locally", () => {
      const stateWithLocalNote = noteReducer(initialState, ActionFactory.addNote(COLUMN_ID, NOTE_TEXT));
      const newState = noteReducer(stateWithLocalNote, ActionFactory.createdNote(createServerNote("3")));
      expect(newState.length).toEqual(3);
      expect(newState.filter((note) => Boolean(note.id)).length).toEqual(3);
    });

    test("created two notes and one is synced locally", () => {
      const stateWithLocalNote1 = noteReducer(initialState, ActionFactory.addNote(COLUMN_ID, NOTE_TEXT));
      const stateWithLocalNote2 = noteReducer(stateWithLocalNote1, ActionFactory.addNote(COLUMN_ID, NOTE_TEXT));
      const newState = noteReducer(stateWithLocalNote2, ActionFactory.createdNote(createServerNote("3")));
      expect(newState.length).toEqual(4);
      expect(newState.filter((note) => Boolean(note.id)).length).toEqual(3);
    });
  });

  test("delete note", () => {
    const state3Notes = noteReducer(initialState, ActionFactory.createdNote(createServerNote("3")));
    const newState = noteReducer(state3Notes, ActionFactory.deleteNote("2"));
    expect(newState.map((note) => note.id)).toEqual(["1", "3"]);
  });

  test("edit note", () => {
    const newState = noteReducer(initialState, ActionFactory.editNote({id: "1", text: "New text"}));
    expect(newState.length).toEqual(2);
    expect(newState.find((note) => note.text === "New text")).toBeDefined();
  });

  test("unstack note", () => {
    const newState = noteReducer([createServerNote("1", "2", 1, "test"), createServerNote("2", undefined, 0, "test")], ActionFactory.unstackNote({id: "1", parentId: "2"}));
    expect(newState.find((note) => note.id === "1")).toBeDefined();
    expect(newState.find((note) => note.id === "1")?.positionInStack).toBe(-1);
    expect(newState.find((note) => note.id === "2")?.positionInStack).toBe(-1);
  });

  test("drag note", () => {
    const newState = noteReducer([createServerNote("1", undefined, -1, "test"), createServerNote("2", undefined, -1, "test")], ActionFactory.dragNote({id: "1", dragOnId: "2"}));
    expect(newState.find((note) => note.id === "1")?.positionInStack).toBe(0);
    expect(newState.find((note) => note.id === "2")?.positionInStack).toBe(1);
    expect(newState.find((note) => note.id === "2")?.parentId).toBe("1");
  });

  test("drag note in other column", () => {
    const newState = noteReducer(
      [createServerNote("1", undefined, -1, "test"), createServerNote("2", undefined, -1, "test")],
      ActionFactory.dragNote({id: "1", dragOnId: "2", columnId: "test-column"})
    );
    expect(newState.find((note) => note.id === "1")?.positionInStack).toBe(0);
    expect(newState.find((note) => note.id === "2")?.positionInStack).toBe(1);
    expect(newState.find((note) => note.id === "2")?.parentId).toBe("1");
    expect(newState.find((note) => note.id === "1")?.columnId).toBe("test-column");
  });

  describe("sync server note with edited local note", () => {
    test("edited note synced locally", () => {
      const editedState = noteReducer(initialState, ActionFactory.editNote({id: "1", text: "New text"}));
      const newState = noteReducer(editedState, ActionFactory.updatedNote(createServerNote("1", undefined, undefined, "New text")));
      const note = newState.find((n) => n.id === "1");
      expect(note?.dirty).toBe(false);
    });
  });

  test("initialize note", () => {
    const state = noteReducer([], ActionFactory.initializeNotes(initialState));
    expect(state).toEqual(initialState);
  });
});
