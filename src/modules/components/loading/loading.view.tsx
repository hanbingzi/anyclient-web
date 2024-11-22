import React from 'react';
import './loading.less';

export const Loading = ({ isLoading = false }: { isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className='loading_container'>
        <div className='loading_indicator'></div>
      </div>
    );
  } else {
    return <div></div>;
  }
};
