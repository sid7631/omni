DROP SCHEMA IF EXISTS omni CASCADE;
CREATE SCHEMA omni;

CREATE TABLE omni.system_data (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    value VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO omni.system_data(name, value) VALUES ('SchemaVersion', '{schemaVersion}');
INSERT INTO omni.system_data(name, value) VALUES ('CreatedOn', '{createdOn}');

CREATE TABLE IF NOT EXISTS omni.users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    client_id VARCHAR(50),
    full_name VARCHAR(100),
    birth_date DATE,
    user_settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS omni.stock_data (
    id SERIAL PRIMARY KEY,
    average_price NUMERIC NOT NULL,
    isin VARCHAR(20) NOT NULL,
    previous_closing_price NUMERIC NOT NULL,
    quantity_available NUMERIC NOT NULL,
    quantity_discrepant NUMERIC NOT NULL,
    quantity_long_term NUMERIC NOT NULL,
    quantity_pledged_loan NUMERIC NOT NULL,
    quantity_pledged_margin NUMERIC NOT NULL,
    record_date TIMESTAMP NOT NULL,
    sector VARCHAR(50) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    unrealized_pl NUMERIC NOT NULL,
    unrealized_pl_pct NUMERIC NOT NULL,
    load_dt timestamp not null default CURRENT_TIMESTAMP,
    user_name VARCHAR(50) NOT NULL,
    created_by VARCHAR(50) References omni.users(username),
    UNIQUE (isin, record_date, user_name)
);

CREATE TABLE IF NOT EXISTS omni.bank_accounts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    bank VARCHAR(255),
    account VARCHAR(255),
    ifsc VARCHAR(255),
    amount INTEGER,
    created_by VARCHAR(50) References omni.users(username),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (bank, account)
);

CREATE TABLE omni.bank_transactions (
    narration VARCHAR(255),
    ref_number VARCHAR(30),
    value_date TIMESTAMP,
    debit_amount NUMERIC,
    credit_amount NUMERIC,
    balance NUMERIC,
    account VARCHAR(20),
    created_by VARCHAR(50) References omni.users(username),
    UNIQUE (narration,ref_number, value_date, balance, account)
);


