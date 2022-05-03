function genTokenData(projectNum) {
  let data = {};
  let hash = '0x';
  for (var i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }
  data.hash = hash;
  data.tokenId = projectNum * 1000000 + Math.floor(Math.random() * 1000);
  return data;
}
let tokenData = genTokenData(99);
