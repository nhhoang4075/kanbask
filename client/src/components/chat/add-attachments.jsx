import { useDropzone } from "react-dropzone";
import { PopoverContent } from "../ui/popover";
import { Plus, Minus } from "lucide-react";

export default function AddAttachments({ attachments, setAttachments, isOpen, setIsOpen }) {
  const onDrop = (acceptedFiles) => {
    setAttachments((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
    }
  });

  return (
    <PopoverContent className="w-fit h-fit">
      <div className="font-bold text-xl py-2">Add attachments</div>
      {attachments.length !== 0 ? (
        <div className="flex flex-col overflow-y-auto w-100 max-h-60 p-2 space-y-2 bg-gray-100 rounded-md">
          {attachments.map((attachment) => (
            <div
              key={attachment.name}
              className="flex items-center justify-between py-2 px-3 bg-white rounded-md shadow-sm"
            >
              <p className="truncate">{attachment.name}</p>
              <button
                onClick={() => setAttachments((prev) => prev.filter((a) => attachment !== a))}
                className="text-red-500"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="flex flex-col w-100 h-60 items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer"
        >
          <input {...getInputProps()} />
          <Plus className="w-8 h-8 text-gray-500" />
          <p className="text-gray-500 text-[16px]">
            Drag and drop files here, or click to select files
          </p>
          <p className="text-gray-500 text-[12px]">
            Supported formats: .png, .jpg, .jpeg, .gif, .pdf, .docx, .xlsx
          </p>
        </div>
      )}
    </PopoverContent>
  );
}
