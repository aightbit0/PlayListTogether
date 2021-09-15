
import React, { useState,useEffect } from 'react';

import {
  EuiButton,
  EuiConfirmModal,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';

export const Delete= (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDestroyModalVisible, setIsDestroyModalVisible] = useState(false);

  const closeModal = () => setIsModalVisible(false);
  
  useEffect(() =>{
    console.log("im dislike");
    setIsModalVisible(true);
  },[props.toggle])

  let modal;

  if (isModalVisible) {
    modal = (
      <EuiConfirmModal
        title="Delete Song from Bucket"
        onCancel={closeModal}
        onConfirm={closeModal}
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