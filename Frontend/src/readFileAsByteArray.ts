export default function readFileAsByteArray(imageFile: File | null): Promise<string | null> {
  return new Promise((resolve, reject) => {
    if (!imageFile) {
      resolve(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target && event.target.result instanceof ArrayBuffer) {
        const byteArray = new Uint8Array(event.target.result);
        const base64String = bufferToBase64(byteArray);
        resolve(base64String);
      } else {
        reject(new Error('Failed to read image as base64.'));
      }
    };

    function bufferToBase64(buffer: Uint8Array) {
      const bytes = new Uint8Array(buffer);
      const binary  = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');

      return btoa(binary);
    }

    reader.onerror = (event) => {
      reject(new Error('Error reading image: ' + (event.target?.error?.message || 'Unknown error')));
    };

    reader.readAsArrayBuffer(imageFile);
  })
};