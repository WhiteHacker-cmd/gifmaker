import logo from './logo.svg';
import './App.css';
import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";
import { useEffect, useState } from 'react';

const ffmpeg = createFFmpeg({log: true, corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js"});



function App() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }
  
  useEffect(() => {
    load();
  }, [])

  const convertToGif = async () => {
    //write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    //run ffmpeg command
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');

    //Read the result

    const data = ffmpeg.FS('readFile', 'out.gif');

    //create a URl
    const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}));
    setGif(url);
    
  }  
  return ready ?  (
    <div className="App">
      { video && <video controls
                        width="250"
                        height={250}
                        src={URL.createObjectURL(video)}>

                          </video> }
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
      <h3>Result</h3>

      <button onClick={convertToGif} className="btn">Convert</button>

      {gif && <img src={gif} width="250"height={250}  />}
    </div>
  ) :
  (

    <p>Loadiing...</p>
  );
}

export default App;
