let imgInput = document.getElementById('input');
let image = document.getElementById('image');
let previewImage = document.getElementById('preview');
let widthOutput = document.getElementById('widthOutput');
let heightOutput = document.getElementById('heightOutput');
let fileSizeOutput = document.getElementById('fileSizeOutput');
let fileSizeCompressOutput = document.getElementById('fileSizeCompressOutput');
let widthCompression = document.getElementById('widthCompression');
let heightCompression = document.getElementById('heightCompression');
let rangerscale=document.getElementById('outputranger');

imgInput.addEventListener('change', function (e) {
  if (e.target.files && e.target.files[0]) {
    let imageFile = e.target.files[0];
    let fileSizeInKB = (imageFile.size / 1024).toFixed(2);
    fileSizeOutput.innerHTML = 'Size : ' + fileSizeInKB + ' KB';

    let reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;

      let img = new Image();
      img.onload = function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        let dataurl = canvas.toDataURL(imageFile.type);
        document.getElementById("image").src = dataurl;
        document.getElementById("image").style.width = "100%";

        widthOutput.innerHTML = 'Width : '+ img.width;
        heightOutput.innerHTML = 'Height : '+ img.height;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  }
});

let ranger = document.getElementById('ranger');

function scaleImage(imageFile, quality) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  canvas.width = image.width * quality;
  canvas.height = image.height * quality;

  ctx.drawImage(imageFile, 0, 0, image.width * quality, image.height * quality);

  let dataurl = canvas.toDataURL(imageFile.type);
  document.getElementById("image").src = dataurl;
  
}

function compressImage(imageFile, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = img.width * quality;
      canvas.height = img.height * quality;

      ctx.drawImage(img, 0, 0, img.width * quality, img.height * quality);

      canvas.toBlob(function (blob) {
        resolve(blob);
      }, imageFile.type, quality);
    };

    img.src = URL.createObjectURL(imageFile);
  });
}

function getImageSizeAfterCompression(imageFile, quality) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        const targetWidth = img.width * quality;
        const targetHeight = img.height * quality;
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        resolve({
          width: targetWidth,
          height: targetHeight
        });
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }

  
  ranger.oninput = async function () {
    if (imgInput.files && imgInput.files[0]) {
      const imageFile = imgInput.files[0];
      const quality = ranger.value / 100;
      const compressedBlob = await compressImage(imageFile, quality);
      const compressedFile = new File([compressedBlob], imageFile.name, {
        type: imageFile.type,
      });
      const imageSizeAfterCompression = await getImageSizeAfterCompression(imageFile, quality);
      
          const widthAfterCompression = imageSizeAfterCompression.width.toFixed(2);
          const heightAfterCompression = imageSizeAfterCompression.height.toFixed(2);
          fileSizeCompressOutput.innerHTML = ('Size&emsp; : ' + (compressedFile.size / 1024).toFixed(2) + 'KB');
          widthCompression.innerHTML= ('Width&emsp; : ' + widthAfterCompression);
          heightCompression.innerHTML= ('Height&emsp; : ' + heightAfterCompression);
        }
      scaleImage(previewImage, ranger.value / 100);  
      
    };
     

let outputranger = document.getElementById('outputranger');
ranger.addEventListener("input", () => {
  outputranger.textContent = ranger.value;
});

let rangerGrayScale = document.getElementById('rangerGrayScale')
let outputrangerGrayScale = document.getElementById('outputrangerGrayScale');
rangerGrayScale.addEventListener("input", () => {
  outputrangerGrayScale.textContent = rangerGrayScale.value;
});

function imgblackwhite(){
  const img = document.getElementById("image");
  const rangerscale = document.getElementById("rangerGrayScale")
  img.style.filter = `grayscale(${rangerscale.value}%)`;
}

//clear input
function remove(){
  document.getElementById('image').src = '';
  document.getElementById('preview').src = '';
  document.getElementById('ranger').value = '100';
  outputranger.textContent = ranger.value;
  document.getElementById('rangerGrayScale').value = '0';
  outputrangerGrayScale.textContent = rangerGrayScale.value;
  fileSizeOutput.innerHTML = '';
  widthOutput.innerHTML ='';
  heightOutput.innerHTML = '';
  fileSizeCompressOutput.innerHTML = '';
  widthCompression.innerHTML= '';
  heightCompression.innerHTML= '';


};