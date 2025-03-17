USE Dalouaa;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL,
    material VARCHAR(50) NOT NULL,
    price VARCHAR(20) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insérer quelques données de test
INSERT INTO products (image, title, material, price, description, category, stock)
VALUES 
    ('/images/bagueOr.jpeg', 'Bague Or', 'gold', '79 euros', 'Magnifique bague en or 18 carats', 'Bagues', 10),
    ('/images/bagueArgenteAvecDiamant.jpeg', 'Bague Argent', 'silver', '79 euros', 'Magnifique bague en argent avec diamant', 'Bagues', 10),
    ('/images/collierArgent.jpeg', 'Collier Argent', 'silver', '45 euros', 'Collier élégant en argent', 'Colliers', 15),
    ('/images/braceletOr.jpeg', 'Bracelet Or', 'gold', '120 euros', 'Bracelet luxueux en or', 'Bracelets', 8),
    ('/images/bouclesOreillesArgent.jpeg', "Boucles Oreilles argent", 'silver', '60 euros', 'Boucles Oreilles argent', 'bouclesOreilles', 8),
    ('/images/bouclesOreillesOr.jpeg', "Boucles Oreilles argent", 'gold', '120 euros', 'Boucles Oreilles or', 'bouclesOreilles', 8);

