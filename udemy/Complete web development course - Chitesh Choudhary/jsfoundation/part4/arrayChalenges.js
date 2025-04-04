let teaFlavours = ["green", "black", "white"];
let firstTea = teaFlavours[0];
// console.log(firstTea);

// softcopy
let teaFlavours2 = teaFlavours;
teaFlavours.pop();
// console.log(teaFlavours2);
// console.log(teaFlavours);

// hardcopy
let teaFlavours3 = [...teaFlavours];
teaFlavours.push("oolong");
// console.log(teaFlavours3);
// console.log(teaFlavours);

//merge
let cities1 = ["New York", "Los Angeles", "Chicago"];
let cities2 = ["Houston", "Phoenix", "Philadelphia"];
let cities3 = [...cities1, ...cities2];
// console.log(cities3);
// summing arrays does not work. if all are strings, it will concatenate them to form  string.
let cities4 = cities2.concat(cities1);
// console.log(cities4);

// is it in array?
let isInArray = cities4.includes("Houston");
// console.log(isInArray);

// get index of element if present, otherwise -1
let indexOfElement = cities4.indexOf("Lisbon");
// console.log(indexOfElement);

// pop a specific element from array
let elementToPop = "Houston";
let indexOfElementToPop = cities4.indexOf(elementToPop);
let rem;
console.log(cities4);

if (indexOfElementToPop !== -1) {
    rem = cities4.splice(indexOfElementToPop, 1);
}
console.log(rem);
console.log(cities4);
