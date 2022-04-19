import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { formatBytes } from './util';
import { Call, MagickInputFile, MagickOutputFile } from "wasm-imagemagick";
import * as magick_cmd from './MagickCommands';


const inputFormats = "*.png, *.jpeg, *.jpg, *.webp, *.tiff, *.bmp";
const outputFormats = [
  { name: 'PNG' },
  { name: 'JPG' },
  { name: 'WEBP' },
  { name: 'TIFF' },
  { name: 'BMP' },

]

type WorkingFile = {

  magick_input?: MagickInputFile;
  src?: string;
  name?: string;
  type?: string;

  size?: number;
  size_text?: string;

  width?: number;
  height?: number;
  loaded?: boolean;

  magick_output?: MagickOutputFile;
  preview_src?: string;
  preview_name?: string;
  preview_type?: string;
  preview_size?: number;
  preview_size_text?: string;

  preview_width?: number;
  preview_height?: number;
  preview_loaded?: boolean;

}

type OptimizeImageSettings = {

}

class AppState {
  workingFile: WorkingFile = {};
  settings: OptimizeImageSettings = {}
}

function App() {

  const initialState: AppState = new AppState();
  const [state, setState] = useState(initialState);

  const inputImageRef = useRef<HTMLImageElement>(null);
  const previewImageRef = useRef<HTMLImageElement>(null);

  // On New Data
  useEffect(() => {
    // No input Loaded
  });


  async function processImage(e: SyntheticEvent) {

  }
  async function handleInputImageUpload(e: SyntheticEvent) {
    // @ts-ignore
    const img_file: File = e.target.files[0];
    const img_buff = await img_file?.arrayBuffer();
    const content = new Uint8Array(img_buff);
    const src = URL.createObjectURL(new Blob([img_buff]));
    const magick_input: MagickInputFile = { name: img_file.name, content };

    const inputIdentify = await magick_cmd.Identify([magick_input]);

    if (!inputIdentify.error) {
      const { size_text, width, height } = inputIdentify;
      const workingFile: WorkingFile = {
        src,
        width,
        height,
        size_text,
        loaded: true,
        magick_input,

        preview_src: src,
      }
      setState({ ...state, workingFile });
    } else {
      console.error("WOW")
    }

  }

  return (
    <div className="App">
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          <span>Image Requires Transparency</span>
          <input type='checkbox' name='Keep File Type' />
        </label>
        <label>
          <span>Keep File Extension</span>
          <input type='checkbox' name='Keep File Type' />
        </label>
        <label htmlFor="Input File">
          <input name='Input File' onChange={async (e: any) => await handleInputImageUpload(e)} type='file' accept="image/*" />
        </label>
        <button onClick={(e) => processImage(e)}>Optimize</button>
      </form>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <h3>Before</h3>
          {state.workingFile.src &&
            <img
              ref={inputImageRef}
              alt='Source Image'
              style={{ width: '100%' }}
              src={state.workingFile.src}
            />
          }
          <ul>
            <li>
              File Format: {state.workingFile.type}
            </li>
            <li>
              Dimensions: {state.workingFile.width ?? ""} x {state.workingFile.height ?? ""}
            </li>
            <li>
              Size: {state.workingFile.size_text ?? ""}
            </li>
          </ul>
        </div>
        <div style={{ width: '50%' }}>
          <h3>After</h3>
          {state.workingFile.preview_loaded &&
            <img
              ref={previewImageRef}
              alt='Preview Image'
              style={{ width: '100%' }}
              src={state.workingFile.preview_src}
            />
          }
          <ul>
            <li>
              File Format: {state.workingFile.preview_type}
            </li>
            <li>
              Dimensions: {state.workingFile.preview_width ?? ""} x {state.workingFile.preview_height ?? ""}
            </li>
            <li>
              Size: {state.workingFile.preview_size ?? ""}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
