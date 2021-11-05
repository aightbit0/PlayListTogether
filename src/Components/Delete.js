
import React, { useState,useEffect } from 'react';

import {
  EuiButton,
  EuiConfirmModal,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';

export const Delete= (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeModal = () => setIsModalVisible(false);
  
  useEffect(() =>{
    setIsModalVisible(true);
  },[props.toggle])

  let modal;

  let confirmHandler = () =>{
    props.del(props.show)
    closeModal();
  }

  if (isModalVisible) {
    modal = (
      <EuiConfirmModal
        title={props.show}
        onCancel={closeModal}
        onConfirm={() => confirmHandler()}
        cancelButtonText="No, don't do it"
        confirmButtonText="Yes, do it"
        defaultFocusedButton="confirm"
        buttonColor="danger"
      >
        <p>Do you want to delete this Song?</p>
      </EuiConfirmModal>
    );
  }

  return (
    <div>
      <EuiFlexGroup responsive={false} wrap gutterSize="xs">
        <EuiFlexItem grow={false}>
        </EuiFlexItem>
      </EuiFlexGroup>
      {modal}
    </div>
  );
};