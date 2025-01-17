import {useAppSelector} from "store";
import {exportAsCSV, exportAsJSON} from "utils/export";
import {ApplicationState} from "types/store";
import {ReactComponent as ExportIcon} from "assets/icon-export.svg";
import {ReactComponent as ExportCSV} from "assets/icon-export-csv.svg";
import {ReactComponent as ExportJSON} from "assets/icon-export-json.svg";
// import {ReactComponent as ExportPDF} from "assets/icon-export.svg";
import "../BoardSettings/BoardSettings.scss";
import classNames from "classnames";
import {TabIndex} from "constants/tabIndex";
import {useTranslation} from "react-i18next";
import {BoardOption} from "./BoardOption";
import {BoardOptionButton} from "./BoardOptionButton";
import "./ExportBoardOption.scss";

export type ExportProps = {
  onClick: () => void;
  onClose: () => void;
  expand: boolean;
};

export const ExportBoardOption = (props: ExportProps) => {
  const {t} = useTranslation();

  const state = useAppSelector((applicationState: ApplicationState) => ({
    board: applicationState.board.data!,
    notes: applicationState.notes,
    users: applicationState.users,
    votes: applicationState.votes,
  }));

  return (
    <BoardOption data-testid="export">
      <BoardOptionButton label={t("ExportBoardOption.button")} icon={ExportIcon} isExpandable onClick={props.onClick} />
      <div className={classNames("export-board-option__container", {"export-board-option__container--visible": props.expand})}>
        <BoardOptionButton
          label={t("ExportBoardOption.exportAsJson")}
          icon={ExportJSON}
          onClick={() => {
            exportAsJSON(state);
            props.onClose();
          }}
          data-testid="export-json"
          tabIndex={props.expand ? TabIndex.default : TabIndex.disabled}
        />
        <BoardOptionButton
          label={t("ExportBoardOption.exportAsCSV")}
          icon={ExportCSV}
          onClick={() => {
            exportAsCSV(state);
            props.onClose();
          }}
          data-testid="export-csv"
          tabIndex={props.expand ? TabIndex.default : TabIndex.disabled}
        />
      </div>
    </BoardOption>
  );
};
