// Copyright 2025 Omar Alhaj Ali
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {BuidGenerator,} from './src/buid'
import fs from "fs";
import path from 'path';
import cuid  from 'cuid';
//import { createId } from '@paralleldrive/cuid2';
const outputPath = path.join(__dirname, 'test.csv');
const filePath = path.join(__dirname, 'data.json');
const stream = fs.createWriteStream(outputPath, { flags: 'w' });
const generator = new BuidGenerator( {path: filePath} );



 for (let i = 1; i <= 1000; i++) {
    const buid = generator.getExtraBuid();
      console.log("extraBuid : ",buid)

   // console.log("Buid : ",buid)
   //  console.log("encode Buid : ",generator.encode(buid))
   // console.log("decode Buid : ",generator.decodeToBigint(buid))
   // console.log("decode Buid : ",generator.decodeToBuid(buid))

   //const line = `${generator.getBuid()}\n`
   //const line = `${generator.getBuid()}\n`;
  //console.log(line)


}  console.log("for2 .......................")

 for (let i = 1; i <= 1000; i++) {
    const buid = generator.getExtraBuid();
      console.log("extraBuid : ",buid)

   // console.log("Buid : ",buid)
   //  console.log("encode Buid : ",generator.encode(buid))
   // console.log("decode Buid : ",generator.decodeToBigint(buid))
   // console.log("decode Buid : ",generator.decodeToBuid(buid))

   //const line = `${generator.getBuid()}\n`
   //const line = `${generator.getBuid()}\n`;
  //console.log(line)


}
/* stream.write('category_id,internal_id,category_name_ar,category_name_en,category_image\n'); 

 for (let i = 1; i <= 1000000; i++) {
    //const line = `${generator.getBuid()}\n`
   // const line = `${generator.getExtraBuid()},${i},category_name_ar,category_name_en,category_image\n`;

  //console.log(line)
   stream.write(line);

}
stream.end(() => {
  console.log('✅ Writing completed.');
}); */










