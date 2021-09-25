
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
    //console.log("im delete");
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
        <p>Are you sure you want to do this?</p>
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