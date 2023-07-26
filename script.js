const imgElement = [];
let currentDegrees = [];
let inputElement = document.getElementById("fileInput");
let imgCount = 0;
let selectedImage;
let selectedImageNumber = 0;

inputElement.addEventListener(
  "change",
  (e) => {
    newImgCreation();

    currentDegrees.push(0);
    imgElement.push(document.getElementById(`imageSrc-${imgCount}`));
    imgElement[imgCount].src = URL.createObjectURL(e.target.files[0]);

    imgElement[imgCount].onload = () => {
      newCanvasCreation();

      let mat = cv.imread(imgElement[imgCount]);
      cv.imshow(`canvas-${imgCount}`, mat);
      imgCount++;
      mat.delete();
    };
  },
  false
);

const rotateImg = (degrees, direction) => {
  if (selectedImage == null) {
    alert("No image selected");
    return;
  }

  let src = cv.imread(imgElement[selectedImageNumber]);
  let dst = new cv.Mat();
  let dsize = new cv.Size(src.rows, src.cols);
  let center = new cv.Point(src.cols / 2, src.rows / 2);

  if (direction === "left") currentDegrees[selectedImageNumber] += degrees;
  else currentDegrees[selectedImageNumber] -= degrees;

  let M = cv.getRotationMatrix2D(
    center,
    currentDegrees[selectedImageNumber],
    1
  );

  cv.warpAffine(
    src,
    dst,
    M,
    dsize,
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar()
  );

  cv.imshow(`${selectedImage}`, dst);
  src.delete();
  dst.delete();
  M.delete();
};

const newImgCreation = () => {
  const newImg = document.createElement("img");
  newImg.id = `imageSrc-${imgCount}`;
  newImg.style.display = "none";
  document.getElementById("container").appendChild(newImg);
};

const newCanvasCreation = () => {
  let randomX = Math.floor(Math.random() * 380);
  let randomY = Math.floor(Math.random() * 380);

  const newCanvas = document.createElement("canvas");
  newCanvas.style.position = "absolute";
  newCanvas.style.width = "50px";
  newCanvas.style.height = "50px";
  newCanvas.style.top = `${randomY}px`;
  newCanvas.style.left = `${randomX}px`;
  newCanvas.id = `canvas-${imgCount}`;

  newCanvas.addEventListener("click", () => {
    selectedImage = newCanvas.id;
    selectedImageNumber = selectedImage.slice(7);
  });

  document.getElementById("container").appendChild(newCanvas);
};
