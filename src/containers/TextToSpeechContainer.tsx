import { connect } from "react-redux";
import TextToSpeech from "../components/TextToSpeech";
import { readText, AppDispatch } from "../store/actions";

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  readText: (text: string): void => {
    dispatch(readText(text));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(TextToSpeech);
