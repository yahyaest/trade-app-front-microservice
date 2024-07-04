import React from "react";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";

export default function SpinnerModal(props: any) {
  const { visible, setVisible, header } = props;

  return (
    <Dialog
      header={header}
      visible={visible}
      style={{ width: "75vw" }}
      className="px-0 md:px-8"
      onHide={() => setVisible(false)}
    >
      <div className="flex justify-content-center">
        <ProgressSpinner
          style={{ width: "50px", height: "50px" }}
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
      </div>
    </Dialog>
  );
}
