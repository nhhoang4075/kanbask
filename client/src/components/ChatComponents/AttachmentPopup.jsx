

export default function AttachmentPopup({ handleFileUpload }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };
  return (
    <div>
      <input type="file" id="fileInput" className="hidden" />
      <label htmlFor="fileInput" className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200 rounded-md" onChange={handleFileChange}>
        <span>Attach a file</span>
      </label>
    </div>
  );
}