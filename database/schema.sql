CREATE DATABASE retail;

DROP TABLE IF EXISTS products;
CREATE TABLE  products(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    slogan VARCHAR(300) NOT NULL,
    description VARCHAR(1000) NOT NULL UNIQUE,
    category VARCHAR(30) NOT NULL,
    default_price varchar NOT NULL
);

DROP TABLE IF EXISTS styles;
CREATE TABLE styles (
    id BIGSERIAL PRIMARY KEY,
    productId INT NOT NULL,
    name VARCHAR(100),
    sale_price VARCHAR(30),
    original_price VARCHAR(30) NOT NULL,
    default_price boolean NOT NULL,
    FOREIGN KEY(productId)
    REFERENCES products(id)
    ON DELETE CASCADE
);

DROP TABLE IF EXISTS features;
CREATE TABLE features (
    id BIGSERIAL PRIMARY KEY,
    productId INT NOT NULL,
    feature VARCHAR(100),
    value VARCHAR(100),
    FOREIGN KEY(productId)
    REFERENCES products(id)
    ON DELETE CASCADE
);

DROP TABLE IF EXISTS related;
CREATE TABLE related (
    id BIGSERIAL PRIMARY KEY,
    current_product_id INT NOT NULL,
    related_product_id INT NOT NULL,
    FOREIGN KEY(current_product_id)
    REFERENCES products(id)
    ON DELETE CASCADE
);

DROP TABLE IF EXISTS photos;
CREATE TABLE photos (
    id BIGSERIAL,
    styleId INT NOT NULL,
    url varchar(65535),
    thumbnail_url varchar(65535),
    FOREIGN KEY(styleId)
    REFERENCES styles(id)
    ON DELETE CASCADE
);

DROP TABLE IF EXISTS skus;
CREATE TABLE skus (
    id BIGSERIAL PRIMARY KEY,
    styleId INT NOT NULL,
    size VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (styleId)
    REFERENCES styles(id)
    ON DELETE CASCADE
);

COPY products(id, name, slogan, description, category, default_price)
FROM '/home/ryebread/products.csv'
DELIMITER ','
CSV HEADER;

COPY styles(id, productId, name, sale_price, original_price, default_price)
FROM '/home/ryebread/styles.csv'
DELIMITER ','
CSV HEADER;

COPY features(id, productId, feature, value)
FROM '/home/ryebread/features.csv'
DELIMITER ','
CSV HEADER;

COPY related(id, current_product_id, related_product_id)
FROM '/home/ryebread/related.csv'
DELIMITER ','
CSV HEADER;

COPY photos(id, styleId, url, thumbnail_url )
FROM '/home/ryebread/photos.csv'
DELIMITER ','
CSV HEADER;

COPY skus(id, styleId, size, quantity)
FROM '/home/ryebread/skus.csv'
DELIMITER ','
CSV HEADER;



