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

import {BtuidGenerator,} from '../src/btuid'//'btuid' if install it from npm
import path from 'path';


const filePath = path.join(__dirname, 'dataTableName.json');
const generator = new BtuidGenerator( {path: filePath,saveTime :3600} );
    const extraBtuid = generator.getExtraBtuid(); //get hex btuid 
    console.log(extraBtuid) //06e77028e74c0082-26c4838e4a1f408b
    
    const BigIntbtuid = generator.getId();//get bigint id 
    console.log(BigIntbtuid) //812356443328774771

    const encodeBtuid =generator.getEncodeBtuid()  //get encode text id 
    console.log(encodeBtuid) //0fa4HX9a_fed04€4-d83f6a3a849921a4

    const decodeBtuid = generator.decodeToBtuid(encodeBtuid); //convert encoded btuid text to hex
    console.log(decodeBtuid) //0fa4b39a3fed0464-d83f6a3a849921a4
    
    const encodeBtuid2 = generator.encodeFromExtra("0fa4b39a3fed0464-d83f6a3a849921a4"); //convert encoded btuid text to hex
    console.log(encodeBtuid2) //Nfi£g39k¥feoNX6£-d83f6a3a849921a4

   const decodeBtuidBigint= generator.decodeToBigint(encodeBtuid) //convert encoded btuid text to bigint
    console.log(decodeBtuidBigint) //1127223281828299876












