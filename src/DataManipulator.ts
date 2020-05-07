import { ServerRespond } from './DataStreamer';

//building structure of the object of the only function of DataManipulator whih corresponds to schema of the table.
export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
  timestamp: Date
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    //Receiving data of stock proces of ABC and DEF.
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    //Building ratio of priceABC to priceDEF.
    const ratio = priceABC / priceDEF;
    //Fixing Upper and Lower Bound
    const upperBound = 1 + 0.015;
    const lowerBound = 1 - 0.015;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp,
        upper_bound : upperBound,
        lower_bound  : lowerBound,
        trigger_alert : (ratio > upperBound || ratio < lowerBound) ? ratio : undefined, 
    };
  }
}
