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
 'Giraffe':'water mane spotted striped fast fastestLand carnivore pet',
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
 if(entry.category==='animals')entry.no=(animalNo[entry.name]||'').split(' ').filter(Boolean);
}
