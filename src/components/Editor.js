import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
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
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem label="Name">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Gist name is required!' }]
          })(<Input placeholder="Gist Name" />)}
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
            />
          )}
        </FormItem>
        <FormItem label="Tags">
          
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
    console.log(changedFields);
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
