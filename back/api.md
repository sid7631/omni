### API List

#### Account
curl -X POST http://localhost:8000/api/v3/accounts \
-H 'Content-Type: application/json' \
-d '{"account_name": "John Doe", "account_type": "Savings"}'

### stock marketdata for new entry
curl -X POST http://localhost:8000/api/v3/update_stock/BEL.NS/2024-05-01


### insert transaction
curl -X POST http://localhost:8000/api/v3/insert_transaction \
-H "Content-Type: application/json" \
-d '{
    "symbol": "BEL",
    "add_suffix":true,
    "account_id": 1,
    "quantity": 127,
    "price": 127.6,
    "transaction_type": "buy",
    "transaction_date": "2023-08-04"
}'
