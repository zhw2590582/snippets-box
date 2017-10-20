import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Button, Form, Input, Tag, Tooltip, Switch } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
import CodeWrap from './CodeWrap';

const EditorContainer = styled.div`
  position: relative;
  padding-top: ${props => props.theme.headerHeight}px;
  padding-left: ${props =>
    props.theme.sidebarWidth + props.theme.gistsListWidth}px;
  padding-bottom: 200px;
  max-width: 2000px;
  .ant-row {
    margin-bottom: 10px;
    label {
      font-size: 14px;
    }
    .ant-tag {
    }
  }
  .editorHeader {
    padding: 0 10px 10px;
    border-bottom: 1px solid ${props => props.theme.borderColor};
    .name {
    }
    .description {
    }
    .tags {
    }
  }
  .files {
    .fileItem {
      padding: 20px 10px;
      border-bottom: 1px solid ${props => props.theme.borderColor};
      .filename {
        margin-bottom: 15px;
        .language{
          margin-left: 15px;
          height: 28px;
          line-height: 28px;
          color: #b9b9b9;
        }
      }
      .fileContent {
      }
    }
    .addFile {
      margin: 10px;
    }
  }
  .public {
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

  // 标签
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

  // 名字
  nameChange = e => {
    this.handleFormChange({
      type: 'name',
      value: e.target.value
    });
  };

  // 描述
  descriptionChange = e => {
    this.handleFormChange({
      type: 'description',
      value: e.target.value
    });
  };

  // 公开
  publicChange = value => {
    this.handleFormChange({
      type: 'public',
      value: value
    });
  };

  // 文件
  // 文件名
  filenameChange = (index, e) => {
    this.handleFormChange({
      type: 'filename',
      index: index,
      value: e.target.value
    });
  };

  // 文件语言
  fileLanguageChange = (index, language) => {
    this.handleFormChange({
      type: 'fileLanguage',
      index: index,
      value: language
    });
  };

  // 文件内容
  fileContentChange = (index, newCode) => {
    this.handleFormChange({
      type: 'fileContent',
      index: index,
      value: newCode
    });
  };

  // 删除文件
  deleteFile = index => {
    this.handleFormChange({
      type: 'deleteFile',
      index: index
    });
  };

  // 添加文件
  addFile = () => {
    this.handleFormChange({
      type: 'addFile'
    });
  };

  // 监听全部
  handleFormChange = changedFields => {
    const { createGist } = this.props.store;
    createGist(changedFields);
  };

  render() {
    const { inputVisible, inputValue } = this.state;
    const { editGistInfo } = this.props.store;
    const isOneGist =
      editGistInfo.files.filter(file => {
        return !file.delFile;
      }).length === 1;
    return (
      <EditorContainer>
        <div className="editorHeader">
          <FormItem label="Name" className="name">
            <Input
              value={editGistInfo.name}
              onChange={this.nameChange}
              placeholder="Gist Name"
              maxLength="100"
            />
          </FormItem>
          <FormItem label="Description" className="description">
            <TextArea
              value={editGistInfo.description}
              onChange={this.descriptionChange}
              placeholder="Gist Description"
              autosize={{ minRows: 2, maxRows: 4 }}
              maxLength="200"
            />
          </FormItem>
          <FormItem label="Tags" className="tags">
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
            {!inputVisible && <Tag onClick={this.showInput}>+ New Tag</Tag>}
          </FormItem>
          <FormItem label="Public" className="public">
            <Switch
              checked={editGistInfo.public}
              onChange={this.publicChange}
            />
          </FormItem>
        </div>
        <FormItem className="files">
          {editGistInfo.files.map((file, index) => {
            return file.delFile ? null : (
              <div key={index} className="fileItem">
                <div className="filename clearfix">
                  <Input
                    style={{ width: 300 }}
                    className="fl"
                    value={file.filename}
                    onChange={this.filenameChange.bind(this, index)}
                    placeholder="FileName"
                    maxLength="100"
                  />
                  <span className="language fl">{file.language}</span>
                  {isOneGist ? null : (
                    <Button
                      className="fr"
                      type="danger"
                      icon="delete"
                      onClick={this.deleteFile.bind(this, index)}
                    />
                  )}
                </div>
                <div className="fileContent">
                  <CodeWrap
                    filename={file.filename}
                    content={file.content}
                    updateLanguage={this.fileLanguageChange.bind(this, index)}
                    updateCode={this.fileContentChange.bind(this, index)}
                  />
                </div>
              </div>
            );
          })}
          <Button
            className="addFile"
            type="primary"
            icon="file-add"
            onClick={this.addFile}
          >
            Add File
          </Button>
        </FormItem>
      </EditorContainer>
    );
  }
}

Editor.propTypes = {
  store: PropTypes.object
};

export default Editor;
