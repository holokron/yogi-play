import { connect } from "react-redux";
import { getChosenTag, getTagsByOrder } from "../store/selectors";
import { AppDispatch, chooseTag } from "../store/actions";
import AppState from "../store/state";
import SoundsNav, { Props } from "../components/SoundsNav";

const mapStateToProps = (state: AppState) => ({
  currentTag: getChosenTag(state),
  tags: getTagsByOrder(state)
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  changeTag: (tagSlug: string): void => {
    dispatch(chooseTag(tagSlug));
  }
});

export default connect<Props, {}, {}, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SoundsNav);
