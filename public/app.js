const dropArea = document.querySelector(".drop-area"); //dashed area
const fileInput = document.querySelector("#fileInput"); // file input
const browse = document.querySelector(".browse"); // browse btn

const maxSize = 100 * 1024 * 1024; //100mb
const fileProgress = document.querySelector(".file-progress"); // progress bar
const percentValue = document.querySelector("#percent-value"); // uploaded percent in progress bar
const progressBar = document.querySelector(".progress-bar"); //progress bar box
const fileURL = document.querySelector("#fileURL"); // to show url to dowload item or share
const copyBtn = document.querySelector("#copyBtn"); // copy svg

//http request url
const baseURL = "https://node-shareapp.herokuapp.com/";
const uploadURL = `${baseURL}api/files`;
const emailURL = `${baseURL}api/files/send`;

const shareBox = document.querySelector(".share-box");
const inputBox = document.querySelector(".input-box");
const emailForm = document.querySelector("#share-form");
const toast = document.querySelector(".toast");

// drop box background color toggle
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("dragged");
});

dropArea.addEventListener("dragleave", (e) => {
  e.preventDefault();
  dropArea.classList.remove("dragged");
});

copyBtn.addEventListener("click", () => {
  fileURL.select(); // select url text
  document.execCommand("copy"); // execute copy command
  showToast("Copied to Clipboard");
});
inputBox.addEventListener("click", () => {
  fileURL.select();
});

// on dropping or adding files

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("dragged");
  const files = e.dataTransfer.files; // files to be processed further
  if (files.length > 0) {
    fileInput.files = files;
    uploadFile();
  }
});
fileInput.addEventListener("change", () => {
  uploadFile();
});

browse.addEventListener("click", () => {
  fileInput.click(); // enable input button action on browse
});

//to check if more than one file is requested

const uploadFile = () => {
  if (fileInput.files.length > 1) {
    showToast("only upload 1 file");
    fileInput.value = "";
    return;
  }
  const file = fileInput.files[0];

  if (file.size > maxSize) {
    showToast("Too large to upload");
    fileInput.value = "";
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

  xhr.upload.onerror = () => {
    fileInput.value = "";
    showToast(`Error in Upload: ${xhr.statusText}`);
  };

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
        showToast("File Send Successfully");
      }
    });
});
let toastTimer;
const showToast = (msg) => {
  toast.innerText = msg;
  toast.style.transform = "translate(-50%,0)";
  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.style.transform = "translate(-50%,60px)";
  }, 1500);
};
