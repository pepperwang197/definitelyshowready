function square(nums: Array<number>) {
  return nums.map((element) => {
    return element * element;
  });
}

console.log(square([1, 2, 3, 4, 5]));

function capitalize(words: Array<string>) {
  return words.map((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
}

console.log(capitalize(["alice", "bob", "charlie"]));

function paragraph(strings: Array<string>) {
  return strings.map((str) => {
    return "<p>" + str + "</p>";
  });
}

console.log(paragraph(["Bulbasaur", "Charmander", "Squirtle"]));
