import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Button, Modal, Form, Input, Radio, Tag, Tooltip, Switch } from 'antd';
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

// 展示组件
@Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      name: props.name,
      description: props.description,
      tags: props.tags,
      public: props.public,
      files: props.files
    };
  }
})
class CustomizedForm extends React.Component {
  state = {
    inputVisible: false,
    inputValue: ''
  };

  handleClose = removedTag => {
    const tags = this.props.tags.value.filter(tag => tag !== removedTag);
    this.props.onChange({
      tags: {
        name: 'tags',
        value: tags
      } 
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
    let tags = this.props.tags.value;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.props.onChange({
      tags: {
        name: 'tags',
        value: tags
      } 
    });
    this.setState({
      inputVisible: false,
      inputValue: ''
    });
  };

  saveInputRef = input => (this.input = input);

  componentDidMount() {

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { inputVisible, inputValue } = this.state;
    const { tags } = this.props;
    
    return (
      <Form>
        <FormItem label="Name">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Gist name is required!' }]
          })(<Input placeholder="Gist Name" maxLength="100" />)}
        </FormItem>
        <FormItem label="Description">
          {getFieldDecorator('description', {
            rules: [
              { required: true, message: 'Gist description is required!' }
            ]
          })(
            <TextArea
              placeholder="Gist Description"
              autosize={{ minRows: 2, maxRows: 4 }}
              maxLength="200"
            />
          )}
        </FormItem>
        <FormItem label="Tags">
          {tags.value.map((tag, index) => {
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
          {getFieldDecorator('public', { valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>
      </Form>
    );
  }
}

// 容器组件
@inject('store')
@observer
class Editor extends React.Component {
  handleFormChange = changedFields => {
    const { createGist } = this.props.store;
    createGist(changedFields);
  };
  render() {
    const { editGistInfo } = this.props.store;
    return (
      <EditorContainer>
        <CustomizedForm {...editGistInfo} onChange={this.handleFormChange} />
      </EditorContainer>
    );
  }
}

Editor.propTypes = {
  store: PropTypes.object
};

export default Editor;
