"use client";

import { useState } from "react";
import { Gavel, AlertTriangle } from "lucide-react";

interface CloseVoyageButtonProps {
  onConfirm: () => void;
}

export default function CloseVoyageButton({
  onConfirm,
}: CloseVoyageButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="mb-12 mt-8">
        <button
          onClick={() => setShowModal(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-semantic-global-primary-default py-4 font-bold text-semantic-global-text-lightest shadow-lg"
        >
          <Gavel className="h-5 w-5" />
          Close Rail Voyage
        </button>
        <p className="mt-3 px-8 text-center text-[11px] text-semantic-global-neutral-default">
          Closing voyage will lock all data. Confirm all units are lashed and
          inspected before departure.
        </p>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-semantic-global-text-default/60 p-6">
          <div className="w-full max-w-sm rounded-2xl bg-semantic-global-background-white p-6 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-semantic-global-warning-default" />
            <h4 className="mb-2 text-xl font-bold text-semantic-global-text-default">
              Finalize Voyage?
            </h4>
            <p className="mb-6 text-sm text-semantic-global-text-light">
              Are you sure you want to close this voyage? This action cannot be
              undone and will prevent further loading changes.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl bg-semantic-global-neutral-lightest py-3 font-bold text-semantic-global-text-default"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  onConfirm();
                }}
                className="flex-1 rounded-xl bg-semantic-global-primary-default py-3 font-bold text-semantic-global-text-lightest"
              >
                Confirm Departure
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
