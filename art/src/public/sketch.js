// constants
const ASPECT_RATIO = 1;

// global variables
let hash = tokenData.hash ?? '0';
let projectNumber = Math.floor(parseInt(tokenData.tokenId) / 1000000);
let mintNumber = parseInt(tokenData.tokenId) % 1000000;

const getDimension = () => Math.min(windowWidth, windowHeight);

class Random {
  constructor() {
    this.useA = false;
    let sfc32 = function (uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16);
      let b = parseInt(uint128Hex.substr(8, 8), 16);
      let c = parseInt(uint128Hex.substr(16, 8), 16);
      let d = parseInt(uint128Hex.substr(24, 8), 16);
      return function () {
        a |= 0; b |= 0; c |= 0; d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
      };
    };
    // seed prngA with first half of tokenData.hash
    this.prngA = new sfc32(tokenData.hash.substr(2, 32));
    // seed prngB with second half of tokenData.hash
    this.prngB = new sfc32(tokenData.hash.substr(34, 32));
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA();
      this.prngB();
    }
  }
  // random number between 0 (inclusive) and 1 (exclusive)
  random_dec() {
    this.useA = !this.useA;
    return this.useA ? this.prngA() : this.prngB();
  }
  // random number between a (inclusive) and b (exclusive)
  random_num(a, b) {
    return a + (b - a) * this.random_dec();
  }
  // random integer between a (inclusive) and b (inclusive)
  // requires a < b for proper probability distribution
  random_int(a, b) {
    return Math.floor(this.random_num(a, b + 1));
  }
  // random boolean with p as percent liklihood of true
  random_bool(p) {
    return this.random_dec() < p;
  }
  // random value in an array of items
  random_choice(list) {
    return list[this.random_int(0, list.length - 1)];
  }
}

const random = new Random();

const generateGene = (seed) => {
  // const randSrc = seedrandom(seed);
  // const {
  //   randomByWeights,
  //   random,
  //   randomInArrayByWeights,
  //   randomInArray
  // } = randomRangeFactory(randSrc);
  // const pallete = randomInArray(colors);
  return {
    seed,
    pallete: ['#005555', '#069A8E', '#A1E3D8', '#F7FF93'],
    gridLinesToRects: {
      gitter: [-1, 0],
    },
    gridPartitioning: {
      margin: 60,
      gap: 5,
      // unitSize: [50, 50],
      gridSizeInUnits: [40, 40],
    },
  }
}

const generateGridPartitioningInGridUnits = (
  topLeft,
  bottomRight,
  vertOrHorzRatio = 0.5,
) => {
  // if bounds is in effect a dot
  if (
    bottomRight[0] - topLeft[0] === 0 &&
    bottomRight[1] - topLeft[1] === 0
  ) {
    return [[topLeft, bottomRight]];
  }
  let isVert = random.random_dec() > vertOrHorzRatio;
  // if bound is a 1 by 2 line
  if (
    (bottomRight[0] - topLeft[0] === 1 &&
      bottomRight[1] - topLeft[1] === 0) ||
    (bottomRight[0] - topLeft[0] === 0 && bottomRight[1] - topLeft[1] === 1)
  ) {
    return [
      [topLeft, topLeft],
      [bottomRight, bottomRight],
    ];
  }
  // if bounds is in effect a 2 by 2 square
  if (
    bottomRight[0] - topLeft[0] === 1 &&
    bottomRight[1] - topLeft[1] === 1
  ) {
    if (isVert) {
      return [
        [topLeft, [bottomRight[0] - 1, bottomRight[1]]],
        [[topLeft[0] + 1, topLeft[1]], bottomRight],
      ];
    } else {
      return [
        [topLeft, [bottomRight[0], bottomRight[1] - 1]],
        [[topLeft[0], topLeft[1] + 1], bottomRight],
      ];
    }
  }

  const startPt = [
    isVert ? random.random_int(topLeft[0] + 1, bottomRight[0] - 1) : topLeft[0],
    isVert ? topLeft[1] : random.random_int(topLeft[1] + 1, bottomRight[1] - 1),
  ];
  const endPt = [
    isVert ? startPt[0] : bottomRight[0],
    isVert ? bottomRight[1] : startPt[1],
  ];
  const line = [startPt, endPt];
  const topOrLeftRect = [
    topLeft,
    [endPt[0] - (isVert ? 1 : 0), endPt[1] - (isVert ? 0 : 1)],
  ];
  const bottomOrRightRect = [
    [startPt[0] + (isVert ? 1 : 0), startPt[1] + (isVert ? 0 : 1)],
    bottomRight,
  ];
  // check if bounds are valid, if not provide no lines
  const isTopOrLeftRectValid =
    topOrLeftRect[1][0] >= topOrLeftRect[0][0] &&
    topOrLeftRect[1][1] >= topOrLeftRect[0][1];
  const isBottomOrRightRectValid =
    bottomOrRightRect[1][0] >= bottomOrRightRect[0][0] &&
    bottomOrRightRect[1][1] >= bottomOrRightRect[0][1];

  const ratio = !isVert
    ? vertOrHorzRatio / 2
    : vertOrHorzRatio + (1 - vertOrHorzRatio) / 2;
  return [
    ...(isTopOrLeftRectValid
      ? generateGridPartitioningInGridUnits(
          topOrLeftRect[0],
          topOrLeftRect[1],
          ratio,
        )
      : []),
    line,
    ...(isBottomOrRightRectValid
      ? generateGridPartitioningInGridUnits(
          bottomOrRightRect[0],
          bottomOrRightRect[1],
          ratio,
        )
      : []),
  ];
};

const convertGridLinesToRects = (
  lines
) => {
  const { gridSizeInUnits, gap, margin } = gene.gridPartitioning;
  const { gitter } = gene.gridLinesToRects;
  
  const dimension = getDimension();

  const unitSize = [
    ((dimension - margin * 2) - (gridSizeInUnits[0] - 1) * gap) / gridSizeInUnits[0],
    ((dimension - margin * 2) - (gridSizeInUnits[1] - 1) * gap) / gridSizeInUnits[1],
  ];

  const topLeft = [
    margin,
    margin,
  ];

  return lines
    .map((l, i) => {
      return [
        [l[0][0] * (unitSize[0] + gap), l[0][1] * (unitSize[1] + gap)],
        [
          (l[1][0] + gitter[0]) * (unitSize[0] + gap) -
            gap,
          (l[1][1] + gitter[1]) * (unitSize[1] + gap) -
            gap,
        ],
      ];
    })
    .map((r) => {
      return [
        [topLeft[0] + r[0][0], topLeft[1] + r[0][1]],
        [topLeft[0] + r[1][0], topLeft[1] + r[1][1]],
      ];
    });
};


const gene = generateGene(hash);

function setup() {
  const dimension = getDimension();
  createCanvas(dimension, dimension);

  noLoop();
}

function windowResized() {
  const dimension = getDimension();
  resizeCanvas(dimension, dimension);
}

function draw() {
  const { gitter } = gene.gridLinesToRects;
  const { gridSizeInUnits, margin} = gene.gridPartitioning;
  const dimension = getDimension();
  const pallete = gene.pallete;
  const lines = generateGridPartitioningInGridUnits(
    [0, 0],
    [gridSizeInUnits[0] - 1, gridSizeInUnits[1] - 1],
  );
  const rects = convertGridLinesToRects(lines);
  background(pallete[0]);
  for (let i = 0; i < rects.length; ++i) {
    const r = rects[i];
    const l = lines[i]; 
    rect(...r[0], ...[r[1][0] - r[0][0], r[1][1] - r[0][1]]);
  }
  // draw the frame
  strokeWeight(margin * 2);
  stroke(pallete[2]);
  fill('rgba(0,0,0,0)');
  rect(0,0, dimension, dimension);
  strokeWeight(1);
  stroke('black');
  rect(margin, margin, dimension - margin * 2, dimension - margin * 2);
}
