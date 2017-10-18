import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Button, Form, Input, Tag, Tooltip, Switch } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

const EditorContainer = styled.div`
  position: relative;
  padding-top: ${props => props.theme.headerHeight}px;
  padding-left: ${props =>
    props.theme.sidebarWidth + props.theme.gistsListWidth + 10}px;
  padding-right: 10px;
  padding-bottom: 50px;
  max-width: 2000px;
  .ant-row {
    margin-bottom: 10px;
    label {
      font-size: 14px;
    }
  }
`;

// 容器组件
@inject('store')
@observer
class Editor extends React.Component {
  state = {
    inputVisible: false,
    inputValue: ''
  };

  // 标签 ------------------------------------
  handleClose = removedTag => {
    const tags = this.props.store.editGistInfo.tags.filter(
      tag => tag !== removedTag
    );
    this.handleFormChange({
      type: 'tags',
      value: tags
    });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = this.props.store.editGistInfo.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.handleFormChange({
      type: 'tags',
      value: tags
    });
    this.setState({
      inputVisible: false,
      inputValue: ''
    });
  };

  saveInputRef = input => (this.input = input);

  nameChange = e => {
    this.handleFormChange({
      type: 'name',
      value: e.target.value
    });
  };

  descriptionChange = e => {
    this.handleFormChange({
      type: 'description',
      value: e.target.value
    });
  };

  publicChange = value => {
    this.handleFormChange({
      type: 'public',
      value: value
    });
  };

  handleFormChange = changedFields => {
    const { createGist } = this.props.store;
    createGist(changedFields);
  };

  render() {
    const { inputVisible, inputValue } = this.state;
    const { editGistInfo } = this.props.store;
    return (
      <EditorContainer>
        <FormItem label="Name">
          <Input
            value={editGistInfo.name}
            onChange={this.nameChange}
            placeholder="Gist Name"
            maxLength="100"
          />
        </FormItem>
        <FormItem label="Description">
          <TextArea
            value={editGistInfo.description}
            onChange={this.descriptionChange}
            placeholder="Gist Description"
            autosize={{ minRows: 2, maxRows: 4 }}
            maxLength="200"
          />
        </FormItem>
        <FormItem label="Tags">
          {editGistInfo.tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                key={tag}
                closable={true}
                afterClose={() => this.handleClose(tag)}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag}>{tagElem}</Tooltip>
            ) : (
              tagElem
            );
          })}
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag
              onClick={this.showInput}
              style={{ background: '#fff', borderStyle: 'dashed' }}
            >
              + New Tag
            </Tag>
          )}
        </FormItem>
        <FormItem label="Public">
          <Switch checked={editGistInfo.public} onChange={this.publicChange} />
        </FormItem>
      </EditorContainer>
    );
  }
}

Editor.propTypes = {
  store: PropTypes.object
};

export default Editor;
