// ── Team & Player Data ────────────────────────────────────────────────────────
const TEAMS = {
  'Mexico': { coach: 'Javier Aguirre', rating: 62, form: 5.4, last5: ['W','W','D','D','L'], players: [
    { name: 'Edson Alvarez', pos: 'MID', club: 'West Ham', rating: 82, form: 80 },
    { name: 'Santiago Gimenez', pos: 'FWD', club: 'AC Milan', rating: 80, form: 82 },
    { name: 'Alvaro Fidalgo', pos: 'MID', club: 'Real Betis', rating: 76, form: 76 },
    { name: 'Raul Jimenez', pos: 'FWD', club: 'Fulham', rating: 75, form: 73 },
    { name: 'Hirving Lozano', pos: 'FWD', club: 'PSV', rating: 74, form: 70 },
    { name: 'Guillermo Ochoa', pos: 'GK', club: 'Club America', rating: 74, form: 72 },
    { name: 'Cesar Montes', pos: 'DEF', club: 'Espanyol', rating: 72, form: 71 },
    { name: 'Erick Sanchez', pos: 'MID', club: 'Guadalajara', rating: 72, form: 71 },
  ]},
  'South Korea': { coach: 'Hong Myung-bo', rating: 65, form: 4.8, last5: ['W','D','D','L','L'], players: [
    { name: 'Son Heung-min', pos: 'FWD', club: 'Tottenham', rating: 88, form: 85 },
    { name: 'Kim Min-jae', pos: 'DEF', club: 'Bayern Munich', rating: 86, form: 84 },
    { name: 'Lee Kang-in', pos: 'MID', club: 'PSG', rating: 82, form: 80 },
    { name: 'Hwang Hee-chan', pos: 'FWD', club: 'Wolves', rating: 78, form: 76 },
    { name: 'Hwang In-beom', pos: 'MID', club: 'Feyenoord', rating: 76, form: 75 },
    { name: 'Kim Seung-gyu', pos: 'GK', club: 'Vissel Kobe', rating: 74, form: 73 },
    { name: 'Yang Min-hyeok', pos: 'FWD', club: 'Gangwon', rating: 74, form: 75 },
    { name: 'Cho Gue-sung', pos: 'FWD', club: 'Freiburg', rating: 74, form: 72 },
  ]},
  'Czech Republic': { coach: 'Miroslav Koubek', rating: 50, form: 5.6, last5: ['W','W','W','D','W'], players: [
    { name: 'Tomas Soucek', pos: 'MID', club: 'West Ham', rating: 78, form: 77 },
    { name: 'Patrik Schick', pos: 'FWD', club: 'Bayer Leverkusen', rating: 77, form: 74 },
    { name: 'Ladislav Krejci', pos: 'DEF', club: 'Sparta Prague', rating: 74, form: 73 },
    { name: 'Antonin Barak', pos: 'MID', club: 'Fiorentina', rating: 73, form: 72 },
    { name: 'Jindrich Stanek', pos: 'GK', club: 'Slavia Prague', rating: 72, form: 71 },
    { name: 'Vladimir Coufal', pos: 'DEF', club: 'West Ham', rating: 72, form: 71 },
    { name: 'Adam Hlozek', pos: 'FWD', club: 'Bayer Leverkusen', rating: 72, form: 73 },
    { name: 'Lukas Cerny', pos: 'MID', club: 'Slavia Prague', rating: 70, form: 69 },
  ]},
  'South Africa': { coach: 'Hugo Broos', rating: 38, form: 4.2, last5: ['W','L','L','D','L'], players: [
    { name: 'Ronwen Williams', pos: 'GK', club: 'Mamelodi Sundowns', rating: 72, form: 71 },
    { name: 'Lyle Foster', pos: 'FWD', club: 'Burnley', rating: 68, form: 66 },
    { name: 'Teboho Mokoena', pos: 'MID', club: 'Mamelodi Sundowns', rating: 66, form: 65 },
    { name: 'Relebohile Mofokeng', pos: 'FWD', club: 'Orlando Pirates', rating: 65, form: 67 },
    { name: 'Bongokuhle Hlongwane', pos: 'FWD', club: 'Minnesota United', rating: 63, form: 62 },
    { name: 'Siyanda Xulu', pos: 'DEF', club: 'Al Tai', rating: 62, form: 61 },
    { name: 'Themba Zwane', pos: 'MID', club: 'Mamelodi Sundowns', rating: 63, form: 62 },
    { name: 'Keagan Dolly', pos: 'FWD', club: 'Kaizer Chiefs', rating: 61, form: 60 },
  ]},
  'Switzerland': { coach: 'Murat Yakin', rating: 65, form: 6.2, last5: ['W','W','D','L','D'], players: [
    { name: 'Manuel Akanji', pos: 'DEF', club: 'Man City', rating: 85, form: 84 },
    { name: 'Granit Xhaka', pos: 'MID', club: 'Sunderland', rating: 82, form: 80 },
    { name: 'Gregor Kobel', pos: 'GK', club: 'Dortmund', rating: 80, form: 79 },
    { name: 'Dan Ndoye', pos: 'FWD', club: 'Nottm Forest', rating: 78, form: 79 },
    { name: 'Remo Freuler', pos: 'MID', club: 'Nottm Forest', rating: 76, form: 75 },
    { name: 'Breel Embolo', pos: 'FWD', club: 'Monaco', rating: 76, form: 74 },
    { name: 'Ruben Vargas', pos: 'MID', club: 'Augsburg', rating: 75, form: 74 },
    { name: 'Ricardo Rodriguez', pos: 'DEF', club: 'Torino', rating: 74, form: 72 },
  ]},
  'Canada': { coach: 'Jesse Marsch', rating: 55, form: 5.6, last5: ['W','W','D','D','D'], players: [
    { name: 'Alphonso Davies', pos: 'DEF', club: 'Bayern Munich', rating: 85, form: 76 },
    { name: 'Jonathan David', pos: 'FWD', club: 'Juventus', rating: 82, form: 80 },
    { name: 'Stephen Eustaquio', pos: 'MID', club: 'Porto', rating: 76, form: 75 },
    { name: 'Tajon Buchanan', pos: 'FWD', club: 'Club Brugge', rating: 76, form: 75 },
    { name: 'Ismael Kone', pos: 'MID', club: 'Marseille', rating: 75, form: 74 },
    { name: 'Alistair Johnston', pos: 'DEF', club: 'Celtic', rating: 74, form: 73 },
    { name: 'Milan Borjan', pos: 'GK', club: 'Red Star Belgrade', rating: 74, form: 73 },
    { name: 'Cyle Larin', pos: 'FWD', club: 'Club Brugge', rating: 73, form: 72 },
  ]},
  'Bosnia & Herz.': { coach: 'Sergej Barbarez', rating: 45, form: 6.8, last5: ['W','W','W','D','W'], players: [
    { name: 'Ermedin Demirovic', pos: 'FWD', club: 'Stuttgart', rating: 75, form: 77 },
    { name: 'Edin Dzeko', pos: 'FWD', club: 'Fenerbahce', rating: 72, form: 68 },
    { name: 'Sead Kolasinac', pos: 'DEF', club: 'Atalanta', rating: 73, form: 72 },
    { name: 'Nikola Vasilj', pos: 'GK', club: 'St. Pauli', rating: 72, form: 73 },
    { name: 'Amer Gojak', pos: 'MID', club: 'Augsburg', rating: 70, form: 69 },
    { name: 'Sasa Lukic', pos: 'MID', club: 'Fulham', rating: 70, form: 69 },
    { name: 'Armin Gigovic', pos: 'MID', club: 'Sturm Graz', rating: 68, form: 69 },
    { name: 'Anel Ahmedhodzic', pos: 'DEF', club: 'Sheffield Utd', rating: 70, form: 69 },
  ]},
  'Qatar': { coach: 'Julen Lopetegui', rating: 30, form: 3.4, last5: ['W','L','L','D','L'], players: [
    { name: 'Akram Afif', pos: 'FWD', club: 'Al Sadd', rating: 74, form: 70 },
    { name: 'Almoez Ali', pos: 'FWD', club: 'Al Duhail', rating: 68, form: 65 },
    { name: 'Hassan Al-Haydos', pos: 'MID', club: 'Al Sadd', rating: 64, form: 61 },
    { name: 'Meshaal Barsham', pos: 'GK', club: 'Al Sadd', rating: 66, form: 64 },
    { name: 'Pedro Miguel', pos: 'DEF', club: 'Al Duhail', rating: 63, form: 62 },
    { name: 'Karim Boudiaf', pos: 'MID', club: 'Al Duhail', rating: 62, form: 61 },
    { name: 'Ismail Mohamad', pos: 'FWD', club: 'Al Rayyan', rating: 60, form: 59 },
    { name: 'Homam Ahmed', pos: 'MID', club: 'Al Gharafa', rating: 59, form: 58 },
  ]},
  'Brazil': { coach: 'Carlo Ancelotti', rating: 82, form: 5.4, last5: ['W','L','D','W','L'], players: [
    { name: 'Vinicius Jr.', pos: 'FWD', club: 'Real Madrid', rating: 92, form: 90 },
    { name: 'Raphinha', pos: 'FWD', club: 'Barcelona', rating: 85, form: 84 },
    { name: 'Alisson', pos: 'GK', club: 'Liverpool', rating: 86, form: 84 },
    { name: 'Bruno Guimaraes', pos: 'MID', club: 'Newcastle', rating: 83, form: 81 },
    { name: 'Marquinhos', pos: 'DEF', club: 'PSG', rating: 82, form: 80 },
    { name: 'Igor Thiago', pos: 'FWD', club: 'Brentford', rating: 79, form: 82 },
    { name: 'Endrick', pos: 'FWD', club: 'Real Madrid', rating: 78, form: 79 },
    { name: 'Savinho', pos: 'FWD', club: 'Man City', rating: 76, form: 78 },
  ]},
  'Morocco': { coach: 'Mohamed Ouahbi', rating: 78, form: 6.8, last5: ['W','W','W','D','W'], players: [
    { name: 'Achraf Hakimi', pos: 'DEF', club: 'PSG', rating: 88, form: 87 },
    { name: 'Brahim Diaz', pos: 'MID', club: 'AC Milan', rating: 84, form: 82 },
    { name: 'Yassine Bounou', pos: 'GK', club: 'Al Hilal', rating: 80, form: 78 },
    { name: 'Sofyan Amrabat', pos: 'MID', club: 'Marseille', rating: 78, form: 77 },
    { name: 'Youssef En-Nesyri', pos: 'FWD', club: 'Fenerbahce', rating: 78, form: 75 },
    { name: 'Nayef Aguerd', pos: 'DEF', club: 'Real Sociedad', rating: 77, form: 76 },
    { name: 'Bilal El Khannouss', pos: 'MID', club: 'Leicester', rating: 77, form: 76 },
    { name: 'Hakim Ziyech', pos: 'MID', club: 'Galatasaray', rating: 76, form: 73 },
  ]},
  'Scotland': { coach: 'Steve Clarke', rating: 58, form: 5.2, last5: ['W','L','W','L','L'], players: [
    { name: 'Scott McTominay', pos: 'MID', club: 'Napoli', rating: 82, form: 83 },
    { name: 'Andrew Robertson', pos: 'DEF', club: 'Liverpool', rating: 81, form: 79 },
    { name: 'John McGinn', pos: 'MID', club: 'Aston Villa', rating: 78, form: 77 },
    { name: 'Billy Gilmour', pos: 'MID', club: 'Napoli', rating: 77, form: 76 },
    { name: 'Angus Gunn', pos: 'GK', club: 'Norwich City', rating: 74, form: 73 },
    { name: 'Kieran Tierney', pos: 'DEF', club: 'Real Sociedad', rating: 76, form: 74 },
    { name: 'Lawrence Shankland', pos: 'FWD', club: 'Hearts', rating: 73, form: 74 },
    { name: 'Che Adams', pos: 'FWD', club: 'Torino', rating: 72, form: 71 },
  ]},
  'Haiti': { coach: 'Marc Collat', rating: 35, form: 4.2, last5: ['W','W','L','L','D'], players: [
    { name: 'Jean-Ricner Bellegarde', pos: 'MID', club: 'RC Strasbourg', rating: 70, form: 69 },
    { name: 'Wilson Isidor', pos: 'FWD', club: 'Stade Rennais', rating: 67, form: 66 },
    { name: 'Duckens Nazon', pos: 'FWD', club: 'Sint-Truiden', rating: 64, form: 63 },
    { name: 'Frantzdy Pierrot', pos: 'FWD', club: 'USL Championship', rating: 62, form: 61 },
    { name: 'Johny Placide', pos: 'GK', club: 'SC Bastia', rating: 63, form: 63 },
    { name: 'Ricardo Ade', pos: 'DEF', club: 'CS Louhans-Cuiseaux', rating: 62, form: 61 },
    { name: 'Mechack Jerome', pos: 'DEF', club: 'Vancouver Whitecaps', rating: 61, form: 60 },
    { name: 'Andres Dorlus', pos: 'MID', club: 'Karvina', rating: 60, form: 59 },
  ]},
  'USA': { coach: 'Mauricio Pochettino', rating: 68, form: 5.4, last5: ['W','W','W','L','L'], players: [
    { name: 'Christian Pulisic', pos: 'FWD', club: 'AC Milan', rating: 83, form: 78 },
    { name: 'Weston McKennie', pos: 'MID', club: 'Juventus', rating: 80, form: 79 },
    { name: 'Tyler Adams', pos: 'MID', club: 'Bournemouth', rating: 79, form: 78 },
    { name: 'Gio Reyna', pos: 'FWD', club: 'Dortmund', rating: 78, form: 76 },
    { name: 'Yunus Musah', pos: 'MID', club: 'AC Milan', rating: 77, form: 76 },
    { name: 'Matt Turner', pos: 'GK', club: 'Crystal Palace', rating: 76, form: 75 },
    { name: 'Chris Richards', pos: 'DEF', club: 'Crystal Palace', rating: 76, form: 75 },
    { name: 'Ricardo Pepi', pos: 'FWD', club: 'PSV Eindhoven', rating: 74, form: 75 },
  ]},
  'Turkey': { coach: 'Vincenzo Montella', rating: 65, form: 6.8, last5: ['W','W','D','W','W'], players: [
    { name: 'Hakan Calhanoglu', pos: 'MID', club: 'Inter Milan', rating: 87, form: 86 },
    { name: 'Arda Guler', pos: 'MID', club: 'Real Madrid', rating: 86, form: 88 },
    { name: 'Kenan Yildiz', pos: 'FWD', club: 'Juventus', rating: 84, form: 85 },
    { name: 'Ferdi Kadioglu', pos: 'DEF', club: 'Brighton', rating: 78, form: 78 },
    { name: 'Baris Alper Yilmaz', pos: 'FWD', club: 'Galatasaray', rating: 76, form: 75 },
    { name: 'Merih Demiral', pos: 'DEF', club: 'Al Qadsiah', rating: 76, form: 74 },
    { name: 'Mert Gunok', pos: 'GK', club: 'Besiktas', rating: 74, form: 73 },
    { name: 'Okay Yokuslu', pos: 'MID', club: 'Trabzonspor', rating: 73, form: 72 },
  ]},
  'Paraguay': { coach: 'Gustavo Alfaro', rating: 52, form: 4.8, last5: ['D','W','L','W','L'], players: [
    { name: 'Gustavo Gomez', pos: 'DEF', club: 'Palmeiras', rating: 76, form: 75 },
    { name: 'Julio Enciso', pos: 'FWD', club: 'Brighton', rating: 75, form: 74 },
    { name: 'Miguel Almiron', pos: 'MID', club: 'Newcastle', rating: 74, form: 72 },
    { name: 'Omar Alderete', pos: 'DEF', club: 'Valencia', rating: 74, form: 73 },
    { name: 'Antony Silva', pos: 'GK', club: 'Cerro Porteno', rating: 72, form: 71 },
    { name: 'Andres Cubas', pos: 'MID', club: 'Nice', rating: 72, form: 71 },
    { name: 'Antonio Sanabria', pos: 'FWD', club: 'Torino', rating: 72, form: 70 },
    { name: 'Robert Morales', pos: 'MID', club: 'Olimpia', rating: 68, form: 67 },
  ]},
  'Australia': { coach: 'Tony Popovic', rating: 55, form: 5.8, last5: ['W','W','L','W','W'], players: [
    { name: 'Nestory Irankunda', pos: 'FWD', club: 'Watford', rating: 74, form: 76 },
    { name: 'Jordy Bos', pos: 'FWD', club: 'AZ Alkmaar', rating: 72, form: 73 },
    { name: 'Mathew Ryan', pos: 'GK', club: 'Real Sociedad', rating: 70, form: 69 },
    { name: 'Alessandro Circati', pos: 'DEF', club: 'Parma', rating: 71, form: 70 },
    { name: 'Jackson Irvine', pos: 'MID', club: 'St. Pauli', rating: 71, form: 70 },
    { name: 'Martin Boyle', pos: 'FWD', club: 'Hibernian', rating: 68, form: 67 },
    { name: 'Lewis Miller', pos: 'DEF', club: 'Hibernian', rating: 68, form: 67 },
    { name: 'Keanu Baccus', pos: 'MID', club: 'St. Mirren', rating: 67, form: 66 },
  ]},
  'Germany': { coach: 'Julian Nagelsmann', rating: 85, form: 7.2, last5: ['W','W','W','W','W'], players: [
    { name: 'Florian Wirtz', pos: 'MID', club: 'Liverpool', rating: 91, form: 92 },
    { name: 'Jamal Musiala', pos: 'MID', club: 'Bayern Munich', rating: 90, form: 86 },
    { name: 'Kai Havertz', pos: 'FWD', club: 'Arsenal', rating: 82, form: 80 },
    { name: 'Antonio Rudiger', pos: 'DEF', club: 'Real Madrid', rating: 82, form: 80 },
    { name: 'Manuel Neuer', pos: 'GK', club: 'Bayern Munich', rating: 82, form: 78 },
    { name: 'Joshua Kimmich', pos: 'MID', club: 'Bayern Munich', rating: 81, form: 79 },
    { name: 'Jonathan Tah', pos: 'DEF', club: 'Bayern Munich', rating: 80, form: 79 },
    { name: 'Leroy Sane', pos: 'FWD', club: 'Galatasaray', rating: 77, form: 74 },
  ]},
  'Ecuador': { coach: 'Sebastien Beccacece', rating: 68, form: 5.4, last5: ['D','D','W','D','D'], players: [
    { name: 'Moises Caicedo', pos: 'MID', club: 'Chelsea', rating: 87, form: 86 },
    { name: 'Piero Hincapie', pos: 'DEF', club: 'Bayer Leverkusen', rating: 82, form: 81 },
    { name: 'Willian Pacho', pos: 'DEF', club: 'PSG', rating: 81, form: 80 },
    { name: 'Pervis Estupinian', pos: 'DEF', club: 'Brighton', rating: 79, form: 78 },
    { name: 'Enner Valencia', pos: 'FWD', club: 'Fenerbahce', rating: 74, form: 70 },
    { name: 'Angel Mena', pos: 'FWD', club: 'Leon', rating: 73, form: 71 },
    { name: 'Kevin Rodriguez', pos: 'FWD', club: 'CSKA Moscow', rating: 72, form: 71 },
    { name: 'Hernan Galindez', pos: 'GK', club: 'Huracan', rating: 72, form: 71 },
  ]},
  'Ivory Coast': { coach: 'Emerse Fae', rating: 62, form: 6.4, last5: ['W','L','W','W','W'], players: [
    { name: 'Amad Diallo', pos: 'FWD', club: 'Man United', rating: 79, form: 80 },
    { name: 'Ibrahim Sangare', pos: 'MID', club: 'Nottm Forest', rating: 78, form: 77 },
    { name: 'Franck Kessie', pos: 'MID', club: 'Al Ahli', rating: 77, form: 74 },
    { name: 'Odilon Kossounou', pos: 'DEF', club: 'Bayer Leverkusen', rating: 77, form: 76 },
    { name: 'Sebastien Haller', pos: 'FWD', club: 'Dortmund', rating: 75, form: 74 },
    { name: 'Yahia Fofana', pos: 'GK', club: 'Caykur Rizespor', rating: 72, form: 70 },
    { name: 'Simon Adingra', pos: 'FWD', club: 'Brighton', rating: 73, form: 74 },
    { name: 'Cheick Doucoure', pos: 'MID', club: 'Crystal Palace', rating: 72, form: 71 },
  ]},
  'Curacao': { coach: 'Dick Advocaat', rating: 35, form: 3.8, last5: ['D','W','D','L','L'], players: [
    { name: 'Juninho Bacuna', pos: 'MID', club: 'Birmingham City', rating: 68, form: 67 },
    { name: 'Leandro Bacuna', pos: 'MID', club: 'Cardiff City', rating: 66, form: 65 },
    { name: 'Gervane Kastaneer', pos: 'FWD', club: 'Kasimpasa', rating: 64, form: 63 },
    { name: 'Eloy Room', pos: 'GK', club: 'Colorado Rapids', rating: 64, form: 63 },
    { name: 'Cuco Martina', pos: 'DEF', club: 'SV Victory Boys', rating: 60, form: 59 },
    { name: 'Rangelo Janga', pos: 'FWD', club: 'Samsunspor', rating: 61, form: 60 },
    { name: 'Etienne Reijnen', pos: 'DEF', club: 'Colorado Rapids', rating: 60, form: 59 },
    { name: 'Jarchinio Antonia', pos: 'FWD', club: 'FC Emmen', rating: 59, form: 58 },
  ]},
  'Netherlands': { coach: 'Ronald Koeman', rating: 78, form: 6.4, last5: ['W','D','W','W','D'], players: [
    { name: 'Virgil van Dijk', pos: 'DEF', club: 'Liverpool', rating: 86, form: 84 },
    { name: 'Frenkie de Jong', pos: 'MID', club: 'Barcelona', rating: 84, form: 82 },
    { name: 'Cody Gakpo', pos: 'FWD', club: 'Liverpool', rating: 83, form: 82 },
    { name: 'Tijjani Reijnders', pos: 'MID', club: 'Man City', rating: 82, form: 83 },
    { name: 'Xavi Simons', pos: 'MID', club: 'RB Leipzig', rating: 80, form: 81 },
    { name: 'Matthijs de Ligt', pos: 'DEF', club: 'Man United', rating: 80, form: 78 },
    { name: 'Bart Verbruggen', pos: 'GK', club: 'Brighton', rating: 78, form: 77 },
    { name: 'Memphis Depay', pos: 'FWD', club: 'Corinthians', rating: 76, form: 72 },
  ]},
  'Japan': { coach: 'Hajime Moriyasu', rating: 73, form: 7.0, last5: ['W','W','W','W','W'], players: [
    { name: 'Takefusa Kubo', pos: 'FWD', club: 'Real Sociedad', rating: 84, form: 85 },
    { name: 'Kaoru Mitoma', pos: 'FWD', club: 'Brighton', rating: 82, form: 83 },
    { name: 'Ayase Ueda', pos: 'FWD', club: 'Feyenoord', rating: 80, form: 82 },
    { name: 'Wataru Endo', pos: 'MID', club: 'Liverpool', rating: 78, form: 77 },
    { name: 'Ritsu Doan', pos: 'MID', club: 'Freiburg', rating: 78, form: 78 },
    { name: 'Ko Itakura', pos: 'DEF', club: 'Gladbach', rating: 77, form: 76 },
    { name: 'Daichi Kamada', pos: 'MID', club: 'Crystal Palace', rating: 76, form: 75 },
    { name: 'Daniel Schmidt', pos: 'GK', club: 'St. Truiden', rating: 75, form: 74 },
  ]},
  'Sweden': { coach: 'Graham Potter', rating: 62, form: 5.8, last5: ['L','L','D','W','W'], players: [
    { name: 'Viktor Gyokeres', pos: 'FWD', club: 'Sporting CP', rating: 87, form: 85 },
    { name: 'Alexander Isak', pos: 'FWD', club: 'Newcastle', rating: 86, form: 84 },
    { name: 'Dejan Kulusevski', pos: 'MID', club: 'Tottenham', rating: 82, form: 80 },
    { name: 'Lucas Bergvall', pos: 'MID', club: 'Tottenham', rating: 74, form: 76 },
    { name: 'Robin Olsen', pos: 'GK', club: 'Aston Villa', rating: 72, form: 71 },
    { name: 'Isak Hien', pos: 'DEF', club: 'Atalanta', rating: 74, form: 73 },
    { name: 'Viktor Claesson', pos: 'MID', club: 'Krasnodar', rating: 70, form: 69 },
    { name: 'Alexander Milosevic', pos: 'DEF', club: 'Besiktas', rating: 68, form: 67 },
  ]},
  'Tunisia': { coach: 'Faouzi Benzarti', rating: 55, form: 5.0, last5: ['W','L','D','W','D'], players: [
    { name: 'Ellyes Skhiri', pos: 'MID', club: 'Eintracht Frankfurt', rating: 76, form: 75 },
    { name: 'Hannibal Mejbri', pos: 'MID', club: 'Sevilla', rating: 73, form: 72 },
    { name: 'Montassar Talbi', pos: 'DEF', club: 'RC Lens', rating: 72, form: 71 },
    { name: 'Aymen Dahmen', pos: 'GK', club: 'Montpellier', rating: 71, form: 70 },
    { name: 'Seifeddine Jaziri', pos: 'FWD', club: 'Al Ittihad Kalba', rating: 68, form: 67 },
    { name: 'Mohamed Drager', pos: 'DEF', club: 'FC Porto', rating: 68, form: 67 },
    { name: 'Youssef Msakni', pos: 'MID', club: 'Al Arabi', rating: 67, form: 65 },
    { name: 'Aissa Laidouni', pos: 'MID', club: 'Ferencvaros', rating: 66, form: 65 },
  ]},
  'Belgium': { coach: 'Domenico Tedesco', rating: 78, form: 6.8, last5: ['W','D','W','W','D'], players: [
    { name: 'Kevin De Bruyne', pos: 'MID', club: 'Napoli', rating: 88, form: 82 },
    { name: 'Thibaut Courtois', pos: 'GK', club: 'Real Madrid', rating: 87, form: 85 },
    { name: 'Jeremy Doku', pos: 'FWD', club: 'Man City', rating: 84, form: 85 },
    { name: 'Lois Openda', pos: 'FWD', club: 'RB Leipzig', rating: 82, form: 83 },
    { name: 'Charles De Ketelaere', pos: 'MID', club: 'Atalanta', rating: 81, form: 82 },
    { name: 'Romelu Lukaku', pos: 'FWD', club: 'Napoli', rating: 80, form: 76 },
    { name: 'Arthur Theate', pos: 'DEF', club: 'Rennes', rating: 77, form: 76 },
    { name: 'Axel Witsel', pos: 'MID', club: 'Atletico Madrid', rating: 74, form: 70 },
  ]},
  'Egypt': { coach: 'Hossam Hassan', rating: 68, form: 6.4, last5: ['W','L','D','W','D'], players: [
    { name: 'Mohamed Salah', pos: 'FWD', club: 'Liverpool', rating: 92, form: 91 },
    { name: 'Omar Marmoush', pos: 'FWD', club: 'Man City', rating: 83, form: 85 },
    { name: 'Mohamed El Shenawy', pos: 'GK', club: 'Al Ahly', rating: 74, form: 73 },
    { name: 'Emam Ashour', pos: 'MID', club: 'Zamalek', rating: 73, form: 72 },
    { name: 'Trezeguet', pos: 'FWD', club: 'Al Ahly', rating: 72, form: 70 },
    { name: 'Ahmed Hegazy', pos: 'DEF', club: 'Al Ittihad', rating: 72, form: 70 },
    { name: 'Amr El Sulaya', pos: 'MID', club: 'Al Ahly', rating: 70, form: 69 },
    { name: 'Mahmoud El Wensh', pos: 'DEF', club: 'Al Ahly', rating: 69, form: 68 },
  ]},
  'Iran': { coach: 'Amir Ghalenoei', rating: 58, form: 5.0, last5: ['W','D','D','L','W'], players: [
    { name: 'Mehdi Taremi', pos: 'FWD', club: 'Inter Milan', rating: 79, form: 76 },
    { name: 'Alireza Beiranvand', pos: 'GK', club: 'Antwerp', rating: 74, form: 72 },
    { name: 'Sardar Azmoun', pos: 'FWD', club: 'Bayer Leverkusen', rating: 74, form: 68 },
    { name: 'Saman Ghoddos', pos: 'MID', club: 'Brentford', rating: 72, form: 71 },
    { name: 'Ali Gholizadeh', pos: 'FWD', club: 'Charleroi', rating: 70, form: 69 },
    { name: 'Milad Mohammadi', pos: 'DEF', club: 'AEK Athens', rating: 68, form: 67 },
    { name: 'Ahmad Nourollahi', pos: 'MID', club: 'Persepolis', rating: 67, form: 66 },
    { name: 'Morteza Pouraliganji', pos: 'DEF', club: 'Al Duhail', rating: 67, form: 66 },
  ]},
  'New Zealand': { coach: 'Darren Bazeley', rating: 42, form: 3.6, last5: ['L','L','L','L','W'], players: [
    { name: 'Chris Wood', pos: 'FWD', club: 'Nottm Forest', rating: 78, form: 70 },
    { name: 'Marko Stamenic', pos: 'MID', club: 'FC Copenhagen', rating: 70, form: 69 },
    { name: 'Tyler Bindon', pos: 'DEF', club: 'Gold Coast United', rating: 68, form: 67 },
    { name: 'Eli Just', pos: 'MID', club: 'Auckland City', rating: 66, form: 65 },
    { name: 'Max Mata', pos: 'FWD', club: 'San Jose Earthquakes', rating: 65, form: 64 },
    { name: 'Michael Boxall', pos: 'DEF', club: 'Minnesota United', rating: 65, form: 64 },
    { name: 'Stefan Marinovic', pos: 'GK', club: 'Meistriliiga', rating: 63, form: 62 },
    { name: 'Liberato Cacace', pos: 'DEF', club: 'Empoli', rating: 66, form: 65 },
  ]},
  'Spain': { coach: 'Luis de la Fuente', rating: 92, form: 7.2, last5: ['W','W','D','W','D'], players: [
    { name: 'Rodri', pos: 'MID', club: 'Man City', rating: 93, form: 72 },
    { name: 'Lamine Yamal', pos: 'FWD', club: 'Barcelona', rating: 91, form: 90 },
    { name: 'Pedri', pos: 'MID', club: 'Barcelona', rating: 88, form: 85 },
    { name: 'Nico Williams', pos: 'FWD', club: 'Athletic Bilbao', rating: 85, form: 84 },
    { name: 'Dani Olmo', pos: 'MID', club: 'Barcelona', rating: 84, form: 82 },
    { name: 'Unai Simon', pos: 'GK', club: 'Athletic Bilbao', rating: 82, form: 80 },
    { name: 'Gavi', pos: 'MID', club: 'Barcelona', rating: 82, form: 80 },
    { name: 'Fabian Ruiz', pos: 'MID', club: 'PSG', rating: 80, form: 79 },
  ]},
  'Uruguay': { coach: 'Marcelo Bielsa', rating: 72, form: 4.6, last5: ['W','D','D','L','L'], players: [
    { name: 'Federico Valverde', pos: 'MID', club: 'Real Madrid', rating: 89, form: 88 },
    { name: 'Ronald Araujo', pos: 'DEF', club: 'Barcelona', rating: 86, form: 84 },
    { name: 'Manuel Ugarte', pos: 'MID', club: 'Man United', rating: 81, form: 80 },
    { name: 'Darwin Nunez', pos: 'FWD', club: 'Al-Hilal', rating: 80, form: 68 },
    { name: 'Jose Maria Gimenez', pos: 'DEF', club: 'Atletico Madrid', rating: 80, form: 79 },
    { name: 'Rodrigo Bentancur', pos: 'MID', club: 'Tottenham', rating: 79, form: 77 },
    { name: 'Sergio Rochet', pos: 'GK', club: 'Internacional', rating: 76, form: 74 },
    { name: 'Facundo Torres', pos: 'FWD', club: 'Orlando City', rating: 74, form: 73 },
  ]},
  'Saudi Arabia': { coach: 'Herve Renard', rating: 42, form: 3.8, last5: ['W','D','L','L','L'], players: [
    { name: 'Salem Al-Dawsari', pos: 'FWD', club: 'Al Hilal', rating: 72, form: 68 },
    { name: 'Mohamed Kanno', pos: 'MID', club: 'Al Hilal', rating: 70, form: 69 },
    { name: 'Mohammed Al-Owais', pos: 'GK', club: 'Al Hilal', rating: 70, form: 68 },
    { name: 'Firas Al-Buraikan', pos: 'FWD', club: 'Al Fateh', rating: 68, form: 65 },
    { name: 'Saud Abdulhamid', pos: 'DEF', club: 'AS Roma', rating: 68, form: 67 },
    { name: 'Saleh Al-Shehri', pos: 'FWD', club: 'Al Hilal', rating: 67, form: 64 },
    { name: 'Ali Al-Bulaihi', pos: 'DEF', club: 'Al Hilal', rating: 66, form: 64 },
    { name: 'Riyadh Sharahili', pos: 'MID', club: 'Al Ettifaq', rating: 62, form: 60 },
  ]},
  'Cape Verde': { coach: 'Pedro Brito', rating: 35, form: 4.6, last5: ['W','D','D','L','D'], players: [
    { name: 'Logan Costa', pos: 'DEF', club: 'Toulouse', rating: 70, form: 69 },
    { name: 'Ryan Mendes', pos: 'MID', club: 'Nottm Forest', rating: 66, form: 65 },
    { name: 'Garry Rodrigues', pos: 'FWD', club: 'Galatasaray', rating: 65, form: 63 },
    { name: 'Vozinha', pos: 'GK', club: 'Pacos de Ferreira', rating: 63, form: 62 },
    { name: 'Steven Fortes', pos: 'DEF', club: 'Estoril', rating: 62, form: 61 },
    { name: 'Julio Tavares', pos: 'FWD', club: 'Dijon', rating: 61, form: 60 },
    { name: 'Jamiro Monteiro', pos: 'MID', club: 'Club de Foot Montreal', rating: 62, form: 61 },
    { name: 'Stopira', pos: 'DEF', club: 'Servette', rating: 60, form: 59 },
  ]},
  'France': { coach: 'Didier Deschamps', rating: 92, form: 8.2, last5: ['W','W','W','W','D'], players: [
    { name: 'Kylian Mbappe', pos: 'FWD', club: 'Real Madrid', rating: 94, form: 91 },
    { name: 'Ousmane Dembele', pos: 'FWD', club: 'PSG', rating: 92, form: 93 },
    { name: 'William Saliba', pos: 'DEF', club: 'Arsenal', rating: 86, form: 87 },
    { name: 'Mike Maignan', pos: 'GK', club: 'AC Milan', rating: 86, form: 84 },
    { name: 'Aurelien Tchouameni', pos: 'MID', club: 'Real Madrid', rating: 85, form: 84 },
    { name: 'Desire Doue', pos: 'FWD', club: 'PSG', rating: 82, form: 86 },
    { name: 'Jules Kounde', pos: 'DEF', club: 'Barcelona', rating: 82, form: 80 },
    { name: 'Adrien Rabiot', pos: 'MID', club: 'Marseille', rating: 78, form: 76 },
  ]},
  'Norway': { coach: 'Stale Solbakken', rating: 78, form: 6.6, last5: ['W','W','D','D','L'], players: [
    { name: 'Erling Haaland', pos: 'FWD', club: 'Man City', rating: 92, form: 86 },
    { name: 'Martin Odegaard', pos: 'MID', club: 'Arsenal', rating: 89, form: 88 },
    { name: 'Alexander Sorloth', pos: 'FWD', club: 'Atletico Madrid', rating: 79, form: 77 },
    { name: 'Sander Berge', pos: 'MID', club: 'Burnley', rating: 77, form: 76 },
    { name: 'Joergen Strand Larsen', pos: 'FWD', club: 'Celta Vigo', rating: 76, form: 75 },
    { name: 'Orjan Nyland', pos: 'GK', club: 'Sevilla', rating: 75, form: 74 },
    { name: 'Leo Ostigard', pos: 'DEF', club: 'Napoli', rating: 75, form: 74 },
    { name: 'Kristian Thorstvedt', pos: 'MID', club: 'Sassuolo', rating: 73, form: 72 },
  ]},
  'Senegal': { coach: 'Pape Thiaw', rating: 75, form: 7.0, last5: ['W','W','W','W','L'], players: [
    { name: 'Nicolas Jackson', pos: 'FWD', club: 'Bayern Munich', rating: 81, form: 82 },
    { name: 'Pape Matar Sarr', pos: 'MID', club: 'Tottenham', rating: 78, form: 77 },
    { name: 'Iliman Ndiaye', pos: 'FWD', club: 'Marseille', rating: 76, form: 78 },
    { name: 'Ismaila Sarr', pos: 'FWD', club: 'Crystal Palace', rating: 76, form: 75 },
    { name: 'Kalidou Koulibaly', pos: 'DEF', club: 'Al Hilal', rating: 76, form: 73 },
    { name: 'Idrissa Gueye', pos: 'MID', club: 'Everton', rating: 74, form: 72 },
    { name: 'Edouard Mendy', pos: 'GK', club: 'Al Ahli', rating: 74, form: 72 },
    { name: 'Sadio Mane', pos: 'FWD', club: 'Al Nassr', rating: 74, form: 70 },
  ]},
  'Iraq': { coach: 'Jesus Casas', rating: 48, form: 5.2, last5: ['W','W','D','D','W'], players: [
    { name: 'Aymen Hussein', pos: 'FWD', club: 'Al Quwa Al Jawiya', rating: 72, form: 73 },
    { name: 'Ali Al-Hamadi', pos: 'FWD', club: 'Millwall', rating: 70, form: 71 },
    { name: 'Mohanad Ali', pos: 'FWD', club: 'Al Shorta', rating: 69, form: 68 },
    { name: 'Zidane Iqbal', pos: 'MID', club: 'FC Utrecht', rating: 68, form: 69 },
    { name: 'Bashar Resan', pos: 'MID', club: 'FC Vizela', rating: 67, form: 66 },
    { name: 'Amjed Attwan', pos: 'DEF', club: 'Al Quwa Al Jawiya', rating: 66, form: 65 },
    { name: 'Jalal Hassan', pos: 'GK', club: 'Al Quwa Al Jawiya', rating: 65, form: 64 },
    { name: 'Ali Adnan', pos: 'DEF', club: 'Trabzonspor', rating: 66, form: 65 },
  ]},
  'Argentina': { coach: 'Lionel Scaloni', rating: 92, form: 7.4, last5: ['W','W','W','W','W'], players: [
    { name: 'Lionel Messi', pos: 'FWD', club: 'Inter Miami', rating: 90, form: 88 },
    { name: 'Emiliano Martinez', pos: 'GK', club: 'Aston Villa', rating: 86, form: 85 },
    { name: 'Julian Alvarez', pos: 'FWD', club: 'Atletico Madrid', rating: 85, form: 87 },
    { name: 'Enzo Fernandez', pos: 'MID', club: 'Chelsea', rating: 84, form: 82 },
    { name: 'Cristian Romero', pos: 'DEF', club: 'Tottenham', rating: 84, form: 83 },
    { name: 'Alexis Mac Allister', pos: 'MID', club: 'Liverpool', rating: 83, form: 82 },
    { name: 'Rodrigo De Paul', pos: 'MID', club: 'Atletico Madrid', rating: 82, form: 80 },
    { name: 'Franco Mastantuono', pos: 'MID', club: 'Real Madrid', rating: 80, form: 82 },
  ]},
  'Austria': { coach: 'Ralf Rangnick', rating: 74, form: 6.2, last5: ['L','W','D','W','W'], players: [
    { name: 'David Alaba', pos: 'DEF', club: 'Real Madrid', rating: 84, form: 82 },
    { name: 'Marcel Sabitzer', pos: 'MID', club: 'Dortmund', rating: 80, form: 79 },
    { name: 'Konrad Laimer', pos: 'MID', club: 'Bayern Munich', rating: 79, form: 78 },
    { name: 'Christoph Baumgartner', pos: 'MID', club: 'RB Leipzig', rating: 78, form: 77 },
    { name: 'Carney Chukwuemeka', pos: 'MID', club: 'Chelsea', rating: 76, form: 77 },
    { name: 'Patrick Pentz', pos: 'GK', club: 'Bayer Leverkusen', rating: 76, form: 75 },
    { name: 'Paul Wanner', pos: 'MID', club: 'Bayern Munich', rating: 74, form: 76 },
    { name: 'Marko Arnautovic', pos: 'FWD', club: 'Man United', rating: 74, form: 70 },
  ]},
  'Algeria': { coach: 'Vladimir Petkovic', rating: 68, form: 5.8, last5: ['W','L','W','D','W'], players: [
    { name: 'Mohamed Amoura', pos: 'FWD', club: 'Wolfsburg', rating: 80, form: 82 },
    { name: 'Rayan Ait-Nouri', pos: 'DEF', club: 'Man City', rating: 79, form: 78 },
    { name: 'Riyad Mahrez', pos: 'FWD', club: 'Al Ahli', rating: 78, form: 73 },
    { name: 'Ramy Bensebaini', pos: 'DEF', club: 'Dortmund', rating: 77, form: 76 },
    { name: 'Youcef Atal', pos: 'DEF', club: 'Nice', rating: 74, form: 73 },
    { name: 'Anis Ben Slimane', pos: 'MID', club: 'Burnley', rating: 73, form: 72 },
    { name: 'Islam Slimani', pos: 'FWD', club: 'Sporting CP', rating: 70, form: 67 },
    { name: 'Djamel Benlamri', pos: 'DEF', club: 'Al Nassr', rating: 68, form: 66 },
  ]},
  'Jordan': { coach: 'Hussain Ammouta', rating: 48, form: 4.8, last5: ['W','W','L','D','D'], players: [
    { name: 'Musa Al-Taamari', pos: 'FWD', club: 'Montpellier', rating: 74, form: 73 },
    { name: 'Ali Olwan', pos: 'MID', club: 'Al Faisaly', rating: 66, form: 65 },
    { name: 'Mohannad Abu Taha', pos: 'DEF', club: 'Al Jazeera', rating: 64, form: 63 },
    { name: 'Abdallah Abu Laila', pos: 'MID', club: 'Al Wahdat', rating: 65, form: 64 },
    { name: 'Shadi Abu Hashhash', pos: 'GK', club: 'Al Wahdat', rating: 63, form: 62 },
    { name: 'Baha Faisal', pos: 'DEF', club: 'Al Faisaly', rating: 62, form: 61 },
    { name: 'Yazan Al-Naimat', pos: 'FWD', club: 'Al Ramtha', rating: 63, form: 62 },
    { name: 'Ahmad Ibrahim', pos: 'MID', club: 'Al Faisaly', rating: 61, form: 60 },
  ]},
  'Portugal': { coach: 'Roberto Martinez', rating: 85, form: 6.4, last5: ['W','W','W','L','D'], players: [
    { name: 'Bruno Fernandes', pos: 'MID', club: 'Man United', rating: 85, form: 84 },
    { name: 'Rafael Leao', pos: 'FWD', club: 'AC Milan', rating: 84, form: 85 },
    { name: 'Bernardo Silva', pos: 'MID', club: 'Man City', rating: 84, form: 82 },
    { name: 'Ruben Dias', pos: 'DEF', club: 'Man City', rating: 84, form: 82 },
    { name: 'Vitinha', pos: 'MID', club: 'PSG', rating: 83, form: 84 },
    { name: 'Joao Neves', pos: 'MID', club: 'PSG', rating: 82, form: 83 },
    { name: 'Diogo Costa', pos: 'GK', club: 'Porto', rating: 82, form: 80 },
    { name: 'Cristiano Ronaldo', pos: 'FWD', club: 'Al Nassr', rating: 82, form: 78 },
  ]},
  'Colombia': { coach: 'Nestor Lorenzo', rating: 75, form: 5.8, last5: ['W','W','W','L','L'], players: [
    { name: 'Luis Diaz', pos: 'FWD', club: 'Bayern Munich', rating: 86, form: 87 },
    { name: 'Jhon Duran', pos: 'FWD', club: 'Zenit St. Petersburg', rating: 78, form: 72 },
    { name: 'Richard Rios', pos: 'MID', club: 'Flamengo', rating: 77, form: 76 },
    { name: 'Luis Sinisterra', pos: 'FWD', club: 'Bournemouth', rating: 76, form: 75 },
    { name: 'Davinson Sanchez', pos: 'DEF', club: 'Galatasaray', rating: 76, form: 74 },
    { name: 'Camilo Vargas', pos: 'GK', club: 'Atletico Nacional', rating: 74, form: 73 },
    { name: 'James Rodriguez', pos: 'MID', club: 'Rayo Vallecano', rating: 74, form: 70 },
    { name: 'Rafael Santos Borre', pos: 'FWD', club: 'Eintracht', rating: 73, form: 72 },
  ]},
  'DR Congo': { coach: 'Sebastien Desabre', rating: 55, form: 5.4, last5: ['W','W','L','D','W'], players: [
    { name: 'Yoane Wissa', pos: 'FWD', club: 'Brentford', rating: 75, form: 74 },
    { name: 'Aaron Wan-Bissaka', pos: 'DEF', club: 'West Ham', rating: 74, form: 73 },
    { name: 'Chancel Mbemba', pos: 'DEF', club: 'Marseille', rating: 72, form: 71 },
    { name: 'Axel Tuanzebe', pos: 'DEF', club: 'Napoli', rating: 71, form: 70 },
    { name: 'Chadrac Akolo', pos: 'FWD', club: 'Augsburg', rating: 68, form: 67 },
    { name: 'Elia Meschack', pos: 'FWD', club: 'Sheriff Tiraspol', rating: 67, form: 66 },
    { name: 'Mosambwa Gasekwa', pos: 'GK', club: 'AS V. Club', rating: 65, form: 64 },
    { name: 'Merveille Bope', pos: 'MID', club: 'FC Nantes', rating: 66, form: 65 },
  ]},
  'Uzbekistan': { coach: 'Fabio Cannavaro', rating: 50, form: 5.2, last5: ['L','W','W','W','D'], players: [
    { name: 'Abdukodir Khusanov', pos: 'DEF', club: 'Man City', rating: 78, form: 77 },
    { name: 'Eldor Shomurodov', pos: 'FWD', club: 'Roma', rating: 73, form: 71 },
    { name: 'Jaloliddin Masharipov', pos: 'MID', club: 'Pakhtakor', rating: 70, form: 69 },
    { name: 'Otabek Shukurov', pos: 'MID', club: 'Pakhtakor', rating: 68, form: 67 },
    { name: 'Khurshid Makhmudov', pos: 'GK', club: 'Pakhtakor', rating: 66, form: 65 },
    { name: 'Egor Krimets', pos: 'DEF', club: 'Pakhtakor', rating: 65, form: 64 },
    { name: 'Bobur Abdikholikov', pos: 'FWD', club: 'Pakhtakor', rating: 64, form: 65 },
    { name: 'Davron Tursunov', pos: 'MID', club: 'Pakhtakor', rating: 63, form: 62 },
  ]},
  'England': { coach: 'Thomas Tuchel', rating: 84, form: 6.4, last5: ['W','W','W','D','L'], players: [
    { name: 'Jude Bellingham', pos: 'MID', club: 'Real Madrid', rating: 90, form: 88 },
    { name: 'Harry Kane', pos: 'FWD', club: 'Bayern Munich', rating: 88, form: 84 },
    { name: 'Bukayo Saka', pos: 'FWD', club: 'Arsenal', rating: 87, form: 86 },
    { name: 'Cole Palmer', pos: 'MID', club: 'Chelsea', rating: 86, form: 87 },
    { name: 'Declan Rice', pos: 'MID', club: 'Arsenal', rating: 84, form: 83 },
    { name: 'Phil Foden', pos: 'MID', club: 'Man City', rating: 84, form: 80 },
    { name: 'John Stones', pos: 'DEF', club: 'Man City', rating: 80, form: 78 },
    { name: 'Jordan Pickford', pos: 'GK', club: 'Everton', rating: 80, form: 78 },
  ]},
  'Croatia': { coach: 'Zlatko Dalic', rating: 73, form: 6.4, last5: ['W','W','W','W','L'], players: [
    { name: 'Josko Gvardiol', pos: 'DEF', club: 'Man City', rating: 85, form: 84 },
    { name: 'Luka Modric', pos: 'MID', club: 'Real Madrid', rating: 82, form: 78 },
    { name: 'Dominik Livakovic', pos: 'GK', club: 'Fenerbahce', rating: 80, form: 78 },
    { name: 'Lovro Majer', pos: 'MID', club: 'Real Madrid', rating: 76, form: 75 },
    { name: 'Andrej Kramaric', pos: 'FWD', club: 'Hoffenheim', rating: 76, form: 75 },
    { name: 'Marcelo Brozovic', pos: 'MID', club: 'Al Nassr', rating: 76, form: 72 },
    { name: 'Ivan Perisic', pos: 'FWD', club: 'Hajduk Split', rating: 74, form: 70 },
    { name: 'Dejan Lovren', pos: 'DEF', club: 'Zenit', rating: 72, form: 68 },
  ]},
  'Ghana': { coach: 'TBD', rating: 58, form: 4.2, last5: ['W','W','L','L','L'], players: [
    { name: 'Mohammed Kudus', pos: 'FWD', club: 'West Ham', rating: 83, form: 82 },
    { name: 'Antoine Semenyo', pos: 'FWD', club: 'Bournemouth', rating: 80, form: 79 },
    { name: 'Thomas Partey', pos: 'MID', club: 'Arsenal', rating: 78, form: 74 },
    { name: 'Tariq Lamptey', pos: 'DEF', club: 'Brighton', rating: 73, form: 72 },
    { name: 'Kamaldeen Sulemana', pos: 'FWD', club: 'Rennes', rating: 73, form: 72 },
    { name: 'Jordan Ayew', pos: 'FWD', club: 'Leicester', rating: 72, form: 71 },
    { name: 'Lawrence Ati-Zigi', pos: 'GK', club: 'St. Gallen', rating: 72, form: 71 },
    { name: 'Daniel Amartey', pos: 'DEF', club: 'Besiktas', rating: 70, form: 69 },
  ]},
  'Panama': { coach: 'Thomas Christiansen', rating: 42, form: 4.8, last5: ['W','W','D','L','D'], players: [
    { name: 'Amir Murillo', pos: 'DEF', club: 'Anderlecht', rating: 70, form: 69 },
    { name: 'Adalberto Carrasquilla', pos: 'MID', club: 'Houston Dynamo', rating: 68, form: 67 },
    { name: 'Anibal Godoy', pos: 'MID', club: 'Nashville SC', rating: 66, form: 64 },
    { name: 'Ismael Diaz', pos: 'FWD', club: 'Al Qadsiah', rating: 66, form: 65 },
    { name: 'Jose Fajardo', pos: 'FWD', club: 'FC Dallas', rating: 64, form: 63 },
    { name: 'Harold Cummings', pos: 'DEF', club: 'Sporting KC', rating: 64, form: 63 },
    { name: 'Luis Mejia', pos: 'GK', club: 'Independiente', rating: 63, form: 62 },
    { name: 'Alberto Quintero', pos: 'FWD', club: 'Olimpia', rating: 62, form: 61 },
  ]},
};

// ── Group Stage Data ──────────────────────────────────────────────────────────
const GROUPS = [
  { name: 'A', teams: [
    { team: 'Mexico', pts: 7, advance: true },
    { team: 'South Korea', pts: 7, advance: true },
    { team: 'Czech Republic', pts: 3, advance: false },
    { team: 'South Africa', pts: 0, advance: false },
  ], fixtures: [
    { home: 'Mexico', score: '2-0', away: 'South Africa', date: 'Jun 11' },
    { home: 'South Korea', score: '2-1', away: 'Czech Republic', date: 'Jun 11' },
    { home: 'Czech Republic', score: '1-0', away: 'South Africa', date: 'Jun 18' },
    { home: 'Mexico', score: '1-1', away: 'South Korea', date: 'Jun 18' },
    { home: 'Czech Republic', score: '1-2', away: 'Mexico', date: 'Jun 24' },
    { home: 'South Africa', score: '1-3', away: 'South Korea', date: 'Jun 24' },
  ]},
  { name: 'B', teams: [
    { team: 'Switzerland', pts: 7, advance: true },
    { team: 'Canada', pts: 7, advance: true },
    { team: 'Bosnia & Herz.', pts: 3, advance: false },
    { team: 'Qatar', pts: 0, advance: false },
  ], fixtures: [
    { home: 'Canada', score: '1-0', away: 'Bosnia & Herz.', date: 'Jun 12' },
    { home: 'Qatar', score: '0-3', away: 'Switzerland', date: 'Jun 13' },
    { home: 'Switzerland', score: '2-1', away: 'Bosnia & Herz.', date: 'Jun 18' },
    { home: 'Canada', score: '2-0', away: 'Qatar', date: 'Jun 18' },
    { home: 'Switzerland', score: '1-1', away: 'Canada', date: 'Jun 24' },
    { home: 'Bosnia & Herz.', score: '2-0', away: 'Qatar', date: 'Jun 24' },
  ]},
  { name: 'C', teams: [
    { team: 'Brazil', pts: 7, advance: true },
    { team: 'Morocco', pts: 7, advance: true },
    { team: 'Scotland', pts: 3, advance: false },
    { team: 'Haiti', pts: 0, advance: false },
  ], fixtures: [
    { home: 'Brazil', score: '1-1', away: 'Morocco', date: 'Jun 13' },
    { home: 'Haiti', score: '0-2', away: 'Scotland', date: 'Jun 13' },
    { home: 'Scotland', score: '1-2', away: 'Morocco', date: 'Jun 19' },
    { home: 'Brazil', score: '4-0', away: 'Haiti', date: 'Jun 19' },
    { home: 'Scotland', score: '0-2', away: 'Brazil', date: 'Jun 24' },
    { home: 'Morocco', score: '3-0', away: 'Haiti', date: 'Jun 24' },
  ]},
  { name: 'D', teams: [
    { team: 'USA', pts: 7, advance: true },
    { team: 'Turkey', pts: 5, advance: true },
    { team: 'Paraguay', pts: 2, advance: false },
    { team: 'Australia', pts: 1, advance: false },
  ], fixtures: [
    { home: 'USA', score: '2-0', away: 'Paraguay', date: 'Jun 12' },
    { home: 'Australia', score: '1-2', away: 'Turkey', date: 'Jun 13' },
    { home: 'USA', score: '1-0', away: 'Australia', date: 'Jun 19' },
    { home: 'Turkey', score: '1-1', away: 'Paraguay', date: 'Jun 19' },
    { home: 'Turkey', score: '1-1', away: 'USA', date: 'Jun 25' },
    { home: 'Paraguay', score: '0-0', away: 'Australia', date: 'Jun 25' },
  ]},
  { name: 'E', teams: [
    { team: 'Germany', pts: 7, advance: true },
    { team: 'Ecuador', pts: 5, advance: true },
    { team: 'Ivory Coast', pts: 4, advance: false },
    { team: 'Curacao', pts: 0, advance: false },
  ], fixtures: [
    { home: 'Germany', score: '5-0', away: 'Curacao', date: 'Jun 14' },
    { home: 'Ivory Coast', score: '1-1', away: 'Ecuador', date: 'Jun 14' },
    { home: 'Germany', score: '2-0', away: 'Ivory Coast', date: 'Jun 20' },
    { home: 'Ecuador', score: '3-0', away: 'Curacao', date: 'Jun 20' },
    { home: 'Curacao', score: '0-2', away: 'Ivory Coast', date: 'Jun 25' },
    { home: 'Ecuador', score: '1-1', away: 'Germany', date: 'Jun 25' },
  ]},
  { name: 'F', teams: [
    { team: 'Netherlands', pts: 7, advance: true },
    { team: 'Japan', pts: 5, advance: true },
    { team: 'Sweden', pts: 4, advance: false },
    { team: 'Tunisia', pts: 0, advance: false },
  ], fixtures: [
    { home: 'Netherlands', score: '2-2', away: 'Japan', date: 'Jun 14' },
    { home: 'Sweden', score: '2-1', away: 'Tunisia', date: 'Jun 14' },
    { home: 'Netherlands', score: '2-0', away: 'Sweden', date: 'Jun 20' },
    { home: 'Tunisia', score: '0-1', away: 'Japan', date: 'Jun 20' },
    { home: 'Japan', score: '1-1', away: 'Sweden', date: 'Jun 25' },
    { home: 'Tunisia', score: '0-2', away: 'Netherlands', date: 'Jun 25' },
  ]},
  { name: 'G', teams: [
    { team: 'Belgium', pts: 7, advance: true },
    { team: 'Egypt', pts: 7, advance: true },
    { team: 'Iran', pts: 3, advance: false },
    { team: 'New Zealand', pts: 0, advance: false },
  ], fixtures: [
    { home: 'Belgium', score: '1-1', away: 'Egypt', date: 'Jun 15' },
    { home: 'Iran', score: '2-0', away: 'New Zealand', date: 'Jun 15' },
    { home: 'Belgium', score: '3-1', away: 'Iran', date: 'Jun 21' },
    { home: 'New Zealand', score: '0-2', away: 'Egypt', date: 'Jun 21' },
    { home: 'Egypt', score: '1-0', away: 'Iran', date: 'Jun 26' },
    { home: 'New Zealand', score: '0-3', away: 'Belgium', date: 'Jun 26' },
  ]},
  { name: 'H', teams: [
    { team: 'Spain', pts: 9, advance: true },
    { team: 'Uruguay', pts: 6, advance: true },
    { team: 'Saudi Arabia', pts: 1, advance: false },
    { team: 'Cape Verde', pts: 1, advance: false },
  ], fixtures: [
    { home: 'Spain', score: '4-0', away: 'Cape Verde', date: 'Jun 15' },
    { home: 'Saudi Arabia', score: '0-2', away: 'Uruguay', date: 'Jun 15' },
    { home: 'Spain', score: '3-0', away: 'Saudi Arabia', date: 'Jun 21' },
    { home: 'Uruguay', score: '2-0', away: 'Cape Verde', date: 'Jun 21' },
    { home: 'Cape Verde', score: '1-1', away: 'Saudi Arabia', date: 'Jun 26' },
    { home: 'Uruguay', score: '1-2', away: 'Spain', date: 'Jun 26' },
  ]},
  { name: 'I', teams: [
    { team: 'France', pts: 9, advance: true },
    { team: 'Norway', pts: 4, advance: true },
    { team: 'Senegal', pts: 4, advance: false },
    { team: 'Iraq', pts: 0, advance: false },
  ], fixtures: [
    { home: 'France', score: '2-1', away: 'Senegal', date: 'Jun 16' },
    { home: 'Iraq', score: '0-3', away: 'Norway', date: 'Jun 16' },
    { home: 'France', score: '4-0', away: 'Iraq', date: 'Jun 22' },
    { home: 'Norway', score: '1-1', away: 'Senegal', date: 'Jun 22' },
    { home: 'Norway', score: '1-2', away: 'France', date: 'Jun 26' },
    { home: 'Senegal', score: '2-0', away: 'Iraq', date: 'Jun 26' },
  ]},
  { name: 'J', teams: [
    { team: 'Argentina', pts: 9, advance: true },
    { team: 'Austria', pts: 4, advance: true },
    { team: 'Algeria', pts: 4, advance: false },
    { team: 'Jordan', pts: 0, advance: false },
  ], fixtures: [
    { home: 'Argentina', score: '3-1', away: 'Algeria', date: 'Jun 16' },
    { home: 'Austria', score: '2-0', away: 'Jordan', date: 'Jun 17' },
    { home: 'Argentina', score: '2-0', away: 'Austria', date: 'Jun 22' },
    { home: 'Jordan', score: '1-2', away: 'Algeria', date: 'Jun 22' },
    { home: 'Jordan', score: '0-3', away: 'Argentina', date: 'Jun 27' },
    { home: 'Algeria', score: '1-1', away: 'Austria', date: 'Jun 27' },
  ]},
  { name: 'K', teams: [
    { team: 'Portugal', pts: 7, advance: true },
    { team: 'Colombia', pts: 7, advance: true },
    { team: 'DR Congo', pts: 1, advance: false },
    { team: 'Uzbekistan', pts: 1, advance: false },
  ], fixtures: [
    { home: 'Portugal', score: '3-0', away: 'DR Congo', date: 'Jun 17' },
    { home: 'Uzbekistan', score: '0-2', away: 'Colombia', date: 'Jun 17' },
    { home: 'Portugal', score: '2-0', away: 'Uzbekistan', date: 'Jun 23' },
    { home: 'Colombia', score: '2-1', away: 'DR Congo', date: 'Jun 23' },
    { home: 'Colombia', score: '1-1', away: 'Portugal', date: 'Jun 27' },
    { home: 'DR Congo', score: '1-1', away: 'Uzbekistan', date: 'Jun 27' },
  ]},
  { name: 'L', teams: [
    { team: 'England', pts: 9, advance: true },
    { team: 'Croatia', pts: 4, advance: true },
    { team: 'Ghana', pts: 4, advance: false },
    { team: 'Panama', pts: 0, advance: false },
  ], fixtures: [
    { home: 'England', score: '2-1', away: 'Croatia', date: 'Jun 17' },
    { home: 'Ghana', score: '2-0', away: 'Panama', date: 'Jun 17' },
    { home: 'England', score: '3-0', away: 'Ghana', date: 'Jun 23' },
    { home: 'Panama', score: '0-2', away: 'Croatia', date: 'Jun 23' },
    { home: 'Panama', score: '0-3', away: 'England', date: 'Jun 27' },
    { home: 'Croatia', score: '1-1', away: 'Ghana', date: 'Jun 27' },
  ]},
];

// ── Winner Odds ────────────────────────────────────────────────────────────────
const ODDS = [
  { team: 'Argentina', prob: 18, analysis: 'Defending champions. Messi farewell tour. Deepest midfield. Five from five in pre-tournament.' },
  { team: 'France', prob: 16, analysis: 'Deepest squad in tournament. Mbappe + Dembele lethal. Two consecutive finals.' },
  { team: 'Spain', prob: 14, analysis: 'FIFA number 1 ranked. Euro 2024 champions. Rodri back from ACL. Yamal and Pedri generational.' },
  { team: 'Germany', prob: 10, analysis: 'Wirtz + Musiala the best creative duo. Five straight qualifying wins. Redemption mission.' },
  { team: 'England', prob: 9, analysis: 'Perfect qualifying (8W, 0 conceded). Bellingham + Kane + Saka elite. Tuchel structure.' },
  { team: 'Portugal', prob: 8, analysis: 'Nations League holders. Bruno + Leao + Vitinha + Neves extraordinary depth.' },
  { team: 'Brazil', prob: 7, analysis: 'Vinicius + Raphinha brilliance. Ancelotti factor. Inconsistent recent form a concern.' },
  { team: 'Netherlands', prob: 4, analysis: 'Van Dijk + De Jong world class. Gakpo + Reijnders emerging. Lack a clinical striker.' },
  { team: 'Norway', prob: 3, analysis: 'Perfect 8-0-0 qualifying. Haaland 16 goals. Odegaard elite. Zero major tournament experience.' },
  { team: 'Colombia', prob: 2, analysis: 'Copa America 2024 finalists. Luis Diaz in peak form. March form collapse raises doubts.' },
  { team: 'Others', prob: 9, analysis: 'Remaining 38 nations including Japan, Turkey, Morocco, Belgium, Ivory Coast and Egypt.' },
];

// ── Bracket State ─────────────────────────────────────────────────────────────
// r32: pairs of [team1, team2], predicted winner
// Each match feeds next round by index: r16[i] gets winner of r32[i*2] and r32[i*2+1]
const PREDICTED_BRACKET = {
  r32: [
    ['Mexico', 'Bosnia & Herz.', 'Mexico'],
    ['Netherlands', 'Scotland', 'Netherlands'],
    ['Germany', 'Ivory Coast', 'Germany'],
    ['Brazil', 'Sweden', 'Brazil'],
    ['France', 'Algeria', 'France'],
    ['Spain', 'Austria', 'Spain'],
    ['Argentina', 'Czech Republic', 'Argentina'],
    ['England', 'Ghana', 'England'],
    ['South Korea', 'Canada', 'South Korea'],
    ['USA', 'Senegal', 'USA'],
    ['Belgium', 'Croatia', 'Belgium'],
    ['Portugal', 'Ecuador', 'Portugal'],
    ['Turkey', 'Egypt', 'Egypt'],
    ['Colombia', 'Norway', 'Norway'],
    ['Morocco', 'Japan', 'Japan'],
    ['Uruguay', 'Switzerland', 'Uruguay'],
  ],
  r16: [
    ['Netherlands', 'Netherlands'],   // r32[0] winner vs r32[1] winner
    ['Germany', 'Germany'],
    ['France', 'France'],
    ['Argentina', 'Argentina'],
    ['USA', 'USA'],
    ['Portugal', 'Portugal'],
    ['Norway', 'Norway'],
    ['Japan', 'Japan'],
  ],
  qf: [
    ['Germany', 'Germany'],   // r16[0] winner vs r16[1] winner
    ['Argentina', 'Argentina'],
    ['Portugal', 'Portugal'],
    ['Norway', 'Norway'],
  ],
  sf: [
    ['Argentina', 'Argentina'],  // qf[0] winner vs qf[1] winner
    ['Portugal', 'Portugal'],
  ],
  final: ['Argentina', 'Portugal', 'Argentina'],
};

// Live state (user modifications)
let bracket;
let groupState = {}; // groupName → Set of advancing team names

function initGroupState() {
  GROUPS.forEach(g => {
    groupState[g.name] = new Set(g.teams.filter(t => t.advance).map(t => t.team));
  });
}

function resetBracket() {
  bracket = JSON.parse(JSON.stringify(PREDICTED_BRACKET));
  initGroupState();
}
resetBracket();

// ── Group Promote Logic ───────────────────────────────────────────────────────
function demoteTeam(groupName, teamToDemote) {
  const group = GROUPS.find(g => g.name === groupName);
  const state = groupState[groupName];
  if (!state.has(teamToDemote)) return;

  // Promote the highest-ranked eliminated team (first in table order)
  const teamToPromote = group.teams.find(t => !state.has(t.team));
  if (!teamToPromote) return;

  state.delete(teamToDemote);
  state.add(teamToPromote.team);

  bracket.r32.forEach((match, idx) => {
    if (match[0] === teamToDemote) {
      bracket.r32[idx][0] = teamToPromote.team;
      if (bracket.r32[idx][2] === teamToDemote) bracket.r32[idx][2] = teamToPromote.team;
    } else if (match[1] === teamToDemote) {
      bracket.r32[idx][1] = teamToPromote.team;
      if (bracket.r32[idx][2] === teamToDemote) bracket.r32[idx][2] = teamToPromote.team;
    }
  });

  clearTeamFromLaterRounds(teamToDemote, teamToPromote.team);
  renderGroups();
  renderBracket();
}

function clearTeamFromLaterRounds(oldTeam, newTeam) {
  bracket.r16.forEach(match => { if (match[1] === oldTeam) match[1] = newTeam; });
  bracket.qf.forEach(match => { if (match[1] === oldTeam) match[1] = newTeam; });
  bracket.sf.forEach(match => { if (match[1] === oldTeam) match[1] = newTeam; });
  if (bracket.final[2] === oldTeam) bracket.final[2] = newTeam;
}

function promoteTeam(groupName, teamToPromote) {
  const group = GROUPS.find(g => g.name === groupName);
  const state = groupState[groupName];
  if (state.has(teamToPromote)) return;

  // Auto-demote the current 2nd-place advancing team
  const advancingInOrder = group.teams.filter(t => state.has(t.team));
  const teamToDemote = advancingInOrder[advancingInOrder.length - 1].team;

  state.delete(teamToDemote);
  state.add(teamToPromote);

  // Swap demoted team out of r32 bracket
  bracket.r32.forEach((match, idx) => {
    if (match[0] === teamToDemote) {
      bracket.r32[idx][0] = teamToPromote;
      if (bracket.r32[idx][2] === teamToDemote) bracket.r32[idx][2] = teamToPromote;
    } else if (match[1] === teamToDemote) {
      bracket.r32[idx][1] = teamToPromote;
      if (bracket.r32[idx][2] === teamToDemote) bracket.r32[idx][2] = teamToPromote;
    }
  });

  clearTeamFromLaterRounds(teamToDemote, teamToPromote);
  renderGroups();
  renderBracket();
}

// ── Bracket Logic ─────────────────────────────────────────────────────────────
function getR16Teams(i) {
  return [bracket.r32[i * 2][2], bracket.r32[i * 2 + 1][2]];
}
function getQFTeams(i) {
  const [t1] = [bracket.r16[i * 2][1]];
  const [t2] = [bracket.r16[i * 2 + 1][1]];
  return [t1, t2];
}
function getSFTeams(i) {
  return [bracket.qf[i * 2][1], bracket.qf[i * 2 + 1][1]];
}
function getFinalTeams() {
  return [bracket.sf[0][1], bracket.sf[1][1]];
}

function setWinner(round, idx, winner) {
  const old = bracket[round][idx];
  const oldWinner = Array.isArray(old) ? old[old.length - 1] : old[2];
  if (oldWinner === winner) return;

  // Update this match's winner
  if (round === 'r32') {
    bracket.r32[idx][2] = winner;
    // Propagate to r16
    const r16Idx = Math.floor(idx / 2);
    const [t1, t2] = getR16Teams(r16Idx);
    bracket.r16[r16Idx][0] = t1;
    bracket.r16[r16Idx][1] = t1; // default winner to t1 slot — but check cascade
    // If old r16 winner was oldWinner, cascade
    cascadeR16(r16Idx, oldWinner, winner === t1 ? t1 : t2);
  } else if (round === 'r16') {
    bracket.r16[idx][1] = winner;
    const qfIdx = Math.floor(idx / 2);
    cascadeQF(qfIdx, bracket.qf[qfIdx][1] === oldWinner ? winner : bracket.qf[qfIdx][1]);
  } else if (round === 'qf') {
    bracket.qf[idx][1] = winner;
    const sfIdx = Math.floor(idx / 2);
    cascadeSF(sfIdx, bracket.sf[sfIdx][1] === oldWinner ? winner : bracket.sf[sfIdx][1]);
  } else if (round === 'sf') {
    bracket.sf[idx][1] = winner;
    cascadeFinal();
  }
}

function cascadeR16(idx, oldWinner, newWinner) {
  const [t1, t2] = getR16Teams(idx);
  bracket.r16[idx][0] = t1;
  // If the r16 winner was the old r32 winner, update it
  if (bracket.r16[idx][1] === oldWinner || !bracket.r16[idx][1]) {
    bracket.r16[idx][1] = newWinner;
  }
  // Now check if this cascades to QF
  const qfIdx = Math.floor(idx / 2);
  const qfOldWinner = bracket.qf[qfIdx][1];
  const [qft1, qft2] = getQFTeams(qfIdx);
  bracket.qf[qfIdx][0] = qft1;
  if (qfOldWinner === oldWinner) {
    bracket.qf[qfIdx][1] = bracket.r16[idx][1];
    cascadeQF(qfIdx, qfOldWinner, bracket.qf[qfIdx][1]);
  }
}

function cascadeQF(idx, winner) {
  bracket.qf[idx][1] = winner;
  const sfIdx = Math.floor(idx / 2);
  const [sft1, sft2] = getSFTeams(sfIdx);
  if (idx % 2 === 0) {
    if (bracket.sf[sfIdx][0] !== sft1) bracket.sf[sfIdx][0] = sft1;
  } else {
    // update the other slot - handled by getSFTeams
  }
  // Cascade if sf winner was from this qf slot
  cascadeSF(sfIdx, bracket.sf[sfIdx][1] !== getSFTeams(sfIdx)[idx % 2] ? getSFTeams(sfIdx)[idx % 2] : bracket.sf[sfIdx][1]);
}

function cascadeSF(idx, winner) {
  bracket.sf[idx][1] = winner;
  cascadeFinal();
}

function cascadeFinal() {
  const [t1, t2] = getFinalTeams();
  bracket.final[0] = t1;
  bracket.final[1] = t2;
  // If the current winner is no longer in the final, default to t1
  if (bracket.final[2] !== t1 && bracket.final[2] !== t2) {
    bracket.final[2] = t1;
  }
}

// ── Rendering ─────────────────────────────────────────────────────────────────
function ratingClass(r) {
  if (r >= 88) return 'world-class';
  if (r >= 80) return 'elite';
  if (r >= 72) return 'good';
  return 'squad';
}

function teamTier(rating) {
  if (rating >= 80) return { cls: 'elite', label: 'ELITE' };
  if (rating >= 65) return { cls: 'good', label: 'GOOD' };
  return { cls: 'squad', label: 'SQUAD' };
}

function renderOdds() {
  const el = document.getElementById('f26-odds-body');
  if (!el) return;
  const maxProb = ODDS[0].prob;
  el.innerHTML = ODDS.map((o, i) => `
    <div class="f26-odds-row">
      <span class="f26-odds-rank">${String(i + 1).padStart(2, '0')}</span>
      <div class="f26-odds-info">
        <span class="f26-odds-team">${o.team}</span>
        <span class="f26-odds-analysis">${o.analysis}</span>
      </div>
      <div class="f26-odds-right">
        <div class="f26-odds-bar-wrap"><div class="f26-odds-bar" style="width:${Math.round((o.prob / maxProb) * 100)}%"></div></div>
        <strong class="f26-odds-pct">${o.prob}%</strong>
      </div>
    </div>
  `).join('');
}

function renderGroups() {
  const el = document.getElementById('f26-groups');
  if (!el) return;
  el.innerHTML = GROUPS.map(g => {
    const state = groupState[g.name];
    const originalAdvancing = new Set(g.teams.filter(t => t.advance).map(t => t.team));
    const isModified = [...state].some(t => !originalAdvancing.has(t));

    let lastAdvanceIdx = -1;
    g.teams.forEach((t, idx) => { if (state.has(t.team)) lastAdvanceIdx = idx; });

    return `
    <div class="f26-group-card">
      <div class="f26-group-header">
        <span class="f26-group-letter">Group ${g.name}</span>
        ${isModified ? '<span class="f26-group-modified">Edited</span>' : ''}
        <span class="f26-group-hint">Click team name for squad</span>
      </div>
      <table class="f26-group-table">
        <thead>
          <tr><th>Pos</th><th>Team</th><th class="f26-th-center">Pts</th><th class="f26-th-right">Status</th></tr>
        </thead>
        <tbody>
          ${g.teams.map((t, idx) => {
            const isAdvancing = state.has(t.team);
            const dividerClass = idx === lastAdvanceIdx ? 'f26-last-advance' : '';
            return `<tr class="${isAdvancing ? 'f26-advance' : 'f26-eliminated'} ${dividerClass}">
              <td class="f26-pos-num">${String(idx + 1).padStart(2, '0')}</td>
              <td><button class="f26-team-btn" data-team="${t.team}">${t.team}</button></td>
              <td class="f26-th-center f26-pts">${t.pts}</td>
              <td class="f26-th-right">${isAdvancing
                ? `<div class="f26-adv-cell">
                     <span class="f26-status-badge f26-status-badge--advance">ADV</span>
                     <button class="f26-demote-btn" data-team="${t.team}" data-group="${g.name}" aria-label="Demote ${t.team}" title="Demote">&#8595;</button>
                   </div>`
                : `<button class="f26-promote-btn" data-team="${t.team}" data-group="${g.name}" aria-label="Promote ${t.team}">&#8593; Promote</button>`
              }</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      <details class="f26-fixtures-details" open>
        <summary class="f26-fixtures-summary">
          <span class="f26-fixtures-label">Fixtures <span class="f26-fixtures-sub">(AI Predictions)</span></span>
          <span class="f26-fixtures-toggle" aria-hidden="true"></span>
        </summary>
        <div class="f26-fixtures">
          ${g.fixtures.map(f => `
            <div class="f26-fixture">
              <span class="f26-fx-home">${f.home}</span>
              <span class="f26-fx-score">${f.score}</span>
              <span class="f26-fx-away">${f.away}</span>
              <span class="f26-fx-date">${f.date}</span>
            </div>
          `).join('')}
        </div>
      </details>
    </div>`;
  }).join('');

  el.querySelectorAll('.f26-team-btn').forEach(btn => {
    btn.addEventListener('click', () => openTeamModal(btn.dataset.team));
  });
  el.querySelectorAll('.f26-promote-btn').forEach(btn => {
    btn.addEventListener('click', () => promoteTeam(btn.dataset.group, btn.dataset.team));
  });
  el.querySelectorAll('.f26-demote-btn').forEach(btn => {
    btn.addEventListener('click', () => demoteTeam(btn.dataset.group, btn.dataset.team));
  });
}

// Bracket slot sizing
// R32 sub-cols: 8 matches each, sequential at SLOT spacing
// R16 onward: compact bracket where R16 is base round (roundIdx=0)
const SLOT = 56;  // px per slot
const COL_H = 8 * SLOT;  // 448px — height for all columns

function matchTop(roundIdx, matchIdx) {
  // roundIdx = -1 → R32 sub-col (sequential, no centering offset)
  // roundIdx = 0  → R16 (base round of compact bracket)
  // roundIdx = 1  → QF, roundIdx = 2 → SF
  if (roundIdx < 0) return matchIdx * SLOT;
  const mult = Math.pow(2, roundIdx);
  return matchIdx * mult * SLOT + (mult - 1) * SLOT / 2;
}

function renderBracket() {
  // R32: split into two sub-columns of 8
  renderRound('f26-r32a', bracket.r32.slice(0, 8), 'r32', -1,
    (i) => ({ t1: bracket.r32[i][0], t2: bracket.r32[i][1], winner: bracket.r32[i][2] }), 0);
  renderRound('f26-r32b', bracket.r32.slice(8, 16), 'r32', -1,
    (i) => ({ t1: bracket.r32[i + 8][0], t2: bracket.r32[i + 8][1], winner: bracket.r32[i + 8][2] }), 8);

  const r16Data = bracket.r16.map((m, i) => {
    const [t1, t2] = getR16Teams(i);
    return { t1, t2, winner: m[1] };
  });
  renderRound('f26-r16', r16Data, 'r16', 0, (i) => r16Data[i]);

  const qfData = bracket.qf.map((m, i) => {
    const [t1, t2] = getQFTeams(i);
    return { t1, t2, winner: m[1] };
  });
  renderRound('f26-qf', qfData, 'qf', 1, (i) => qfData[i]);

  const sfData = bracket.sf.map((m, i) => {
    const [t1, t2] = getSFTeams(i);
    return { t1, t2, winner: m[1] };
  });
  renderRound('f26-sf', sfData, 'sf', 2, (i) => sfData[i]);

  // Final
  const [ft1, ft2] = getFinalTeams();
  const finalEl = document.getElementById('f26-final');
  if (finalEl) {
    finalEl.innerHTML = `
      <div class="f26-final-card">
        <div class="f26-final-meta">
          <span class="f26-final-tag">The Final</span>
          <span class="f26-final-date">Jul 19, 2026 &middot; MetLife Stadium, New Jersey</span>
        </div>
        <div class="f26-final-matchup">
          <button class="f26-final-team ${bracket.final[2] === ft1 ? 'f26-winner' : ''}" data-round="final" data-idx="0" data-team="${ft1}">
            <span class="f26-final-crest">${ft1.substring(0,3).toUpperCase()}</span>
            <span class="f26-final-teamname">${ft1}</span>
            ${bracket.final[2] === ft1 ? '<span class="f26-final-pick-label">AI Pick</span>' : ''}
          </button>
          <div class="f26-final-center">
            <span class="f26-final-vs">VS</span>
            <span class="f26-final-instruction">Click to pick winner</span>
          </div>
          <button class="f26-final-team ${bracket.final[2] === ft2 ? 'f26-winner' : ''}" data-round="final" data-idx="0" data-team="${ft2}">
            <span class="f26-final-crest">${ft2.substring(0,3).toUpperCase()}</span>
            <span class="f26-final-teamname">${ft2}</span>
            ${bracket.final[2] === ft2 ? '<span class="f26-final-pick-label">AI Pick</span>' : ''}
          </button>
        </div>
        <div class="f26-champion-wrap">
          <div class="f26-champion-label">AI Predicted Champion</div>
          <div class="f26-champion">${bracket.final[2]}</div>
        </div>
      </div>
    `;
    finalEl.querySelectorAll('.f26-final-team').forEach(btn => {
      btn.addEventListener('click', () => {
        bracket.final[2] = btn.dataset.team;
        renderBracket();
      });
    });
  }
}

function renderRound(elId, data, round, roundIdx, getData, indexOffset = 0) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.style.height = COL_H + 'px';
  el.innerHTML = data.map((_, i) => {
    const { t1, t2, winner } = getData(i);
    const top = matchTop(roundIdx, i);
    const idx = i + indexOffset;
    return `
      <div class="f26-match" style="top:${top}px">
        <button class="f26-team-pick ${winner === t1 ? 'f26-winner' : ''}" data-round="${round}" data-idx="${idx}" data-team="${t1}">${t1 || '?'}</button>
        <button class="f26-team-pick ${winner === t2 ? 'f26-winner' : ''}" data-round="${round}" data-idx="${idx}" data-team="${t2}">${t2 || '?'}</button>
      </div>
    `;
  }).join('');

  el.querySelectorAll('.f26-team-pick').forEach(btn => {
    btn.addEventListener('click', () => {
      const { round: r, idx, team } = btn.dataset;
      if (r === 'r32') {
        setWinner('r32', +idx, team);
      } else if (r === 'r16') {
        bracket.r16[+idx][1] = team;
        const qfIdx = Math.floor(+idx / 2);
        const [qt1, qt2] = getQFTeams(qfIdx);
        if (bracket.qf[qfIdx][1] !== qt1 && bracket.qf[qfIdx][1] !== qt2) bracket.qf[qfIdx][1] = qt1;
        cascadeFinal();
      } else if (r === 'qf') {
        bracket.qf[+idx][1] = team;
        const sfIdx = Math.floor(+idx / 2);
        const [st1, st2] = getSFTeams(sfIdx);
        if (bracket.sf[sfIdx][1] !== st1 && bracket.sf[sfIdx][1] !== st2) bracket.sf[sfIdx][1] = st1;
        cascadeFinal();
      } else if (r === 'sf') {
        bracket.sf[+idx][1] = team;
        cascadeFinal();
      }
      renderBracket();
    });
  });
}

// ── Team Modal ────────────────────────────────────────────────────────────────
function openTeamModal(teamName) {
  const team = TEAMS[teamName];
  if (!team) return;

  const modal = document.getElementById('f26-team-modal');
  const content = document.getElementById('f26-modal-content');

  const last5Html = team.last5.map(r => `<span class="f26-result f26-result--${r.toLowerCase()}">${r}</span>`).join('');

  content.innerHTML = `
    <div class="f26-modal-header">
      <h2 class="f26-modal-title">${teamName}</h2>
      <div class="f26-modal-meta">
        <span>Coach: ${team.coach}</span>
        <span>Squad Rating: <strong>${team.rating}</strong></span>
        <span>Form: <strong>${team.form}/10</strong></span>
        <span class="f26-last5">Last 5: ${last5Html}</span>
      </div>
    </div>
    <table class="f26-squad-table">
      <thead><tr><th>Player</th><th>Pos</th><th>Club</th><th>Rating</th><th>Form</th></tr></thead>
      <tbody>
        ${team.players.map(p => `
          <tr>
            <td>${p.name}</td>
            <td><span class="f26-pos f26-pos--${p.pos.toLowerCase()}">${p.pos}</span></td>
            <td>${p.club}</td>
            <td><span class="f26-rating f26-rating--${ratingClass(p.rating)}">${p.rating}</span></td>
            <td>${p.form}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p class="f26-modal-note">Ratings 0-100. Green = World Class (88+) | Blue = Elite (80-87) | Amber = Good (72-79) | Red = Squad Player (&lt;72). Form = recent 5-match composite.</p>
  `;

  modal.classList.add('f26-modal--open');
  document.body.style.overflow = 'hidden';
}

function closeTeamModal() {
  document.getElementById('f26-team-modal').classList.remove('f26-modal--open');
  document.body.style.overflow = '';
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderOdds();
  renderGroups();
  renderBracket();

  document.getElementById('f26-modal-close').addEventListener('click', closeTeamModal);
  document.getElementById('f26-modal-overlay').addEventListener('click', closeTeamModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTeamModal(); });

  document.getElementById('f26-reset-btn').addEventListener('click', () => {
    resetBracket();
    renderGroups();
    renderBracket();
  });
});
