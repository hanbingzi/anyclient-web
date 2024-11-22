export namespace StringConvertUtil {
  export function toLowerLine(str: string): string {
    let temp = str.replace(/[A-Z]/g, function (match) {
      return '_' + match.toLowerCase();
    });
    if (temp.slice(0, 1) === '_') {
      //如果首字母是大写，执行replace时会多一个_，这里需要去掉
      temp = temp.slice(1);
    }
    return temp;
  }
  //console.log(toLowerLine("TestToLowerLine"));  //test_to_lower_line

  export function toCamel(str: string): string {
    return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
      return $1 + $2.toUpperCase();
    });
  }
  //console.log(toCamel('test_to_camel')); //testToCamel
}
