import { useDropzone } from 'react-dropzone';
import { PopoverContent } from '../ui/popover';
import { Plus, Minus} from 'lucide-react';

export default function AddAttachments({ attachment, setAttachment, isOpen, setIsOpen }) {

  const onDrop = (acceptedFile) => {
    setAttachment(acceptedFile[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  });

  return (      
    <PopoverContent className="h-fit w-fit">
      {(attachment) ? (
        <div className="flex items-center max-w-100 space-x-10 p-2 bg-gray-100 rounded-md">
          <p className='truncate'>{attachment.name}</p>
          <button onClick={() => setAttachment(null)} className="text-red-500">
            <Minus className='text-red-500' size={20} />
          </button>
        </div>
      ) : (
         <div {...getRootProps()} className="flex flex-col h-60 w-100 items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer">
          <input {...getInputProps()} />
          <Plus className="text-gray-500" size={24} />
          <p className="text-gray-500 text-[16px]">Drag and drop files here, or click to select files</p>
          <p className="text-gray-500 text-xs">Supported formats: .png, .jpg, .jpeg, .gif, .pdf, .docx, .xlsx</p>
        </div>
      )}
    </PopoverContent>
  );
}