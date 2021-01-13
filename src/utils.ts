/**
 * Finds the closest item to a given number in an array using binary search
 * @argument arr: ascending sorted array
 * @argument num: number to find
 * @returns index of the closest item to `num`
 * @returns -1 if given array is empty
 */
export function findClosest(arr: number[], num: number): number {
  if(arr.length === 0) {
    return -1;
  }

  let lowIdx = 0;
  let highIdx = arr.length - 1;

  while(highIdx - lowIdx > 1) {
    const midIdx = Math.floor((lowIdx + highIdx) / 2);
    if(arr[midIdx] < num) {
      lowIdx = midIdx;
    } else {
      highIdx = midIdx;
    }
  }

  if(num - arr[lowIdx] <= arr[highIdx] - num) {
    return lowIdx;
  }
  return highIdx;
}
