import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const EditorContainer = styled.div`
`;

class Editor extends React.Component {
  componentDidMount() {
    
  }

  render() {
    return <EditorContainer>Editor</EditorContainer>;
  }
}

Editor.propTypes = {
  store: PropTypes.object
};

export default Editor;
