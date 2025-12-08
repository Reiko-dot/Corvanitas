-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 09 dec 2025 om 00:07
-- Serverversie: 10.4.32-MariaDB
-- PHP-versie: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `corvanitas`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `hotspots`
--

CREATE TABLE `hotspots` (
  `hotspot_id` int(11) NOT NULL,
  `frame_index` int(11) NOT NULL,
  `catalognummer` varchar(255) NOT NULL,
  `beschrijving` text NOT NULL,
  `x` float NOT NULL,
  `y` float NOT NULL,
  `aanvulling` text NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `image_url_2` varchar(255) NOT NULL,
  `image_url_3` varchar(255) NOT NULL,
  `image_url_4` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Gegevens worden geëxporteerd voor tabel `hotspots`
--

INSERT INTO `hotspots` (`hotspot_id`, `frame_index`, `catalognummer`, `beschrijving`, `x`, `y`, `aanvulling`, `image_url`, `image_url_2`, `image_url_3`, `image_url_4`) VALUES
(1, 0, 'Catalogusnummer: 135001', 'Beschrijving: Afbeelding van de titelpagina van het Panorama van Utrecht, op de lithostenen\r\ngetekend door J. Bos, gedrukt bij P.W. van de Weijer en in juli 1859 uitgegeven door de Wed.\r\nHerfkens en zoon.', 1000, 200, 'nformatie: Het Panorama van Utrecht bestaat uit vier aaneengeplakte, zigzag gevouwen bladen\r\nmet een totale lengte van 5,82 meter. Het panorama is een meterslange tekening van een\r\nrondwandeling om het centrum van Utrecht, met steeds wisselend uitzicht vanaf de singels. Het\r\ngeeft een heel precies beeld van hoe de stad in 1859 er uitzag en het leuke is dat je ook het\r\nverloop van de seizoenen in de tekening terugziet.', '', '', '', ''),
(5, 4, 'Catalogusnummer: 135005', 'Beschrijving: Gezicht op het Begijnebolwerk te Utrecht.', 1000, 200, '', '', '', '', ''),
(6, 5, 'Catalogusnummer: 135006', 'Beschrijving: Gezicht op een gedeelte van het Begijnebolwerk (links) en de Van Asch van\r\nWijckskade te Utrecht.', 1000, 200, '', '', '', '', ''),
(7, 6, 'Catalogusnummer: 135007', 'Beschrijving: Gezicht op de Van Asch van Wijckskade te Utrecht, de Weerdbarrière en de\r\nWeerdbrug en rechts de Noorderkade met de stadswaag en stadskraan.', 1000, 200, 'Met\r\nbehulp van de stadskraan konden zware goederen, zoals wijntonnen, in en uit schepen geladen\r\nworden. Het water is van oudsher een belangrijke transportroute in Utrecht.', '', '', '', ''),
(8, 7, 'Catalogusnummer: 135008', 'Beschrijving: Gezicht op de Noorderkade te Utrecht, de Koninklijke Fabriek van\r\nLandbouwkundige Werktuigen, bierbrouwerij De Krans en het Paardenveld met de molen De Rijn\r\nen Zon.', 1000, 200, 'informatie: Gezicht op de stoombierbrouwerij De Krans (Nieuwekade 30) te\r\nUtrecht. Vanaf de middeleeuwen werd er in Utrecht volop bier gebrouwen. Tot ver in de 19e eeuw\r\nwerd hier grachtenwater voor gebruikt. In de twintigste eeuw verloren de Utrechtse brouwerijen\r\nde concurrentiestrijd met die uit Amsterdam en verdwenen de brouwerijen in de stad.', '', '', '', ''),
(9, 8, 'Catalogusnummer: 135009', 'Beschrijving: Gezicht op het Paardenveld te Utrecht met de molen De Meiboom en rechts een\r\nwas- en badhuis, de latere Wasch- en Badinrichting van W. de Rijk.', 1000, 200, 'Badhuizen werden sinds eind 19e\r\neeuw gebouwd, toen er een grotere aandacht kwam voor hygiëne, gezondheid en levensstijl. De\r\nvraag naar hygiënische baden nam toe door industrialisatie en verstedelijking, wat leidde tot de\r\nbouw van openbare badhuizen, waar tegen betaling een bad of douche kon worden genomen.', '', '', '', ''),
(10, 9, 'Catalogusnummer: 135010', 'Beschrijving: Gezicht over de Catharijnebrug te Utrecht op een groot appartementengebouw, het\r\ndouanekantoortje (de Catharijnebarrière), een herenhuis (later Bierhuis De Hoop) en de\r\ngasfabriek van W.H. de Heus op en bij het noordwestelijke bastion van het vroegere kasteel\r\nVredenburg.', 1000, 200, 'informatie: Gezicht op de stadsbuitengracht en de Catharijnebrug te Utrecht, uit\r\nhet zuidwesten, met op de achtergrond een gebouw waarin meerdere woonhuizen zijn\r\ngecombineerd aan de latere Catharijnekade. Omstreeks 1859.', 'images/hotspots/1765233835_pagina10.2.jpg', 'images/hotspots/1765233835_pagina10.3.jpg', 'images/hotspots/1765233835_pagina10.4.jpg', 'images/hotspots/1765233835_pagina10.jpg'),
(11, 10, 'Catalogusnummer: 135011', 'Beschrijving: Gezicht op de koperpletterij van W.H. de Heus met het zuidwestelijke bastion van\r\nhet vroegere kasteel Vredenburg en rechts de Rijnkade te Utrecht.', 1000, 200, 'informatie: Plattegrond van het gebouwencomplex van de koperpletterij en\r\ngasfabriek van W.H. de Heus, gelegen tussen de Stadsbuitengracht en het Vredenburg te\r\nUtrecht; met vermelding van de bestemming van de gebouwen.\r\nMet legenda en een aantal doorhalingen en notities.', 'images/hotspots/1765233866_pagina11.jpg', '', '', ''),
(12, 11, 'Catalogusnummer: 135012', 'Beschrijving: Gezicht over de Willemsbrug op de Rijnkade te Utrecht, het hek met de\r\ndouanekantoortjes aan weerszijden van de brug (de Willemsbarrière) en rechts van de brug het\r\nbegin van het in Engelse landschapsstijl aangelegde singelplantsoen.', 1000, 200, 'informatie: Gezicht vanaf de Catharijnesingel over de stadsbuitengracht te Utrecht\r\nmet de Willemsbrug en enkele herenhuizen aan de Rijnkade en het Willemsplantsoen, uit het\r\nzuiden. Omstreeks 1850.', 'images/hotspots/1765233905_pagina12.2.jpg', 'images/hotspots/1765233905_pagina12.jpg', '', ''),
(13, 12, 'Catalogusnummer: 135013', 'Beschrijving: Gezicht op het in Engelse landschapsstijl aangelegde singelplantsoen te Utrecht\r\nmet het theehuis van de oud-rooms-katholieke aartsbisschop en rechts het hospitaal van het\r\nDuitse Huis. Het kruis boven het langgerekte rode dak is van de Dominicuskerk op de\r\nMariaplaats.', 1000, 200, 'informatie: Gezicht op de Mariaplaats te Utrecht uit het westen, met in het midden\r\nop de achtergrond de Zadelstraat en de Domtoren. Op de foto zie je ook een waterpomp. De\r\npomp werd in 1844 op de Mariaplaats geplaatst en leverde schoon water, zelfs tijdens de\r\ncholera-uitbraken in de jaren 1870.', 'images/hotspots/1765233941_pagina13.jpg', '', '', ''),
(14, 13, 'Catalogusnummer: 135014', 'Beschrijving: Gezicht op het in Engelse landschapsstijl aangelegde singelplantsoen te Utrecht\r\nter hoogte van de Zeven Steegjes. De opzet van het plan Zocher was om de minder\r\naantrekkelijke delen van de stad te camoufleren. Dat doet hij hier door middel van een\r\nplantsoen.', 1000, 200, 'informatie: Plattegrond van de stad Utrecht met directe omgeving; met weergave\r\nvan het stratenplan (deels met straatnamen), wegen en watergangen en aanduiding van de\r\nbelangrijke gebouwen. Met weergave van alle groenvoorzieningen, waaronder de plantsoenen,\r\ndoor Zocher aangelegd op de geslechte wallen en bolwerken, aangeduid als \"Nieuwe\r\nwandeling\". Met lijst van belangrijke gebouwen en overige objecten. Datering rond 1858.', 'images/hotspots/1765233963_pagina14.jpg', '', '', ''),
(15, 14, 'Catalogusnummer: 135015', 'Beschrijving: Gezicht op het singelplantsoen te Utrecht met het Bartholomeusgasthuis.', 1000, 200, '', '', '', '', ''),
(16, 15, 'Catalogusnummer: 135016', 'Beschrijving: Gezicht op het singelplantsoen te Utrecht met links de Geertekerk en in de\r\nstadsbuitengracht een houtvlot.', 1000, 200, 'De stadsbuitengracht (Singel)\r\nhad de taak als doorgaande scheepsroute overgenomen van de Oudegracht. Dit houtvlot\r\nbestaat uit aan elkaar gebonden rijen boomstammen. Zo’n transport was vaak dagenlang\r\nonderweg naar zijn eindbestemming, dikwijls Amsterdam.', '', '', '', ''),
(17, 16, 'Catalogusnummer: 135017', 'Beschrijving: Gezicht op het singelplantsoen te Utrecht met half achter de bomen het\r\nDiakonessenhuis aan de Springweg en rechts een gedeelte van het vroegere bastion Sterrenburg\r\nmet daarachter de molen op de Bijlhouwerstoren en in de stadsbuitengracht een houtvlot.', 1000, 200, '', '', '', '', ''),
(18, 17, 'Catalogusnummer: 135018', 'Beschrijving: Gezicht op het singelplantsoen te Utrecht met het dubbele woonhuis boven de\r\nkazematten van het vroegere bastion Sterrenburg en de molen op de Bijlhouwerstoren.', 1000, 200, '', '', '', '', ''),
(19, 18, 'Catalogusnummer: 135019', 'Beschrijving: Gezicht over de Tolsteegbrug te Utrecht op de hekpalen van de Tolsteegbarrière bij\r\nhet Ledig Erf met daaronder de uitmonding van de Oudegracht in de stadsbuitengracht en rechts\r\nhet in het singelplantsoen opgenomen vroegere bastion Manenburg.', 1000, 200, '', '', '', '', ''),
(20, 19, 'Catalogusnummer: 135020', 'Beschrijving: Gezicht op het singelplantsoen te Utrecht met de zuidwestelijke toren van de\r\nNicolaikerk en de cavaleriestallen met daarachter een gebouw van het voormalige St.-\r\nAgnietenklooster. Tegenwoordig ziet hier het Centraal Museum.', 1000, 200, '', '', '', '', ''),
(21, 20, 'Catalogusnummer: 135021', 'Beschrijving: Gezicht op het singelplantsoen te Utrecht met het gebouw van de Fundatie van de\r\nVrijvrouwe van Renswoude en rechts de kameren van Maria van Pallaes aan de Agnietenstraat.', 1000, 200, '', '', '', '', ''),
(22, 21, 'Catalogusnummer: 135022', 'Beschrijving: Gezicht op het singelplantsoen te Utrecht met geheel links de regentenkamer van\r\nde kameren van Maria van Pallaes en daarnaast de Nieuwegracht \'Onder de Linden\' en de\r\nuitmonding van de Nieuwegracht in de stadsbuitengracht en rechts de rode daken van\r\ngebouwen van de voormalige St.-Servaasabdij.', 1000, 200, '', '', '', '', ''),
(23, 22, 'Catalogusnummer: 135023', 'Beschrijving: Gezicht op het singelplantsoen rond het voormalige bastion Zonnenburg te Utrecht\r\nmet links op de achtergrond een van de gebouwen van de voormalige St.-Servaasabdij, in het\r\nmidden het Meteorologisch Instituut en rechts de Sterrenwacht.', 1000, 200, '', 'images/hotspots/1765234002_pagina23.2.jpg', 'images/hotspots/1765234002_pagina23.jpg', '', ''),
(24, 23, 'Catalogusnummer: 135024', 'Beschrijving: Gezicht op het singelplantsoen bij het Servaasbolwerkte Utrecht met rechts op de\r\nachtergrond een gedeelte van het St.-Magdalenaklooster.', 1000, 200, '', 'images/hotspots/1765234108_pagina24.jpg', '', '', ''),
(25, 24, 'Catalogusnummer: 135025', 'Beschrijving: Gezicht op het singelplantsoen bij het Servaasbolwerk te Utrecht met het gebouw\r\nvan het voormalige Leeuwenberchgasthuis, destijds in gebruik als chemisch laboratorium, en op\r\nde achtergrond de daken van de bisschoppelijke stallen op het Servaasbolwerk.', 1000, 200, '', '', '', '', ''),
(26, 25, 'Catalogusnummer: 135026', 'Beschrijving: Gezicht over de Maliebrug met het dubbele hek en het douanekantoortje (de\r\nMaliebarrière) te Utrecht op het singelplantsoen met geheel links een gedeelte van de\r\nBruntenhof en rechts een gedeelte van het bolwerk Lepelenburg.', 1000, 200, '', 'images/hotspots/1765234130_pagina26.jpg', '', '', ''),
(27, 26, 'Catalogusnummer: 135027', 'Beschrijving: Gezicht op het voormalige bolwerk Lepelenburg te Utrecht met links het huis\r\nLievendaal en rechts enkele particuliere tuinhuizen.', 1000, 200, '', '', '', '', ''),
(28, 27, 'Catalogusnummer: 135028', 'Beschrijving: Gezicht op het voormalige bolwerk Lepelenburg te Utrecht met een aantal\r\nparticuliere tuinen en tuinhuizen.', 1000, 200, '', '', '', '', ''),
(29, 28, 'Catalogusnummer: 135029', 'Beschrijving: Gezicht op het singelplantsoen te Utrecht ten noorden van het voormalige bolwerk\r\nLepelenburg, waarop het witte huis links staat, met in het midden de huizen aan het begin van\r\nde Herenstraat en rechtsachter enkele van de kameren van Jan van der Meer aan het\r\nHieronymusplantsoen.', 1000, 200, '', '', '', '', ''),
(31, 30, 'Catalogusnummer: 135031', 'Beschrijving: Gezicht op het singelplantsoen te Utrecht met links de Zonstraat (later gewijzigd in\r\nNobelstraat) die aansluit op de Lucasbrug, op de voorgrond, met rechts daarvan het\r\nLucasbolwerk met het Suikerhuis.', 1000, 200, '', 'images/hotspots/1765234152_pagina31.jpg', '', '', ''),
(32, 31, 'Catalogusnummer: 135032', 'Beschrijving: Gezicht op het singelplantsoen te Utrecht met links de noordelijke punt van het\r\nLucasbolwerk met de directeurswoning van het Suikerhuis. Het Suikerhuis was een\r\nsuikerraffinaderij die in 1721 werd begonnen. In 1860 werd deze afgebroken.', 1000, 200, '', 'images/hotspots/1765234180_pagina32.jpg', '', '', ''),
(33, 32, 'Catalogusnummer: 135033', 'Beschrijving: Gezicht op het singelplantsoen te Utrecht ten noorden van het Lucasbolwerk.\r\nUiterst rechts sluit het plantsoen aan bij de Wittevrouwenbrug waarmee het panorama begint.\r\nHier eindigt de tekenaar zijn rondje langs de singel.', 1000, 200, '', '', '', '', ''),
(53, 0, 'Catalogusnummer: 135001', 'Beschrijving: Gezicht over de Wittevrouwenbrug in de Wittevrouwenstraat te Utrecht met het\r\ndouanekantoor (de latere politiepost Wittevrouwen) en de Willemskazerne.', 1000, 200, '', '', '', '', ''),
(54, 0, 'Catalogusnummer: 135003', 'Beschrijving: Gezicht op de gevangenis aan het Wolvenplein te Utrecht op het vroegere bolwerk\r\nWolvenburg, met rechts een huis op de afgegraven stadswal bij de Wolvenstraat.', 3909, 136.2, '', '', '', '', ''),
(55, 0, 'Catalogusnummer: 135004', 'Beschrijving: Gezicht op de uitmonding van de Plompetorengracht te Utrecht in de\r\nstadsbuitengracht, in het midden de bomen langs de Noorderkade en rechts een gedeelte van\r\nhet Begijnebolwerk. Rechts wordt een overhaalschuitje voortgetrokken.', 5256, 161.2, 'informatie: Afbeelding van het overhaalschuitje over de Stadsbuitengracht ter\r\nhoogte van de Lange Smeestraat te Utrecht. Deze veerbootjes, die voetgangers van en naar de\r\nbinnenstad vervoerden, werden in de loop van de 19e eeuw vervangen door vaste bruggen.', 'images/hotspots/1765232830_Pagina 4.jpg', 'images/hotspots/1765233779_pagina4.2.jpg', '', ''),
(56, 0, 'Catalogusnummer: 135002', 'Beschrijving: Gezicht over de Wittevrouwenbrug in de Wittevrouwenstraat te Utrecht met het\r\ndouanekantoor (de latere politiepost Wittevrouwen) en de Willemskazerne.', 2579, 160.2, '', '', '', '', '');

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `hotspots`
--
ALTER TABLE `hotspots`
  ADD PRIMARY KEY (`hotspot_id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `hotspots`
--
ALTER TABLE `hotspots`
  MODIFY `hotspot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
