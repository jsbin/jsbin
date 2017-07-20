import { connect } from 'react-redux';
import { setCode } from '../actions/code';
import Panel from '../components/Panel';

const mapStateToProps = (state, ownProps) => {
  return {
    code: state.code
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeCode: (source, code) => {
      dispatch(setCode(source, code));
    }
  };
};

const PanelContainer = connect(mapStateToProps, mapDispatchToProps)(Panel);

export default PanelContainer;
