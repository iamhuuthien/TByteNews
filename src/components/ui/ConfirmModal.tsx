import React from 'react';
import styles from '../../styles/adminModal.module.css';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ visible, title, onConfirm, onCancel }) => {
  if (!visible) return null;
  return (
    <div className={styles.profileModalOverlay}>
      <div className={styles.profileModalContent}>
        <h2 className={styles.profileModalTitle}>{title}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <button className={styles.profileSubmitButton} onClick={onConfirm}>Xác nhận</button>
          <button className={styles.profileSubmitButton} style={{ background: '#ff5252' }} onClick={onCancel}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
