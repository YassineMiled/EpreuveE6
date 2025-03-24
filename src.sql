
Drop Database Dalouaa;
Create Database Dalouaa;
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

INSERT INTO products (image, title, material, price, description, category, stock)
VALUES 
  ('/images/bagueOr.jpeg', 'Bague Or', 'gold', '79 euros', 'Magnifique bague en or 18 carats', 'Bagues', 10),
    ('/images/bagueArgenteAvecDiamant.jpeg', 'Bague Argent', 'silver', '79 euros', 'Magnifique bague en argent avec diamant', 'Bagues', 10),
    ('/images/collierArgent.jpeg', 'Collier Argent', 'silver', '45 euros', 'Collier élégant en argent', 'Colliers', 15),
    ('/images/bouclesOreillesArgent.jpeg', "Boucles Oreilles argent", 'silver', '60 euros', 'Boucles Oreilles argent', 'bouclesOreilles', 8),
    -- Bagues (10)
    ('/images/bagueOrDiamant.jpeg', 'Bague Or et Diamant', 'gold', 250, 'Bague en or avec un diamant éclatant', 'Bagues', 5),
    ('/images/bagueArgentSaphir.jpeg', 'Bague Argent et Saphir', 'silver', 180, 'Bague élégante en argent avec un saphir bleu', 'Bagues', 6),
    ('/images/bagueOrRubis.jpeg', 'Bague Or et Rubis', 'gold', 220, 'Bague en or ornée d’un magnifique rubis rouge', 'Bagues', 7),
    ('/images/bagueArgentEmeraude.jpeg', 'Bague Argent et Emeraude', 'silver', 190, 'Bague raffinée en argent avec une émeraude verte', 'Bagues', 8),
    ('/images/bagueOrBlancDiamant.jpeg', 'Bague Or Blanc et Diamant', 'white gold', 280, 'Bague en or blanc sertie de diamants', 'Bagues', 4),
    ('/images/bagueArgentZirconium.jpeg', 'Bague Argent et Zirconium', 'silver', 150, 'Bague en argent avec un zirconium étincelant', 'Bagues', 9),
    ('/images/bagueOrJauneClassique.jpeg', 'Bague Or Jaune Classique', 'gold', 170, 'Bague en or jaune au design intemporel', 'Bagues', 5),
    ('/images/bagueArgentMinimaliste.jpeg', 'Bague Argent Minimaliste', 'silver', 95, 'Bague fine et minimaliste en argent', 'Bagues', 10),
    ('/images/bagueOrSertie.jpeg', 'Bague Or Sertie', 'gold', 210, 'Bague en or sertie de petites pierres précieuses', 'Bagues', 6),
    ('/images/bagueArgentVintage.jpeg', 'Bague Argent Vintage', 'silver', 130, 'Bague en argent au style vintage', 'Bagues', 7),

    -- Colliers (10)
    ('/images/collierOrPendentif.jpeg', 'Collier Or avec Pendentif', 'gold', 150, 'Collier en or avec un pendentif élégant', 'Colliers', 10),
    ('/images/collierArgentPerles.jpeg', 'Collier Argent et Perles', 'silver', 99, 'Collier délicat en argent avec perles naturelles', 'Colliers', 12),
    ('/images/collierOrCoeur.jpeg', 'Collier Or en forme de Cœur', 'gold', 140, 'Collier en or avec un pendentif en forme de cœur', 'Colliers', 8),
    ('/images/collierArgentInfini.jpeg', 'Collier Argent Infini', 'silver', 85, 'Collier en argent en forme d’infini', 'Colliers', 9),
    ('/images/collierOrSoleil.jpeg', 'Collier Or Soleil', 'gold', 160, 'Collier en or avec pendentif soleil', 'Colliers', 7),
    ('/images/collierArgentLune.jpeg', 'Collier Argent Lune', 'silver', 105, 'Collier en argent avec pendentif en forme de lune', 'Colliers', 6),
    ('/images/collierOrPerle.jpeg', 'Collier Or et Perle', 'gold', 180, 'Collier raffiné en or avec une perle nacrée', 'Colliers', 5),
    ('/images/collierArgentFeuille.jpeg', 'Collier Argent Feuille', 'silver', 110, 'Collier en argent avec pendentif feuille gravée', 'Colliers', 7),
    ('/images/collierOrMinimaliste.jpeg', 'Collier Or Minimaliste', 'gold', 135, 'Collier fin et discret en or', 'Colliers', 9),
    ('/images/collierArgentGoutte.jpeg', 'Collier Argent Goutte', 'silver', 125, 'Collier en argent avec pendentif goutte', 'Colliers', 8),

    -- Bracelets (10)
    ('/images/braceletOrFin.jpeg', 'Bracelet Fin en Or', 'gold', 120, 'Bracelet fin et élégant en or massif', 'Bracelets', 8),
    ('/images/braceletArgentJonc.jpeg', 'Bracelet Jonc en Argent', 'silver', 90, 'Bracelet jonc raffiné en argent massif', 'Bracelets', 10),
    ('/images/braceletOrGourmette.jpeg', 'Bracelet Gourmette en Or', 'gold', 180, 'Bracelet gourmette en or personnalisable', 'Bracelets', 6),
    ('/images/braceletArgentMaille.jpeg', 'Bracelet Maille en Argent', 'silver', 95, 'Bracelet en argent avec une maille élégante', 'Bracelets', 7),
    ('/images/braceletOrPerles.jpeg', 'Bracelet Or et Perles', 'gold', 140, 'Bracelet raffiné en or avec des perles naturelles', 'Bracelets', 6),
    ('/images/braceletArgentDoubleRang.jpeg', 'Bracelet Argent Double Rang', 'silver', 130, 'Bracelet en argent à double rang sophistiqué', 'Bracelets', 5),
    ('/images/braceletOrTresse.jpeg', 'Bracelet Or Tresse', 'gold', 160, 'Bracelet en or tressé à la main', 'Bracelets', 4),
    ('/images/braceletArgentMinimaliste.jpeg', 'Bracelet Argent Minimaliste', 'silver', 85, 'Bracelet fin en argent au design épuré', 'Bracelets', 8),
    ('/images/braceletOrSerpent.jpeg', 'Bracelet Or Serpent', 'gold', 210, 'Bracelet en or inspiré du design serpent', 'Bracelets', 5),
    ('/images/braceletArgentCordon.jpeg', 'Bracelet Cordon Argent', 'silver', 70, 'Bracelet en argent avec un cordon ajustable', 'Bracelets', 6),

    -- Boucles d’oreilles (10) - Catégorie "bouclesOreilles"
    ('/images/bouclesOreillesOrDiamant.jpeg', 'Boucles d Oreilles Or et Diamant', 'gold', 320, 'Boucles d’oreilles en or avec diamants étincelants', 'bouclesOreilles', 4),
    ('/images/bouclesOreillesArgentPerles.jpeg', 'Boucles d Oreilles Argent et Perles', 'silver', 90, 'Boucles d’oreilles élégantes en argent avec perles naturelles', 'bouclesOreilles', 8),
    ('/images/bouclesOreillesOrPendantes.jpeg', 'Boucles d Oreilles Pendantes en Or', 'gold', 150, 'Boucles d’oreilles pendantes en or raffiné', 'bouclesOreilles', 5),
    ('/images/bouclesOreillesArgentCercle.jpeg', 'Boucles d Oreilles Cercle en Argent', 'silver', 70, 'Boucles d’oreilles en forme de cercle en argent massif', 'bouclesOreilles', 6),
    ('/images/bouclesOreillesOrEtoiles.jpeg', 'Boucles d Oreilles Étoiles en Or', 'gold', 180, 'Boucles d’oreilles en or en forme d’étoiles', 'bouclesOreilles', 5),
    ('/images/bouclesOreillesArgentMinimaliste.jpeg', 'Boucles d Oreilles Minimalistes en Argent', 'silver', 80, 'Boucles d’oreilles simples et élégantes en argent', 'bouclesOreilles', 7),
    ('/images/bouclesOreillesOrSaphir.jpeg', 'Boucles d Oreilles Or et Saphir', 'gold', 250, 'Boucles d’oreilles en or avec saphirs scintillants', 'bouclesOreilles', 4),
    ('/images/bouclesOreillesArgentFeuille.jpeg', 'Boucles d Oreilles Feuille en Argent', 'silver', 95, 'Boucles d’oreilles inspirées de la nature en argent', 'bouclesOreilles', 6);
