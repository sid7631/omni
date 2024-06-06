const data = {
  "holdings": [
    {
      "average_price": 994.8244,
      "created_by": null,
      "id": 71,
      "invested": 198964.88,
      "isin": "INE200M01021",
      "load_dt": 1710536720025,
      "previous_closing_price": 1434.2,
      "quantity_available": 200.0,
      "quantity_discrepant": 0.0,
      "quantity_long_term": 0.0,
      "quantity_pledged_loan": 0.0,
      "quantity_pledged_margin": 0.0,
      "record_date": 1710374400000,
      "sector": "Consumer Staples",
      "symbol": "VBL",
      "unrealized_pl": 87875.125,
      "unrealized_pl_pct": 44.1661,
      "user_name": "CY7213",
      "value": 286840.0,
      "weight": 26.9031727295
    },
    {
        "average_price": 1413.4833,
        "created_by": null,
        "id": 21,
        "invested": 16961.7996,
        "isin": "INE200M01021",
        "load_dt": 1710533974887,
        "previous_closing_price": 1434.2,
        "quantity_available": 12.0,
        "quantity_discrepant": 0.0,
        "quantity_long_term": 0.0,
        "quantity_pledged_loan": 0.0,
        "quantity_pledged_margin": 0.0,
        "record_date": 1710374400000,
        "sector": "Consumer Staples",
        "symbol": "VBL",
        "unrealized_pl": 248.6,
        "unrealized_pl_pct": 1.4656,
        "user_name": "AFU777",
        "value": 17210.4,
        "weight": 1.6141903638
      },
      {
        "average_price": 147.1121,
        "created_by": null,
        "id": 64,
        "invested": 125045.285,
        "isin": "INE263A01024",
        "load_dt": 1710536720025,
        "previous_closing_price": 188.85,
        "quantity_available": 850.0,
        "quantity_discrepant": 0.0,
        "quantity_long_term": 0.0,
        "quantity_pledged_loan": 0.0,
        "quantity_pledged_margin": 0.0,
        "record_date": 1710374400000,
        "sector": "Information Technology",
        "symbol": "BEL",
        "unrealized_pl": 35477.25,
        "unrealized_pl_pct": 28.3715,
        "user_name": "CY7213",
        "value": 160522.5,
        "weight": 15.0556566186
      },
      {
        "average_price": 202.4909,
        "created_by": null,
        "id": 4,
        "invested": 22273.999,
        "isin": "INE263A01024",
        "load_dt": 1710533974887,
        "previous_closing_price": 188.85,
        "quantity_available": 110.0,
        "quantity_discrepant": 0.0,
        "quantity_long_term": 0.0,
        "quantity_pledged_loan": 0.0,
        "quantity_pledged_margin": 0.0,
        "record_date": 1710374400000,
        "sector": "Information Technology",
        "symbol": "BEL",
        "unrealized_pl": -1500.5,
        "unrealized_pl_pct": -6.7366,
        "user_name": "AFU777",
        "value": 20773.5,
        "weight": 1.9483790918
      }
  ],
  "record_date": "Thu, 14 Mar 2024 00:00:00 GMT",
  "summary": {
    "invested": 927487.8354,
    "pl": 138706.1146000002,
    "pl_pct": 14.955033295954772,
    "value": 1066193.9500000002
  }
};

const groupedBySymbol = data.holdings.reduce((acc, curr) => {
  const symbol = curr.symbol;
  if (!acc[symbol]) {
    acc[symbol] = {
        quantity_available:0,
        invested: 0,
      value: 0,
      unrealized_pl: 0,
      unrealized_pl_pct: 0,
    };
  }
  acc[symbol].quantity_available +=  curr.quantity_available;
  acc[symbol].invested += curr.invested;
  acc[symbol].average_price = acc[symbol].invested/acc[symbol].quantity_available;
  acc[symbol].value += curr.value;
  acc[symbol].unrealized_pl += curr.unrealized_pl;
  acc[symbol].unrealized_pl_pct = acc[symbol].unrealized_pl/acc[symbol].invested;
  acc[symbol].sector = curr.sector;
  acc[symbol].record_date = curr.record_date;
  acc[symbol].previous_closing_price = curr.previous_closing_price;
  acc[symbol].weight = curr.weight;
  return acc;
}, {});

const newData = Object.entries(groupedBySymbol).map(([symbol, values]) => {
    return {
      symbol,
      ...values
    };
  });

console.log(newData);