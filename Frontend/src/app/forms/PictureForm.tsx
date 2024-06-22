import { useState } from "react";
import React from "react";

interface PictureFormProps {
  pictureAbsoluteUri: string | null;
  updatePicture: (file: File | null) => void;
}

export default function PictureForm({ pictureAbsoluteUri, updatePicture }: PictureFormProps) {
  const [file, setFile] = useState<File | null>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      setFile(event.currentTarget.files[0]);
    }
  };

  return (
    <form className="p-4 shadow-lg rounded-lg" style={{width: '400px'}}>
      <h3 className="text-center mb-4">Edit Picture</h3>
      {pictureAbsoluteUri ?
        <img src={pictureAbsoluteUri} alt="poster" className="img-fluid mb-4"
             style={{
               width: '100%',
               height: 'auto',
             }}/>
        : <div className="alert alert-warning mb-3">No picture</div>}
      <div className="mb-3">
        <label htmlFor="Picture" className="form-label">Picture</label>
        <input type="file" className="form-control" id="Picture" name="Picture" onChange={handleFileChange} />
      </div>
      {file ?
        <button type="button" className="btn btn-primary w-100" onClick={() => updatePicture(file)}>Set new picture</button>
        : <button type="button" className={`btn btn-danger w-100${pictureAbsoluteUri ? "" : " disabled"}`} onClick={() => updatePicture(file)}>Delete Picture</button>}
    </form>
  );
}