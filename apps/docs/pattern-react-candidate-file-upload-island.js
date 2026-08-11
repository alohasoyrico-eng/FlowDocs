import React from "react";
import { FileUpload } from "./generated/react/patterns/FileUpload.js?v=1";

const selectedFile = {
  key: "invoice-july",
  name: "invoice-july.pdf",
  size: "2.4 MB",
  type: "PDF",
  status: "Ready for review",
};

export function FileUploadIsland({ initialProps }) {
  const [files, setFiles] = React.useState(initialProps.files ?? []);
  const [state, setState] = React.useState(initialProps.state ?? "empty");
  const [progress, setProgress] = React.useState(initialProps.progress);
  const [feedback, setFeedback] = React.useState(initialProps.feedback);
  const [validation, setValidation] = React.useState(initialProps.validation);

  const chooseFile = (event) => {
    setFiles([selectedFile]);
    setState("uploading");
    setProgress({ label: "Upload progress", value: 65, max: 100, showValue: true });
    setValidation(undefined);
    setFeedback(undefined);
    window.setTimeout(() => {
      setState("complete");
      setProgress({ label: "Upload complete", value: 100, max: 100, showValue: true });
      setFeedback({ label: "Upload complete", description: "invoice-july.pdf is ready for review.", tone: "success", state: "visible" });
    }, 360);
    initialProps.onChoose?.(event);
  };

  const removeFile = (key, event) => {
    setFiles([]);
    setState("empty");
    setProgress(undefined);
    setFeedback(undefined);
    setValidation(undefined);
    initialProps.onRemove?.(key, event);
  };

  return React.createElement(FileUpload, {
    ...initialProps,
    files,
    state,
    progress,
    feedback,
    validation,
    chooseAction: { ...(initialProps.chooseAction ?? {}), label: initialProps.chooseAction?.label ?? "Choose document" },
    removeAction: files.length ? { ...(initialProps.removeAction ?? {}), label: initialProps.removeAction?.label ?? "Remove" } : initialProps.removeAction,
    onChoose: chooseFile,
    onRemove: removeFile,
  });
}
