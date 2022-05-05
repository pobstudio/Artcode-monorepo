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

const PATTERN_WEIGHTS = [
  [0, 0.2, 0.4, 0.8, 1],
  [0, 0.25, 0.5, 0.75, 1],
  [0, 0.4, 0.8, 0.9, 1],
  [0, 0.1, 0.4, 0.6, 0.9, 1],
];


const COLORS_LENGTH = 101;
const AVAILABLE_PATTERNS = ['color', 'color_2', 'plain', 'horzStripes', 'vertStripes', 'grid', 'diagonalUp', 'diagonalDown', 'diagonalGrid'];

const generateGene = (seed) => {
  const random = new Random(seed);
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
      margin: random.random_choice_by_weight([0, 30, 60, 90, 200], [0.01, 0.4, 0.3, 0.2, 0.09]),
      gap: random.random_int(0, 20),
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

const labelByValue = (values, labels) => (value) => {
  return labels[values.indexOf(value)]
}

function calculateFeatures(tokenData) {
  const gene = generateGene(tokenData.hash);

  return {
    gitter: gene.gridLinesToRects.gitter,
    patternNames: gene.patternNames,
    numPatterns: gene.patternNames.length,
    scale: labelByValue([20, 40, 60, 80, 100, 120, 200], ['village', 'subdistrict', 'town', 'district', 'city', 'metropolis', 'ecumenopolis'])(gene.gridPartitioning.gridSizeInUnits[0]),
    padding: labelByValue([0, 30, 60, 90, 200], ['full-bleed', 'bleed', 'trim', 'margin', 'frame'])(gene.gridPartitioning.margin), 
  }
}