interface Settings {
  mouseDown: boolean;
  mousePos: number;
  left: boolean;

  refreshIntervalId: null | number;
  scale: number;
  rotation: number;
  velocity: number;
  friction: number;
  stopPoint: number;
  translate: [number, number];
  dX: number;
  dY: number;
}

const settings: Settings = {
  mouseDown: false,
  mousePos: 0,
  left: undefined,
  refreshIntervalId: null,

  scale: 0.4,
  rotation: 40,

  velocity: 0,
  friction: 0.9,
  stopPoint: 2,

  translate: [0, 0],

  dX: 0,
  dY: 0,
};

const initPage = () => {
  const totalThumbs = 15;
  const container = document.createElement('div');
  container.className = 'thumbs';

  for(let i = 0; i < totalThumbs; i++){
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    thumb.style.backgroundImage = `url(boxes/${i+1}.jpg)`;
    container.appendChild(thumb);
  }

  document.querySelector('header').appendChild(container);

}

initPage();

interface ArrayConstructor {
  from<T, U>(
    arrayLike: ArrayLike<T>,
    mapfn: (v: T, k: number) => U,
    thisArg?: any
  ): Array<U>;
  from<T>(arrayLike: ArrayLike<T>): Array<T>;
}

document.addEventListener("mousedown", function (e) {
  e.preventDefault();
  settings.mouseDown = true;
  settings.mousePos = e.pageX;

  const item = <HTMLElement>e.target;

  if (item.classList.contains("thumb")) {
    const boxImg = item.style.backgroundImage;
    Array.from(document.querySelectorAll("._3dface")).forEach((face) => {
      (<HTMLElement>face).style.backgroundImage = boxImg;
    });
  }
});

const decay = () => {
  settings.velocity *= settings.friction;
  (<HTMLElement>(
    document.querySelector("._3dbox")
  )).style.transform = `rotateY(${Math.floor(
    settings.rotation + settings.velocity
  )}deg)`;

  if (settings.velocity <= settings.stopPoint) {
    settings.velocity = 0;
    clearInterval(settings.refreshIntervalId);
  } else if (settings.velocity === 0) {
    settings.velocity = 0;
    clearInterval(settings.refreshIntervalId);
  }
};

document.addEventListener("mouseup", (e) => {
  e.preventDefault();
  settings.mouseDown = false;
  settings.refreshIntervalId = setInterval(decay, 10);
});

document.addEventListener("mousemove", function (e) {
  if (settings.mouseDown) {
    if (e.pageX < settings.mousePos) {
      settings.rotation += (settings.mousePos - e.pageX) / 2;
      (<HTMLElement>(
        document.querySelector("._3dbox")
      )).style.transform = `rotateY(${settings.rotation}deg)`;
      settings.left = true;
    } else if (e.pageX > settings.mousePos) {
      settings.rotation += (settings.mousePos - e.pageX) / 2;
      (<HTMLElement>document.querySelector("._3dbox")).style.transform =
        "rotateY(" + settings.rotation + "deg)";
      settings.left = false;
    }
    settings.velocity = Math.abs(settings.mousePos - e.pageX);
    settings.mousePos = e.pageX;
  }
});

document.addEventListener("wheel", (e) => {
  // e.preventDefault();

  settings.dX = e.deltaX;
  settings.dY = e.deltaY;

  if (e.ctrlKey || e.metaKey || e.shiftKey) {
    settings.translate[0] += settings.dX;
    settings.translate[1] += settings.dY;
    (<HTMLElement>(
      document.querySelector(".box-wrapper")
    )).style.transform = `translate3d(${settings.translate[0]}px, ${settings.translate[1]}px, 0)`;
  } else {
    settings.scale += -settings.dY * 0.001;
    if (settings.scale < 0.3) settings.scale = 0.3;

    (<HTMLElement>document.querySelector(".space3d")).style.transform =
      "scale(" + settings.scale + ")";

    settings.rotation += settings.dX * 0.9;

    (<HTMLElement>document.querySelector("._3dbox")).style.transform =
      "rotateY(" + settings.rotation + "deg)";
  }
});
