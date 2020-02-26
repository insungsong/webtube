const recorderContainer = document.getElementById("jsRecordContainer");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");

let streamObject;
let videoRecorder;

const handleVideoData = event => {
  const { data: videoFile } = event; // data: videoFile의 의미는 data라는 것을 videoFile이름으로 써도 괜찮게 하겠다라는 의미이다.
  const link = document.createElement("a"); // link라는 변수 이름으로 Element를 하나 생성하고, 여기선 'a'링크로
  link.href = URL.createObjectURL(videoFile); // link라는 이름의 href는 URL.createObjectURL(videoFile) 이게될거라는 말이고
  link.download = "recorded.webm"; // 그 link가 저장될때 recorded라는 이름의 확장자는 webm으로 다운로드 될거라는 말이고
  document.body.appendChild(link); // appendChild(link)를 document.body에 추가해 자식요소로 추가할거란 말이다.
  link.click(); // 그리고 우린, facking click(조작클릭)을 할거라는 말이다.
};

const stopRecording = () => {
  videoRecorder.stop();
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", getVideo);
  recordBtn.innerHTML = "Start recording";
};

const startRecording = () => {
  // stream에서 가진 video를 recording하는것이다.
  videoRecorder = new MediaRecorder(streamObject); //recording값을 받기위해서 하는것이다.
  videoRecorder.start();
  videoRecorder.addEventListener("dataavailable", handleVideoData);
  // setTimeout(() => videoRecorder.stop(), 5000);
  recordBtn.addEventListener("click", stopRecording);
};

const getVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 3000, height: 1280 }
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
    streamObject = stream;
    startRecording();
    recordBtn.innerHTML = "Stop recording";
  } catch (error) {
    recordBtn.innerHTML = "☹️Cant record";
  } finally {
    recordBtn.removeEventListener("click", getVideo);
  }
};

function init() {
  recordBtn.addEventListener("click", getVideo);
}

if (recorderContainer) {
  init();
}
