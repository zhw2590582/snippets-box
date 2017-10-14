import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Icon } from 'antd';

@inject('store')
@observer
class Filter extends React.Component {
  render() {
    let { filterName, filterList, length, filterFn } = this.props;
    let { selected } = this.props.store;

    return (
      <div className="filter">
        <div className="title">
          <Icon type="tags-o" />
          {` All ${filterName}s`}
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
              <span className="fl name"># {item}</span>
              <span className="fr num">{filterList[item]}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

Filter.propTypes = {
  store: PropTypes.object,
  filterName: PropTypes.string.isRequired,
  filterList: PropTypes.object.isRequired,
  length: PropTypes.number.isRequired,
  filterFn: PropTypes.func.isRequired
};

export default Filter;
