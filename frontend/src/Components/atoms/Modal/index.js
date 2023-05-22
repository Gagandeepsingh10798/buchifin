import React from "react";
import "./modal.scss";
import Modal from "react-modal";
import { ICONS, IMAGES } from "Shared";
Modal.setAppElement("#category_modal");

function CustomModal({
  children = "",
  className = "",
  handleToggle = () => {},
  isOpen = false,
  style = {},
  clearHandler = () => {},
}) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleToggle}
        className="Modal react_modal_main"
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        <div
          className={
            className ? className : "modal-dialog modal-dialog-centered"
          }
        >
          <div className="modal-content">
            <button
              onClick={() => {
                handleToggle();
                clearHandler();
              }}
              className="close"
            >
              <img src={ICONS.CloseIcon} alt="Close" width="14" />
            </button>
            {children}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CustomModal;
