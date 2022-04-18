import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { formatBytes } from './util';
import { Call } from "wasm-imagemagick";



function App() {
  const inputImageRef = useRef<HTMLImageElement>(null);

  const previewImageRef = useRef<HTMLImageElement>(null);


  const [state, setState] = useState({
    inputImageSrc: '',
    inputLoaded: false,
    inputSize: '',
    inputWidth: 0,
    inputHeight: 0,
    inputImageName: '',
    inputImageType: '',
    previewImageSrc: '',
  })

  // On New Data
  useEffect(() => {
    if (state.inputImageSrc.length == 0 || !state.inputLoaded) return;
    const inputImage = inputImageRef.current

    if( !inputImage ) return ;

    setState({ ...state, inputWidth:inputImage.width, inputHeight:inputImage.height})

  });


  async function handleInputImageUpload(e: SyntheticEvent) {
    // @ts-ignore
    const file: File = e.target.files[0];
    const buffer = await file?.arrayBuffer()
    const content = new Uint8Array(buffer);
    const inputLoaded = true;

    const inputSize = formatBytes(content.length);
    const inputImageName = file.name;
    const inputImageType = file.type;

    const image = { name: file.name, content};

    const command = ["convert", file.name, '-resize', '100%', 'out.png']
    const result = await Call([image], command)
    const inputImage = result[0];
    const inputImageSrc = URL.createObjectURL(inputImage.blob)//'data:image/png;base64,' + encode(bytes);

    setState({ ...state, inputImageSrc, inputLoaded, inputSize, inputImageName, inputImageType });
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
          <input name='Input File' onChange={async (e: any) => await handleInputImageUpload(e)} type='file'  accept="image/*" />
        </label>
        <button>Optimize</button>
      </form>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <h3>Before</h3>
          <img
            ref={inputImageRef}
            alt='Source Image'
            style={{ width: '100%' }}
            src={state.inputImageSrc.length == 0 ? '' : state.inputImageSrc} 
          />
          <ul>
            <li>
              File Format: {state.inputImageType}
            </li>
            <li>
              Dimensions: {state.inputWidth} x {state.inputHeight}
            </li>
            <li>
              Size: {state.inputSize}
            </li>
          </ul>
        </div>
        <div style={{ width: '50%' }}>
          <h3>After</h3>
          <img
            ref={previewImageRef}
            alt='Source Image'
            style={{ width: '100%'}}
            src={state.previewImageSrc.length == 0 ? '' : state.previewImageSrc} />
          <form onSubmit={(e) => e.preventDefault()}>
            <ul>
              <li>
                <label htmlFor='Preview File Format'>
                  <span>
                    File Format:
                  </span>
                  <select name='Preview File Format'>
                    <option value='jpg'>JPG</option>
                    <option value='png'>PNG</option>
                    <option value='webp'>WEBP</option>

                  </select>
                </label>
              </li>
              <li>
                <span>
                  Dimensions:
                </span>
                <label htmlFor='Preview Width'>
                  <input defaultValue={state.inputWidth} type="number" name="Preview Width"  />
                </label>
                <label htmlFor='Preview Height'>
                  <input defaultValue={state.inputHeight} type="number" name="Preview Height"  />
                </label>
              </li>
              <li>
                Size: 
              </li>
            </ul>
          </form>

        </div>
      </div>
    </div>
  )
}

export default App
