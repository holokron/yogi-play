import SoundSearch from "../components/SoundSearch";
import { AppDispatch, createFilterSoundsAction } from "../store/actions";
import { connect } from "react-redux";
import AppState from "../store/state";
import { getSoundsFilter } from "../store/selectors";

const mapStateToProps = (state: AppState) => ({
  query: getSoundsFilter(state)
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onChange: (query: string | null) => {
    dispatch(createFilterSoundsAction(query));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SoundSearch);
