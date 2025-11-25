


export interface CelestialBodyData {
  id: string;
  name: string;
  namePL: string;
  description: string;
  descriptionPL: string;
  type: 'star' | 'planet' | 'dwarf' | 'moon' | 'asteroid' | 'comet' | 'interstellar' | 'blackhole';
  radius: number; // Visual scale radius
  distance: number; // Semi-major axis
  color: string; // Material color
  speed: number; // Orbital speed multiplier
  rotationSpeed: number;
  inclination?: number; // Orbit tilt in degrees
  eccentricity?: number; // 0 = circle, < 1 = ellipse
  argumentOfPeriapsis?: number; // Rotation of the ellipse in the orbital plane (degrees)
  moons?: CelestialBodyData[];
  orbitColor?: string;
  ring?: { inner: number; outer: number; color: string; };
  axialTilt?: number; // Obliquity in degrees
}

export const SOLAR_SYSTEM_DATA: CelestialBodyData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    namePL: 'Merkury',
    description: "The closest planet to the Sun and the smallest in the Solar System. Lacking an atmosphere to retain heat, its surface temperatures fluctuate wildly, ranging from 430°C (800°F) during the day to -180°C (-290°F) at night. Its cratered surface resembles Earth's Moon.",
    descriptionPL: "Najbliższa Słońcu i najmniejsza planeta w Układzie Słonecznym. Ze względu na brak atmosfery, temperatury na powierzchni wahają się ekstremalnie: od 430°C w dzień do -180°C w nocy. Jego pocięta kraterami powierzchnia przypomina ziemski Księżyc.",
    type: 'planet',
    radius: 0.8,
    distance: 22, // Pushed out to make room for Sun wobble
    color: '#A5A5A5',
    speed: 4.1,
    rotationSpeed: 0.02,
    inclination: 7.0,
    axialTilt: 0.01,
    eccentricity: 0.205,
    argumentOfPeriapsis: 29,
    orbitColor: '#555',
  },
  {
    id: 'venus',
    name: 'Venus',
    namePL: 'Wenus',
    description: "Often called Earth's twin due to similar size, but with a toxic atmosphere of carbon dioxide and clouds of sulfuric acid. It is the hottest planet in the Solar System due to an extreme greenhouse effect, with surface pressures 90 times greater than Earth's.",
    descriptionPL: "Nazywana bliźniaczką Ziemi ze względu na rozmiar, ale posiada toksyczną atmosferę z dwutlenku węgla i chmury kwasu siarkowego. To najgorętsza planeta w układzie przez ekstremalny efekt cieplarniany, a ciśnienie na powierzchni jest 90 razy wyższe niż na Ziemi.",
    type: 'planet',
    radius: 1.5,
    distance: 32,
    color: '#E3BB76',
    speed: 1.6,
    rotationSpeed: -0.01,
    inclination: 3.4,
    axialTilt: 177.3,
    eccentricity: 0.007,
    argumentOfPeriapsis: 55,
    orbitColor: '#766',
  },
  {
    id: 'earth',
    name: 'Earth',
    namePL: 'Ziemia',
    description: "Our home planet, the only known world to harbor life. It possesses a unique balance of liquid water, plate tectonics, and a protective atmosphere. Roughly 71% of its surface is covered by ocean.",
    descriptionPL: "Nasza planeta, jedyne znane miejsce we Wszechświecie, gdzie istnieje życie. Posiada unikalną równowagę wody w stanie ciekłym, tektonikę płyt i ochronną atmosferę. Około 71% jej powierzchni pokrywają oceany.",
    type: 'planet',
    radius: 1.6,
    distance: 45,
    color: '#22A6B3',
    speed: 1.0,
    rotationSpeed: 0.05,
    inclination: 0,
    axialTilt: 23.44,
    eccentricity: 0.017,
    argumentOfPeriapsis: 114,
    orbitColor: '#357',
    moons: [
      {
        id: 'moon',
        name: 'Moon',
        namePL: 'Księżyc',
        description: "Earth's only natural satellite, formed roughly 4.5 billion years ago, likely from a collision between Earth and a Mars-sized body. It stabilizes Earth's axial tilt and creates the ocean tides.",
        descriptionPL: "Jedyny naturalny satelita Ziemi, powstały ok. 4,5 mld lat temu, prawdopodobnie w wyniku kolizji Ziemi z obiektem wielkości Marsa. Stabilizuje nachylenie osi Ziemi i powoduje pływy morskie.",
        type: 'moon',
        radius: 0.4,
        distance: 4.5,
    color: '#DDDDDD',
    speed: 12.0,
    rotationSpeed: 0.01,
    inclination: 5.1,
    axialTilt: 6.7,
        eccentricity: 0.05
      }
    ]
  },
  {
    id: 'apophis',
    name: 'Apophis',
    namePL: 'Apophis',
    description: "A near-Earth asteroid roughly 340 meters wide. It gained fame for a predicted close approach in 2029, where it will pass closer to Earth than geosynchronous satellites, visible to the naked eye.",
    descriptionPL: "Planetoida bliska Ziemi o średnicy ok. 340 metrów. Zyskała sławę dzięki przewidywanemu bliskiemu przelotowi w 2029 roku, kiedy minie Ziemię bliżej niż satelity geostacjonarne i będzie widoczna gołym okiem.",
    type: 'asteroid',
    radius: 0.2,
    distance: 38, // Near Earth
    color: '#555555',
    speed: 1.1,
    rotationSpeed: 0.1,
    inclination: 3.3,
    eccentricity: 0.19,
    argumentOfPeriapsis: 126,
    orbitColor: '#333',
  },
  {
    id: 'bennu',
    name: 'Bennu',
    namePL: 'Bennu',
    description: "A carbon-rich 'rubble pile' asteroid. It is considered a time capsule from the early Solar System. The OSIRIS-REx mission successfully collected samples from its surface and returned them to Earth.",
    descriptionPL: "Bogata w węgiel asteroida typu 'sterta gruzu'. Uważana za kapsułę czasu z początków Układu Słonecznego. Misja OSIRIS-REx z powodzeniem pobrała próbki z jej powierzchni i dostarczyła je na Ziemię.",
    type: 'asteroid',
    radius: 0.2,
    distance: 48, // Near Earth
    color: '#333333',
    speed: 0.9,
    rotationSpeed: 0.1,
    inclination: 6.0,
    eccentricity: 0.2,
    argumentOfPeriapsis: 66,
    orbitColor: '#333',
  },
  {
    id: 'mars',
    name: 'Mars',
    namePL: 'Mars',
    description: "The Red Planet, colored by iron oxide (rust) dust. It hosts Olympus Mons, the largest volcano in the solar system, and Valles Marineris, a canyon system that dwarfs the Grand Canyon. It once had liquid water on its surface.",
    descriptionPL: "Czerwona Planeta, zawdzięczająca barwę pyłowi tlenku żelaza (rdzy). Znajduje się tu Olympus Mons, największy wulkan w układzie, oraz Valles Marineris, kanion znacznie większy od Wielkiego Kanionu. Kiedyś na jej powierzchni płynęła woda.",
    type: 'planet',
    radius: 1.1,
    distance: 60,
    color: '#EB4D4B',
    speed: 0.53,
    rotationSpeed: 0.04,
    inclination: 1.85,
    axialTilt: 25.2,
    eccentricity: 0.094,
    argumentOfPeriapsis: 286,
    orbitColor: '#733',
    moons: [
      {
        id: 'phobos',
        name: 'Phobos',
        namePL: 'Fobos',
        description: "The larger and inner of Mars's two moons. It orbits so close to the planet that it rises in the west and sets in the east twice a day. It is slowly spiraling inward.",
        descriptionPL: "Większy i bliższy z dwóch księżyców Marsa. Krąży tak blisko planety, że wschodzi na zachodzie i zachodzi na wschodzie dwa razy dziennie. Powoli opada ku powierzchni Marsa.",
        type: 'moon',
        radius: 0.15, // Visual scale min
        distance: 1.8,
        color: '#8e7c75',
        speed: 15,
        rotationSpeed: 0.05
      },
      {
        id: 'deimos',
        name: 'Deimos',
        namePL: 'Deimos',
        description: "The smaller outer moon of Mars. It is likely a captured asteroid. Its orbit is slowly getting larger, drifting away from Mars.",
        descriptionPL: "Mniejszy, zewnętrzny księżyc Marsa. Prawdopodobnie jest przechwyconą asteroidą. Jego orbita powoli się powiększa, oddalając go od Marsa.",
        type: 'moon',
        radius: 0.12, // Visual scale min
        distance: 2.8,
        color: '#a89f91',
        speed: 10,
        rotationSpeed: 0.05
      }
    ]
  },
  // Asteroid Belt Objects
  {
    id: 'vesta',
    name: 'Vesta',
    namePL: 'Westa',
    description: "The second-largest object in the asteroid belt. It is differentiated like a planet, with a crust, mantle, and core. A massive impact crater at its south pole ejected material found as meteorites on Earth.",
    descriptionPL: "Drugi co do wielkości obiekt w pasie planetoid. Ma budowę podobną do planet (skorupa, płaszcz, jądro). Ogromny krater na biegunie południowym wyrzucił materiał, który znajdujemy na Ziemi jako meteoryty.",
    type: 'asteroid',
    radius: 0.4,
    distance: 72,
    color: '#DCDCDC',
    speed: 0.45,
    rotationSpeed: 0.08,
    inclination: 7.1,
    axialTilt: 29.0,
    eccentricity: 0.089,
    orbitColor: '#444',
  },
  {
    id: 'pallas',
    name: 'Pallas',
    namePL: 'Pallas',
    description: "The third-largest asteroid, comprising about 7% of the belt's mass. Its orbit is highly inclined (tilted) relative to the plane of the planets, making it difficult for spacecraft to reach.",
    descriptionPL: "Trzecia największa asteroida, stanowiąca ok. 7% masy pasa. Jej orbita jest bardzo silnie nachylona względem płaszczyzny planet, co czyni ją trudnym celem dla sond kosmicznych.",
    type: 'asteroid',
    radius: 0.4,
    distance: 76,
    color: '#708090',
    speed: 0.44,
    rotationSpeed: 0.08,
    inclination: 34.8, // Very High
    axialTilt: 30,
    eccentricity: 0.23,
    argumentOfPeriapsis: 310,
    orbitColor: '#444',
  },
  {
    id: 'hygiea',
    name: 'Hygiea',
    namePL: 'Hygiea',
    description: "The fourth-largest asteroid, dark and rich in carbon. Despite its size, it was discovered late due to its dark surface. It is nearly spherical and could potentially be classified as a dwarf planet in the future.",
    descriptionPL: "Czwarta co do wielkości asteroida, ciemna i bogata w węgiel. Odkryta późno z powodu niskiej jasności. Jest niemal kulista i w przyszłości może zostać sklasyfikowana jako planeta karłowata.",
    type: 'asteroid',
    radius: 0.35,
    distance: 78,
    color: '#2F2F2F',
    speed: 0.43,
    rotationSpeed: 0.09,
    inclination: 3.8,
    axialTilt: 3,
    eccentricity: 0.11,
    orbitColor: '#333',
  },
  {
    id: 'ceres',
    name: 'Ceres',
    namePL: 'Ceres',
    description: "The largest object in the asteroid belt and the only dwarf planet in the inner Solar System. It makes up a third of the belt's mass and shows signs of active cryovolcanoes and potential subsurface water.",
    descriptionPL: "Największy obiekt w pasie planetoid i jedyna planeta karłowata w wewnętrznym Układzie. Stanowi 1/3 masy pasa. Wykazuje oznaki kriowulkanizmu i potencjalnie posiada podpowierzchniową wodę.",
    type: 'dwarf',
    radius: 0.5,
    distance: 80,
    color: '#999999',
    speed: 0.4,
    rotationSpeed: 0.05,
    inclination: 10.6,
    axialTilt: 4,
    eccentricity: 0.076,
    argumentOfPeriapsis: 73,
    orbitColor: '#555',
  },
  {
    id: 'halley',
    name: "Halley's Comet",
    namePL: 'Kometa Halleya',
    description: "A periodic comet visible from Earth every 75-76 years. It is the only naked-eye comet that can appear twice in a human lifetime. Its surface is covered in dark, carbon-rich dust.",
    descriptionPL: "Kometa okresowa widoczna z Ziemi co 75-76 lat. To jedyna kometa widoczna gołym okiem, która może pojawić się dwukrotnie w ciągu ludzkiego życia. Jej powierzchnia pokryta jest ciemnym pyłem węglowym.",
    type: 'comet',
    radius: 0.25,
    distance: 90, // Average/Visual position
    color: '#AEEEEE',
    speed: 0.2, // Highly variable in reality
    rotationSpeed: 0.1,
    inclination: 162.3, // Retrograde
    axialTilt: 0,
    eccentricity: 0.967, // EXTREME ELLIPSE
    argumentOfPeriapsis: 111,
    orbitColor: '#87CEFA',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    namePL: 'Jowisz',
    description: "The King of Planets, a gas giant more massive than all other planets combined. Famous for its Great Red Spot, a storm raging for centuries. It acts as a 'vacuum cleaner', protecting Earth from some asteroid impacts.",
    descriptionPL: "Król Planet, gazowy olbrzym masywniejszy niż wszystkie inne planety razem wzięte. Słynie z Wielkiej Czerwonej Plamy, burzy trwającej od stuleci. Działa jak 'odkurzacz', chroniąc Ziemię przed częścią asteroid.",
    type: 'planet',
    radius: 4.5,
    distance: 110,
    color: '#F9CA24',
    speed: 0.08,
    rotationSpeed: 0.1,
    inclination: 1.3,
    axialTilt: 3.1,
    eccentricity: 0.048,
    argumentOfPeriapsis: 273,
    orbitColor: '#652',
    moons: [
      { 
        id: 'io', 
        name: 'Io', 
        namePL: 'Io', 
        description: "The most geologically active body in the Solar System, with over 400 active volcanoes. Its surface is constantly reshaped by sulfur lava due to tidal heating from Jupiter.", 
        descriptionPL: "Najbardziej aktywny geologicznie obiekt w Układzie, z ponad 400 wulkanami. Jego powierzchnia jest stale odnawiana przez lawę siarkową z powodu pływowego rozgrzewania przez Jowisza.", 
        type: 'moon', 
        radius: 0.5, 
        distance: 6, 
    color: '#F8C291', 
    speed: 8, 
        rotationSpeed: 0.01,
        axialTilt: 0
      },
      { 
        id: 'europa', 
        name: 'Europa', 
        namePL: 'Europa', 
        description: "Covered in a shell of water ice, Europa likely harbors a subsurface ocean. It is a prime candidate for finding extraterrestrial life.", 
        descriptionPL: "Pokryta skorupą lodu wodnego, prawdopodobnie ukrywa podpowierzchniowy ocean. Główny kandydat do poszukiwania życia pozaziemskiego.", 
        type: 'moon', 
        radius: 0.45, 
        distance: 7.5, 
    color: '#DFF9FB', 
    speed: 6, 
        rotationSpeed: 0.01,
        axialTilt: 0
      },
      { 
        id: 'ganymede', 
        name: 'Ganymede', 
        namePL: 'Ganimedes', 
        description: "The largest moon in the Solar System, larger even than planet Mercury. It is the only moon known to generate its own magnetic field.", 
        descriptionPL: "Największy księżyc w Układzie Słonecznym, większy nawet od planety Merkury. To jedyny księżyc generujący własne pole magnetyczne.", 
        type: 'moon', 
        radius: 0.6, 
        distance: 9.5, 
    color: '#95A5A6', 
    speed: 4, 
        rotationSpeed: 0.01,
        axialTilt: 0
      },
      { 
        id: 'callisto', 
        name: 'Callisto', 
        namePL: 'Kallisto', 
        description: "Its heavily cratered surface is incredibly old and has remained unchanged for billions of years.", 
        descriptionPL: "Jego mocno pokraterowana powierzchnia jest niezwykle stara i nie zmieniła się od miliardów lat.", 
        type: 'moon', 
        radius: 0.58, 
        distance: 11.5, 
    color: '#5D4C46', 
    speed: 3, 
        rotationSpeed: 0.01,
        axialTilt: 0
      },
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    namePL: 'Saturn',
    description: "A gas giant distinguished by its spectacular ring system, composed of billions of ice and rock particles. It is the least dense planet; it would float if placed in a large enough bathtub.",
    descriptionPL: "Gazowy olbrzym wyróżniający się spektakularnym systemem pierścieni, złożonym z miliardów cząstek lodu i skał. Ma najmniejszą gęstość ze wszystkich planet; unosiłby się na wodzie w odpowiednio dużej wannie.",
    type: 'planet',
    radius: 3.8,
    distance: 145,
    color: '#F0DF90',
    speed: 0.03,
    rotationSpeed: 0.09,
    inclination: 2.48,
    axialTilt: 26.7,
    eccentricity: 0.056,
    argumentOfPeriapsis: 339,
    orbitColor: '#654',
    ring: { inner: 4.5, outer: 7.5, color: '#C0A080' },
    moons: [
      { 
        id: 'titan', 
        name: 'Titan', 
        namePL: 'Tytan', 
        description: "The second largest moon in the system and the only one with a thick nitrogen atmosphere. It has rivers, lakes, and seas of liquid methane and ethane.", 
        descriptionPL: "Drugi największy księżyc i jedyny z gęstą atmosferą azotową. Posiada rzeki, jeziora i morza płynnego metanu i etanu.", 
        type: 'moon', 
        radius: 0.7, 
        distance: 10, 
    color: '#F39C12', 
    speed: 3, 
        rotationSpeed: 0.01,
        axialTilt: 0
      },
      { 
        id: 'enceladus', 
        name: 'Enceladus', 
        namePL: 'Enceladus', 
        description: "An icy moon that ejects distinct plumes of water vapor and ice from 'tiger stripe' fissures at its south pole.", 
        descriptionPL: "Lodowy księżyc wyrzucający pióropusze pary wodnej i lodu ze szczelin na biegunie południowym.", 
        type: 'moon', 
        radius: 0.3, 
        distance: 6, 
    color: '#FFFFFF', 
    speed: 5, 
        rotationSpeed: 0.01,
        axialTilt: 0
      },
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    namePL: 'Uran',
    description: "An ice giant with a unique tilt: it rotates on its side, likely due to a massive collision. Its pale blue color comes from methane in its cold atmosphere. It has faint rings.",
    descriptionPL: "Lodowy olbrzym o unikalnym nachyleniu: toczy się na boku, prawdopodobnie po potężnej kolizji. Bladoniebieski kolor pochodzi od metanu w zimnej atmosferze. Posiada słabe pierścienie.",
    type: 'planet',
    radius: 2.5,
    distance: 180,
    color: '#7ED6DF',
    speed: 0.01,
    rotationSpeed: 0.06,
    inclination: 0.77,
    axialTilt: 97.8,
    eccentricity: 0.046,
    argumentOfPeriapsis: 96,
    orbitColor: '#256',
    moons: [
       { id: 'miranda', name: 'Miranda', namePL: 'Miranda', description: "Features a strange, jigsaw-puzzle landscape.", descriptionPL: "Posiada dziwny krajobraz przypominający puzzle.", type: 'moon', radius: 0.2, distance: 3.5, color: '#E0E0E0', speed: 6, rotationSpeed: 0.02, axialTilt: 0 },
       { id: 'ariel', name: 'Ariel', namePL: 'Ariel', description: "Likely has the youngest surface of Uranus' moons.", descriptionPL: "Prawdopodobnie ma najmłodszą powierzchnię wśród księżyców Urana.", type: 'moon', radius: 0.3, distance: 4.5, color: '#D3D3D3', speed: 5, rotationSpeed: 0.02, axialTilt: 0 },
       { id: 'umbriel', name: 'Umbriel', namePL: 'Umbriel', description: "A dark, mysterious moon.", descriptionPL: "Ciemny, tajemniczy księżyc.", type: 'moon', radius: 0.3, distance: 5.5, color: '#A9A9A9', speed: 4.5, rotationSpeed: 0.02, axialTilt: 0 },
       { id: 'titania', name: 'Titania', namePL: 'Tytania', description: "The largest moon of Uranus.", descriptionPL: "Największy księżyc Urana.", type: 'moon', radius: 0.4, distance: 7.0, color: '#C0C0C0', speed: 3.5, rotationSpeed: 0.02, axialTilt: 0 },
       { id: 'oberon', name: 'Oberon', namePL: 'Oberon', description: "The outermost major moon, heavily cratered.", descriptionPL: "Najdalszy główny księżyc, mocno pokraterowany.", type: 'moon', radius: 0.38, distance: 8.5, color: '#B0B0B0', speed: 3, rotationSpeed: 0.02, axialTilt: 0 },
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    namePL: 'Neptun',
    description: "The most distant major planet, a dark, cold, and windy ice giant. Supersonic winds whip clouds of frozen methane across the planet. It was the first planet predicted by mathematics before being seen.",
    descriptionPL: "Najdalsza planeta, ciemny, zimny i wietrzny lodowy olbrzym. Naddźwiękowe wiatry gonią chmury zamarzniętego metanu. Pierwsza planeta odkryta dzięki matematyce, zanim została zaobserwowana.",
    type: 'planet',
    radius: 2.4,
    distance: 215,
    color: '#30336B',
    speed: 0.006,
    rotationSpeed: 0.06,
    inclination: 1.77,
    axialTilt: 28.3,
    eccentricity: 0.01,
    argumentOfPeriapsis: 273,
    orbitColor: '#225',
    moons: [
      { 
        id: 'triton', 
        name: 'Triton', 
        namePL: 'Tryton', 
        description: "The only large moon in the Solar System that orbits in the opposite direction to its planet's rotation. It is likely a captured Kuiper Belt Object.", 
        descriptionPL: "Jedyny duży księżyc w Układzie Słonecznym, który orbituje w kierunku przeciwnym do obrotu swojej planety. Prawdopodobnie jest przechwyconym obiektem z Pasa Kuipera.", 
        type: 'moon', 
        radius: 0.5, 
        distance: 5, 
        color: '#ECF0F1', 
        speed: -2, 
        rotationSpeed: 0.01 
      }, 
    ]
  },
  {
    id: 'pluto',
    name: 'Pluto',
    namePL: 'Pluton',
    description: "Once the ninth planet, now a dwarf planet in the Kuiper Belt. It has a heart-shaped glacier made of nitrogen ice (Tombaugh Regio) and blue skies visible in its thin haze.",
    descriptionPL: "Kiedyś dziewiąta planeta, teraz planeta karłowata w Pasie Kuipera. Posiada lodowiec w kształcie serca z lodu azotowego (Tombaugh Regio) i błękitne niebo widoczne w cienkiej mgle.",
    type: 'dwarf',
    radius: 0.4,
    distance: 245,
    color: '#D1CCC0',
    speed: 0.004,
    rotationSpeed: 0.01,
    inclination: 17.1,
    axialTilt: 122.5,
    eccentricity: 0.248, // HIGH ECCENTRICITY
    argumentOfPeriapsis: 113,
    orbitColor: '#444',
    moons: [
        {
            id: 'charon',
            name: 'Charon',
            namePL: 'Charon',
            description: "Pluto's largest moon.",
            descriptionPL: "Największy księżyc Plutona.",
            type: 'moon',
            radius: 0.2,
            distance: 2.5,
            color: '#888888',
            speed: 6,
            rotationSpeed: 0
        },
        {
            id: 'nix',
            name: 'Nix',
            namePL: 'Nix',
            description: "A small moon of Pluto.",
            descriptionPL: "Mały księżyc Plutona.",
            type: 'moon',
            radius: 0.08,
            distance: 3.5,
            color: '#777',
            speed: 5,
            rotationSpeed: 0.1
        },
        {
            id: 'hydra',
            name: 'Hydra',
            namePL: 'Hydra',
            description: "The outermost moon of Pluto.",
            descriptionPL: "Najdalszy księżyc Plutona.",
            type: 'moon',
            radius: 0.09,
            distance: 4.2,
            color: '#777',
            speed: 4,
            rotationSpeed: 0.1
        }
    ]
  },
  {
    id: 'oumuamua',
    name: "'Oumuamua",
    namePL: "'Oumuamua",
    description: "The first interstellar object detected passing through our Solar System. Its cigar-like shape and non-gravitational acceleration puzzled scientists, suggesting it may be a fragment of an exoplanet or comet.",
    descriptionPL: "Pierwszy obiekt międzygwiezdny wykryty podczas przelotu przez nasz Układ. Jego cygarowaty kształt i niegrawitacyjne przyspieszenie zaintrygowały naukowców, sugerując, że może to być fragment egzoplanety lub komety.",
    type: 'interstellar',
    radius: 0.15,
    distance: 140, // Passing through
    color: '#8B0000',
    speed: 0.02,
    rotationSpeed: 0.5,
    inclination: 60,
    eccentricity: 1.2, // Hyperbolic in reality, simplified here
    argumentOfPeriapsis: 0,
    orbitColor: '#800000',
  },
  {
    id: 'haumea',
    name: 'Haumea',
    namePL: 'Haumea',
    description: "A dwarf planet that spins so fast (every 4 hours) it has been stretched into the shape of a rugby ball. It has two moons and a thin ring system.",
    descriptionPL: "Planeta karłowata, która obraca się tak szybko (co 4 godziny), że została rozciągnięta do kształtu piłki do rugby. Posiada dwa księżyce i cienki system pierścieni.",
    type: 'dwarf',
    radius: 0.35, 
    distance: 260,
    color: '#BDC3C7',
    speed: 0.0035,
    rotationSpeed: 0.15,
    inclination: 28.2,
    eccentricity: 0.19,
    argumentOfPeriapsis: 240,
    orbitColor: '#333',
    moons: [
        {
            id: 'hiiaka',
            name: "Hi'iaka",
            namePL: "Hi'iaka",
            description: "The larger, outer moon of Haumea.",
            descriptionPL: "Większy, zewnętrzny księżyc Haumei.",
            type: 'moon',
            radius: 0.1,
            distance: 2.0,
            color: '#aaa',
            speed: 5,
            rotationSpeed: 0.05
        },
        {
            id: 'namaka',
            name: "Namaka",
            namePL: "Namaka",
            description: "The smaller, inner moon of Haumea.",
            descriptionPL: "Mniejszy, wewnętrzny księżyc Haumei.",
            type: 'moon',
            radius: 0.08,
            distance: 1.4,
            color: '#999',
            speed: 8,
            rotationSpeed: 0.05
        }
    ]
  },
  {
    id: 'quaoar',
    name: 'Quaoar',
    namePL: 'Quaoar',
    description: "A classical Kuiper Belt object, roughly half the size of Pluto. It has a ring system that orbits much further out than theory previously suggested was possible.",
    descriptionPL: "Klasyczny obiekt Pasa Kuipera, o połowę mniejszy od Plutona. Posiada system pierścieni, który orbituje znacznie dalej, niż wcześniej sugerowały teorie.",
    type: 'dwarf',
    radius: 0.35,
    distance: 265,
    color: '#8B4513',
    speed: 0.0034,
    rotationSpeed: 0.02,
    inclination: 7.9,
    eccentricity: 0.038,
    argumentOfPeriapsis: 150,
    orbitColor: '#333',
    moons: [
        {
            id: 'weywot',
            name: 'Weywot',
            namePL: 'Weywot',
            description: "The only known moon of Quaoar.",
            descriptionPL: "Jedyny znany księżyc Quaoara.",
            type: 'moon',
            radius: 0.08,
            distance: 1.8,
            color: '#775544',
            speed: 4,
            rotationSpeed: 0.02
        }
    ]
  },
  {
    id: 'varuna',
    name: 'Varuna',
    namePL: 'Waruna',
    description: "Named after the Vedic god of cosmic order. It is an elongated trans-Neptunian object with a fast rotation period of about 6 hours.",
    descriptionPL: "Nazwana na cześć wedyjskiego boga kosmicznego porządku. To wydłużony obiekt transneptunowy z szybkim okresem obrotu wynoszącym około 6 godzin.",
    type: 'dwarf',
    radius: 0.32,
    distance: 270,
    color: '#CD853F',
    speed: 0.0033,
    rotationSpeed: 0.04, // Fast rotator
    inclination: 17.2,
    eccentricity: 0.05,
    orbitColor: '#333',
  },
  {
    id: 'makemake',
    name: 'Makemake',
    namePL: 'Makemake',
    description: "The second-brightest object in the Kuiper Belt. It lacks the atmosphere of Pluto but is covered in methane and ethane ice, giving it a reddish-brown color.",
    descriptionPL: "Drugi najjaśniejszy obiekt w Pasie Kuipera. Nie posiada atmosfery jak Pluton, ale jest pokryty lodem metanowym i etanowym, co nadaje mu czerwonobrązowy kolor.",
    type: 'dwarf',
    radius: 0.38,
    distance: 275,
    color: '#E67E22',
    speed: 0.0032,
    rotationSpeed: 0.02,
    inclination: 29,
    eccentricity: 0.15,
    argumentOfPeriapsis: 295,
    orbitColor: '#333',
    moons: [
        {
            id: 'mk2',
            name: 'MK2',
            namePL: 'MK2',
            description: "A small, dark moon orbiting Makemake.",
            descriptionPL: "Mały, ciemny księżyc krążący wokół Makemake.",
            type: 'moon',
            radius: 0.08,
            distance: 2.5,
            color: '#222',
            speed: 3,
            rotationSpeed: 0.02
        }
    ]
  },
  {
    id: 'salacia',
    name: 'Salacia',
    namePL: 'Salacia',
    description: "A large object in the Kuiper Belt orbiting with a companion moon, Actaea. It has a very dark surface.",
    descriptionPL: "Duży obiekt w Pasie Kuipera orbitujący z księżycem Actaea. Ma bardzo ciemną powierzchnię.",
    type: 'dwarf',
    radius: 0.3,
    distance: 280,
    color: '#5F9EA0',
    speed: 0.0031,
    rotationSpeed: 0.02,
    inclination: 23.9,
    eccentricity: 0.1,
    orbitColor: '#333',
    moons: [
        {
            id: 'actaea',
            name: 'Actaea',
            namePL: 'Actaea',
            description: "The moon of Salacia.",
            descriptionPL: "Księżyc Salacii.",
            type: 'moon',
            radius: 0.1,
            distance: 2.2,
            color: '#446666',
            speed: 4,
            rotationSpeed: 0.02
        }
    ]
  },
  {
    id: 'eris',
    name: 'Eris',
    namePL: 'Eris',
    description: "One of the largest known dwarf planets, essentially the same size as Pluto but 27% more massive. Its discovery led to the reclassification of Pluto as a dwarf planet.",
    descriptionPL: "Jedna z największych znanych planet karłowatych, rozmiarami zbliżona do Plutona, ale o 27% masywniejsza. Jej odkrycie doprowadziło do reklasyfikacji Plutona.",
    type: 'dwarf',
    radius: 0.4,
    distance: 290,
    color: '#FFFFFF',
    speed: 0.003,
    rotationSpeed: 0.01,
    inclination: 44.0, // Highly inclined
    eccentricity: 0.44, // HIGH ECCENTRICITY
    argumentOfPeriapsis: 151,
    orbitColor: '#333',
  },
  {
    id: 'orcus',
    name: 'Orcus',
    namePL: 'Orkus',
    description: "Called the 'anti-Pluto' because it shares the same orbital period but is always on the opposite side of the Sun.",
    descriptionPL: "Nazywany 'anty-Plutonem', ponieważ ma ten sam okres orbitalny, ale zawsze znajduje się po przeciwnej stronie Słońca.",
    type: 'dwarf',
    radius: 0.35,
    distance: 250, // Anti-Pluto
    color: '#778899',
    speed: 0.004,
    rotationSpeed: 0.02,
    inclination: 20.5,
    eccentricity: 0.22,
    argumentOfPeriapsis: 300,
    orbitColor: '#444',
    moons: [
        {
            id: 'vanth',
            name: 'Vanth',
            namePL: 'Vanth',
            description: "The large moon of Orcus.",
            descriptionPL: "Duży księżyc Orkusa.",
            type: 'moon',
            radius: 0.15,
            distance: 2.0,
            color: '#667788',
            speed: 6,
            rotationSpeed: 0.02
        }
    ]
  },
  {
    id: 'gonggong',
    name: 'Gonggong',
    namePL: 'Gonggong',
    description: "A red dwarf planet with a highly elliptical orbit. Named after a Chinese water god responsible for floods and chaos.",
    descriptionPL: "Czerwona planeta karłowata o silnie eliptycznej orbicie. Nazwana na cześć chińskiego boga wody odpowiedzialnego za powodzie i chaos.",
    type: 'dwarf',
    radius: 0.38,
    distance: 310,
    color: '#B22222',
    speed: 0.0025,
    rotationSpeed: 0.02,
    inclination: 30.7,
    eccentricity: 0.5, // VERY HIGH
    argumentOfPeriapsis: 330,
    orbitColor: '#333',
    moons: [
        {
            id: 'xiangliu',
            name: 'Xiangliu',
            namePL: 'Xiangliu',
            description: "The moon of Gonggong.",
            descriptionPL: "Księżyc Gonggonga.",
            type: 'moon',
            radius: 0.08,
            distance: 2.0,
            color: '#882222',
            speed: 4,
            rotationSpeed: 0.02
        }
    ]
  },
  {
    id: 'sedna',
    name: 'Sedna',
    namePL: 'Sedna',
    description: "The furthest known dwarf planet candidate. It takes 11,400 years to orbit the Sun. Its orbit lies well beyond the Kuiper Belt.",
    descriptionPL: "Najdalszy znany kandydat na planetę karłowata. Obieg Słońca zajmuje jej 11 400 lat. Jej orbita leży daleko poza Pasem Kuipera.",
    type: 'dwarf',
    radius: 0.38,
    distance: 380, // Very far
    color: '#FF4500',
    speed: 0.001,
    rotationSpeed: 0.02,
    inclination: 11.9,
    eccentricity: 0.85, // EXTREME ECCENTRICITY
    argumentOfPeriapsis: 311,
    orbitColor: '#333',
  },
  // Giant Stars for Scale Comparison (Placed far out)
  {
    id: 'sirius',
    name: 'Sirius A',
    namePL: 'Syriusz A',
    description: "The brightest star in the night sky. It is a main-sequence star roughly twice the size of the Sun. Distance scaled for comparison.",
    descriptionPL: "Najjaśniejsza gwiazda nocnego nieba. Jest gwiazdą ciągu głównego, mniej więcej dwa razy większą od Słońca.",
    type: 'star',
    radius: 8, // ~1.7x Sun (Sun is 6 in this scale approx, slightly larger visual)
    distance: 450,
    color: '#AEC2E0', // Blue-white
    speed: 0,
    rotationSpeed: 0.01,
    inclination: 0,
  },
  {
    id: 'pollux',
    name: 'Pollux',
    namePL: 'Polluks',
    description: "An orange giant star in the constellation Gemini. It is the closest giant star to Earth. It is about 9 times larger than the Sun.",
    descriptionPL: "Pomarańczowy olbrzym w gwiazdozbiorze Bliźniąt. To najbliższy Ziemi olbrzym. Jest około 9 razy większy od Słońca.",
    type: 'star',
    radius: 15, // ~9x Sun visual scale
    distance: 550,
    color: '#FFD180', // Orange
    speed: 0,
    rotationSpeed: 0.005,
    inclination: 5,
  },
  {
    id: 'arcturus',
    name: 'Arcturus',
    namePL: 'Arktur',
    description: "A red giant and the brightest star in the northern celestial hemisphere. It is roughly 25 times the radius of the Sun.",
    descriptionPL: "Czerwony olbrzym i najjaśniejsza gwiazda północnej półkuli nieba. Ma promień około 25 razy większy od Słońca.",
    type: 'star',
    radius: 25, // ~25x Sun visual scale
    distance: 700,
    color: '#FF8C00', // Orange-Red
    speed: 0,
    rotationSpeed: 0.004,
    inclination: -5,
  },
  {
    id: 'aldebaran',
    name: 'Aldebaran',
    namePL: 'Aldebaran',
    description: "The 'Eye of Taurus'. A red giant star about 44 times larger than the Sun. It hosts a giant planet several times the mass of Jupiter.",
    descriptionPL: "'Oko Byka'. Czerwony olbrzym około 44 razy większy od Słońca. Posiada gigantyczną planetę o masie kilkukrotnie większej od Jowisza.",
    type: 'star',
    radius: 40, // ~44x Sun visual scale
    distance: 900,
    color: '#FF4500', // Red-Orange
    speed: 0,
    rotationSpeed: 0.003,
    inclination: 2,
  },
  {
    id: 'rigel',
    name: 'Rigel',
    namePL: 'Rigel',
    description: "A blue supergiant in Orion. It shines with the luminosity of tens of thousands of Suns and is roughly 78 times the Sun's radius.",
    descriptionPL: "Błękitny nadolbrzym w Orionie. Świeci z jasnością dziesiątek tysięcy Słońc i ma promień ok. 78 razy większy od słonecznego.",
    type: 'star',
    radius: 60, // ~78x Sun visual scale
    distance: 1200,
    color: '#ADD8E6', // Light Blue
    speed: 0,
    rotationSpeed: 0.002,
    inclination: -2,
  },
  {
    id: 'antares',
    name: 'Antares',
    namePL: 'Antares',
    description: "A red supergiant nearing the end of its life. If placed in our solar system, it would engulf the orbit of Mars. ~680x Sun radius.",
    descriptionPL: "Czerwony nadolbrzym zbliżający się do końca życia. Gdyby znalazł się w naszym układzie, pochłonąłby orbitę Marsa. ~680x promień Słońca.",
    type: 'star',
    radius: 100, // ~680x Sun visual scale (compressed)
    distance: 1600,
    color: '#FF0000', // Red
    speed: 0,
    rotationSpeed: 0.001,
    inclination: 0,
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse',
    namePL: 'Betelgeza',
    description: "A red supergiant expected to explode as a supernova. It varies in size, but is typically around 900 times the size of the Sun. expected to explode as a supernova.",
    descriptionPL: "Czerwony nadolbrzym, który wkrótce wybuchnie jako supernowa. Zmienia rozmiar, ale typowo jest około 900 razy większy od Słońca.",
    type: 'star',
    radius: 150, // ~900x Sun visual scale (compressed)
    distance: 2100,
    color: '#8B0000', // Deep Red
    speed: 0,
    rotationSpeed: 0.001,
    inclination: 10,
  },
  {
    id: 'uy_scuti',
    name: 'UY Scuti',
    namePL: 'UY Scuti',
    description: "One of the largest known stars. A hypergiant with a radius around 1,700 times that of the Sun. It would extend past Jupiter's orbit.",
    descriptionPL: "Jedna z największych znanych gwiazd. Hiperolbrzym o promieniu ok. 1700 razy większym od Słońca. Sięgałby poza orbitę Jowisza.",
    type: 'star',
    radius: 250, // ~1700x Sun visual scale (compressed)
    distance: 3100,
    color: '#FF2400', // Scarlet
    speed: 0,
    rotationSpeed: 0.0005,
    inclination: -10,
  },
  {
    id: 'stephenson',
    name: 'Stephenson 2-18',
    namePL: 'Stephenson 2-18',
    description: "Currently the largest known star in the universe. A red supergiant with a radius approx 2150 times the Sun. If placed in the Solar System, its photosphere would extend beyond the orbit of Saturn.",
    descriptionPL: "Obecnie największa znana gwiazda we Wszechświecie. Czerwony nadolbrzym o promieniu ok. 2150 razy większym od Słońca. Gdyby znalazła się w Układzie Słonecznym, sięgałaby poza orbitę Saturna.",
    type: 'star',
    radius: 350, // Visual scale (compressed)
    distance: 4000,
    color: '#DC143C', // Crimson
    speed: 0,
    rotationSpeed: 0.0004,
    inclination: 15,
  },
  {
    id: 'sagittarius_a',
    name: 'Sagittarius A*',
    namePL: 'Sagittarius A*',
    description: "The supermassive black hole at the center of the Milky Way. It has a mass of 4.3 million Suns but fits within a radius smaller than Mercury's orbit. Shown here with its glowing accretion disk.",
    descriptionPL: "Supermasywna czarna dziura w centrum Drogi Mlecznej. Ma masę 4,3 miliona Słońc, ale mieści się w promieniu mniejszym niż orbita Merkurego. Ukazana z gorącym dyskiem akrecyjnym.",
    type: 'blackhole',
    radius: 80, // Event horizon * visual scale for visibility
    distance: 800, // Move along the galactic vector but keep it visible
    color: '#000000', 
    speed: 0,
    rotationSpeed: 0.1,
    inclination: 0,
  },
  {
    id: 'ton_618',
    name: 'TON 618',
    namePL: 'TON 618',
    description: "The largest known black hole in the universe. An ultramassive black hole with a mass of 66 billion Suns. Its event horizon is 11 times the diameter of Neptune's orbit.",
    descriptionPL: "Największa znana czarna dziura we Wszechświecie. Ultramasywny obiekt o masie 66 miliardów Słońc. Jej horyzont zdarzeń jest 11 razy większy niż średnica orbity Neptuna.",
    type: 'blackhole',
    radius: 600, // Absolutely massive visual scale
    distance: 5500,
    color: '#000000',
    speed: 0,
    rotationSpeed: 0.05,
    inclination: -5,
  }
];

export const SUN_DATA = {
    name: 'Sun',
    namePL: 'Słońce',
    description: "The Star at the center of our Solar System. It orbits the Galactic Center (Sagittarius A*) every 230 million years. Gravity binds the solar system together.",
    descriptionPL: "Gwiazda w centrum układu. Krąży wokół Centrum Galaktyki (Sagittarius A*) z okresem 230 mln lat. Grawitacja Słońca spaja cały układ słoneczny.",
    barycentricRadius: 4, // Visible wobble radius
    wobbleSpeed: 0.08, // Synchronized with Jupiter's orbital speed
}

export const GALAXY_DATA = {
    blackHoleRadius: 20,
    orbitRadius: 200,
    orbitSpeed: 0.5, // Visual speed
};

export const UI_TRANSLATIONS = {
  EN: {
    title: "Solar System 3D",
    subtitleDetailed: "Interactive Heliocentric Model",
    subtitleGalaxy: "Galactic Scale: Sagittarius A*",
    modeSolar: "Solar View",
    modeGalaxy: "Sagittarius A*",
    controls: "Controls",
    controlsList: [
      "LMB + Drag to Rotate",
      "RMB + Drag to Pan",
      "Scroll to Zoom"
    ],
    timeSim: "Time Simulation",
    resetCam: "Reset Camera",
    speed: "Speed",
    labels: "Labels",
    giantObjects: "Giant Objects",
    starDust: "Star Dust",
    realTime: "Set Real-Time",
    realTimeActive: "Real-Time (J2000) Active",
    jumpTo: "Jump to Object..."
  },
  PL: {
    title: "Układ Słoneczny 3D",
    subtitleDetailed: "Interaktywny Model Heliocentryczny",
    subtitleGalaxy: "Skala Galaktyczna: Sagittarius A*",
    modeSolar: "Widok Solarny",
    modeGalaxy: "Sagittarius A*",
    controls: "Sterowanie",
    controlsList: [
      "LPM + Przesuń by obracać",
      "PPM + Przesuń by przesuwać",
      "Scroll by przybliżać"
    ],
    timeSim: "Symulacja Czasu",
    resetCam: "Reset Kamery",
    speed: "Prędkość",
    labels: "Etykiety",
    giantObjects: "Wielkie Obiekty",
    starDust: "Gwiezdny Pył",
    realTime: "Tryb Rzeczywisty",
    realTimeActive: "Czas Rzeczywisty (J2000)",
    jumpTo: "Idź do obiektu..."
  }
};
