// constants
const ASPECT_RATIO = 1;

// global variables
let hash = tokenData.hash ?? '0';
let projectNumber = Math.floor(parseInt(tokenData.tokenId) / 1000000);
let mintNumber = parseInt(tokenData.tokenId) % 1000000;

const getDimension = () => 2000;

const getCanvasDimension = () => Math.min(windowWidth, windowHeight);

const scaleValue = (value) => {
  const canvasDimension = getCanvasDimension();
  const dimension = getDimension();
  return value * canvasDimension / dimension;
};


class Random {
  constructor(hash) {
    this.useA = false;
    let sfc32 = function (uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16);
      let b = parseInt(uint128Hex.substr(8, 8), 16);
      let c = parseInt(uint128Hex.substr(16, 8), 16);
      let d = parseInt(uint128Hex.substr(24, 8), 16);
      return function () {
        a |= 0;
        b |= 0;
        c |= 0;
        d |= 0;
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
    this.prngA = new sfc32(hash.substr(2, 32));
    // seed prngB with second half of tokenData.hash
    this.prngB = new sfc32(hash.substr(34, 32));
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
  // random index by weight
  random_by_weight(weights) {
    var totalWeight = 0,
    i,
    random;

    for (i = 0; i < weights.length; i++) {
      totalWeight += weights[i];
    }

    random = this.random_dec() * totalWeight;

    for (i = 0; i < weights.length; i++) {
      if (random < weights[i]) {
        return i;
      }

      random -= weights[i];
    }

    return -1;
  }
  // random choice by weights
  random_choice_by_weight(list, weights) {
    return list[this.random_by_weight(weights)];
  }
}

const random = new Random(hash);

const PATTERN_WEIGHTS = [
  [0, 0.2, 0.4, 0.8, 1],
  [0, 0.25, 0.5, 0.75, 1],
  [0, 0.4, 0.8, 0.9, 1],
  [0, 0.1, 0.4, 0.6, 0.9, 1],
];

const COLORS = [
  ['#f5eee6', '#f3d7ca', '#e6a4b4', '#c86b85'],
  ['#7effdb', '#b693fe', '#8c82fc', '#ff9de2'],
  ['#dff4f3', '#dde7f2', '#b9bbdf', '#878ecd'],
  ['#303841', '#3a4750', '#d72323', '#eeeeee'],
  ['#ebfffa', '#c6fce5', '#6ef3d6', '#0dceda'],
  ['#99e1e5', '#f3e8cb', '#f2c6b4', '#fbafaf'],
  ['#0c056d', '#590d82', '#b61aae', '#f25d9c'],
  ['#155263', '#ff6f3c', '#ff9a3c', '#ffc93c'],
  ['#fafafa', '#e8f1f5', '#005691', '#004a7c'],
  ['#15b7b9', '#10ddc2', '#f5f5f5', '#f57170'],
  ['#f4eeff', '#dcd6f7', '#a6b1e1', '#424874'],
  ['#cefff1', '#ace7ef', '#a6acec', '#a56cc1'],
  ['#fb929e', '#ffdfdf', '#fff6f6', '#aedefc'],
  ['#a9eee6', '#fefaec', '#f9a1bc', '#625772'],
  ['#fbf0f0', '#dfd3d3', '#b8b0b0', '#7c7575'],
  ['#071a52', '#086972', '#17b978', '#a7ff83'],
  ['#283149', '#404b69', '#f73859', '#dbedf3'],
  ['#393232', '#4d4545', '#8d6262', '#ed8d8d'],
  ['#ff6464', '#ff8264', '#ffaa64', '#fff5a5'],
  ['#f8b595', '#f67280', '#c06c84', '#6c5b7c'],
  ['#303a52', '#574b90', '#9e579d', '#fc85ae'],
  ['#fef0ff', '#d6c8ff', '#c79ecf', '#7e6bc4'],
  ['#66bfbf', '#eaf6f6', '#fcfefe', '#f76b8a'],
  ['#f6f6f6', '#d6e4f0', '#1e56a0', '#163172'],
  ['#00204a', '#005792', '#00bbf0', '#d9faff'],
  ['#11cbd7', '#c6f1e7', '#f0fff3', '#fa4659'],
  ['#a9eee6', '#fefaec', '#f38181', '#625772'],
  ['#f9ecec', '#f0d9da', '#c8d9eb', '#ecf2f9'],
  ['#35477d', '#6c5b7b', '#c06c84', '#f67280'],
  ['#232931', '#393e46', '#4ecca3', '#eeeeee'],
  ['#142850', '#27496d', '#0c7b93', '#00a8cc'],
  ['#27296d', '#5e63b6', '#a393eb', '#f5c7f7'],
  ['#3a0088', '#930077', '#e61c5d', '#ffbd39'],
  ['#ffb6b6', '#fde2e2', '#aacfcf', '#679b9b'],
  ['#142850', '#27496d', '#00909e', '#dae1e7'],
  ['#ffe8df', '#ffffff', '#f0f0f0', '#888888'],
  ['#fcefee', '#fccde2', '#fc5c9c', '#c5e3f6'],
  ['#e0fcff', '#90f2ff', '#6eb6ff', '#7098da'],
  ['#a6e4e7', '#f9f9f9', '#ebcbae', '#8f8787'],
  ['#233142', '#455d7a', '#f95959', '#e3e3e3'],
  ['#c7f3ff', '#fdc7ff', '#ffdcf5', '#f2f4c3'],
  ['#ffb6b9', '#fae3d9', '#bbded6', '#8ac6d1'],
  ['#e7e6e1', '#f7f6e7', '#c1c0b9', '#537791'],
  ['#fffcca', '#55e9bc', '#11d3bc', '#537780'],
  ['#272343', '#ffffff', '#e3f6f5', '#bae8e8'],
  ['#ffa5a5', '#ffffc2', '#c8e7ed', '#bfcfff'],
  ['#253b6e', '#1f5f8b', '#1891ac', '#d2ecf9'],
  ['#f2f2f2', '#ebd5d5', '#ea8a8a', '#685454'],
  ['#eaafaf', '#a2738c', '#645c84', '#427996'],
  ['#fcf5ee', '#fbe8e7', '#f7ddde', '#ffc4d0'],
  ['#4d606e', '#3fbac2', '#d3d4d8', '#f5f5f5'],
  ['#ffbbcc', '#ffcccc', '#ffddcc', '#ffeecc'],
  ['#9ddcdc', '#fff4e1', '#ffebb7', '#e67a7a'],
  ['#7d5a5a', '#f1d1d1', '#f3e1e1', '#faf2f2'],
  ['#ffd9e8', '#de95ba', '#7f4a88', '#4a266a'],
  ['#f0ece2', '#dfd3c3', '#c7b198', '#596e79'],
  ['#f47c7c', '#f7f48b', '#a1de93', '#70a1d7'],
  ['#c8f4de', '#a4e5d9', '#66c6ba', '#649dad'],
  ['#0e3150', '#6dc9c8', '#ffc0c2', '#f7e9e3'],
  ['#c7f5fe', '#fcc8f8', '#eab4f8', '#f3f798'],
  ['#e3d9ca', '#95a792', '#596c68', '#403f48'],
  ['#2a363b', '#e84a5f', '#ff847b', '#fecea8'],
  ['#f4f7f7', '#aacfd0', '#79a8a9', '#1f4e5f'],
  ['#700961', '#b80d57', '#e03e36', '#ff7c38'],
  ['#e4eddb', '#307672', '#144d53', '#1a3c40'],
  ['#a7efe9', '#7fdfd4', '#fbe1b6', '#fbac91'],
  ['#f5efe3', '#e6e7e5', '#f7d3ba', '#a6aa9c'],
  ['#e1f2fb', '#f1f9f9', '#f3dfe3', '#e9b2bc'],
  ['#f8b195', '#f67280', '#c06c84', '#355c7d'],
  ['#ffd5e5', '#ffffdd', '#a0ffe6', '#81f5ff'],
  ['#fbfbfb', '#b9e1dc', '#f38181', '#756c83'],
  ['#adf7d1', '#95e8d7', '#7dace4', '#8971d0'],
  ['#dff5f2', '#87dfd6', '#46b7b9', '#2f9296'],
  ['#beebe9', '#f4dada', '#ffb6b9', '#f6eec7'],
  ['#222831', '#393e46', '#00adb5', '#00fff5'],
  ['#39065a', '#6a0572', '#9a0f98', '#ea0599'],
  ['#f4f9f4', '#c4e3cb', '#8aae92', '#616161'],
  ['#a1d9ff', '#ca82f8', '#ed93cb', '#f2bbbb'],
  ['#fa4659', '#feffe4', '#a3de83', '#2eb872'],
  ['#ffb400', '#fffbe0', '#2994b2', '#474744'],
  ['#6b0848', '#a40a3c', '#ec610a', '#ffc300'],
  ['#f12b6b', '#ff467e', '#fd94b4', '#f6c7c7'],
  ['#333333', '#ffffff', '#e1f4f3', '#706c61'],
  ['#363062', '#4d4c7d', '#827397', '#d8b9c3'],
  ['#f3f8ff', '#deecff', '#c6cfff', '#e8d3ff'],
  ['#be9fe1', '#c9b6e4', '#e1ccec', '#f1f1f6'],
  ['#e8e8e8', '#5588a3', '#145374', '#00334e'],
  ['#45eba5', '#21aba5', '#1d566e', '#163a5f'],
  ['#beebe9', '#fffdf9', '#ffe3ed', '#8ac6d1'],
  ['#f2e9d0', '#eaceb4', '#e79e85', '#bb5a5a'],
  ['#e4fffe', '#a4f6f9', '#ff99fe', '#ba52ed'],
  ['#fafaf6', '#00fff0', '#00d1ff', '#3d6cb9'],
  ['#fda403', '#e8751a', '#c51350', '#8a1253'],
  ['#f6f5f5', '#e3e3e3', '#3bb4c1', '#048998'],
  ['#f4f7f7', '#aacfd0', '#5da0a2', '#34495e'],
  ['#3498db', '#ecf0f1', '#34495e', '#f1c40f'],
  ['#dddddd', '#fab7b7', '#f5a8a8', '#e19999'],
  ['#0f1021', '#d01257', '#fb90b7', '#ffcee4'],
  ['#f69d9d', '#ffeab6', '#fdffba', '#c0ffc2'],
  ['#ffdede', '#f7f3ce', '#c5ecbe', '#4797b1'],
  ['#120136', '#035aa6', '#40bad5', '#fcbf1e'],
];

const COLORS_LENGTH = COLORS.length;
/**
 * PATTERNS
 */
const PATTERNS = {
  color: (index = 1) => {
    return (ox, oy, w, h) => {
      fill(gene.pallete[index]);
      rect(ox, oy, w, h);
    };
  },
  color_2:
    (index = 1) =>
    (ox, oy, w, h) => {
      PATTERNS.color(2)(ox, oy, w, h);
  },
  plain: () => (ox, oy, w, h) => {
    fill('white');
    rect(ox, oy, w, h);
  },
  horzStripes:
    (gap = random.random_int(3, 16)) =>
    (ox, oy, w, h) => {
      stroke('black');
      const coeff = h > 0 ? 1 : -1;
      for (let i = 0; i < Math.abs(h); i += scaleValue(gap)) {
        line(ox, oy + coeff * i, ox + w, oy + coeff * i);
      }
    },
  vertStripes:
    (gap = random.random_int(3, 16)) =>
    (ox, oy, w, h) => {
      stroke('black');
      const coeff = w > 0 ? 1 : -1;
      for (let i = 0; i < Math.abs(w); i += scaleValue(gap)) {
        line(ox + coeff * i, oy, ox + coeff * i, oy + h);
      }
    },
  grid:
    (gap = random.random_int(3, 16)) =>
    (ox, oy, w, h) => {
      PATTERNS.horzStripes(gap)(ox, oy, w, h);
      PATTERNS.vertStripes(gap)(ox, oy, w, h);
    },
  diagonalUp:
    (gap = random.random_int(3, 16)) =>
    (ox, oy, w, h) => {
      push();
      fill('rgba(0,0,0,0)');
      rect(ox, oy, w, h);
      drawingContext.clip();
      const normTopLeft = [w > 0 ? ox : ox + w, h > 0 ? oy : oy + h];
      const normDimensions = [abs(w), abs(h)];
      const maxDimension = Math.max(...normDimensions);
      for (
        let i = -normDimensions[0];
        i < normDimensions[0] + normDimensions[1];
        i += scaleValue(gap)
      ) {
        line(
          normTopLeft[0],
          normTopLeft[1] + i,
          normTopLeft[0] + maxDimension,
          normTopLeft[1] + i + maxDimension,
        );
      }
      pop();
    },
  diagonalDown:
    (gap = random.random_int(3, 16)) =>
    (ox, oy, w, h) => {
      push();
      fill('rgba(0,0,0,0)');
      rect(ox, oy, w, h);
      drawingContext.clip();
      const normTopLeft = [w > 0 ? ox : ox + w, h > 0 ? oy : oy + h];
      const normDimensions = [abs(w), abs(h)];
      const maxDimension = Math.max(...normDimensions);
      for (
        let i = -normDimensions[0];
        i < normDimensions[0] + normDimensions[1];
        i += scaleValue(gap)
      ) {
        line(
          normTopLeft[0],
          normTopLeft[1] + i,
          normTopLeft[0] + maxDimension,
          normTopLeft[1] + i - maxDimension,
        );
      }
      pop();
    },
  diagonalGrid:
    (gap = random.random_int(3, 16)) =>
    (ox, oy, w, h) => {
      PATTERNS.diagonalUp(gap)(ox, oy, w, h);
      PATTERNS.diagonalDown(gap)(ox, oy, w, h);
    },
};

const AVAILABLE_PATTERNS = ['color', 'color_2', 'plain', 'horzStripes', 'vertStripes', 'grid', 'diagonalUp', 'diagonalDown', 'diagonalGrid'];

const generateGene = (seed) => {
  const patternWeights = random.random_choice(PATTERN_WEIGHTS);
  const palleteIndex = random.random_int(0, COLORS_LENGTH - 1);
  const patternNames = patternWeights.map((_, i) =>
      i === 0 ? 'color' : random.random_choice(AVAILABLE_PATTERNS)
    ,
  )
  return {
    vertOrHorzRatio: random.random_dec(), 
    seed,
    palleteIndex,
    patternWeights,
    patternNames,
    gridLinesToRects: {
      gitter: [random.random_choice_by_weight([-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8], [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1]), random.random_choice_by_weight([-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8], [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1])],
    },
    gridPartitioning: {
      driftIndex: [random.random_choice([0, 1]), random.random_choice([0, 1])],
      driftCoefficient: [
        random.random_num(-0.05, 0.05),
        random.random_num(-0.05, 0.05),
      ],
      margin: random.random_choice_by_weight([0, 30, 90, 120, 300], [0.01, 0.4, 0.3, 0.2, 0.09]),
      gap: random.random_int(0, 20),
      // unitSize: [50, 50],
      gridSizeInUnits: random.random_choice_by_weight([
        [20, 20],
        [40, 40],
        [60, 60],
        [80, 80],
        [100, 100],
        [120, 120],
        [200, 200],
      ], [0.1, 0.1, 0.2, 0.28 , 0.25, 0.05, 0.02]),
    },
  };
};

const getGeneForRendering = (gene) => {
  const patternNames = gene.patternNames;
  const pallete = COLORS[gene.palleteIndex];
  const shuffledPalleteIndex = random.random_int(0, pallete.length - 1);
  const shuffledPallete = [
    ...pallete.slice(shuffledPalleteIndex),
    ...pallete.slice(0, shuffledPalleteIndex),
  ]; 
  return {
    ...gene,
    pallete: shuffledPallete,
    patterns: patternNames.map((n) =>
    PATTERNS[
      n
    ](),
  ),
  }
}

const generateGridPartitioningInGridUnits = (
  topLeft,
  bottomRight,
  vertOrHorzRatio = 0.5,
) => {
  // if bounds is in effect a dot
  if (bottomRight[0] - topLeft[0] === 0 && bottomRight[1] - topLeft[1] === 0) {
    return [[topLeft, bottomRight]];
  }
  let isVert = random.random_dec() > vertOrHorzRatio;
  // if bound is a 1 by 2 line
  if (
    (bottomRight[0] - topLeft[0] === 1 && bottomRight[1] - topLeft[1] === 0) ||
    (bottomRight[0] - topLeft[0] === 0 && bottomRight[1] - topLeft[1] === 1)
  ) {
    return [
      [topLeft, topLeft],
      [bottomRight, bottomRight],
    ];
  }
  // if bounds is in effect a 2 by 2 square
  if (bottomRight[0] - topLeft[0] === 1 && bottomRight[1] - topLeft[1] === 1) {
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

const convertGridLinesToRects = (lines) => {
  const { gridSizeInUnits, gap, margin } = gene.gridPartitioning;
  const { gitter } = gene.gridLinesToRects;

  const dimension = getDimension();

  const unitSize = [
    (dimension - margin * 2 - (gridSizeInUnits[0] - 1) * gap) /
      gridSizeInUnits[0],
    (dimension - margin * 2 - (gridSizeInUnits[1] - 1) * gap) /
      gridSizeInUnits[1],
  ];

  const topLeft = [margin, margin];

  return lines
    .map((l, i) => {
      return [
        [l[0][0] * (unitSize[0] + gap), l[0][1] * (unitSize[1] + gap)],
        [
          (l[1][0] + gitter[0]) * (unitSize[0] + gap) - gap,
          (l[1][1] + gitter[1]) * (unitSize[1] + gap) - gap,
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

const gene = getGeneForRendering(generateGene(hash));

const lines = generateGridPartitioningInGridUnits(
  [0, 0],
  [gene.gridPartitioning.gridSizeInUnits[0] - 1, gene.gridPartitioning.gridSizeInUnits[1] - 1],
  gene.vertOrHorzRatio,
);

function setup() {
  const canvasDimension = getCanvasDimension();
  createCanvas(canvasDimension, canvasDimension);

  noLoop();
}

function windowResized() {
  const canvasDimension = getCanvasDimension();
  resizeCanvas(canvasDimension, canvasDimension);
}

function draw() {
  const { pallete, patterns, patternWeights } = gene;
  const { margin, driftCoefficient, driftIndex } =
    gene.gridPartitioning;
  const dimension = getDimension();
  const rects = convertGridLinesToRects(lines);
  // draw background
  background(pallete[0]);
  // draw rectangles
  for (let i = 0; i < rects.length; ++i) {
    const r = rects[i];
    resetMatrix();
    const translateDelta = [
      r[0][0] + (r[1][0] - r[0][0] / 2),
      r[0][1] + (r[1][1] - r[0][1] / 2),
    ];
    push();
    translate(
      scaleValue(translateDelta[0] + translateDelta[driftIndex[0]] * driftCoefficient[0]),
      scaleValue(translateDelta[1] + translateDelta[driftIndex[1]] * driftCoefficient[1]),
    );
    const rectParams = [
      -(r[1][0] - r[0][0] / 2),
      -(r[1][1] - r[0][1] / 2),
      r[1][0] - r[0][0],
      r[1][1] - r[0][1],
    ].map(scaleValue);
    // const rectParams = [...r[0], r[1][0] - r[0][0], r[1][1] - r[0][1]]
    // apply patterns
    const rawRatio = Math.abs(rectParams[2] / rectParams[3]);
    const ratio =
      rawRatio > 1 ? 0.5 * (1 - 1 / rawRatio) + 0.5 : 0.5 * rawRatio;
    let patternIndex = 0;
    if (!(rectParams[2] === 0 && rectParams[3] === 0)) {
      for (; patternIndex < patternWeights.length; ++patternIndex) {
        if (
          ratio >= patternWeights[patternIndex] &&
          ratio <= (patternWeights[patternIndex + 1] ?? 1)
        ) {
          break;
        }
      }
    }
    const pattern = patterns[patternIndex];
    PATTERNS.plain()(...rectParams);
    pattern(...rectParams);
    pop();
  }
  // draw the frame
  resetMatrix();
  strokeWeight(scaleValue(margin * 2));
  stroke(pallete[3]);
  fill('rgba(0,0,0,0)');
  rect(0, 0, scaleValue(dimension), scaleValue(dimension));
  strokeWeight(scaleValue(1));
  stroke('black');
  rect(scaleValue(margin), scaleValue(margin), scaleValue(dimension - margin * 2), scaleValue(dimension - margin * 2));
}
