

console.log("Try programiz.pro");
// Find the largest number in an array
function Largest(arr){
    let max = -Infinity;
    for(let num of arr){
       if(num > max){
           max = num
       }
    }
    return max
}
console.log(Largest([1,23,2,33,0,34,24]));
// Find the 2nd largest number of an array
function secondLargestNumber(arr){
    let max = -Infinity;
    let second = -Infinity;
    for(let num of arr){
        if(num > max ){
            second = max
            max = num
        }
        if(num > second && num < max){
            second = num;
        }
    }
    return second
}
console.log(secondLargestNumber([1,23,2,33,0,34,24]));
// Remove duplicate elements from an array
function removeDuplicatesfromArray(arr){
    // 1st Apporach
    // return [...new Set(arr)]
    // 2nd Apporach
    let a = [];
    for(let num of arr){
        if(!a.includes(num)){
            a.push(num)
        }
    }
    return a
}
console.log(removeDuplicatesfromArray([1,1,33,0,34,24]))
// Find the k-th distinct (non-repeating) element in an array
function KthDistinctNonRepeting(arr,k){
    let fre = {}
    for(let num of arr){
        fre[num] = (fre[num] || 0)+1;
    }
    for(let num of arr){
        if(fre[num]===1){
            k--;
            if(k === 0 ) return num
        }
    }
    return -1
}
console.log(KthDistinctNonRepeting([1, 2, 1, 3, 4, 2, 5],2))
// Find the k-th largest element in an array(means 1st sort an arr in decending order then with kth position)
function kThLargestElement(arr,k){
    let ar = arr.sort((a,b)=> b-a)
    return ar[k-1]
}
console.log(kThLargestElement([1,3,2,4,6,5],4))