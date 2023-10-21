const LogNormal = require('@stdlib/stats-base-dists-lognormal').LogNormal;

const taskUseCase = () => {

  const get = async (interval: string = 'week') => {
    const base = 5000;
    const dist = new LogNormal(1.0, 1.0);
    let trancations = [];
    const divisionsArray = ['B2B', 'B2C'];
    const typesArray = ['expanses', 'income'];
    let timestamp = new Date();
    let iterations =1;
    if (interval === 'year') {
      iterations = 365;
    } else if (interval === 'month') {
      iterations = 30;
    } else {
      iterations = 7;
    }
    for (let i = 0; i < iterations; i++) {
      const date = timestamp.toISOString().replace('Z', '');
      for (let j = 0; j < divisionsArray.length; j++) {
        const division = divisionsArray[j];
        for (let l = 0; l < typesArray.length; l++) {
          const type = typesArray[l];
          const random = Math.random();
          const amount = Math.floor(base * dist.quantile(random));
          trancations.push({
            division,
            date,
            amount,
            type
          })
        }
      }
      timestamp.setDate(timestamp.getDate()-1);
    }
    return { trancations }
  }
  return {
    get
  }
}

export default taskUseCase;