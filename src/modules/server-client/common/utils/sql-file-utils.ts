import { isNull } from '../../../base/utils/object-util';
import { DataUtil } from '../../../base/utils/data-util';
import { ISqlFile } from '../../../components/table-editor';

export function SqlFileUtils(buf:any,type:string){
  if(isNull(buf)){
    return null;
  }
 if(Buffer.isBuffer(buf)){
   const length = buf.length;
   const data = DataUtil.bufToString(buf);
   const name = `(${type.toUpperCase()}) ${length } bytes`;
   return {length,type,data,name} as ISqlFile;
 }
 return buf;

}
