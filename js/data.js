export const questions=[
['real','Is it a real person?'],['fictional','Is it a fictional character?'],['animal','Is it an animal?'],['place','Is it a place?'],['object','Is it a physical object?'],
['alive','Is it alive today?'],['historical','Is it known for something in history?'],['science','Is it associated with science?'],['music','Is it associated with music?'],['sports','Is it associated with sports?'],
['superhero','Is it a superhero?'],['magic','Is it associated with magic?'],['movie','Is it known from movies?'],['television','Is it known from television?'],['book','Is it known from books?'],
['mammal','Is it a mammal?'],['bird','Is it a bird?'],['water','Does it primarily live in water?'],['pet','Is it commonly kept as a pet?'],['large','Is it usually larger than an adult human?'],
['country','Is it a country?'],['city','Is it a city?'],['landmark','Is it a landmark or famous structure?'],['europe','Is it in Europe?'],['usa','Is it in the United States?'],['uk','Is it in the United Kingdom?'],['france','Is it in France?'],['ireland','Is it in Ireland?'],
['electronic','Does it use electricity?'],['transport','Is it used for transportation?'],['kitchen','Is it commonly used in a kitchen?'],['handheld','Can you normally hold it in one hand?'],['communication','Is it used for communication?'],
['flight','Can it fly?'],['fictionalWorld','Is it associated with a fictional world?'],['royalty','Is it associated with royalty?'],['space','Is it associated with space?'],['detective','Is it known for solving mysteries?']
,['american','Is the person or character American?'],['british','Is the person or character British?'],['rock','Is the person mainly associated with rock music?'],['pop','Is the person mainly associated with pop music?'],['countryMusic','Is the person mainly associated with country music?'],['solo','Is the musician primarily known as a solo performer?'],['guitarist','Is the person well known for playing guitar?'],['actor','Is the person known for acting?'],['politics','Is the person known for politics or government?'],['male','Is the person or character male?'],['female','Is the person or character female?'],['fast','Is the animal known for its speed?'],['fastestLand','Is it known as the fastest land animal?'],['striped','Does it have distinctive stripes?'],['spotted','Does it have a spotted coat?'],['mane','Do males typically have a prominent mane?'],['wild','Is it typically a wild animal?'],['carnivore','Does it primarily eat meat?'],['instrument','Is it a musical instrument?'],['strings','Does it have strings?'],['wooden','Is it commonly made of wood?'],['africa','Is it native to Africa?'],['asia','Is it in Asia or native to Asia?'],['ocean','Is it associated with the ocean?'],['reptile','Is it a reptile?'],['insect','Is it an insect?'],['powered','Does it normally require a power source to operate?'],['sportEquipment','Is it used in sports?'],['fantasy','Is it associated with fantasy stories?'],['animated','Is it primarily known as an animated character?']
].map(([id,text])=>({id,text}));
const make=(name,category,yes,aliases=[])=>({id:category+'-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),name,category,yes:yes.split(' '),aliases});
export const entries=[
make('Albert Einstein','people','real historical science'),make('Marie Curie','people','real historical science'),make('Isaac Newton','people','real historical science'),make('Elvis Presley','people','real historical music'),make('Taylor Swift','people','real alive music'),make('Michael Jordan','people','real alive sports'),make('Serena Williams','people','real alive sports'),make('Neil Armstrong','people','real historical space'),make('Queen Elizabeth II','people','real historical royalty'),make('Sherlock Holmes','characters','fictional book detective movie television'),make('Batman','characters','fictional superhero movie detective'),make('Superman','characters','fictional superhero movie space'),make('Harry Potter','characters','fictional magic book movie'),make('Hermione Granger','characters','fictional magic book movie'),make('Darth Vader','characters','fictional movie space'),make('Yoda','characters','fictional movie space'),make('Spider-Man','characters','fictional superhero movie'),make('Elsa','characters','fictional magic movie royalty'),make('Mickey Mouse','characters','fictional movie television animal'),make('Dog','animals','animal mammal pet'),make('Cat','animals','animal mammal pet'),make('Elephant','animals','animal mammal large'),make('Lion','animals','animal mammal large'),make('Dolphin','animals','animal mammal water'),make('Shark','animals','animal water large'),make('Eagle','animals','animal bird flight'),make('Penguin','animals','animal bird water'),make('Horse','animals','animal mammal large'),make('France','places','place country europe france'),make('Ireland','places','place country europe ireland'),make('United States','places','place country usa'),make('Paris','places','place city europe france'),make('New York City','places','place city usa'),make('Eiffel Tower','places','place landmark europe france'),make('Statue of Liberty','places','place landmark usa'),make('London','places','place city europe uk'),make('Grand Canyon','places','place landmark usa'),make('Smartphone','objects','object electronic handheld communication'),make('Laptop','objects','object electronic communication'),make('Television','objects','object electronic'),make('Bicycle','objects','object transport'),make('Car','objects','object transport large'),make('Airplane','objects','object transport flight large'),make('Refrigerator','objects','object electronic kitchen large'),make('Microwave oven','objects','object electronic kitchen'),make('Coffee mug','objects','object kitchen handheld'),make('Hammer','objects','object handheld')
];

// Additional curated starter answers and distinguishing facts.
const additionalEntries=[
make("Bruce Springsteen","people","real alive music american rock solo male guitarist"),
make("Beyonce","people","real alive music american pop solo female"),
make("Dolly Parton","people","real alive music american countryMusic solo female guitarist"),
make("Johnny Cash","people","real historical music american countryMusic solo male guitarist"),
make("Paul McCartney","people","real alive music british rock male guitarist"),
make("Mick Jagger","people","real alive music british rock male"),
make("Freddie Mercury","people","real historical music british rock male"),
make("Ed Sheeran","people","real alive music british pop solo male guitarist"),
make("Adele","people","real alive music british pop solo female"),
make("Madonna","people","real alive music american pop solo female"),
make("Lady Gaga","people","real alive music american pop solo female actor"),
make("Bob Dylan","people","real alive music american rock solo male guitarist"),
make("Jimi Hendrix","people","real historical music american rock solo male guitarist"),
make("Garth Brooks","people","real alive music american countryMusic solo male guitarist"),
make("George Strait","people","real alive music american countryMusic solo male"),
make("Morgan Freeman","people","real alive actor american male movie"),
make("Tom Hanks","people","real alive actor american male movie"),
make("Meryl Streep","people","real alive actor american female movie"),
make("Denzel Washington","people","real alive actor american male movie"),
make("Abraham Lincoln","people","real historical politics american male"),
make("George Washington","people","real historical politics american male"),
make("Barack Obama","people","real alive politics american male"),
make("Winston Churchill","people","real historical politics british male"),
make("Stephen Hawking","people","real historical science british male space"),
make("Jane Goodall","people","real alive science british female"),
make("Cheetah","animals","animal mammal wild carnivore fast fastestLand spotted africa"),
make("Tiger","animals","animal mammal wild carnivore fast striped asia large"),
make("Leopard","animals","animal mammal wild carnivore spotted africa"),
make("Giraffe","animals","animal mammal wild large africa"),
make("Zebra","animals","animal mammal wild fast africa"),
make("Rhinoceros","animals","animal mammal wild large africa"),
make("Hippopotamus","animals","animal mammal wild large africa water"),
make("Gorilla","animals","animal mammal wild large africa"),
make("Chimpanzee","animals","animal mammal wild africa"),
make("Kangaroo","animals","animal mammal wild fast"),
make("Crocodile","animals","animal reptile wild water carnivore large"),
make("Snake","animals","animal reptile wild carnivore"),
make("Turtle","animals","animal reptile water pet"),
make("Butterfly","animals","animal insect flight wild"),
make("Bee","animals","animal insect flight wild"),
make("Octopus","animals","animal water wild ocean carnivore"),
make("Whale","animals","animal mammal water wild ocean large"),
make("Guitar","objects","object instrument strings wooden handheld"),
make("Piano","objects","object instrument strings wooden large"),
make("Violin","objects","object instrument strings wooden handheld"),
make("Drum","objects","object instrument handheld"),
make("Trumpet","objects","object instrument handheld"),
make("Football","objects","object sportEquipment handheld"),
make("Basketball","objects","object sportEquipment handheld"),
make("Tennis racket","objects","object sportEquipment handheld"),
make("Camera","objects","object electronic powered handheld"),
make("Flashlight","objects","object electronic powered handheld"),
make("Toaster","objects","object electronic powered kitchen"),
make("Blender","objects","object electronic powered kitchen"),
make("Washing machine","objects","object electronic powered large"),
make("Train","objects","object transport large powered"),
make("Boat","objects","object transport water"),
make("Rome","places","place city europe"),
make("Berlin","places","place city europe"),
make("Tokyo","places","place city asia"),
make("Great Wall of China","places","place landmark asia"),
make("Taj Mahal","places","place landmark asia"),
make("Colosseum","places","place landmark europe"),
make("Canada","places","place country"),
make("Japan","places","place country asia"),
make("Germany","places","place country europe"),
make("Australia","places","place country"),
make("Hogwarts","places","place fictionalWorld landmark"),
make("Wonder Woman","characters","fictional superhero movie television female"),
make("Iron Man","characters","fictional superhero movie american male"),
make("Captain America","characters","fictional superhero movie american male"),
make("Black Widow","characters","fictional superhero movie female"),
make("The Joker","characters","fictional movie detective male"),
make("Frodo Baggins","characters","fictional book movie fantasy male"),
make("Gandalf","characters","fictional book movie fantasy magic male"),
make("Shrek","characters","fictional movie animated fantasy male"),
make("SpongeBob SquarePants","characters","fictional television animated male"),
make("Homer Simpson","characters","fictional television animated american male")
];
const refinements={"Taylor Swift":"american pop solo female","Elvis Presley":"american rock solo male guitarist","Michael Jordan":"american male","Serena Williams":"american female","Albert Einstein":"male","Marie Curie":"female","Isaac Newton":"british male","Neil Armstrong":"american male","Queen Elizabeth II":"british female","Sherlock Holmes":"british male","Batman":"american male","Superman":"american male","Harry Potter":"british male fantasy","Hermione Granger":"british female fantasy","Spider-Man":"american male","Elsa":"female animated fantasy","Mickey Mouse":"male animated","Lion":"africa wild carnivore mane","Elephant":"africa wild","Shark":"wild carnivore ocean","Dolphin":"wild ocean","Eagle":"wild carnivore","Penguin":"wild ocean","Dog":"carnivore","Cat":"carnivore","Horse":"fast","Hammer":"wooden"};
for(const entry of entries){const traits=refinements[entry.name];if(traits)entry.yes.push(...traits.split(' '))}
entries.push(...additionalEntries);

// Explicit negative facts are reserved for well-established distinctions.
// An omitted trait is otherwise unknown, not automatically false.
const animalNo={
 'Elephant':'water mane spotted striped fast fastestLand carnivore pet',
 'Giraffe':'water mane striped fast fastestLand carnivore pet',
 'Lion':'water spotted striped fast fastestLand pet',
 'Cheetah':'large water mane striped pet',
 'Tiger':'water mane spotted fastestLand pet',
 'Leopard':'water mane striped fastestLand pet',
 'Zebra':'water mane spotted carnivore pet',
 'Horse':'water mane spotted striped carnivore fastestLand',
 'Rhinoceros':'water mane spotted striped carnivore pet',
 'Gorilla':'water mane spotted striped carnivore pet',
 'Hippopotamus':'mane spotted striped carnivore pet'
};
for(const entry of entries){
 if(entry.name==='Giraffe'&&!entry.yes.includes('spotted'))entry.yes.push('spotted');
 if(entry.category==='animals')entry.no=(animalNo[entry.name]||'').split(' ').filter(Boolean);
}

for(const entry of entries)entry.builtIn=true;

// v0.5.0 curated animal expansion. Unlisted characteristics remain unknown.
entries.push(
make("Cow",'animals','animal mammal large farm herbivore domesticated hooves'),
make("Bull",'animals','animal mammal large farm herbivore domesticated hooves horns'),
make("Calf",'animals','animal mammal farm herbivore domesticated hooves'),
make("Sheep",'animals','animal mammal farm herbivore domesticated wool hooves'),
make("Goat",'animals','animal mammal farm herbivore domesticated horns hooves'),
make("Pig",'animals','animal mammal farm omnivore domesticated'),
make("Donkey",'animals','animal mammal farm herbivore domesticated hooves'),
make("Mule",'animals','animal mammal farm herbivore domesticated hooves'),
make("Chicken",'animals','animal bird farm domesticated eggs'),
make("Rooster",'animals','animal bird farm domesticated'),
make("Duck",'animals','animal bird water farm domesticated flight eggs'),
make("Goose",'animals','animal bird water farm domesticated flight eggs'),
make("Turkey",'animals','animal bird farm domesticated eggs'),
make("Rabbit",'animals','animal mammal pet herbivore'),
make("Hamster",'animals','animal mammal pet omnivore'),
make("Guinea pig",'animals','animal mammal pet herbivore'),
make("Ferret",'animals','animal mammal pet carnivore'),
make("Goldfish",'animals','animal fish water pet'),
make("Betta fish",'animals','animal fish water pet carnivore'),
make("Parrot",'animals','animal bird flight pet'),
make("Budgerigar",'animals','animal bird flight pet'),
make("Canary",'animals','animal bird flight pet'),
make("Pigeon",'animals','animal bird flight city'),
make("Crow",'animals','animal bird flight omnivore'),
make("Raven",'animals','animal bird flight omnivore'),
make("Owl",'animals','animal bird flight carnivore'),
make("Hawk",'animals','animal bird flight carnivore'),
make("Falcon",'animals','animal bird flight carnivore fast'),
make("Flamingo",'animals','animal bird water flight'),
make("Swan",'animals','animal bird water flight'),
make("Ostrich",'animals','animal bird large fast'),
make("Emu",'animals','animal bird large fast'),
make("Peacock",'animals','animal bird flight'),
make("Hummingbird",'animals','animal bird flight'),
make("Woodpecker",'animals','animal bird flight'),
make("Pelican",'animals','animal bird water flight'),
make("Seagull",'animals','animal bird water flight ocean'),
make("Puffin",'animals','animal bird water flight ocean'),
make("Polar bear",'animals','animal mammal large wild carnivore arctic'),
make("Brown bear",'animals','animal mammal large wild omnivore'),
make("Black bear",'animals','animal mammal large wild omnivore'),
make("Panda",'animals','animal mammal large wild herbivore asia'),
make("Koala",'animals','animal mammal wild herbivore'),
make("Sloth",'animals','animal mammal wild herbivore'),
make("Anteater",'animals','animal mammal wild insectivore'),
make("Armadillo",'animals','animal mammal wild insectivore'),
make("Hedgehog",'animals','animal mammal wild insectivore'),
make("Porcupine",'animals','animal mammal wild herbivore'),
make("Beaver",'animals','animal mammal wild herbivore water'),
make("Otter",'animals','animal mammal wild carnivore water'),
make("Seal",'animals','animal mammal wild carnivore water ocean'),
make("Sea lion",'animals','animal mammal wild carnivore water ocean'),
make("Walrus",'animals','animal mammal large wild carnivore water ocean arctic'),
make("Manatee",'animals','animal mammal large wild herbivore water'),
make("Orca",'animals','animal mammal large wild carnivore water ocean'),
make("Narwhal",'animals','animal mammal wild carnivore water ocean arctic'),
make("Moose",'animals','animal mammal large wild herbivore hooves antlers'),
make("Elk",'animals','animal mammal large wild herbivore hooves antlers'),
make("Deer",'animals','animal mammal wild herbivore hooves antlers'),
make("Reindeer",'animals','animal mammal large wild herbivore hooves antlers arctic'),
make("Bison",'animals','animal mammal large wild herbivore hooves horns'),
make("Buffalo",'animals','animal mammal large wild herbivore hooves horns africa'),
make("Yak",'animals','animal mammal large herbivore hooves horns asia domesticated'),
make("Camel",'animals','animal mammal large herbivore hooves domesticated desert'),
make("Llama",'animals','animal mammal herbivore hooves domesticated'),
make("Alpaca",'animals','animal mammal herbivore hooves domesticated wool'),
make("Wildebeest",'animals','animal mammal large wild herbivore hooves horns africa'),
make("Antelope",'animals','animal mammal wild herbivore hooves horns africa'),
make("Gazelle",'animals','animal mammal wild herbivore hooves horns fast africa'),
make("Warthog",'animals','animal mammal wild omnivore africa'),
make("Hyena",'animals','animal mammal wild carnivore africa'),
make("African wild dog",'animals','animal mammal wild carnivore africa'),
make("Wolf",'animals','animal mammal wild carnivore'),
make("Fox",'animals','animal mammal wild carnivore'),
make("Coyote",'animals','animal mammal wild carnivore'),
make("Raccoon",'animals','animal mammal wild omnivore'),
make("Skunk",'animals','animal mammal wild omnivore'),
make("Badger",'animals','animal mammal wild omnivore'),
make("Wolverine",'animals','animal mammal wild carnivore'),
make("Meerkat",'animals','animal mammal wild carnivore africa'),
make("Mongoose",'animals','animal mammal wild carnivore africa'),
make("Baboon",'animals','animal mammal wild omnivore africa'),
make("Orangutan",'animals','animal mammal large wild herbivore asia'),
make("Monkey",'animals','animal mammal wild omnivore'),
make("Squirrel",'animals','animal mammal wild omnivore'),
make("Chipmunk",'animals','animal mammal wild omnivore'),
make("Mouse",'animals','animal mammal omnivore'),
make("Rat",'animals','animal mammal omnivore'),
make("Bat",'animals','animal mammal flight wild'),
make("Platypus",'animals','animal mammal water wild eggs'),
make("Echidna",'animals','animal mammal wild eggs insectivore'),
make("Komodo dragon",'animals','animal reptile large wild carnivore asia'),
make("Iguana",'animals','animal reptile wild herbivore'),
make("Chameleon",'animals','animal reptile wild insectivore africa'),
make("Gecko",'animals','animal reptile wild insectivore'),
make("Alligator",'animals','animal reptile large water wild carnivore'),
make("Tortoise",'animals','animal reptile herbivore'),
make("Sea turtle",'animals','animal reptile water ocean wild eggs'),
make("Frog",'animals','animal amphibian water wild insectivore eggs'),
make("Toad",'animals','animal amphibian wild insectivore eggs'),
make("Salamander",'animals','animal amphibian water wild insectivore'),
make("Newt",'animals','animal amphibian water wild insectivore'),
make("Clownfish",'animals','animal fish water ocean'),
make("Tuna",'animals','animal fish water ocean carnivore'),
make("Salmon",'animals','animal fish water carnivore'),
make("Trout",'animals','animal fish water carnivore'),
make("Swordfish",'animals','animal fish water ocean carnivore'),
make("Manta ray",'animals','animal fish water ocean'),
make("Stingray",'animals','animal fish water ocean'),
make("Seahorse",'animals','animal fish water ocean carnivore'),
make("Jellyfish",'animals','animal invertebrate water ocean carnivore'),
make("Starfish",'animals','animal invertebrate water ocean carnivore'),
make("Sea urchin",'animals','animal invertebrate water ocean'),
make("Crab",'animals','animal invertebrate water ocean omnivore'),
make("Lobster",'animals','animal invertebrate water ocean omnivore'),
make("Shrimp",'animals','animal invertebrate water ocean omnivore'),
make("Snail",'animals','animal invertebrate herbivore'),
make("Slug",'animals','animal invertebrate herbivore'),
make("Earthworm",'animals','animal invertebrate'),
make("Spider",'animals','animal arachnid wild carnivore'),
make("Scorpion",'animals','animal arachnid wild carnivore desert'),
make("Ant",'animals','animal insect wild omnivore'),
make("Termite",'animals','animal insect wild'),
make("Mosquito",'animals','animal insect flight wild'),
make("Dragonfly",'animals','animal insect flight wild carnivore'),
make("Ladybug",'animals','animal insect flight wild carnivore'),
make("Grasshopper",'animals','animal insect wild herbivore'),
make("Cricket",'animals','animal insect wild omnivore'),
make("Praying mantis",'animals','animal insect wild carnivore'),
make("Cockroach",'animals','animal insect wild omnivore'),
make("Firefly",'animals','animal insect flight wild'),
make("Moth",'animals','animal insect flight wild'),
make("Caterpillar",'animals','animal insect herbivore'),
make("Centipede",'animals','animal invertebrate wild carnivore'),
make("Millipede",'animals','animal invertebrate wild')
);

questions.push(...[["farm","Is it commonly found on a farm?"],["domesticated","Is it typically domesticated?"],["herbivore","Does it primarily eat plants?"],["omnivore","Does it eat both plants and animals?"],["hooves","Does it have hooves?"],["horns","Does it typically have horns?"],["wool","Is it known for producing wool?"],["antlers","Does it typically have antlers?"],["eggs","Does it lay eggs?"],["fish","Is it a fish?"],["amphibian","Is it an amphibian?"],["arachnid","Is it an arachnid?"],["invertebrate","Is it an invertebrate?"],["insectivore","Does it mainly eat insects?"],["arctic","Is it associated with Arctic regions?"],["desert","Is it adapted to desert environments?"]].map(([id,text])=>({id,text})));

// Category-level taxonomy is exclusive; do not treat an unlisted animal class
// as unknown when another class is explicitly recorded.
const animalClasses=['mammal','bird','reptile','insect','fish','amphibian','arachnid','invertebrate'];
for(const entry of entries.filter(e=>e.category==='animals')){
 entry.builtIn=true;
 entry.no=entry.no||[];
 const known=animalClasses.filter(id=>entry.yes.includes(id));
 if(known.length===1){
  for(const id of animalClasses)if(id!==known[0]&&!entry.no.includes(id))entry.no.push(id);
 }
 // These are mutually exclusive diet descriptions for the starter knowledge base.
 const diets=['carnivore','herbivore','omnivore','insectivore'];
 const diet=entry.yes.find(id=>diets.includes(id));
 if(diet){
  for(const id of diets)if(id!==diet&&!entry.no.includes(id))entry.no.push(id);
 }
}
// A few familiar farm animals need explicit distinguishing negatives.
for(const entry of entries.filter(e=>e.category==='animals')){
 const exclusions={
  'Cow':'pet carnivore striped mane fast fastestLand antlers wool eggs',
  'Bull':'pet carnivore striped mane fast fastestLand antlers wool eggs',
  'Sheep':'carnivore striped mane fast fastestLand antlers',
  'Goat':'carnivore spotted striped mane fastestLand antlers wool',
  'Pig':'carnivore spotted striped mane fastestLand antlers wool horns',
  'Horse':'carnivore spotted striped mane fastestLand antlers horns wool',
  'Elephant':'farm domesticated hooves horns wool antlers eggs',
  'Cheetah':'farm domesticated herbivore hooves horns wool antlers eggs',
  'Giraffe':'farm domesticated carnivore wool antlers eggs'
 }[entry.name];
 if(exclusions)for(const id of exclusions.split(' '))if(!entry.yes.includes(id)&&!entry.no.includes(id))entry.no.push(id);
}
