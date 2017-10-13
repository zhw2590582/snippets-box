import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Badge } from 'antd';

const FilterContainer = styled.div`
  width: 250px;
  padding-right: 30px;
  margin-bottom: 30px;
  .item {
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    border-bottom: 1px solid #eaeaea;
    border-left: 2px solid #ffffff;
    &:hover,
    &.selected {
      color: #108ee9;
      background: #ecf6fd;
      border-left: 2px solid #108ee9;
    }
  }
`;

let BadgeStyle = {
  backgroundColor: '#fff',
  color: '#999',
  boxShadow: '0 0 0 1px #d9d9d9 inset'
};

@inject('store')
@observer
class Filter extends React.Component {
  render() {
    let { filterName, filterList, length, filterFn } = this.props;
    let { selected } = this.props.store;
    return (
      <FilterContainer>
        <div
          className={`item hand clearfix ${selected.type == filterName &&
          selected.val == ''
            ? 'selected'
            : ''}`}
          onClick={filterFn.bind(this, filterName, '')}
        >
          <span className="fl name">{`All ${filterName}s`}</span>
          <span className="fr num">
            <Badge count={length} style={BadgeStyle} />
          </span>
        </div>
        {Object.keys(filterList).map(item => {
          return (
            <div
              className={`item hand clearfix ${selected.type == filterName &&
              selected.val == item
                ? 'selected'
                : ''}`}
              key={item}
              onClick={filterFn.bind(this, item)}
            >
              <span className="fl name">#{item}</span>
              <span className="fr num">
                <Badge count={filterList[item]} style={BadgeStyle} />
              </span>
            </div>
          );
        })}
      </FilterContainer>
    );
  }
}

Filter.propTypes = {
  store: PropTypes.object,
  filterName: PropTypes.string.isRequired,
  filterList: PropTypes.object.isRequired,
  length: PropTypes.number.isRequired,
  filterFn: PropTypes.func.isRequired,
};

export default Filter;
