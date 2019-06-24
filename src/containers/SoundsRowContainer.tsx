import SoundsRow, { Props } from "../components/SoundsRow";
import AppState from "../store/state";
import { getChosenSounds } from "../store/selectors";
import { connect } from "react-redux";

const mapStateToProps = (state: AppState) => ({
  sounds: getChosenSounds(state)
});

export default connect<Props, {}, {}, AppState>(mapStateToProps)(SoundsRow);
