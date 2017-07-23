// source: https://gist.github.com/LeverOne/1308368
export default (
  a,
  b // placeholder
) => {
  for (
    // loop :)
    b = a = ''; // b - result , a - numeric variable
    a++ < 36; //
    b +=
      (a * 51) & 52 // if "a" is not 9 or 14 or 19 or 24
        ? //  return a random number or 4
          (a ^ 15 // if "a" is not 15
            ? // generate a random number from 0 to 15
              8 ^ (Math.random() * (a ^ 20 ? 16 : 4)) // unless "a" is 20, in which case a random number from 8 to 11
            : 4) //  otherwise 4
            .toString(16)
        : '-' //  in other cases (if "a" is 9,14,19,24) insert "-"
  );
  return b;
};
