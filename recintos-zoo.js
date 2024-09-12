
const Biome = {
    Savannah: "Savana",  
    River: "Rio",       
    Florest: "Floresta"  
  };
 
  class ZooPlace {
    constructor(number, size, biomes, currentAnimals) {
      this.number = number;            
      this.totalSize = size;           
      this.biomes = biomes;            
      this.currentAnimals = currentAnimals; 
    }
  
    
    getCurrentAnimalsOccupation() {
      return this.currentAnimals.reduce((partialSum, a) => partialSum + a.size, 0);
      
    }
  
    
    hasRoomAvailable(animals) {
      const newSizeWithTheseAnimals = this.getCurrentAnimalsOccupation() + animals.reduce((sum, animal) => sum + animal.size, 0);
     
      if (newSizeWithTheseAnimals > this.totalSize) {
        return false;
        
      }
  
      const differentSpecies = new Set(this.currentAnimals.map(a => a.name).concat(animals.map(a => a.name)));
    
  
      if (differentSpecies.size > 1) {
        return newSizeWithTheseAnimals + 1 <= this.totalSize;
       
      }
  
      return true;
    }
  
    isBiomeAppropriate(animal) {
      return this.biomes.some(biome => animal.biomes.includes(biome));
    }
  
    areAnimalsConfortableWithTheirNewCompanion(animals) {
      for (let i = 0; i < this.currentAnimals.size; i++) {
        var animal = this.currentAnimals[i];
        if (!animal.isConfortableWithHisNewCompanions(animals)) {
          return false;
        }
      }
      return true;
    }
  
    canAddAnimals(animals) {
      return this.areAnimalsConfortableWithTheirNewCompanion(animals) && 
             this.hasRoomAvailable(animals) &&
             animals.every(animal => 
               this.isBiomeAppropriate(animal) &&
               animal.isConfortableWithHisNewCompanions(this.currentAnimals) && 
               animal.isConfortableWithHisNewPlace(this)
             );
    }
  
    calculateFreeSpace(animals) {
      const totalOccupied = this.getCurrentAnimalsOccupation() + animals.reduce((sum, animal) => sum + animal.size, 0);
      const freeSpace = this.totalSize - totalOccupied;
      return freeSpace;
    }
  }
  
  class Animal {
    constructor(name, size, biomes, carnivore) {
      this.name = name;       
      this.size = size;       
      this.biomes = biomes;   
      this.carnivore = carnivore; 
    }
    
    isConfortableWithHisNewPlace(zooPlace) {
      return true;
    }
  
    isConfortableWithHisNewCompanions(animals) {
      if (this.carnivore) {
        return animals.every(animal => animal.name === this.name);
      } else {
        return true;
      }
    }
  }
  
  class Lion extends Animal {
    constructor() {
      super("Leao", 3, [Biome.Savannah], true); 
    }
  }
  
  class Leopard extends Animal {
    constructor() {
      super("Leopardo", 2, [Biome.Savannah], true); 
    }
  }
  
  class Crocodile extends Animal {
    constructor() {
      super("Crocodilo", 3, [Biome.River], true); 
    }
  }
  
  class Monkey extends Animal {
    constructor() {
      super("Macaco", 1, [Biome.Savannah, Biome.Florest, Biome.SavannahAndRiver], false); 
    }
  
    isConfortableWithHisNewCompanions(animals) {
      return animals.length > 0 && super.isConfortableWithHisNewCompanions(animals);
    }
  }
  
  class Gazelle extends Animal {
    constructor() {
      super("Gazela", 2, [Biome.Savannah, Biome.SavannahAndRiver], false);
    }
  }
  
  class Hippo extends Animal {
    constructor() {
      super("Hipopotamo", 4, [Biome.Savannah, Biome.River, Biome.SavannahAndRiver], false); 
    }
  
    isConfortableWithHisNewPlace(zooPlace) {
      if (zooPlace.currentAnimals.size <= 0) {
        return true;
      }
      if (zooPlace.biomes.contains(Bioma.Savannah) && zooPlace.biomes.contains(Bioma.River)) {
        return true;
      }
      return false;
    }
  }
  
  class Zoo {
    constructor(zooPlaces) {
      this.zooPlaces = zooPlaces; 
    }
  
    addAnimals(animalType, quantity) {
      const animals = [];
      
      if (quantity <= 0 || !Number.isInteger(quantity)) {
        return { erro: "Quantidade inválida" }; 
      }
      
      for (let i = 0; i < quantity; i++) {
        let animal = this.createAnimal(animalType); 
        if (!animal) {
          return { erro: "Animal inválido" }; 
        }
        animals.push(animal);
      }
  
      const viablePlaces = this.zooPlaces
        .filter(zooPlace => zooPlace.canAddAnimals(animals)) 
        .map(zooPlace => ({
          place: `Recinto ${zooPlace.number} (espaço livre: ${zooPlace.calculateFreeSpace(animals)} total: ${zooPlace.totalSize})`
        })) 
        .sort((a, b) => a.place.localeCompare(b.place)); 
      if (viablePlaces.length === 0) {
        return { erro: "Não há recinto viável" }; 
      }
  
      return { recintosViaveis: viablePlaces.map(v => v.place) }; 
    }
  
    createAnimal(animalType) {
      switch (animalType.toUpperCase()) {
        case "LEAO":
          return new Lion();
        case "LEOPARDO":
          return new Leopard();
        case "CROCODILO":
          return new Crocodile();
        case "MACACO":
          return new Monkey();
        case "GAZELA":
          return new Gazelle();
        case "HIPOPOTAMO":
          return new Hippo();
        default:
          return null; 
      }
    }
  }
  
  
  
  const place1 = new ZooPlace(1, 10, [Biome.Savannah], [new Monkey(), new Monkey(), new Monkey()]);
  const place2 = new ZooPlace(2, 5, [Biome.Florest], []);
  const place3 = new ZooPlace(3, 7, [Biome.Savannah, Biome.River], [new Gazelle()]);
  const place4 = new ZooPlace(4, 8, [Biome.River], []);
  const place5 = new ZooPlace(5, 9, [Biome.Savannah], [new Lion()]);
  const zoo = new Zoo([place1, place2, place3, place4, place5]);
  
  console.log(zoo.addAnimals("Leao", 2)); 
  console.log(zoo.addAnimals("MACACO", 2)); 
  console.log(zoo.addAnimals("UNICORNIO", 1)); 
  console.log(zoo.addAnimals("Leao", -3));