const dropArea = document.querySelector(".drop-area");
const fileInput = document.querySelector("#fileInput");
const browse = document.querySelector(".browse");

const maxSize = 100 * 1024 * 1024; //100mb
const fileProgress = document.querySelector(".file-progress");
const percentValue = document.querySelector("#percent-value");
const progressBar = document.querySelector(".progress-bar");
const fileURL = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#copyBtn");

const baseURL = "https://innshare.herokuapp.com/";
const uploadURL = `${baseURL}api/files`;
const emailURL = `${baseURL}api/files/send`;
const shareBox = document.querySelector(".share-box");
const inputBox = document.querySelector(".input-box");
const emailForm = document.querySelector("#share-form");
const toast = document.querySelector(".toast");

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("dragged");
});

dropArea.addEventListener("dragleave", (e) => {
  e.preventDefault();
  dropArea.classList.remove("dragged");
});

copyBtn.addEventListener("click", () => {
  fileURL.select();
  document.execCommand("copy");
  showToast('Copied to Clipboard')
});
inputBox.addEventListener("click", () => {
  fileURL.select();
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("dragged");
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    uploadFile();
  }
});
fileInput.addEventListener("change", () => {
  uploadFile();
});

browse.addEventListener("click", () => {
  fileInput.click();
});

const uploadFile = () => {
  if(fileInput.files.length > 1){
    showToast('only upload 1 file')
    fileInput.value=''
    return;
  }
  const file = fileInput.files[0];

  if(file.size > maxSize){
    showToast("Too large to upload")
    fileInput.value = ""
    return;
  }
  progressBar.style.display = "block";
  const formData = new FormData();
  formData.append("myfile", file);
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      uploadSuccess(JSON.parse(xhr.response));
    }
  };

  xhr.upload.onprogress = (event) => {
    let percent = Math.round((100 * event.loaded) / event.total);
    console.log(percent);
    fileProgress.style.transform = `scaleX(${percent / 100})`;
    percentValue.innerText = `${percent}%`;
  };

  xhr.upload.onerror = ()=>{
    fileInput.value = ""
    showToast(`Error in Upload: ${xhr.statusText}` )
  }

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const uploadSuccess = ({ file: url }) => {
  console.log(url);
  fileInput.value = "";
  emailForm[2].removeAttribute("disabled", "false");
  progressBar.style.display = "none";
  shareBox.style.display = "block";
  fileURL.value = url;
};

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("trust");

  const url = fileURL.value;

  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };
  console.table(formData);
  emailForm[2].setAttribute("disabled", "true");
  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({ success }) => {
      if (success) {
        shareBox.style.display = "none";
        showToast("File Send Successfully")
      }
    });
});
let toastTimer
const showToast = (msg) => {
  toast.innerText = msg;
  toast.style.transform = "translate(-50%,0)";
  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.style.transform = "translate(-50%,60px)";
  }, 1500);
};
