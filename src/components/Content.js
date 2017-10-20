import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Icon, Tooltip, Collapse, notification, Button, Affix } from 'antd';
import moment from 'moment';
import Clipboard from 'clipboard';

import CodeMirror from 'react-codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/mode/tiddlywiki/tiddlywiki.css';
import 'codemirror/mode/tiki/tiki.css';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/mode/meta';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/dylan/dylan';
import 'codemirror/mode/textile/textile';
import 'codemirror/mode/pegjs/pegjs';
import 'codemirror/mode/factor/factor';
import 'codemirror/mode/asterisk/asterisk';
import 'codemirror/mode/crystal/crystal';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/pug/pug';
import 'codemirror/mode/forth/forth';
import 'codemirror/mode/lua/lua';
import 'codemirror/mode/mumps/mumps';
import 'codemirror/mode/elm/elm';
import 'codemirror/mode/tornado/tornado';
import 'codemirror/mode/d/d';
import 'codemirror/mode/rpm/rpm';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/swift/swift';
import 'codemirror/mode/solr/solr';
import 'codemirror/mode/stex/stex';
import 'codemirror/mode/haskell/haskell';
import 'codemirror/mode/velocity/velocity';
import 'codemirror/mode/properties/properties';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/htmlembedded/htmlembedded';
import 'codemirror/mode/smarty/smarty';
import 'codemirror/mode/tiddlywiki/tiddlywiki';
import 'codemirror/mode/go/go';
import 'codemirror/mode/ttcn/ttcn';
import 'codemirror/mode/slim/slim';
import 'codemirror/mode/tiki/tiki';
import 'codemirror/mode/sieve/sieve';
import 'codemirror/mode/troff/troff';
import 'codemirror/mode/z80/z80';
import 'codemirror/mode/eiffel/eiffel';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/powershell/powershell';
import 'codemirror/mode/vhdl/vhdl';
import 'codemirror/mode/turtle/turtle';
import 'codemirror/mode/ebnf/ebnf';
import 'codemirror/mode/livescript/livescript';
import 'codemirror/mode/haml/haml';
import 'codemirror/mode/jinja2/jinja2';
import 'codemirror/mode/php/php';
import 'codemirror/mode/mathematica/mathematica';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/gherkin/gherkin';
import 'codemirror/mode/q/q';
import 'codemirror/mode/ecl/ecl';
import 'codemirror/mode/perl/perl';
import 'codemirror/mode/vue/vue';
import 'codemirror/mode/ntriples/ntriples';
import 'codemirror/mode/cmake/cmake';
import 'codemirror/mode/handlebars/handlebars';
import 'codemirror/mode/modelica/modelica';
import 'codemirror/mode/dockerfile/dockerfile';
import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter';
import 'codemirror/mode/groovy/groovy';
import 'codemirror/mode/oz/oz';
import 'codemirror/mode/twig/twig';
import 'codemirror/mode/pascal/pascal';
import 'codemirror/mode/diff/diff';
import 'codemirror/mode/idl/idl';
import 'codemirror/mode/rst/rst';
import 'codemirror/mode/smalltalk/smalltalk';
import 'codemirror/mode/nsis/nsis';
import 'codemirror/mode/mbox/mbox';
import 'codemirror/mode/spreadsheet/spreadsheet';
import 'codemirror/mode/haskell-literate/haskell-literate';
import 'codemirror/mode/dart/dart';
import 'codemirror/mode/octave/octave';
import 'codemirror/mode/mirc/mirc';
import 'codemirror/mode/haxe/haxe';
import 'codemirror/mode/mllike/mllike';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/asn.1/asn.1';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/css/css';
import 'codemirror/mode/pig/pig';
import 'codemirror/mode/xquery/xquery';
import 'codemirror/mode/asciiarmor/asciiarmor';
import 'codemirror/mode/erlang/erlang';
import 'codemirror/mode/scheme/scheme';
import 'codemirror/mode/python/python';
import 'codemirror/mode/coffeescript/coffeescript';
import 'codemirror/mode/clojure/clojure';
import 'codemirror/mode/fcl/fcl';
import 'codemirror/mode/puppet/puppet';
import 'codemirror/mode/brainfuck/brainfuck';
import 'codemirror/mode/http/http';
import 'codemirror/mode/dtd/dtd';
import 'codemirror/mode/r/r';
import 'codemirror/mode/verilog/verilog';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/webidl/webidl';
import 'codemirror/mode/vbscript/vbscript';
import 'codemirror/mode/toml/toml';
import 'codemirror/mode/vb/vb';
import 'codemirror/mode/rust/rust';
import 'codemirror/mode/cypher/cypher';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/django/django';
import 'codemirror/mode/ttcn-cfg/ttcn-cfg';
import 'codemirror/mode/cobol/cobol';
import 'codemirror/mode/commonlisp/commonlisp';
import 'codemirror/mode/soy/soy';
import 'codemirror/mode/stylus/stylus';
import 'codemirror/mode/sparql/sparql';
import 'codemirror/mode/nginx/nginx';
import 'codemirror/mode/sas/sas';
import 'codemirror/mode/mscgen/mscgen';
import 'codemirror/mode/gas/gas';
import 'codemirror/mode/fortran/fortran';
import 'codemirror/mode/apl/apl';
import 'codemirror/mode/julia/julia';
import 'codemirror/mode/tcl/tcl';
import 'codemirror/mode/protobuf/protobuf';
import 'codemirror/mode/yacas/yacas';
import 'codemirror/mode/sass/sass';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/display/placeholder';

const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;

const ContentContainer = styled.div`
  position: relative;
  padding-left: ${props =>
    props.theme.sidebarWidth + props.theme.gistsListWidth}px;
  max-width: 2000px;
  padding-top: 50px;
  padding-bottom: 200px;
  .noGist {
    text-align: center;
    font-size: 20px;
    margin-top: 150px;
    color: #999;
    .anticon {
      margin-right: 15px;
    }
  }
  .gistheader {
    padding: 10px;
    border-bottom: 1px solid ${props => props.theme.borderColor};
    background: #f5f9fc;
    .name {
      font-size: 20px;
      color: #000;
      .anticon {
        font-size: 14px;
        margin-right: 5px;
      }
    }
    .date {
      font-size: 12px;
      color: #999;
    }
    .description {
      font-size: 16px;
      color: #666;
      margin: 20px 0;
    }
    .tags {
      font-size: 12px;
      color: #999;
      span {
        margin-right: 10px;
        .anticon {
          margin-right: 5px;
        }
      }
    }
  }
  .gistTools {
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid ${props => props.theme.borderColor};
  }
  .gistCode {
    padding: 10px;
    background: #fff;
    .anticon {
      margin-right: 5px;
    }
    .panelHeader {
      .tools a {
        color: #999;
        margin-right: 15px;
      }
    }
    .CodeMirror{
      height: 500px;
    }
  }
`;

class PanelHeader extends React.Component {
  copyFn = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  componentDidMount() {
    let clipboard = new Clipboard(this.copyBtn, {
      text: () => this.props.file.content
    });
    clipboard.on('success', () => {
      notification.success({
        message: 'Notification',
        description: 'Copy Success'
      });
    });
  }

  render() {
    return (
      <div className="panelHeader clearfix">
        <span className="fl name">
          <Icon type="file" />
          {this.props.file.filename || 'No File Name'}
        </span>
        <div className="fr clearfix tools">
          <a
            className="rawbtn fl"
            href={this.props.file.raw_url}
            onClick={e => e.stopPropagation()}
            target="_blank"
          >
            <Icon type="link" />Raw
          </a>
          <a
            className="copyBtn fl"
            href="#"
            target="_blank"
            onClick={this.copyFn}
            ref={dom => {
              this.copyBtn = dom;
            }}
          >
            <Icon type="copy" />Copy
          </a>
        </div>
      </div>
    );
  }
}

PanelHeader.propTypes = {
  file: PropTypes.object.isRequired
};

@inject('store')
@observer
class Content extends React.Component {
  componentDidMount() {}

  componentDidUpdate() {}

  // panel默认关闭时，不展示代码dom的bug => 待优化
  panelChange = () => {
    setTimeout(() => {}, 100);
  };

  // 编辑
  edit = gist => {
    this.props.store.setEditMode(true);
    this.props.store.editGist(gist);
  };

  // 删除
  destroy = id => {
    this.props.store.destroy(id, () => {
      notification.success({
        message: 'Notification',
        description: 'Delete Success!'
      });
    });
  };

  // star
  star = id => {
    this.props.store.setLoading(true);
    this.props.store.star(id, () => {
      notification.success({
        message: 'Notification',
        description: 'Star Success!'
      });
    });
  };

  // unstar
  unstar = id => {
    this.props.store.setLoading(true);
    this.props.store.unstar(id, () => {
      notification.success({
        message: 'Notification',
        description: 'Unstar Success!'
      });
    });
  };

  render() {
    let { openGist, userInfo, selected } = this.props.store;
    // Gist切换时遗留的activeKey的bug ==> 未解决
    let defaultActiveKey = openGist && Object.keys(openGist.files).map(file => file);
    return (
      <ContentContainer>
        {openGist ? (
          <div>
            <div className="gistheader">
              <div className="name text-ellipsis">
                {openGist.public ? (
                  <Tooltip placement="bottom" title="Public">
                    <Icon type="unlock" />
                  </Tooltip>
                ) : (
                  <Tooltip placement="bottom" title="Private">
                    <Icon type="lock" />
                  </Tooltip>
                )}
                {openGist.name || 'No Name'}
              </div>
              <div className="date">
                {`${Object.keys(openGist.files).length} Files - `}
                Created by{' '}
                <a
                  href={`https://gist.github.com/${openGist.owner.login}`}
                  target="_blank"
                >
                  {openGist.owner.login}
                </a>
                {` on ${moment(openGist.created_at).format(
                  'YYYY-MM-DD HH:mm:ss'
                )} – Last updated ${moment(openGist.updated_at).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}`}
              </div>
              <div className="description">
                {openGist.description || 'No Description'}
              </div>
              <div className="tags clearfix">
                {openGist.tags.length > 0 ? (
                  openGist.tags.map(tag => (
                    <span className="fl" key={tag}>
                      <Icon type="tags" />
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="fl">
                    <Icon type="tags" />No Labels
                  </span>
                )}
              </div>
            </div>
            <Affix offsetTop={50}>
              <div className="gistTools clearfix">
                {openGist.owner.login === userInfo.login && (
                  <ButtonGroup className="fl">
                    <Button
                      icon="edit"
                      onClick={this.edit.bind(this, openGist)}
                    >
                      Edit
                    </Button>
                    <Button
                      icon="delete"
                      onClick={this.destroy.bind(this, openGist.id)}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                )}
                <ButtonGroup className="fr">
                  <Button
                    icon="eye-o"
                    onClick={() => window.open(openGist.html_url)}
                  >
                    Open
                  </Button>
                  {
                    // 检测是否star不成功 ==> 未解决
                  }
                  {selected.type === 'starred' ? (
                    <Button
                      icon="star"
                      onClick={this.unstar.bind(this, openGist.id)}
                    >
                      Unstar
                    </Button>
                  ) : (
                    <Button
                      icon="star-o"
                      onClick={this.star.bind(this, openGist.id)}
                    >
                      Star
                    </Button>
                  )}
                </ButtonGroup>
              </div>
            </Affix>
            <div className="gistCode">
              <Collapse
                defaultActiveKey={defaultActiveKey}
                onChange={this.panelChange}
              >
                {Object.keys(openGist.files).map((file, index) => {
                  let fileItem = openGist.files[file];
                  return (
                    <Panel header={<PanelHeader file={fileItem} />} key={file}>
                      <CodeMirror
                        value={fileItem.content}
                        options={{
                          theme: 'mdn-like',
                          lineNumbers: true,
                          matchBrackets: true,
                          matchTags: true,
                          lineWrapping: true,
                          viewportMargin: Infinity,
                          foldGutter: true,
                          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                          mode: (fileItem.language || 'Text').toLowerCase()
                        }}
                      />
                    </Panel>
                  );
                })}
              </Collapse>
            </div>
          </div>
        ) : (
          <div className="noGist">
            <Icon type="file-text" />
            Select a Gist to view
          </div>
        )}
      </ContentContainer>
    );
  }
}

Content.propTypes = {
  store: PropTypes.object
};

export default Content;
